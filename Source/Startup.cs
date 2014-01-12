using Microsoft.Owin;
using MVCTraining;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace MVCTraining
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
