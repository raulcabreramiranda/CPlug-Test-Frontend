import Cookies from "cookies";

export const getDirBackend = "http://127.0.0.1:8000/";
export const getHeaderAutorization = (req = null) => {
  if (req === null) {
    return {
      Authorization:
        "Bearer " +
        (getCookie("HEADERS_AUTORIZATION")
          ? getCookie("HEADERS_AUTORIZATION")
          : ""),
    };
  }
  const cookies = new Cookies(req.req, req.res);
  return {
    Authorization:
      "Bearer " +
      (cookies.get("HEADERS_AUTORIZATION")
        ? cookies.get("HEADERS_AUTORIZATION")
        : ""),
  };
};

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export const getCookie = (cname, req) => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const checkCookie = () => {
  var user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
};
// export const HEADERS_AUTORIZATION = { 'Authorization': 'Bearer ' + localStorage.getItem('HEADERS_AUTORIZATION')}
