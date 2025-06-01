using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationController : ControllerBase
{
    [HttpGet]
    public IActionResult GetOrganizations()
    {
        // TODO: Implement organization listing
        return Ok(new[] { new { Id = 1, Name = "Acme Corporation" } });
    }
}
