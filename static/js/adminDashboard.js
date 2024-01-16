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
    let id = document.getElementById("deleteLevelID").value;

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

    return false;
}

function createLevel() {
    let id = document.getElementById("createLevelID").value;
    let name = document.getElementById("createLevelName").value;
    let parents = JSON.parse(document.getElementById("createParents"));
    let instructions = document.getElementById("createInstructions").value;
    let baseJS = document.getElementById("createBaseJS").value;
    let baseHTML = document.getElementById("createBaseHTML").value;
    let baseCSS = document.getElementById("createBaseCSS").value;
    let baseCode = {"js": baseJS, "html": baseHTML, "css": baseCSS};
    let correctLogs = JSON.parse(document.getElementById("createCorrectLogs").value);
    let xpos = document.getElementById("createXpos").value;
    let ypos = document.getElementById("createYpos").value;
    let pos = {"x": xpos, "y": ypos};

    setLevel(id, name, parents, instructions, baseCode, correctLogs, pos);
}

function editLevel() {
    let id = document.getElementById("editLevelID").value;
    let name = document.getElementById("editLevelName").value;
    let parents = JSON.parse(document.getElementById("editParents"));
    let instructions = document.getElementById("editInstructions").value;
    let baseJS = document.getElementById("editBaseJS").value;
    let baseHTML = document.getElementById("editBaseHTML").value;
    let baseCSS = document.getElementById("editBaseCSS").value;
    let baseCode = {"js": baseJS, "html": baseHTML, "css": baseCSS};
    let correctLogs = JSON.parse(document.getElementById("editCorrectLogs").value);
    let xpos = document.getElementById("editXpos").value;
    let ypos = document.getElementById("editYpos").value;
    let pos = {"x": xpos, "y": ypos};

    setLevel(id, name, parents, instructions, baseCode, correctLogs, pos);
}

function setLevel(id, name, parents, instructions, baseCode, correctLogs, position) {
    fetch("/api/setLevel", {
        method: "POST",
        body: JSON.stringify({
            user: user,
            token: token,
            data: {
                id: id,
                name: name,
                parents: parents,
                instructions: instructions,
                baseCode: baseCode,
                correctLogs: correctLogs,
                position: position
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    return false;
}

function banUser() {
    let username = document.getElementById("banUsername").value;
    let reason = document.getElementById("banReason").value;

    fetch("/api/ban", {
        method: "POST",
        body: JSON.stringify({
            username: user,
            token: token,
            user: username,
            reason: reason
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    return false;
}

function unbanUser() {
    let username = document.getElementById("unbanUsername").value;

    console.log("hhi")

    fetch("/api/unban", {
        method: "POST",
        body: JSON.stringify({
            username: user,
            token: token,
            user: username
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    return false;
}

function getBanReason() {
    let username = document.getElementById("gbrUsername").value;

    fetch("/api/getBanReason?user=" + username)
    .then(res => res.text())
    .then(res => {
        alert(`Reason: ${res}`);
    });

    return false;
}