using Microsoft.AspNetCore.Identity;

namespace Dishify_API.Models
{
    public class ApplicationUser : IdentityUser
    {

        public string Name { get; set; } = string.Empty;

    }
}
