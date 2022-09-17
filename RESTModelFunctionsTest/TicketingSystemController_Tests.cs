using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LMSLibrary;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class TicketingSystemController_Tests
    {
        public string studentHash { get; set; }
        public int courseInstanceId { get; set; }
        public TicketingSystemController_Tests()
        {
            studentHash = "bce20431-5af2-4837-812f-5a2c5b65ce53";
            courseInstanceId = 115;
        }
        [TestMethod]
        public void GetListOfSupportTickets_ReturnsTickets()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetList", Opened = true, CourseInstanceId = courseInstanceId, StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as SupportTicketListResults;
            Assert.IsNotNull(resultValue);
            Assert.IsTrue(resultValue.SupportTicketList != null && resultValue.SupportTicketList.Count > 0);
        }

        [TestMethod]
        public void GetListOfClosedSupportTickets_ReturnsClosedTicket()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetList", Closed = true, CourseInstanceId = courseInstanceId, StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as SupportTicketListResults;
            Assert.IsNotNull(resultValue);
            Assert.IsTrue(resultValue.SupportTicketList != null && resultValue.SupportTicketList.Count > 0);
            Assert.AreEqual(resultValue.SupportTicketList.FirstOrDefault().Status.ToLower(), "closed");
        }

        [TestMethod]
        public void SaveNewTicketWithValidValues_ReturnsTicket()
        {
            var saveTicketTitle = "TicketTitleForSaveTest";
            var saveTicketMessage = "TicketMessageForSaveTest";
            var saveTicketPriority = "high";
            var photofromdb = SQLHelper.RunSqlQuery("SELECT Photo FROM Student WHERE StudentId = 708;");
            var imageData = (byte[])photofromdb[0][0];
            var imageString = Convert.ToBase64String(imageData);

            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Title = saveTicketTitle, Message = saveTicketMessage, Method = "SaveNewTicket", Opened = true, Priority = saveTicketPriority, Photo = imageString, CourseInstanceId = courseInstanceId, StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as VmSupportTicket;
            Assert.IsNotNull(resultValue);

            var deleteMessageQuery = $@"DELETE FROM SupportTicketMessage Where StudentId = 708 AND Message = '{saveTicketMessage}'; ";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteMessageQuery) > 0);

            var deleteQuery = $@"DELETE FROM SupportTicket Where StudentId = 708 AND Title = '{saveTicketTitle}' AND Priority =  '{saveTicketPriority}'; ";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void SaveNewTicketWithInvalidValues_ThrowsException()
        {
            var controller = new TicketingSystemController();
            controller.Post(new TicketingSystemIncomingInfo { Method = "SaveNewTicket" });
        }

        [TestMethod]
        public void GetSupportTicketMessages_ReturnsMessages()
        {
            var photofromdb = SQLHelper.RunSqlQuery("SELECT Photo FROM Student WHERE StudentId = 708;");
            var imageData = (byte[])photofromdb[0][0];
            var imageString = Convert.ToBase64String(imageData);
            var controller = new TicketingSystemController();
            
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetMessage", Priority = "high", SupportTicketId = 156, CourseInstanceId = courseInstanceId, StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as List<SupportTicketMessage>;
            Assert.IsNotNull(resultValue != null && resultValue.Count > 1);

            //Assert.AreEqual(resultValue.CourseName, "courseforunittest"); // No longer includes the course name
            Assert.AreEqual(resultValue.FirstOrDefault(a => a.Id == 270).Message, "New message for permanent ticket");
        }

        [TestMethod]
        public void GetSupportTicketMessageByOtherStudentId_ReturnsMessageAndSetIsReadTrue()
        {
            string sqlQueryQuarter = $@"UPDATE [dbo].[SupportTicketMessage] SET [ViewStatus]=0 WHERE [Id]=270";
            Assert.IsTrue(SQLHelper.RunSqlUpdate(sqlQueryQuarter));
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetMessage", Priority = "high", SupportTicketId = 156, CourseInstanceId = courseInstanceId, StudentHash = "56639f07-c41c-4580-b717-375872278323" });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as List<SupportTicketMessage>;
            Assert.IsNotNull(resultValue != null && resultValue.Count > 1);

            //Assert.AreEqual(resultValue.CourseName, "courseforunittest"); // No longer includes the course name
            var firstmessage = resultValue.FirstOrDefault(a => a.Id == 270);
            Assert.AreEqual(firstmessage.Message, "New message for permanent ticket");

            sqlQueryQuarter = $@"SELECT [ViewStatus] FROM [dbo].[SupportTicketMessage] WHERE [Id]=270";
            var queryResult = SQLHelper.RunSqlQuery(sqlQueryQuarter);
            Assert.IsTrue((bool)queryResult[0][0]);
        }

        [TestMethod]
        public void SaveSupportTicketMessage_ReturnSupportTicket()
        {
            var photofromdb = SQLHelper.RunSqlQuery("SELECT Photo FROM Student WHERE StudentId = 708;");
            var imageData = (byte[])photofromdb[0][0];
            var imageString = Convert.ToBase64String(imageData);
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "SaveMessage", Priority = "high", SupportTicketId = 156, CourseInstanceId = courseInstanceId, StudentHash = studentHash, Photo = imageString, Message = "Temporary message for unit testing" });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as VmSupportTicket;
            Assert.IsNotNull(resultValue);

            var deleteQuery = $@"DELETE FROM SupportTicketMessage Where StudentId = 708 AND Message = 'Temporary message for unit testing' AND SupportTicketId = 156; ";
            Assert.IsTrue(SQLHelper.RunSqlUpdateReturnAffectedRows(deleteQuery) > 0);
        }

        [TestMethod]
        [ExpectedException(typeof(Exception))]
        public void SaveMessageWithInvalidValues_ThrowsException()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "SaveMessage",SupportTicketId = 156 });
        }

        [TestMethod]
        public void CloseSupportTicket_ReturnsOkWithNewTicketObject()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "CloseTicket", SupportTicketId = 159 });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as VmSupportTicket;
            Assert.IsNotNull(resultValue);
        }

        [TestMethod]
        public void GetCoursesWithValidStudentId_ReturnsCourses()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetCourses", StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as List<StudentCourse>;
            Assert.IsTrue(resultValue.Count > 0);
        }

        [TestMethod]
        public void GetCourseForStudentWithZeroMessages_ReturnsZeroMessages()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "GetMessage", StudentHash = "0123d262-ff1e-4ac2-8546-186f5882810c" });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as List<SupportTicketMessage>;
            Assert.IsTrue(resultValue.Count == 0);
        }

        [TestMethod]
        public void TicketingSystemControllerWithoutMethod_ReturnsEmptyResponse()
        {
            var controller = new TicketingSystemController();
            var response = controller.Post(new TicketingSystemIncomingInfo { Method = "", StudentHash = studentHash });
            var okResponse = response as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as string;
            Assert.AreEqual(resultValue, string.Empty);
        }

    }
}
