import { API_URL } from "../Global";
import nprogress from "nprogress";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  responseType: "json",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json; charset=UTF-8",
  },
});

axiosInstance.interceptors.request.use(function (config) {
  nprogress.start();
  config.params = config.params || {};
  const Hash = localStorage.getItem("Hash");
  // const AdminHash = localStorage.getItem("AdminHash");
  // const StudentHash = localStorage.getItem("StudentHash");
  // const StudentName = localStorage.getItem("StudentName");
  // if (AdminHash) {
  //   if (config.method === "GET") {
  //     config.params.AdminHash = AdminHash;
  //     config.params.IsAdmin = "true";
  //   } else {
  //     config.data = {
  //       ...config.data,
  //       AdminHash,
  //       IsAdmin: "true"
  //     };
  //   }
  // }

  if (config.method === "GET") {
    config.params.Hash = Hash;
    config.params.StudentHash = Hash;
    // config.params.StudentName = StudentName;
  } else {
    config.data = {
      ...config.data,
      Hash,
      StudentHash: Hash,
      // StudentName,
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    nprogress.done();
    return response.data;
  },
  function (error) {
    nprogress.done();
    console.log(error);
    if (error.response) {
      return Promise.reject(error.response);
    }
    return Promise.reject(null);
  }
);

const request = (method, url, data) => {
  if (method === "GET") {
    return axiosInstance.request({
      url,
      method,
      params: data,
    });
  } else {
    return axiosInstance.request({
      url,
      method,
      data,
    });
  }
};

const requests = {
  get: (url, data) => {
    return request("GET", url, data);
  },
  post: (url, data) => {
    return request("POST", url, data);
  },
  put: (url, data) => {
    return request("PUT", url, data);
  },
  delete: (url, data) => {
    return request("DELETE", url, data);
  },
};

export default requests;
