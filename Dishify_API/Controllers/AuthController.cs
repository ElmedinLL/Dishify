using Azure;
using Dishify_API.Models;
using Dishify_API.Models.Dto;
using Dishify_API.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Dishify_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {

        private readonly ApiResponse _response;
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly string secretKey;


        public AuthController(ApiResponse response, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            secretKey = configuration.GetValue<string>("ApiSettings:Secret") ?? "";
            _response = response;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
        {

            if (ModelState.IsValid)
            {
                ApplicationUser newUser = new()
                {
                    Email = model.Email,
                    UserName = model.Email,
                    Name = model.Name,
                    NormalizedEmail = model.Email.ToUpper()
                };

                var result = await _userManager.CreateAsync(newUser, model.Password);
                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
                    {
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }
                    if (model.Role.Equals(SD.Role_Admin,StringComparison.CurrentCultureIgnoreCase))
                    {
                       await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);
                    }
                    else
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                    }
                        _response.isSuccess = true;
                    _response.StatusCode = HttpStatusCode.OK;
                    return Ok(_response);
                }
                else
                {
                     foreach (var errors in result.Errors)
                    {
                        _response.ErrorMessages.Add(errors.Description);
                    }
                    _response.isSuccess = false;
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    return BadRequest(_response);
                }

            }
            else
            {
                _response.isSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                foreach (var error in ModelState.Values)
                {
                    foreach (var errors in error.Errors)
                    {
                        _response.ErrorMessages.Add(errors.ErrorMessage);
                    }
                }
                return BadRequest(_response);



            }

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
        {

            if (ModelState.IsValid)
            {


                var userFromDb = await _userManager.FindByEmailAsync(model.Email);

                if (userFromDb != null)
                {
                    bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);
                    if (!isValid)
                    {
                        _response.Result = new LoginResponseDTO();
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.isSuccess = false;
                        _response.ErrorMessages.Add("Invalid Credentials");
                        return BadRequest(_response);
                    }

                    JwtSecurityTokenHandler tokenHandler = new();
                    byte[] key = Encoding.ASCII.GetBytes(secretKey);

                    SecurityTokenDescriptor tokenDescriptor = new()
                    {
                        Subject = new ClaimsIdentity([
                            new ("fullname",userFromDb.Name),
                            new ("id",userFromDb.Id),
                            new(ClaimTypes.Email, userFromDb.Email!.ToString()),
                            new(ClaimTypes.Role , _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault()!)
                            ]),
                        Expires = DateTime.UtcNow.AddDays(7),
                        SigningCredentials = new(new SymmetricSecurityKey(key) , SecurityAlgorithms.HmacSha256Signature)
                    };

                    SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

                    LoginResponseDTO loginResponse= new()
                    {
                        Email = userFromDb.Email,
                        Token = tokenHandler.WriteToken(token),
                        Role = _userManager.GetRolesAsync(userFromDb).Result.FirstOrDefault()!
                    };
                    _response.Result = loginResponse;
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.isSuccess = true;
                    return Ok(_response);

                }
                _response.Result = new LoginResponseDTO();
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.isSuccess = false;
            }
        
            else
            {
                _response.isSuccess = false;
                _response.StatusCode = HttpStatusCode.BadRequest;
                foreach (var error in ModelState.Values)
                {
                    foreach (var errors in error.Errors)
                    {
                        _response.ErrorMessages.Add(errors.ErrorMessage);
                    }
                }



            }
                return BadRequest(_response);

        
        }

    }
}
