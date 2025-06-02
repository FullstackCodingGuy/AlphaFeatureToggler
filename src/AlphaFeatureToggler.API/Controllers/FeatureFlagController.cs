using Microsoft.AspNetCore.Mvc;
using AlphaFeatureToggler.Shared.Models;
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

    /// <summary>
    /// Retrieves all feature flags.
    /// </summary>
    /// <returns>A list of feature flags.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public IActionResult GetAllFeatureFlags()
    {
        var featureFlags = _featureFlagService.GetAllFeatureFlags();
        return Ok(featureFlags);
    }

    /// <summary>
    /// Retrieves a feature flag by its ID.
    /// </summary>
    /// <param name="id">The ID of the feature flag.</param>
    /// <returns>The requested feature flag.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Creates a new feature flag.
    /// </summary>
    /// <param name="featureFlag">The feature flag to create.</param>
    /// <returns>The created feature flag.</returns>
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Updates an existing feature flag.
    /// </summary>
    /// <param name="id">The ID of the feature flag to update.</param>
    /// <param name="featureFlag">The updated feature flag.</param>
    /// <returns>The updated feature flag.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Deletes a feature flag by its ID.
    /// </summary>
    /// <param name="id">The ID of the feature flag to delete.</param>
    /// <returns>No content if the deletion was successful.</returns>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// Searches and filters feature flags with optional query, status, type, environment, and pagination.
    /// </summary>
    [HttpGet("search")]
    public IActionResult SearchFeatureFlags([FromQuery] string? query, [FromQuery] string? status, [FromQuery] string? type, [FromQuery] string? environment, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // TODO: Implement search/filter logic in service
        var result = _featureFlagService.SearchFeatureFlags(query, status, type, environment, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Gets rollout progress for a feature flag.
    /// </summary>
    [HttpGet("{id}/rollout")]
    public IActionResult GetRolloutProgress(Guid id)
    {
        var progress = _featureFlagService.GetRolloutProgress(id);
        return Ok(new { Progress = progress });
    }

    /// <summary>
    /// Updates rollout progress for a feature flag.
    /// </summary>
    [HttpPut("{id}/rollout")]
    public IActionResult UpdateRolloutProgress(Guid id, [FromBody] int progress)
    {
        var updated = _featureFlagService.UpdateRolloutProgress(id, progress);
        return Ok(new { Progress = updated });
    }

    /// <summary>
    /// Gets targeting rules for a feature flag.
    /// </summary>
    [HttpGet("{id}/targeting")]
    public IActionResult GetTargetingRules(Guid id)
    {
        var rules = _featureFlagService.GetTargetingRules(id);
        return Ok(rules);
    }

    /// <summary>
    /// Updates targeting rules for a feature flag.
    /// </summary>
    [HttpPut("{id}/targeting")]
    public IActionResult UpdateTargetingRules(Guid id, [FromBody] List<TargetingRule> rules)
    {
        var updated = _featureFlagService.UpdateTargetingRules(id, rules);
        return Ok(updated);
    }
}
