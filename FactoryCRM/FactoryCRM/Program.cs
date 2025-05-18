using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// ---------- MongoDB CONFIGURATION START ----------
var mongoConnection = builder.Configuration.GetConnectionString("MongoDb");
var databaseName = builder.Configuration["DatabaseName"];

var mongoClient = new MongoClient(mongoConnection);
var mongoDb = mongoClient.GetDatabase(databaseName);

builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddSingleton(mongoDb); // теперь ты сможешь внедрять IMongoDatabase в контроллеры/сервисы
// ---------- MongoDB CONFIGURATION END ----------

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
