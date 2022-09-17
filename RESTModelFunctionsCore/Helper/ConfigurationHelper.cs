namespace RESTModelFunctionsCore.Helper
{
    public static class ConfigurationHelper
    {
        public static string GetApiBaseURL()
        {
            string baseURL = string.Empty;
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            baseURL = root.GetSection("ApiList").GetSection("ApiBaseURL").Value;
            return baseURL;
        }

        public static string GetApiBaseURLTest()
        {
            string baseURL = string.Empty;
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            baseURL = root.GetSection("ApiList").GetSection("ApiBaseURLTest").Value;
            return baseURL;
        }
    }
}
