using MedSlot.Api.Data;
using Microsoft.EntityFrameworkCore;
using MedSlot.Api.Auth;
using MedSlot.Api.Middleware;
using MedSlot.Api.Patients;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MedSlotDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("MedSlotDb")));

// Other Services
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddAuthServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddPatientServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddOtherServices();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
