const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

if (!isDev) {
  document.onkeydown = function (e) {
    if (e.which === 123) return false;
    if (e.ctrlKey && e.shiftKey && e.key === "I") return false;
    if (e.ctrlKey && e.shiftKey && e.key === "J") return false;
    if (e.ctrlKey && e.key === "U") return false;
  };
}

export const devMode = isDev;
export const APP_TITLE = "Let's Use Data";
export const API_URL = "https://modelapi.letsusedata.com/api/";
export const ADMIN_URL = "https://admin.letsusedata.com/";
export const ADMIN_API_URL = "https://adminapi.letsusedata.com/api/";
