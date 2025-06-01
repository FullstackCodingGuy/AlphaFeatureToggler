using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamMemberController : ControllerBase
{
    [HttpGet]
    public IActionResult GetTeamMembers()
    {
        // TODO: Implement team member listing
        return Ok(new[] { new { Id = 1, Name = "Sarah Smith" }, new { Id = 2, Name = "Mike Johnson" } });
    }
}
