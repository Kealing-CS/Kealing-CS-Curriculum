function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const user = getCookie("username");
const token = getCookie("token");

if (!user || !token) {
    window.location.href = "/login";
}

// check if the users login info is correct

fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
        user: user,
        token: token
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(res => res.json())
.then(res => {
    if (!res[0]) {
        window.location.href = "/login?redir=";
    }
});

// check if the user is an admin
fetch("/api/isTeacher?user=" + user)
.then(res => res.json())
.then(res => {
    if (!res) {
        window.location.href = "/dashboard";
    }
});
