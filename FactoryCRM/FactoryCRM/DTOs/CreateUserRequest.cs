using FactoryCRM.Enums;

namespace FactoryCRM.DTOs;

public class CreateUserRequest
{
    public UserRole Role { get; set; }
    public string FullName { get; set; } = string.Empty;
}
