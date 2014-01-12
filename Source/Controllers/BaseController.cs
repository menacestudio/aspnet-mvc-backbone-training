using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Dec1313.Controllers
{
    public class BaseController : Controller
    {
        public string UserId { get; set; }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (User.Identity.IsAuthenticated)
            {
                UserId = User.Identity.Name;
                filterContext.Controller.ViewData["UserId"] = UserId;
            }
            else
            {
                UserId = "";
            }
        }
	}
}