using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationController : ControllerBase
{
    [HttpGet]
    public IActionResult GetApplications()
    {
        // TODO: Implement application listing
        return Ok(new[] { new { Id = 1, Name = "Web Application" } });
    }
}
