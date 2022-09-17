//
// Global script
//

//'use strict'; // Helps in catching hard-to-find bugs


var urlFunction = "https://modelapi.letsusedata.com/api/";
var urlCompiler = "https://modelapi.letsusedata.com/api/";
var urlAdminCore = "https://adminapi.letsusedata.com/api/";

if (window.location.href.includes('localhost')) {
    urlFunction = "https://localhost:7061/api/";    // Rest Function Core
    urlCompiler = "https://localhost:7061/api/";    // Rest Compiler
    urlAdminCore = "https://localhost:7086/api/";   // Admin Core
}

async function fetchDirected(url, name, data) {

    const fullUrl = url + name;

    data.StudentHash = localStorage.getItem("Hash");
    data.Hash = localStorage.getItem("Hash");

    const parameter = {
        headers: { "content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
        method: "post"
    };
    return fetch(fullUrl, parameter)
        .then(
            res => res.json()
            //console.log(res.json())
        );
}

async function fetchCompiler(name, data) {

    return fetchDirected(urlCompiler, name, data);
}

async function fetchFunction(name, data) {

    return fetchDirected(urlFunction, name, data);
}

async function fetchAdmin(name, data) {
    return fetchDirected(urlAdminCore, name, data);
}

function onEnterClick(e, button)
{
    if (e.keyCode == 13) // 27=esc
    {
        button.click();
    }
}

function checkUser()
{
    const hash = localStorage.getItem("Hash")
    if (hash == null) {
        window.location.href = "index.html";
    }
}

function getHeader() {
    $(document).ready(function () {
        $('#includedContent').load("Logout.html");
    });
}

function GetUrl(pageUrl,
    name1 = "", value1 = "",
    name2 = "", value2 = "",
    name3 = "", value3 = "") {

    urlParams = new URLSearchParams(window.location.search);
    original = urlParams.toString();

    if (original == null) original = "";

    newUrl = pageUrl + "?" + original;

    if (name1 != "")
        newUrl += "&" + name1 + "=" + value1;

    if (name2 != "")
        newUrl += "&" + name2 + "=" + value2;

    if (name3 != "")
        newUrl += "&" + name3 + "=" + value3;
    
    return newUrl;

}

function GetUrlClean(pageUrl,
    name1 = "", value1 = "",
    name2 = "", value2 = "",
    name3 = "", value3 = "") {

    newUrl = pageUrl;

    if (name1 != "")
        newUrl += "?" + name1 + "=" + value1;

    if (name2 != "")
        newUrl += "&" + name2 + "=" + value2;

    if (name3 != "")
        newUrl += "&" + name3 + "=" + value3;

    return newUrl;
}

function Navigate(pageUrl,
    name1 = "", value1 = "",
    name2 = "", value2 = "",
    name3 = "", value3 = "") {

    url = GetUrl(pageUrl, name1, value1, name2, value2, name3, value3);

    window.location = url;
}

function NavigateClean(pageUrl,
    name1 = "", value1 = "",
    name2 = "", value2 = "",
    name3 = "", value3 = "") {

    newUrl = GetUrlClean(name1, value1, name2, value2, name3, value3);

    window.location = newUrl;
}

function GetFromQueryString(name)
{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


/**
 * @description Returns name and links of breadcrumbs for current page
 * @returns {[object]} - breadcrumb names with their corresponding links
 * 
 * 
 * // TODO : Requests to server for breadcrumbs will not be necessary after full implementation of react and react-router. React-router should be able to hold path names and add to breadcrumbs as necessary
 * */
async function GetBreadCrumbs() {
    const urlParams = new URLSearchParams(window.location.search);
    const data = {};

    //Iterate through search params and add to data
    urlParams.forEach((value, key) => {
        data[key] = value
    })

    const result = await fetchFunction("Breadcrumb", data);

    const crumbs = [];

    //Course Selection (Home) Link and BreadCrumb
    let name = "Home"
    let link = GetUrlClean("CourseSelection.html")
    crumbs.push({name, link})

    // Push name and link for all breadcrumbs from result to crumbs
    for (let key in result) {
        link = "#"
        if (result[key] === null) {
            continue;
        }
        if (key === "CourseName") {
            link = GetUrlClean(
                "CourseObjectives.html",
                "courseInstanceId",
                GetFromQueryString("courseInstanceId")
            )
        }
        else if (key === "ModuleName") {
            link = GetUrlClean(
                "ModulePage.html",
                "courseInstanceId",
                GetFromQueryString("courseInstanceId"),
                "moduleId", GetFromQueryString("moduleId")
            )
        }
        crumbs.push({name: result[key], link})
    }

    //Add annoucement breadcrumb if on annoucements page
    if (window.location.pathname === "/AnnouncementPage.html") {
        crumbs.push({name: "Annoucements", link: "#"})
    }

    return crumbs;
}

getHeader();
