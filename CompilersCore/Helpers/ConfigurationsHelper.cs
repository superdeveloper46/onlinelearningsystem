using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CompilersCore.Helpers;
public static class ConfigurationsHelper
{
    public static string GetLudsampleDb()
    {
        string connectionString = @"Data Source=ludsampledb.database.windows.net;Initial Catalog=SampleDB;User ID=sampleuser;Password=7XTdm=/{";
        return connectionString;
    }
    public static string GetCcgserverDb()
    {
        string connectionString = @"Data Source=ccgserver.database.windows.net;Initial Catalog=Week 2;User ID=ccgadmin;Password=N9jvLf65";
        return connectionString;
    }
}
