using System.Web;
using System.Web.Optimization;

namespace MVCTraining
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js", 
                        "~/Scripts/underscore.js", 
                        "~/Scripts/backbone.js",
                        "~/Scripts/backbone.syphon.min.js",
                        //"~/Scripts/bootstrap-modalmanager.js",
                        //"~/Scripts/bootstrap-modal.js",
                        "~/Scripts/bootbox.min.js", 

                        "~/Scripts/moment.js", 
                        "~/Scripts/bootstrap-datepicker.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/bootstrap-modal-bs3patch.css",
                      "~/Content/bootstrap-modal.css",
                      "~/Content/site.css",
                      "~/Content/bootstrap-datepicker.css"));
        }
    }
}
