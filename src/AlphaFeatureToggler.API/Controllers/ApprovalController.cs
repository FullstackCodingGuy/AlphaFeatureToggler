using Microsoft.AspNetCore.Mvc;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApprovalController : ControllerBase
{
    [HttpGet("{flagId}")]
    public IActionResult GetApprovals(Guid flagId)
    {
        // TODO: Implement approval listing
        return Ok(new[] { new { Id = 1, FlagId = flagId, Status = "Pending" } });
    }

    [HttpPost("{flagId}")]
    public IActionResult CreateApproval(Guid flagId)
    {
        // TODO: Implement approval creation
        return Ok(new { Id = 2, FlagId = flagId, Status = "Approved" });
    }
}
