using RESTModelFunctionsCore.Helper;

namespace RESTModelFunctionsTest
{
    [TestClass]
    public class PasswordHelper_Tests
    {
        [TestMethod]
        [DataRow(257)]
        [DataRow(0)]
        [ExpectedException(typeof(ArgumentException))]
        public void GeneratePasswordWithInvalidLength_ReturnArgumentException(int length)
        {
            Password.Generate(length, 2);
        }

        [TestMethod]
        [DataRow(2, 3)]
        [DataRow(2,-1)]
        [ExpectedException(typeof(ArgumentException))]
        public void GeneratePasswordWithInvalidNonAlphanumericCharacters_ReturnArgumentException(int length, int numberOfNonAlphanumericCharacters)
        {
            Password.Generate(length, numberOfNonAlphanumericCharacters);
        }

        [TestMethod]
        public void GeneratePasswordWithValidValues_ReturnsPassword()
        {
            var password = Password.Generate(20, 18);
            Assert.AreEqual(20, password.Length);
            var specialCharacters = "!@#$%^&*()_-+=[{]};:>|./?";
            Assert.IsTrue(password.Count(p => specialCharacters.Contains(p)) >= 18);
        }

        [TestMethod]
        public void GetHashOfPassword_ReturnsSameHashedPassword()
        {
            var password = "123456";
            var hashedPassword = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";
            var generatedHashedPassword = Password.GetHash(password);
            Assert.AreEqual(hashedPassword, generatedHashedPassword);
        }
    }
}
