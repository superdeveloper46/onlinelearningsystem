using LMS.Common.HelperModels;
using LMS.Common.ViewModels;
using LMSLibrary;
using Microsoft.AspNetCore.Mvc;
using RESTModelFunctionsCore.Helper;

namespace RESTModelFunctionsCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketingSystemController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] TicketingSystemIncomingInfo ici)
        {
            VmStudent student = VmModelHelper.GetStudentInfoByHash(ici.StudentHash);

            if (ici.Method == "SaveNewTicket")
            {
                try
                {
                    VmSupportTicket ticket = new();
                    byte[] image = Convert.FromBase64String(ici.Photo);
                    InsertSupportTicket(ici.Title, student.StudentId, ici.Priority, ici.CourseInstanceId, ici.Message, image);
                    return Ok(ticket);
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            else if (ici.Method == "GetList")
            {
                SupportTicketListResults Response = new();
                List<VmSupportTicket> SupportTickets = GetVmSupportTickets(ici.CourseInstanceId, student.StudentId);

                // Filter tickets - Needed only for tests.
                if (ici.Closed && !ici.Opened)
                {
                    SupportTickets = SupportTickets.Where(a => !a.OpenStatus).ToList();
                }

                if (SupportTickets.Count < 1) return Ok(Response);
                Response.SupportTicketList = new List<SupportTicket>();

                // Get all the messages related to all SupportTickets belonging to the current student at the same time.
                // This is to avoid multiple SQL queries for every SupportTicket
                List<int> TicketIDList = new();
                for (int i = 0; i < SupportTickets.Count; i++)
                {
                    TicketIDList.Add(SupportTickets[i].Id);
                }

                List<VmSupportTicketMessage> AllMessages = GetVmSupportTicketMessages(TicketIDList);

                foreach (VmSupportTicket SupportTicketItem in SupportTickets)
                {
                    string TokenNo = SupportTicketItem.TokenNo.ToString();
                    if (SupportTicketItem.TokenNo.ToString().Length < 5) TokenNo = SupportTicketItem.TokenNo.ToString().PadLeft(5, '0');

                    List<SupportTicketMessage> TicketMessageList = new();
                    for (int i = 0; i < AllMessages.Count; i++)
                    {
                        // Walking through memory variables is a lot faster that querying the db!
                        if (AllMessages[i].SupportTicketID != SupportTicketItem.Id) continue;

                        string ContentImage = "", PersonImage = "";
#pragma warning disable CS8604 // (Possible null reference argument) - .ContentImage and .PersonPhoto cannot be null here, because of the "if" statement.
                        if (AllMessages[i].ContentImage != null) ContentImage = "data:image;base64," + Convert.ToBase64String(AllMessages[i].ContentImage.ToArray());
                        if (AllMessages[i].PersonPhoto != null) PersonImage = "data:image;base64," + Convert.ToBase64String(AllMessages[i].PersonPhoto.ToArray());
#pragma warning restore CS8604 // (Possible null reference argument).

                        TicketMessageList.Add(new SupportTicketMessage
                        {
                            Id = AllMessages[i].Id,
                            Message = AllMessages[i].Message,
                            ContentImage = ContentImage,
                            PersonName = AllMessages[i].Name,
                            Role = AllMessages[i].Role,
                            PersonImage = PersonImage
                        });
                    }

                    // Add the now ready SupportTicket to the final response
                    Response.SupportTicketList.Add(new SupportTicket
                    {
                        Id = SupportTicketItem.Id,
                        TokenNo = TokenNo,
                        Title = SupportTicketItem.Title,
                        Status = SupportTicketItem.OpenStatus == true ? "Open" : "Closed",
                        Priority = SupportTicketItem.Priority,
                        MessageList = TicketMessageList
                    });

                    UpdateSupportTicketMessage(SupportTicketItem.Id);
                }

                return Ok(Response);
            }
            else if (ici.Method == "GetMessage") // This method is needed for tests only
            {
                List<int> TicketIDList = new()
                {
                    ici.SupportTicketId
                };
                List<VmSupportTicketMessage> AllMessages = GetVmSupportTicketMessages(TicketIDList);
                var listOfCourse = GetCourseInstance(ici.CourseInstanceId);

                List<SupportTicketMessage> TicketMessageList = new();
                for (int i = 0; i < AllMessages.Count; i++)
                {
                    string ContentImage = "", PersonImage = "";
#pragma warning disable CS8604 // (Possible null reference argument) - .ContentImage and .PersonPhoto cannot be null here, because of the "if" statement.
                    if (AllMessages[i].ContentImage != null) ContentImage = "data:image;base64," + Convert.ToBase64String(AllMessages[i].ContentImage.ToArray());
                    if (AllMessages[i].PersonPhoto != null) PersonImage = "data:image;base64," + Convert.ToBase64String(AllMessages[i].PersonPhoto.ToArray());
#pragma warning restore CS8604 // (Possible null reference argument).

                    TicketMessageList.Add(new SupportTicketMessage
                    {
                        Id = AllMessages[i].Id,
                        Message = AllMessages[i].Message,
                        ContentImage = ContentImage,
                        PersonName = AllMessages[i].Name,
                        Role = AllMessages[i].Role,
                        PersonImage = PersonImage
                    });
                }

                UpdateSupportTicketMessage(ici.SupportTicketId);
                return Ok(TicketMessageList);
            }
            else if (ici.Method == "SaveMessage")
            {
                try
                {
                    VmSupportTicket newTicket = new();
                    byte[] image = Convert.FromBase64String(ici.Photo);
                    InsertSupportTicketMessage(ici.SupportTicketId, student.StudentId, ici.Message, image);
                    return Ok(newTicket);
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            else if (ici.Method == "CloseTicket")
            {
                try
                {
                    VmSupportTicket newTicket = new();
                    UpdateSupportTicket(ici.SupportTicketId);
                    return Ok(newTicket);
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
            else if (ici.Method == "GetCourses")
            {
                var courseList = GetStudentCourse(student.StudentId);
                return Ok(courseList);
            }
            else
            {
                return Ok("");
            }
        }

        private static void InsertSupportTicket(string Title, int StudentId, string Priority, int CourseInstanceId, string Message, byte[] image)
        {
            string sqlQuizQuestionRating = $@"GenerateSupportTicket";
            List<Param> paramList = new()
            {
                new Param() { Name = "Title", Value = Title },
                new Param() { Name = "StudentId", Value = StudentId },
                new Param() { Name = "Priority", Value = Priority },
                new Param() { Name = "CourseInstanceId", Value = CourseInstanceId },
                new Param() { Name = "Message", Value = Message },
                new Param() { Name = "Image", Value = image }
            };
            SQLHelper.RunSqlUpdateWithParam(sqlQuizQuestionRating, paramList);
        }

        private static void InsertSupportTicketMessage(int SupportTicketId, int StudentId, string Message, byte[] image)
        {
            string sqlQuizQuestionRating = $@"InsertSupportTicketMessage";
            List<Param> paramList = new()
            {
                new Param() { Name = "SupportTicketId", Value = SupportTicketId },
                new Param() { Name = "StudentId", Value = StudentId },
                new Param() { Name = "Message", Value = Message },
                new Param() { Name = "Image", Value = image }
            };
            SQLHelper.RunSqlUpdateWithParam(sqlQuizQuestionRating, paramList);
        }

        private static void UpdateSupportTicket(int SupportTicketId)
        {
            string sqlQueryQuarter = $@"UPDATE [dbo].[SupportTicket] SET [OpenStatus]=0 WHERE [Id]={SupportTicketId};";
            SQLHelper.RunSqlQuery(sqlQueryQuarter);
        }

        private static void UpdateSupportTicketMessage(int SupportTicketId)
        {
            string sqlQueryQuarter = $@"UPDATE [dbo].[SupportTicketMessage] SET [ViewStatus]=1 WHERE [SupportTicketId]={SupportTicketId}";
            SQLHelper.RunSqlQuery(sqlQueryQuarter);
        }

        private static List<StudentCourse> GetStudentCourse(int studentId)
        {
            string sqlStudentCourse = $@"select ci.Id,c.Name from Course c
                                    inner join CourseInstance ci on ci.CourseId = c.Id
                                    inner join CourseInstanceStudent cis on cis.CourseInstanceId = ci.Id
                                    where ci.Active = 1 and cis.StudentId = {studentId}";


            var studentCourseData = SQLHelper.RunSqlQuery(sqlStudentCourse);
            List<StudentCourse> studentCourses = new();

            if (studentCourseData.Count > 0)
            {
                foreach (var item in studentCourseData)
                {
                    StudentCourse studentCourseInfo = new()
                    {
                        Id = (int)item[0],
                        Name = (string)item[1]
                    };
                    studentCourses.Add(studentCourseInfo);
                }
            }
            return studentCourses;
        }

        private static List<StudentCourse> GetCourseInstance(int instanceId)
        {
            string sqlStudentCourses = $@"SELECT CI.Id, C.Name FROM [dbo].[CourseInstance] AS CI
                                        INNER JOIN [dbo].[Course] AS C ON CI.CourseId = C.Id
                                        WHERE CI.Id = {instanceId}";
            var queryStudentCourses = SQLHelper.RunSqlQuery(sqlStudentCourses);
            List<StudentCourse> StudentCourses = new();

            if (queryStudentCourses.Count < 1) return StudentCourses; // No course found!

            foreach (var queryRow in queryStudentCourses)
            {
                StudentCourses.Add(new StudentCourse
                {
                    Id = (int)queryRow[0],
                    Name = (string)queryRow[1]
                });
            }

            return StudentCourses;
        }

        private static List<VmSupportTicket> GetVmSupportTickets(int instanceId, int studentId)
        {
            string sqlSupportTickets = $@"SELECT * FROM [dbo].[SupportTicket]
                                        WHERE [CourseInstanceId]={instanceId} AND [StudentId]={studentId}";
            var querySupportTickets = SQLHelper.RunSqlQuery(sqlSupportTickets);
            List<VmSupportTicket> SupportTickets = new();

            if (querySupportTickets.Count < 1) return SupportTickets; // No ticket found!

            foreach (var queryRow in querySupportTickets)
            {
                SupportTickets.Add(new VmSupportTicket
                {
                    Id = (int)queryRow[0],
                    TokenNo = (int)queryRow[1],
                    StudentId = (int)queryRow[2],
                    Title = (string)queryRow[3],
                    Priority = (string)queryRow[4],
                    OpenStatus = (bool)queryRow[6],
                    CourseInstanceId = (int)queryRow[7]
                });
            }

            return SupportTickets;
        }

        private static List<VmSupportTicketMessage> GetVmSupportTicketMessages(List<int> TicketIDList)
        {
            // Create an SQL query with all Ticket Ids
            string sqlCondition = "";
            for (int i = 0; i < TicketIDList.Count; i++)
            {
                sqlCondition += $@"ST.Id={TicketIDList[i]}";
                if (i < TicketIDList.Count - 1) sqlCondition += " OR "; else sqlCondition += ";";
            }

            string sqlMessages = $@"SELECT STM.Id, STM.Message, STM.Image, STM.Role, S.Name, S.Photo, ST.Id FROM [SupportTicket] AS ST
                                INNER JOIN [SupportTicketMessage] AS STM ON ST.Id = STM.SupportTicketId
                                INNER JOIN [Student] AS S ON S.StudentId = STM.StudentId
                                WHERE {sqlCondition}";
            var queryMessages = SQLHelper.RunSqlQuery(sqlMessages);
            List<VmSupportTicketMessage> Messages = new();

            if (queryMessages.Count < 1) return Messages; // No message found!

            foreach (var queryRow in queryMessages)
            {
                Messages.Add(new VmSupportTicketMessage
                {
                    Id = (int)queryRow[0],
                    Message = (string)queryRow[1],
                    ContentImage = (queryRow[2] == DBNull.Value || ((byte[])queryRow[2]).Length < 1) ? null : (byte[])queryRow[2],
                    Role = (string)queryRow[3],
                    Name = (string)queryRow[4],
                    PersonPhoto = (queryRow[5] == DBNull.Value || ((byte[])queryRow[5]).Length < 1) ? null : (byte[])queryRow[5],
                    SupportTicketID = (int)queryRow[6]
                });
            }

            return Messages;
        }
    }

    // Incoming request data structure
    public class TicketingSystemIncomingInfo
    {
        public string StudentHash { get; set; }
        public int CourseInstanceId { get; set; }
        public int SupportTicketId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Photo { get; set; }
        public string Priority { get; set; }
        public string Method { get; set; }
        public bool Opened { get; set; }
        public bool Closed { get; set; }
    }

    // SupportTicket's Message, as it is retrieved from the DB
    public class VmSupportTicketMessage
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public byte[]? ContentImage { get; set; }
        public string? Role { get; set; }
        public string? Name { get; set; }
        public byte[]? PersonPhoto { get; set; }
        public int SupportTicketID { get; set; }
    }

    // SupportTicket's Message, as it is sent to the client
    public class SupportTicketMessage
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public string? ContentImage { get; set; }
        public string? PersonName { get; set; }
        public string? Role { get; set; }
        public string? PersonImage { get; set; }
    }

    // One SupportTicket, with a list of messages (if there any)
    public class SupportTicket
    {
        public int Id { get; set; }
        public string? TokenNo { get; set; }
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public List<SupportTicketMessage>? MessageList { get; set; }
    }

    // Complete SupportTicket result structure
    public class SupportTicketListResults
    {
        public List<SupportTicket>? SupportTicketList { get; set; }
    }
}
