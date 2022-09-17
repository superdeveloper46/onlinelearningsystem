﻿using LMS.Common.ViewModels;
using LMSLibrary;

namespace RESTModelFunctionsCore.Helper
{
    public static class VmModelHelper
    {
        public static VmStudent GetStudentInfoByHash(string hashedPassword)
        {
            string sqlQueryStudent = $@"select StudentId, Password, Name, Email,Test, UserName, Photo  from Student  where Hash = '{hashedPassword}'"; // AND (Password = '{hashedPassword}' OR Password = '{password}');

            var studentData = SQLHelper.RunSqlQuery(sqlQueryStudent);
            VmStudent studentinfo = null;

            if (studentData.Count > 0)
            {
                List<object> st = studentData[0];

                studentinfo = new VmStudent
                {
                    StudentId = (int)st[0],
                    Password = st[1].ToString(),
                    Name = st[2].ToString(),
                    Email = st[3].ToString(),
                    Test = (st[4] != System.DBNull.Value && (bool)st[4]),
                    UserName = st[5].ToString(),
                    Photo = st[6] != DBNull.Value ? (byte[])st[6] : null
                };

            }


            return studentinfo;
        }

        public static VmStudent GetStudentInfoById(string studentId)
        {
            string sqlQueryStudent = $@"SELECT StudentId, Password, Name, Email,Test
                                        FROM Student
                                        WHERE StudentId = {studentId}"; // AND (Password = '{hashedPassword}' OR Password = '{password}');

            var studentData = SQLHelper.RunSqlQuery(sqlQueryStudent);
            VmStudent studentinfo = null;

            if (studentData.Count > 0)
            {
                List<object> st = studentData[0];

                studentinfo = new VmStudent
                {
                    StudentId = (int)st[0],
                    Password = st[1].ToString(),
                    Name = st[2].ToString(),
                    Email = st[3].ToString(),
                    Test = (st[4] != System.DBNull.Value && (bool)st[4])
                };

            }


            return studentinfo;
        }
        public static VmCourseInstance GetCourseInstanceById(int id)
        {
            string sqlQueryCourseInstance = $@"select Id, Active,QuarterId,CourseId,Testing from CourseInstance where Id = {id}";

            var courseInstanceData = SQLHelper.RunSqlQuery(sqlQueryCourseInstance);
            VmCourseInstance courseInstanceinfo = null;

            if (courseInstanceData.Count > 0)
            {
                List<object> st = courseInstanceData[0];
                courseInstanceinfo = new VmCourseInstance
                {
                    Id = (int)st[0],
                    Active = (bool)st[1],
                    QuarterId = (int)st[2],
                    CourseId = (int)st[3],
                    Testing = (bool)st[4]
                };
            }

            return courseInstanceinfo;
        }
        public static VmCourse GetCourseById(int id)
        {
            string sqlQueryCourseInstance = $@"select Id, Name from Course where Id = {id}";

            var courseData = SQLHelper.RunSqlQuery(sqlQueryCourseInstance);
            VmCourse courseinfo = null;

            if (courseData.Count > 0)
            {

                List<object> st = courseData[0];

                courseinfo = new VmCourse
                {
                    Id = (int)st[0],
                    Name = st[1].ToString()
                };
            }

            return courseinfo;
        }
    }
}