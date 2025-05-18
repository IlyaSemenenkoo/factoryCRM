using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FactoryCRM.Models;
using FactoryCRM.DTOs;
using FactoryCRM.Services;

namespace FactoryCRM.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMongoCollection<User> _users;
    private readonly AuthService _authService;

    public AuthController(IMongoDatabase db, AuthService authService)
    {
        _users = db.GetCollection<User>("Users");
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _users.Find(u => u.Username == request.Username).FirstOrDefaultAsync();

        if (user == null || user.PasswordHash != request.Password)
            return Unauthorized("Wrong login or password");

        var token = _authService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            Role = user.Role.ToString()
        });
    }
}
