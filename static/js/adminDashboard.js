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
fetch("/api/isAdmin?user=" + user)
.then(res => res.json())
.then(res => {
    if (!res) {
        window.location.href = "/dashboard";
    }
});


function deleteLevel() {
    let id = document.getElementById("levelID").value;

    fetch("/api/deleteLevel", {
        method: "POST",
        body: JSON.stringify({
            user: user,
            token: token,
            id: id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => {
        if (res.status !== 200) {
            alert(res.status);
        }
    });
}

function createLevel() {
    let id = document.getElementById("levelID").value;
    let name = document.getElementById("levelName").value;

    return false;

    fetch("/api/setLevel", {
        method: "POST",
        body: JSON.stringify({
            user: user,
            token: token,
            data: {
                id: id,
                name: name,
                parents: ["js"],
                instructions: "gersd",
                baseCode: {"js": "console.log('Hello World!');", "html": "<h1>Hello World!</h1>", "css": "h1 { color: red; }"},
                correctLogs: [],
                position: {"x": 15, "y": 15}
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    return false;
}