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

fetch("/api/login")
.then(res => res.status)
.then(res => {
    if (res != 200) {
        window.location.href = `/login?redirect=${window.location.pathname}${window.location.search}`;
    }
});

function signOut() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
}

function openTeacherModal() {
    // open the modal
    document.getElementById("teacherModal").style.display = "block";
}

function closeTeacherModal() {
    // close the modal
    document.getElementById("teacherModal").style.display = "none";
}

function requestTeacherAccount() {
    // get the data from the form
    const school = document.getElementById("school").value;
    const email = document.getElementById("email").value;

    // send the request to the server
    fetch("/api/requestTeacher", {
        method: "POST",
        body: JSON.stringify({
            school: school,
            email: email
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => {
        if (res.status == 200) {
            closeTeacherModal();
        }
    });

    return false;
}

document.getElementById("username").innerText = user;