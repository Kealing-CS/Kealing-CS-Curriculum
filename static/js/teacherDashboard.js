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

// check if the user is an admin
fetch("/api/isTeacher?user=" + user)
.then(res => res.json())
.then(res => {
    if (!res) {
        window.location.href = "/dashboard";
    }
});

function getAssignments() {
    const classCode = document.getElementById("classCode").value;

    fetch("/api/getAssignments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            classCode: classCode
        })
    })
    .then(res => res.status)
    .then(res => {
        if (res != 200) {
            alert("Error getting assignments");
        }
    });
}

function createClass() {
    fetch("/api/createClass", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("className").value
        })
    })
    .then(res => res.status)
    .then(res => {
        if (res != 200) {
            alert("Error creating class");
        } else {
            updateClasses();
        }
    });
}

function updateClasses() {
    fetch("/api/getClasses")
    .then(res => res.json())
    .then(res => {
        console.log(res)
        const classSelect = document.getElementById("classCode");
        classSelect.innerHTML = "";
        res.forEach(c => {
            const option = document.createElement("option");
            option.value = c.classCode;
            option.innerText = c.name;
            classSelect.appendChild(option);
        });
    });
}

updateClasses();