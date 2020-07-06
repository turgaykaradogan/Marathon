﻿namespace Marathon.Server.Features.Identity
{
    using System.Threading.Tasks;

    using Marathon.Server.Features.Common.Models;
    using Marathon.Server.Features.Identity.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;

    using static Marathon.Server.Infrastructure.ApiRoutes;

    public class IdentityController : ControllerBase
    {
        private readonly IIdentityService identityService;
        private readonly AppSettings appSettings;

        public IdentityController(
            IOptions<AppSettings> appSettings,
            IIdentityService identityService)
        {
            this.identityService = identityService;
            this.appSettings = appSettings.Value;
        }

        /// <summary>
        /// Register new User.
        /// </summary>
        /// <param name="input"></param>
        /// <response code="201"> Successfully registered user.</response>
        /// <response code="400"> Bad Reaquest.</response>
        /// <response code="401"> Unauthorized request.</response>
        [HttpPost]
        [Route(Identity.Register)]
        public async Task<ActionResult<AuthResponseModel>> Register([FromBody]RegisterUserRequestModel input)
        {
            var registerResult = await this.identityService.RegisterAsync(
                input.FullName,
                input.UserName,
                input.Email,
                input.Password,
                this.appSettings.Secret);

            if (!registerResult.Success)
            {
                return this.BadRequest(
                new ErrorsResponseModel
                {
                    Errors = registerResult.Errors,
                });
            }

            return new AuthResponseModel()
            {
                Token = registerResult.Result,
            };
        }

        /// <summary>
        /// Log in User.
        /// </summary>
        /// <param name="input"></param>
        /// <response code="200"> Successfully logged in user.</response>
        /// <response code="400"> Bad Reaquest.</response>
        /// <response code="401"> Unauthorized request.</response>
        [HttpPost]
        [Route(Identity.Login)]
        public async Task<ActionResult<AuthResponseModel>> Login([FromBody]LoginRequestModel input)
        {
            var loginResult = await this.identityService.LoginAsync(input.Email, input.Password, this.appSettings.Secret);

            if (!loginResult.Success)
            {
                return this.Unauthorized(new ErrorsResponseModel
                {
                    Errors = loginResult.Errors,
                });
            }

            return new AuthResponseModel()
            {
                Token = loginResult.Result,
            };
        }

        /// <summary>
        /// Logout User.
        /// </summary>
        /// <response code="200"> Successfully logged out user.</response>
        /// <response code="400"> Bad Reaquest.</response>
        /// <response code="401"> Unauthorized request.</response>
        [HttpPost]
        [Route(Identity.Logout)]
        public async Task<ActionResult> Logout([FromBody]string token)
        {
            await this.identityService.LoguotAsync(token);
            return this.Ok();
        }
    }
}
