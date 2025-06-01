using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAuditLogs([FromQuery] Guid? flagId)
    {
        // TODO: Implement audit log listing
        return Ok(new[] { new { Id = 1, FlagId = flagId, Action = "Created", User = "sarah.smith@company.com", Date = DateTime.UtcNow } });
    }
}
