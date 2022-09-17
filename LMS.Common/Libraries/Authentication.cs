using System.Text;
using System;
using LMS.Common.Infos;
using System.Collections.Generic;

namespace LMSLibrary
{
    public class AuthHelper
    {
        // To hold any debug message related to the last error happened
        public static string strLastError;


        //
        // Admin check method (1/2): Using user hash
        //
        public static bool IsAdmin(string UserHash, string UserIPAddress)
        {
            List<string> AuthIPList = GetAuthIPs();
            bool bCheckHash = (UserHash == AdminCredentials.UserHash);
            bool bCheckIP = (string.IsNullOrEmpty(UserIPAddress) || AuthIPList.Contains(UserIPAddress));

            if (!bCheckHash || !bCheckIP)
            {
                strLastError =  $@"UserHash={UserHash} " + (bCheckHash ? "(OK)" : "(failed)") + "\r\n" +
                                $@"UserIP={UserIPAddress} " + (bCheckIP ? "(OK)" : "(failed)") + "\r\n" +
                                $@"AllowedIPCount={AuthIPList.Count}";
                return false;
            }
            
            return true; // Means user is authorized.
        }


        //
        // Admin check method (2/2): Using user name & password
        //
        public static bool IsAdmin(string UserName, string PlainPassword, string UserIPAddress)
        {
            string PasswordHash = GetPasswordHash(PlainPassword);
            List<string> AuthIPList = GetAuthIPs();
            bool bCheckUserName = (UserName == AdminCredentials.UserName);
            bool bCheckPassword = (PasswordHash == AdminCredentials.PasswordHash);
            bool bCheckIP = (string.IsNullOrEmpty(UserIPAddress) || AuthIPList.Contains(UserIPAddress));

            if (!bCheckUserName || !bCheckPassword || !bCheckIP)
            {
                strLastError =  $@"UserName={UserName} " + (bCheckUserName ? "(OK)" : "(failed)") + "\r\n" +
                                $@"PasswordHash={PasswordHash} " + (bCheckPassword ? "(OK)" : "(failed)") + "\r\n" +
                                $@"UserIP={UserIPAddress} " + (bCheckIP ? "(OK)" : "(failed)") + "\r\n" +
                                $@"AllowedIPCount={AuthIPList.Count}";
                return false;
            }
            
            return true; // Means user is authorized.
        }


        //
        // Gets the password hash
        //
        private static string GetPasswordHash(string PlainPassword)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create()) {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(PlainPassword));
                var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                return hash;
            }
        }


        //
        // Get a list of authorized IP addresses
        //
        private static List<string> GetAuthIPs() {
            string sqlQuery = $@"SELECT [IPAddress] FROM [dbo].[AdminAuthIPs];";
            var sqlRows = SQLHelper.RunSqlQuery(sqlQuery);

            // Add authorized IPs from the DB
            List<string> RetData = new List<string>();
            foreach (var sqlRow in sqlRows)
            {
                RetData.Add(sqlRow[0].ToString().Trim());
            }

            return RetData;
        }
    }
}
