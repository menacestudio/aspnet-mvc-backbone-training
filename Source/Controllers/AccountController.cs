using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Dec1313.Models;
using Microsoft.Owin.Security.Twitter.Messages;

namespace Dec1313.Controllers
{
    //[Authorize]
    public class AccountController : BaseController
    {
        private const string Email = "test";
        private const string Password = "1234";

        // POST: /Accounts/ValidateUser
        [HttpPost]
        public JsonResult AuthenticateUser(SystemUser systemuser)
        {
            if (Request.IsAjaxRequest())
            {
                var isValid = systemuser.Email == Email && systemuser.Password == Password;

                var message = "Authenticated successfully!";
                if (!isValid)
                {
                    message = "Incorrect username and password!";
                }
                else
                {
                    DoLoginUser(systemuser);
                }

                return Json(new
                {
                    user = new
                    {
                        systemuser.Email
                    },
                    message = message,
                    isValid = isValid
                });
            }

            return null;
        }

        // GET: /Accounts/GetAuthenticatedUser
        [HttpGet]
        public JsonResult GetAuthenticatedUser()
        {
            return Request.IsAjaxRequest() ? Json(new {Email = Email}, JsonRequestBehavior.AllowGet) : null;
        }

        [HttpPost]
        // POST: /Accounts/LogOut
        public JsonResult LogOut()
        {
            FormsAuthentication.SignOut();
            return Json(new {message = "Successfully logged out!"});
        }

        private void DoLoginUser(SystemUser systemuser)
        {
            var isValid = systemuser.Email == Email && systemuser.Password == Password;

            if (isValid)
            {
                var authticket = new
                            FormsAuthenticationTicket(1,
                            systemuser.Email,
                            DateTime.Now,
                            DateTime.Now.AddHours(8),
                            true,
                            "",
                            FormsAuthentication.FormsCookiePath);

                string hash = FormsAuthentication.Encrypt(authticket);

                var authcookie = new HttpCookie(FormsAuthentication.FormsCookieName, hash);

                if (authticket.IsPersistent) authcookie.Expires = authticket.Expiration;

                Response.Cookies.Add(authcookie);
                FormsAuthentication.SetAuthCookie(systemuser.Email, true);

            }
            ModelState.AddModelError("", "The user name or password provided is incorrect.");

        }

    }
}