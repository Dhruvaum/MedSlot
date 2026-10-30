using MedSlot.Api.Data;
using Microsoft.EntityFrameworkCore;
using MedSlot.Api.Auth;
using MedSlot.Api.Middleware;
using MedSlot.Api.Patients;
using MedSlot.Api.Doctors;
using Hangfire;
using MedSlot.Api.BackgroundJobs;
using MedSlot.Api.Appointments;
using MedSlot.Api.Payments;
using MedSlot.Api.MedslotSupport;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName);

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<MedSlotDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MedSlotDb")));

// Other Services
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddAuthServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddPatientServices();
builder.Services.AddDoctorServices();
builder.Services.AddAppointmentServices();
builder.Services.AddPaymentServices();
builder.Services.AddMedSlotSupportServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddOtherServices();

// Hangfire
builder.Services.AddHangfire(config => config.UseSqlServerStorage(builder.Configuration.GetConnectionString("MedSlotDb")));
builder.Services.AddHangfireServer();

// CORS Configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Register Recurring Job
using (var scope = app.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    recurringJobManager.AddOrUpdate<TimeSlotGenerationJob>(
        "generate-timeslots",
        job => job.RunAsync(),
        "30 20 * * *"
    );

    recurringJobManager.AddOrUpdate<ReleaseUnpaidAppointmentsJob>(
        "release-stale-appointments",
        job => job.RunAsync(),
        "*/2 * * * *"
    );

    recurringJobManager.AddOrUpdate<ReleaseEligibleFundsJob>(
        "release-funds",
        job => job.RunAsync(),
        "*/5 * * * *"
    );

    recurringJobManager.AddOrUpdate<SettleRefundsJob>(
        "settle-refunds",
        job => job.RunAsync(),
        "*/15 * * * *"
    );
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHangfireDashboard("/hangfire");
}

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
