using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Dec1313.Startup))]
namespace Dec1313
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
