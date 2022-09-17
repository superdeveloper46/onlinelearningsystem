using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class VideoMaterialController_Tests
    {
        [TestMethod]
        [ExpectedException(typeof(NullReferenceException))]
        public void GetVideoMaterialWithInvalidMaterialId_ThrowsNullReferenceException()
        {
            var controller = new VideoMaterialController();
            var response = controller.Post(new VideoMaterialInfo { VideoMaterialId = -1 });
        }

        [TestMethod]
        public void GetVideoMaterialWithValidMaterialId_ReturnsVideoMaterialWithSteps()
        {
            var controller = new VideoMaterialController();
            var response = controller.Post(new VideoMaterialInfo { VideoMaterialId = 2 });

            var okResponse = response.Result as OkObjectResult;
            Assert.IsNotNull(okResponse);
            Assert.AreEqual(okResponse.StatusCode, 200);

            var resultValue = okResponse.Value as VideoMaterialResultInfo;
            Assert.IsNotNull(resultValue);

            Assert.AreEqual(resultValue.Title, "Video Material For Unit Testing");
            Assert.AreEqual(resultValue.Url, "https://www.youtube.com/watch?v=HYrXogLj7vg");
            Assert.IsTrue(resultValue.Steps.Count() > 0);
        }
    }
}
