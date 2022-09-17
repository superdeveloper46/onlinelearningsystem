using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace AdminPages.Helpers
{
    public class ConfigurationHelper
    {
        public static string GetApiBaseURL()
        {
            string apiBaseUrl = string.Empty;
            string url = HttpContext.Current.Request.Url.AbsoluteUri;

            if (url.Contains("localhost"))
            {
                apiBaseUrl = ConfigurationManager.AppSettings["ApiBaseURLTest"].ToString();
            }
            else
            {
                apiBaseUrl = ConfigurationManager.AppSettings["ApiBaseURL"].ToString();
            }
            return apiBaseUrl;
        }
    }
}