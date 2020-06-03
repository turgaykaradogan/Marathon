﻿namespace Marathon.Server.Features.Teams
{
    using System.Threading.Tasks;

    using Marathon.Server.Features.Teams.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    using static Marathon.Server.Infrastructure.WebConstants;

    // [Authorize]
    public class TeamsController : ApiController
    {
        private readonly ITeamService teamService;

        public TeamsController(ITeamService teamService)
        {
            this.teamService = teamService;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateTeamRequestModel input)
        {
            var id = await this.teamService.CreateAsync(
                input.Title,
                input.ImageUrl,
                input.ProjectId);

            return this.Created(nameof(this.Create), id);
        }

        [HttpPut]
        public async Task<ActionResult> Update(UpdateTeamRequestModel input)
        {
            var updated = await this.teamService.UpdateAsync(
                input.Id,
                input.Title,
                input.ImageUrl,
                input.ProjectId);

            if (!updated)
            {
                return this.BadRequest();
            }

            return this.Ok();
        }

        [HttpDelete]
        [Route(Id)]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await this.teamService.DeleteAsync(id);

            if (!deleted)
            {
                return this.BadRequest();
            }

            return this.Ok();
        }
    }
}
