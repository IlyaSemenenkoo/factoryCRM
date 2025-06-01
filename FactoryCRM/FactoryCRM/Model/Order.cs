using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using FactoryCRM.Enums;

namespace FactoryCRM.Models;

public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public OrderStatus Status { get; set; } = OrderStatus.New;

    public string? SewingInstruction { get; set; }
    public string? ShoemakerInstruction { get; set; }
    public string? PackerInstruction { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedSewerId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedShoemakerId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssignedPackerId { get; set; }

    public string DeliveryInfo { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
