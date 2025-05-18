using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FactoryCRM.Enums;

namespace FactoryCRM.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; }
}
