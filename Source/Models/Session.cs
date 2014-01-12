using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Dec1313.Models
{
    public class Session
    {
        public int id { get; set; }
        public string SessionName { get; set; }
        public DateTime SessionDate { get; set; }
        public string System { get; set; }
    }
}