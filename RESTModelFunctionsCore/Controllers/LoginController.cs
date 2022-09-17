﻿using System.Net;
using System.Net.Sockets;
using System.Text;
using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Mvc;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {

        public LoginController()
        {
        }

        // POST api/Login
        [HttpPost(Name = "Login")]
        public ResultInfo Post([FromBody] Credentials creds)
        {
            var hashedPassword = GetPasswordHash(creds.password);

            string studentIdHash = "-1";
            string studentName = "";
            string studentPicture = "";
            bool isAdmin = false;
            string adminHash = "";

            var student = GetStudentInfo(creds.username, creds.password, hashedPassword, out string error);
            var state = student != null ? "success" : "fail";
            var ip = GetIPAddress();
            UpdateLoginInfo(creds.username, hashedPassword, state, ip);

            if (state == "success")
            {
                var numberOfCourses = GetNumberOfCourses(student.StudentId);
                if (numberOfCourses == 0)
                {
                    error = "Student not registered in a course";
                }
                else
                {
                    studentName = student.Name;
                    studentIdHash = student.Hash;
                    if (studentIdHash.Length != 36) UpdateStudentHash(student.StudentId);
                    
                    byte[] picture = student.Photo;
                    if (picture != null)
                    {
                        byte[] img = picture.ToArray();
                        studentPicture = "data:image;base64," + Convert.ToBase64String(img);
                    }
                    
                    if (AuthHelper.IsAdmin(creds.username, creds.password, this.HttpContext?.Connection?.RemoteIpAddress?.ToString()))
                    {
                        isAdmin = true;
                        adminHash = studentIdHash;
                    }
                }
            }

            ResultInfo ri = new ResultInfo()
            {
                studentIdHash = studentIdHash,
                error = error,
                StudentName = studentName,
                Picture = studentPicture,
                IsAdmin = isAdmin,
                AdminHash = adminHash
            };

            ResultInfo result = ri;
            return result;
        }

        private VmStudent GetStudentInfo(string userName, string password, string hashedPassword, out string error)
        {
            string sqlQueryStudent = $@"select StudentId, Name, Hash, Email, Test, Photo, Password
                                        from Student
                                        where lower(UserName) = '{userName.ToLower()}'";

            var studentData = SQLHelper.RunSqlQuery(sqlQueryStudent);
            VmStudent studentinfo = null;
            error = "";

            if (studentData.Count == 0)
            {
                error = "Could not find a login with that username";
            }
            else if (studentData.Count > 1)
            {
                error = "Two users have the same username";
            }
            else
            {
                List<object> st = studentData[0];
                if (st[6].ToString() == password || st[6].ToString() == hashedPassword)
                {
                    studentinfo = new VmStudent
                    {
                        StudentId = (int)st[0],
                        Name = st[1].ToString(),
                        Hash = st[2].ToString(),
                        Email = st[3].ToString(),
                        Test = st[4].ToString() == "" ? (bool?)null : (bool)st[4],
                        Photo = st[5] == System.DBNull.Value ? null : (byte[])st[5]
                    };
                }
                else
                {
                    error = "Password was incorrect";
                }
            }
            return studentinfo;
        }
        private int GetNumberOfCourses(int studentId)
        {
            string sqlQueryCourseInstance = $@"Select Count(*) from CourseInstanceStudent cis
                                        join CourseInstance ci on cis.CourseInstanceId = ci.Id
                                        where StudentId = {studentId}";

            var courseInstanceData = SQLHelper.RunSqlQuery(sqlQueryCourseInstance);
            var result = (int)courseInstanceData.First()[0];
            return result;
        }
        private void UpdateStudentHash(int studentId)
        {
            var studentIdHash = Guid.NewGuid().ToString();
            string sqlQueryUpdateHashValue = $@"update Student set Hash = '{studentIdHash}'
                                                                            where StudentId ={studentId}";
            SQLHelper.RunSqlUpdate(sqlQueryUpdateHashValue);
        }
        private void UpdateLoginInfo(string userName, string hashedPassword, string status, string ip)
        {
            var date = DateTime.Now.ToString("yyyy-MM-dd");
            string sqlQueryUpdateHashValue = $@"INSERT INTO [dbo].[StudentLogin]
                                               ([Username]
                                               ,[Password]
                                               ,[Date]
                                               ,[State]
                                               ,[IPAddress])
                                         VALUES
                                               ('{userName}'
                                               ,'{hashedPassword}'
                                               ,'{date}'
                                               ,'{status}'
                                                ,'{ip}')";
            SQLHelper.RunSqlUpdate(sqlQueryUpdateHashValue);
        }
        private string GetIPAddress()
        {
            var ipAddress = "";
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    if (!string.IsNullOrEmpty(ip.ToString()))
                    {
                        ipAddress = ip.ToString();
                    }
                }
            }
            return ipAddress;
        }

        public static string GetPasswordHash(string PlainPassword)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(PlainPassword));
            var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            return hash;
        }
    }


    public class Credentials
    {
        public string username { get; set; }
        public string password { get; set; }
    }
    public class ResultInfo
    {
        public string studentIdHash { get; set; }

        public string error { get; set; }
        public string StudentName { get; set; }
        public string Picture { get; set; }
        public bool IsAdmin { get; set; }
        public string AdminHash { get; set; }
    }

}
