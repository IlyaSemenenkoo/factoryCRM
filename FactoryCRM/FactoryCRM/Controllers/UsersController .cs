using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FactoryCRM.Models;
using FactoryCRM.DTOs;
using BCrypt.Net;

namespace FactoryCRM.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMongoCollection<User> _users;

    public UsersController(IMongoDatabase db)
    {
        _users = db.GetCollection<User>("Users");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var login = $"{request.Role.ToString().ToLower()}.{Random.Shared.Next(10000, 99999)}";
        var password = GeneratePassword(8);
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            Username = login,
            PasswordHash = hashedPassword,
            Role = request.Role,
            FullName = request.FullName
        };

        await _users.InsertOneAsync(user);
        Console.WriteLine($"Created {user.Username}");
        return Ok(new
        {
            username = login,
            password = password,
            fullName = request.FullName
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        var users = await _users.Find(_ => true).ToListAsync();
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var result = await _users.DeleteOneAsync(u => u.Id == id);
        if (result.DeletedCount == 0)
            return NotFound();

        return NoContent();
    }



    private string GeneratePassword(int length)
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!#";
        return new string(Enumerable.Range(1, length)
            .Select(_ => chars[Random.Shared.Next(chars.Length)]).ToArray());
    }
}
