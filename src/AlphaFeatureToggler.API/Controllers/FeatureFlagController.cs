using Microsoft.AspNetCore.Mvc;
using AlphaFeatureToggler.API.Models;
using AlphaFeatureToggler.API.Services;

namespace AlphaFeatureToggler.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeatureFlagController : ControllerBase
{
    private readonly IFeatureFlagService _featureFlagService;

    public FeatureFlagController(IFeatureFlagService featureFlagService)
    {
        _featureFlagService = featureFlagService;
    }

    [HttpGet]
    public IActionResult GetAllFeatureFlags()
    {
        var featureFlags = _featureFlagService.GetAllFeatureFlags();
        return Ok(featureFlags);
    }

    [HttpGet("{id}")]
    public IActionResult GetFeatureFlagById(Guid id)
    {
        var featureFlag = _featureFlagService.GetFeatureFlagById(id);
        if (featureFlag == null)
        {
            return NotFound();
        }
        return Ok(featureFlag);
    }

    [HttpPost]
    public IActionResult CreateFeatureFlag([FromBody] FeatureFlag featureFlag)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdFeatureFlag = _featureFlagService.CreateFeatureFlag(featureFlag);
        return CreatedAtAction(nameof(GetFeatureFlagById), new { id = createdFeatureFlag.Id }, createdFeatureFlag);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateFeatureFlag(Guid id, [FromBody] FeatureFlag featureFlag)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedFeatureFlag = _featureFlagService.UpdateFeatureFlag(id, featureFlag);
        if (updatedFeatureFlag == null)
        {
            return NotFound();
        }

        return Ok(updatedFeatureFlag);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteFeatureFlag(Guid id)
    {
        var isDeleted = _featureFlagService.DeleteFeatureFlag(id);
        if (!isDeleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
