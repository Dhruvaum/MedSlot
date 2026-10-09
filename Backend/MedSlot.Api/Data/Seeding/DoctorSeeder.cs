using Bogus;
using MedSlot.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Data.Seeding
{
    public class DoctorSeeder
    {
        public readonly MedSlotDbContext _context;
        public readonly IPasswordHasher<User> _passwordHasher;

        public DoctorSeeder(MedSlotDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }
        public async Task SeedDoctorsAsync()
        {
            // Get Doctor UserTypeId
            UserType userType = await _context.UserTypes.FirstOrDefaultAsync(ut => ut.TypeName == "Doctor") ?? throw new InvalidOperationException("Doctor UserType not found");
            Guid userTypeId = userType.Id;

            var specializationIds = await _context.Specializations.Select(s => s.Id).ToListAsync();
            var qualificationIds = await _context.Qualifications.Select(q => q.Id).ToListAsync();
            var registeringCouncilIds = await _context.RegisteringCouncils.Select(c => c.Id).ToListAsync();

            var userFaker = new Faker<User>()
                .RuleFor(u => u.Id, f => Guid.NewGuid())
                .RuleFor(u => u.UserTypeId, f => userTypeId)
                .RuleFor(u => u.UserName, f => f.Internet.UserName())
                .RuleFor(u => u.Email, (f, u) => $"{u.UserName}.{f.IndexFaker}@gmail.com")
                .RuleFor(u => u.PasswordHash, (f, u) => _passwordHasher.HashPassword(u, "11111111"))
                .RuleFor(u => u.IsRegistrationCompleted, f => true)
                .RuleFor(u => u.CreatedAt, f => DateTime.UtcNow);

            // Generate Users first
            var users = userFaker.Generate(100);

            var doctorFaker = new Faker<Doctor>()
                .RuleFor(d => d.Id, f => Guid.NewGuid())
                .RuleFor(d => d.FullName, f => f.Name.FullName())
                .RuleFor(d => d.Phone, f => f.Phone.PhoneNumber("##########"))
                .RuleFor(d => d.SpecializationId, f => f.PickRandom(specializationIds))
                .RuleFor(d => d.QualificationId, f => f.PickRandom(qualificationIds))
                .RuleFor(d => d.RegistrationNumber, f => f.Random.AlphaNumeric(10))
                .RuleFor(d => d.RegisteringCouncilId, f => f.PickRandom(registeringCouncilIds))
                .RuleFor(d => d.WorkAddress, f => f.Address.FullAddress())
                .RuleFor(d => d.VerificationStatus, f => f.Random.Number(0, 1));

            // Generate Doctors
            var doctors = doctorFaker.Generate(100);

            // Set UserId For each Doctor
            for(int i = 0; i<users.Count; i++)
            {
                doctors[i].UserId = users[i].Id;
            }

            await _context.AddRangeAsync(users);
            await _context.AddRangeAsync(doctors);

            await _context.SaveChangesAsync();
        }
    }
}
