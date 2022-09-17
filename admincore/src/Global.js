
//export var API_URL = "https://restadminpages.azurewebsites.net/api/"; //Rest Admin Pages Core
//export var VALIDATION_API_URL = "https://restcompilerfunctions1.azurewebsites.net/api/"; //Rest Model Function Core
//export var ADMIN_URL = "https://ludadmin.azurewebsites.net/" //Admin Pages



export var API_URL = "https://adminapi.letsusedata.com/api/";//Rest Admin Pages Core
export var VALIDATION_API_URL = "https://modelapi.letsusedata.com/api/"; //Rest Model Function Core
export var ADMIN_URL = "https://admin.letsusedata.com/" //Admin Core

var currentUrl = window.location.href;

if (currentUrl.includes('localhost')) {
    
    API_URL = "https://localhost:7086/api/"; //Rest Admin Pages Core
    VALIDATION_API_URL = "https://localhost:7061/api/"; //Rest Model Function Core
    ADMIN_URL = "http://localhost:3000/"; //Admin Core
    //ADMIN_URL = "https://localhost:44304/"; //Old Admin Pages

    //API_URL = "https://adminapi.letsusedata.com/api/";
    // VALIDATION_API_URL = "https://restcompilerfunctions1.azurewebsites.net/api/";
    // ADMIN_URL = "https://ludadmin.azurewebsites.net/"

}



