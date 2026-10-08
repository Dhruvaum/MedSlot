using System;
using System.Collections.Generic;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Data;

public partial class MedSlotDbContext : DbContext
{
    public MedSlotDbContext()
    {
    }

    public MedSlotDbContext(DbContextOptions<MedSlotDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<AppointmentStatus> AppointmentStatuses { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Qualification> Qualifications { get; set; }

    public virtual DbSet<Specialization> Specializations { get; set; }

    public virtual DbSet<TimeSlot> TimeSlots { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserType> UserTypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=LAPTOP-4ORBUCUD\\SQLEXPRESS;Database=MedSlot;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Appointm__3214EC07764AC0A2");

            entity.HasIndex(e => e.TimeSlotId, "UQ_Appointments_TimeSlotId").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");

            entity.HasOne(d => d.AppointmentStatus).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.AppointmentStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointments_AppointmentStatuses");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointments_Patients");

            entity.HasOne(d => d.TimeSlot).WithOne(p => p.Appointment)
                .HasForeignKey<Appointment>(d => d.TimeSlotId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointments_TimeSlots");
        });

        modelBuilder.Entity<AppointmentStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Appointm__3214EC07F59251B2");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Doctors__3214EC076A5E2472");

            entity.HasIndex(e => e.UserId, "UQ_Doctors_UserId").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RegisteringCouncil).HasMaxLength(150);
            entity.Property(e => e.RegistrationNumber).HasMaxLength(50);
            entity.Property(e => e.WorkAddress).HasMaxLength(500);

            entity.HasOne(d => d.Qualification).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.QualificationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Doctors_Qualifications");

            entity.HasOne(d => d.Specialization).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.SpecializationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Doctors_Specializations");

            entity.HasOne(d => d.User).WithOne(p => p.Doctor)
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Doctors_Users");
        });

        modelBuilder.Entity<DoctorAvailability>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DoctorAv__3214EC07E1FB74D1");

            entity.ToTable("DoctorAvailability");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Doctor).WithMany(p => p.DoctorAvailabilities)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DoctorAvailability_Doctors");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Patients__3214EC07C755A59C");

            entity.HasIndex(e => e.UserId, "UQ_Patients_UserId").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.Dob).HasColumnName("DOB");
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.Gender).HasMaxLength(20);
            entity.Property(e => e.Phone).HasMaxLength(20);

            entity.HasOne(d => d.User).WithOne(p => p.Patient)
                .HasForeignKey<Patient>(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Patients_Users");
        });

        modelBuilder.Entity<Qualification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Qualific__3214EC07056BA31C");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Specialization>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Speciali__3214EC07B7EB8F63");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<TimeSlot>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TimeSlot__3214EC0703960429");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();

            entity.HasOne(d => d.Doctor).WithMany(p => p.TimeSlots)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TimeSlots_Doctors");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC078B7C3E33");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.PasswordHash).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(100);

            entity.HasOne(d => d.UserType).WithMany(p => p.Users)
                .HasForeignKey(d => d.UserTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_UserTypes");
        });

        modelBuilder.Entity<UserType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserType__3214EC0715D692FE");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.TypeName).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
