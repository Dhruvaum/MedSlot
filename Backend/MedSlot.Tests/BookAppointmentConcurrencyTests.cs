using System;
using System.Collections.Generic;
using System.Text;
using MedSlot.Api.Appointments;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MedSlot.Tests
{
    public class BookAppointmentConcurrencyTests
    {
        [Fact]
        public async Task TwoSimultaneousBookings_OnlyOneSucceeds()
        {
            // Arrange - Find a Test Patient and a fresh unbooked slot
            Guid patientId;
            Guid timeSlotId;

            using (var context = new MedSlotDbContext())
            {
                patientId = await context.Patients
                    .Where(p => p.FullName == "Dhruv .")
                    .Select(p => p.Id)
                    .FirstAsync();

                timeSlotId = await context.TimeSlots
                    .Where(ts => !ts.IsBooked)
                    .Select(ts => ts.Id)
                    .FirstAsync();
            }

            var request = new BookAppointmentRequest { TimeSlotId = timeSlotId, PatientConcern = "Concurrency Test" };

            // Act - 2 independent context and repo, fired together
            using var contextA = new MedSlotDbContext();
            using var contextB = new MedSlotDbContext();

            var repoA = new AppointmentRepository(contextA);
            var repoB = new AppointmentRepository(contextB);

            var taskA = SafeBook(repoA, patientId, request);
            var taskB = SafeBook(repoB, patientId, request);

            var results = await Task.WhenAll(taskA, taskB);

            // Assert - Exactly one succeeded, the other fails
            Assert.Equal(1, results.Count(r => r.Succeeded));

            var failure = results.First(r => !r.Succeeded);
            Assert.IsType<InvalidOperationException>(failure.exc);

            // verify
            using var verifyContext = new MedSlotDbContext();
            var appoinmentCount = await verifyContext.Appointments.CountAsync(a => a.TimeSlotId == timeSlotId);
            Assert.Equal(1, appoinmentCount);

            var slot = await verifyContext.TimeSlots.FirstAsync(t => t.Id == timeSlotId);
            Assert.True(slot.IsBooked);
        }

        private static async Task<(bool Succeeded, Exception? exc)> SafeBook(
            IAppointmentRepository repo, Guid patientid, BookAppointmentRequest request
        )
        {
            try
            {
                await repo.BookAppointmentAsync(patientid, request);
                return (true, null);
            }
            catch (Exception ex)
            {
                return (false, ex);
            }
        }
    }
}
