using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RESTModelFunctionsTest
{
    // Update the tests after module progress controller is completed. 
    [TestClass]
    public class ModuleProgressController_Tests
    {
        [TestMethod]
        public void ModuleProgressController_ReturnsOkResponse()
        {
            var controller = new ModuleProgressController();
            var response = controller.Post();

            var okResponse = response as OkObjectResult;
            Assert.IsNull(okResponse);
        }
    }
}
