using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVCTraining.Models;

namespace MVCTraining.Controllers
{
    public class SessionsController : BaseController
    {
        // GET: /Sessions/
        public ActionResult Index()
        {
            var sessions = (List<Session>)Session["sessions"];
            if (sessions == null)
            {
                sessions = new List<Session>();
                Session["sessions"] = sessions;
            }

            return View();
        }

        // DELETE: /Sessions/Manage/
        [HttpDelete]
        public JsonResult Manage(int id, string empty)
        {
            if (Request.IsAjaxRequest())
            {
                var sessions = (List<Session>)Session["sessions"];
                var sess = sessions.Find(x => x.id == id);
                sessions.Remove(sess);

                return Json(new { Message = "Success!" });
            }

            return null;
        }

        // GET: /Sessions/Manage/
        [HttpGet]
        public JsonResult Manage()
        {
            if (Request.IsAjaxRequest())
            {
                var sessions = (List<Session>)Session["sessions"];
                return Json(sessions, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        // POST: /Sessions/Manage/
        [HttpPost]
        public JsonResult Manage(Session session)
        {
            if (Request.IsAjaxRequest())
            {
                var sessions = (List<Session>) Session["sessions"];

                var id = sessions.DefaultIfEmpty().Max(t=> t == null ? 0 : t.id )+1;
                session.id = id;
                sessions.Add(session);
                return Json(new {id=id});
            }

            return null;
        }

        // PUT: /Sessions/Manage/
        [HttpPut]
        public JsonResult Manage(Session session, int id)
        {
            if (Request.IsAjaxRequest())
            {
                var sessions = (List<Session>)Session["sessions"];

                var sess = sessions.Find(x => x.id == session.id);
                sess.SessionName = session.SessionName;
                sess.SessionDate = session.SessionDate;
                sess.System = session.System;

                return Json(sess);
            }

            return null;
        }


	}
}