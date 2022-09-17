
using Microsoft.Extensions.DependencyInjection.Extensions;

string myCORS = "MyCORS";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myCORS,
                      policy =>
                      {
                          //policy.WithOrigins("*").AllowAnyHeader().AllowAnyMethod();
                          //policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                          //policy.WithOrigins("https://localhost:44303/", "https://localhost:7061/").AllowAnyMethod().AllowAnyHeader();
                          policy.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true).AllowCredentials();
                      });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);
builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();
builder.Services.TryAddScoped<IHttpContextAccessor, HttpContextAccessor>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(myCORS);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
