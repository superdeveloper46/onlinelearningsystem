﻿using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Mvc;
using RESTModelFunctionsCore.Helper;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        [HttpPost]
        public ActionResult<CalendarResultInfo> Post([FromBody] CalendarIncomingInfo ici)
        {
            VmStudent student = VmModelHelper.GetStudentInfoByHash(ici.StudentHash);
            List<VmCalendarData_Result> result = GetCalendarData_Results(student.StudentId);
            List<QuarterDate> StardDate = new List<QuarterDate>();
            List<QuarterDate> EndDate = new List<QuarterDate>();

            var courseInstanceForQuartre = GetStudentCourses(student.StudentId);
            foreach (var i in courseInstanceForQuartre)
            {
                var quarter = GetQuarter(i.QuarterId);
                if (quarter != null)
                {
                    StardDate.Add(new QuarterDate { Date = quarter.StartDate });
                    EndDate.Add(new QuarterDate { Date = quarter.EndDate });
                }
            }
            //-----------------------------------------------------
            DateTime start = StardDate.OrderBy(x => x.Date).First().Date;
            DateTime end = EndDate.OrderByDescending(x => x.Date).First().Date;

            CalendarResultInfo ri = new CalendarResultInfo
            {
                StartDate = start,
                EndDate = end
            };

            int daysInQuarter = getDifference(start, end);
            if (daysInQuarter == 0)
            {
                return Ok(ri);
            }

            DateInfo[] dates = new DateInfo[daysInQuarter];
            foreach (VmCalendarData_Result line in result)
            {
                DateTime date = line.DueDate ?? new DateTime(2000, 1, 1);
                int index = getDifference(start, date);
                if (index < 0 || index >= daysInQuarter)
                {
                    continue;
                }

                if (dates[index] == null)
                {
                    DateInfo di = new DateInfo
                    {
                        DueDate = date.ToString()
                    };

                    List<ActivityInfo> activities = new List<ActivityInfo>();
                    ActivityInfo ai = new ActivityInfo()
                    {
                        CourseInstanceId = line.CourseInstanceId,
                        CourseName = line.CourseName,
                        Id = line.ActivityId,
                        Type = line.ActivityType,
                        Title = line.Title,
                        Completion = line.Completion ?? 0,
                        ModuleObjectiveId = line.ModuleObjectiveId
                    };
                    activities.Add(ai);
                    di.Activities = activities;
                    dates[index] = di;
                }
                //never runs
                else
                {
                    List<ActivityInfo> activities = dates[index].Activities;
                    ActivityInfo ai = new ActivityInfo()
                    {
                        CourseInstanceId = line.CourseInstanceId,
                        CourseName = line.CourseName,
                        Id = line.ActivityId,
                        Type = line.ActivityType,
                        Title = line.Title,
                        Completion = line.Completion ?? 0,
                        ModuleObjectiveId = line.ModuleObjectiveId
                    };
                    activities.Add(ai);
                }
            }

            ri.Dates = dates;
            ri.Courses = result.Select(i => new CourseInfo { CourseInstanceId = i.CourseInstanceId, CourseName = i.CourseName }).DistinctBy(ci => ci.CourseInstanceId).ToList();
            ri.ActivityTypes = result.Select(row => row.ActivityType).Distinct().ToList();
            return Ok(ri);
        }

        private int getDifference(DateTime date1, DateTime date2)
        {
            TimeSpan difference = date2 - date1;
            return difference.Days;
        }
        private List<VmCourseInstance> GetStudentCourses(int studentId)
        {
            string sqlQueryCourseInstance = $@"Select ci.* from CourseInstanceStudent cis
                                        join CourseInstance ci on cis.CourseInstanceId = ci.Id
                                        where StudentId = {studentId} and Active = 1";

            var courseInstanceData = SQLHelper.RunSqlQuery(sqlQueryCourseInstance);
            List<VmCourseInstance> vmCourseInstances = new List<VmCourseInstance>();

            if (courseInstanceData.Count > 0)
            {
                foreach (var item in courseInstanceData)
                {
                    VmCourseInstance vmCourseInstance = new VmCourseInstance
                    {
                        Id = (int)item[0],
                        Active = (bool)item[1],
                        QuarterId = (int)item[2],
                        CourseId = (int)item[3],
                        Testing = (bool)item[4]
                    };
                    vmCourseInstances.Add(vmCourseInstance);
                }
            }
            return vmCourseInstances;
        }
        private VmQuarter GetQuarter(int QuarterId)
        {
            string sqlQueryQuarter = $@"select QuarterId, StartDate, EndDate
                                        from Quarter
                                        where QuarterId = {QuarterId}";

            var quaterData = SQLHelper.RunSqlQuery(sqlQueryQuarter);
            VmQuarter vmQuarter = null;
            if (quaterData.Count > 0)
            {
                List<object> st = quaterData[0];
                vmQuarter = new VmQuarter
                {
                    QuarterId = (int)st[0],
                    StartDate = (DateTime)st[1],
                    EndDate = (DateTime)st[2]
                };
            }
            return vmQuarter;
        }
        private List<VmCalendarData_Result> GetCalendarData_Results(int StudentId)
        {
            string sqlQueryQuarter = $@"exec CalendarData {StudentId}";

            var calenderData = SQLHelper.RunSqlQuery(sqlQueryQuarter);
            List<VmCalendarData_Result> VmCalendarData_Results = new List<VmCalendarData_Result>();
            if (calenderData.Count > 0)
            {
                foreach (var item in calenderData)
                {
                    VmCalendarData_Result vmCalendarData = new VmCalendarData_Result
                    {
                        CourseInstanceId = (int)item[0],
                        CourseName = item[1].ToString(),
                        ActivityType = item[2].ToString(),
                        ActivityId = (int)item[3],
                        Title = item[4].ToString(),
                        DueDate = (DateTime?)item[5],
                        Completion = (int?)item[6],
                        ModuleObjectiveId = (int)item[7]
                    };
                    VmCalendarData_Results.Add(vmCalendarData);
                }
            }
            return VmCalendarData_Results;
        }
    }
    public class CalendarIncomingInfo
    {
        public string StudentHash { get; set; }
        public int? CourseInstanceId { get; set; }
    }
    public class CalendarResultInfo
    {
        public DateInfo[] Dates { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<CourseInfo> Courses { get; set; }
        public List<string> ActivityTypes { get; set; }
    }
    public class CourseInfo
    {
        public CourseInfo() { }
        public int CourseInstanceId { get; set; }
        public string CourseName { get; set; }
    }
    public class DateInfo
    {
        public string DueDate { get; set; } 
        public List<ActivityInfo> Activities { get; set; }
    }
    public class ActivityInfo
    {
        public int CourseInstanceId { get; set; }
        public string CourseName { get; set; }
        public int Id { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public int Completion { get; set; }
        public int ModuleObjectiveId { get; set; }
    }
    public class QuarterDate
    {
        public DateTime Date { get; set; }
    }
}
