using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnvironmentController : ControllerBase
{
    [HttpGet]
    public IActionResult GetEnvironments()
    {
        // TODO: Implement environment listing
        return Ok(new[] { new { Id = 1, Name = "Production" }, new { Id = 2, Name = "Dev" }, new { Id = 3, Name = "QA" }, new { Id = 4, Name = "Stage" } });
    }
}
