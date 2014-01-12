using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using Dec1313.Models;
using Microsoft.Ajax.Utilities;

namespace Dec1313.Controllers
{
    public class HomeController : BaseController
    {
        private static readonly List<Session> Sessions = new List<Session>();
        public ActionResult Index()
        {
            return View(Sessions);
        }

        // Add
        public JsonResult AddSession(Session session)
        {
            if (Request.IsAjaxRequest())
            {
                var id = (Sessions.Count)+1;     
                session.id = id;
                Sessions.Add(session);
                return Json(session);
            }

            return null;
        }

        // Update
        public JsonResult SaveSession(Session session)
        {
            if (Request.IsAjaxRequest())
            {
                var sess = Sessions.Find(x => x.id == session.id);
                sess.SessionName = session.SessionName;
                sess.SessionDate = session.SessionDate;
                sess.System = session.System;

                return Json(sess);
            }

            return null;
        }

        // Delete
        [HttpPost]
        public JsonResult DeleteSession(int id)
        {
            if (Request.IsAjaxRequest())
            {
                var sess = Sessions.Find(x => x.id == id);
                Sessions.Remove(sess);

                return Json(new {Message = "Success!"});
            }

            return null;
        }
    }
}