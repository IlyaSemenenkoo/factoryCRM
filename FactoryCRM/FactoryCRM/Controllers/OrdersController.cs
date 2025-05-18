using FactoryCRM.DTOs;
using FactoryCRM.Enums;
using FactoryCRM.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace FactoryCRM.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMongoCollection<Order> _orders;

    public OrdersController(IMongoDatabase database)
    {
        _orders = database.GetCollection<Order>("Orders");
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetAll()
    {
        var orders = await _orders.Find(_ => true).ToListAsync();
        return Ok(orders);
    }

    // GET: api/orders/{id}
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Order>> GetById(string id)
    {
        var order = await _orders.Find(o => o.Id == id).FirstOrDefaultAsync();
        if (order == null)
            return NotFound();
        return Ok(order);
    }

    // POST: api/orders
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] Order order)
    {
        order.CreatedAt = DateTime.UtcNow;
        order.Status = OrderStatus.New;
        await _orders.InsertOneAsync(order);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    // PUT: api/orders/{id}
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> UpdateOrder(string id, [FromBody] Order updatedOrder)
    {
        var result = await _orders.ReplaceOneAsync(o => o.Id == id, updatedOrder);
        if (result.MatchedCount == 0)
            return NotFound();
        return NoContent();
    }

    [HttpPut("{id:length(24)}/assign-workers")]
    public async Task<IActionResult> AssignWorkers(string id, [FromBody] AssignWorkersDto dto)
    {
        var update = Builders<Order>.Update
            .Set(o => o.AssignedSewerId, dto.SewerId)
            .Set(o => o.AssignedShoemakerId, dto.ShoemakerId)
            .Set(o => o.AssignedPackerId, dto.PackerId);

        var result = await _orders.UpdateOneAsync(o => o.Id == id, update);

        if (result.MatchedCount == 0)
            return NotFound();

        return NoContent();
    }

}
