using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class ContactController_Tests
    {
        [TestMethod]
        public void SendMessageWithOutHash_ReturnsMessageNotSent()
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "invalidhash9099898" });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "");
            Assert.AreEqual(resultValue.error, "Sorry! Message sending is failed. Student cannot found.");

        }

        [TestMethod]
        [DataRow("valid message", "Sorry! The Name field cannot be left blank.")]
        public void SendMessageByStudentWithInvalidName_ReturnsErrorMessage(string message, string expectederror)
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "0123d262-ff1e-4ac2-8546-186f5882810c", Message = message  });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "");
            Assert.AreEqual(resultValue.error, expectederror);

        }

        [TestMethod]
        public void SendMessageByStudentWithEmtpyEmail_ReturnsErrorMessage()
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "5c6472e0-174e-47c1-81ac-d64ed6276591", Message = "valid message" });
            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "");
            Assert.AreEqual(resultValue.error, "Sorry! The Email field cannot be left blank.");

        }

        [TestMethod]
        public void SendMessageByStudentWithInvalidEmail_ReturnsErrorMessage()
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "6676ce9a-3df7-421b-9e21-4ce3a570f6a4", Message = "valid message" });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "");
            Assert.AreEqual(resultValue.error, "Sorry! Your Email address is not valid. Please provide a valid email address.");

        }

        [TestMethod]
        [DataRow("", "Sorry! The Message field cannot be left blank")]
        [DataRow("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et imperdiet dolor. Donec consectetur id nibh id placerat. Aliquam mattis augue at lorem egestas mattis. Cras malesuada vitae erat vitae ultrices. Aliquam elit lectus, fermentum sit amet rhoncus eu, sagittis sit amet libero. Ut vitae tortor tristique, accumsan leo ut, congue nisi. Integer aliquam vitae nisl viverra malesuada. Etiam erat curae.", "Sorry! The message do not support more than 400 character.Total Character of your message is 410.")]
        public void SendInvalidMessageByValidStudent_ReturnsEmptyMessageError(string message, string expectedError)
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", Message = message });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "");
            Assert.AreEqual(resultValue.error, expectedError);
        }

        [TestMethod]
        public void ValidMessageSentByValidStudent_ReturnSuccess()
        {
            var controller = new ContactController();
            var response = controller.Post(new UserCredential { Hash = "bce20431-5af2-4837-812f-5a2c5b65ce53", Message = "valid message sent from unit test method" });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);

            var resultValue = okResponse.Value as ContactResultInfo;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(resultValue.success, "Your Message has been sent successfully.");
            Assert.AreEqual(resultValue.error, "");
        }
    }
}
