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
            id: id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => {
        success(document.getElementById("deleteLevelButton"), res.status === 200);
    });
}

function createLevel() {
    let id = document.getElementById("createLevelID").value;
    let name = document.getElementById("createLevelName").value;
    let parents = JSON.parse(document.getElementById("createParents").value);
    let instructions = document.getElementById("createInstructions").value;
    let baseJS = document.getElementById("createBaseJS").value;
    let baseHTML = document.getElementById("createBaseHTML").value;
    let baseCSS = document.getElementById("createBaseCSS").value;
    let baseCode = {"js": baseJS, "html": baseHTML, "css": baseCSS};
    let correctLogs = JSON.parse(document.getElementById("createCorrectLogs").value);
    let xpos = document.getElementById("createXpos").value;
    let ypos = document.getElementById("createYpos").value;
    let pos = {"x": xpos, "y": ypos};

    setLevel(id, name, parents, instructions, baseCode, correctLogs, pos, document.getElementById("createLevelButton"));
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

    setLevel(id, name, parents, instructions, baseCode, correctLogs, pos, document.getElementById("editLevelButton"));

    
}

async function setLevel(id, name, parents, instructions, baseCode, correctLogs, position, button) {
    let status = await fetch("/api/setLevel", {
        method: "POST",
        body: JSON.stringify({
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
    })
    .then(res => res.status);

    if (button) {
        success(button, status === 200);
    }    

    return status;
}

function banUser() {
    let username = document.getElementById("banUsername").value;
    let reason = document.getElementById("banReason").value;

    fetch("/api/ban", {
        method: "POST",
        body: JSON.stringify({
            user: username,
            reason: reason
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.status)
    .then(res => {
        success(document.getElementById("banUserButton"), res === 200);
    });
}

function unbanUser() {
    let username = document.getElementById("unbanUsername").value;


    fetch("/api/unban", {
        method: "POST",
        body: JSON.stringify({
            user: username
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.status)
    .then(res => {
        success(document.getElementById("unbanUserButton"), res === 200); 
    });

    
}

function getBanReason() {
    let username = document.getElementById("gbrUsername").value;

    fetch("/api/getBanReason?user=" + username)
    .then(res => res.text())
    .then(res => {
        alert(`Reason: ${res}`);
    });

    
}

async function getTeacherRequests() {
    // get the requests
    let requests = await fetch(`/api/getTeacherRequests`)
    .then(res => {return res.status === 200 ? res.json() : []});

    // display the requests
    let requestList = document.getElementById("teacherRequests");
    requestList.innerHTML = "";
    requests.forEach(request => {
        let req = document.createElement("li");
        let para = document.createElement("p");
        para.appendChild(document.createTextNode(`${request.username} - ${request.email}, ${request.school}`));
        req.appendChild(para);
        let accept = document.createElement("button");
        accept.classList.add("dashboard-submit");
        accept.appendChild(document.createTextNode("Accept"));
        accept.onclick = async () => {
            await fetch(`/api/acceptTeacherRequest?id=${request.id}`);
            getTeacherRequests();
        };
        req.appendChild(accept);
        let deny = document.createElement("button");
        deny.classList.add("dashboard-submit");
        deny.appendChild(document.createTextNode("Deny"));
        deny.onclick = async () => {
            await fetch(`/api/denyTeacherRequest?id=${request.id}`);
            getTeacherRequests();
        };
        req.appendChild(deny);
        requestList.appendChild(req);
    });

    // show the modal
    let modal = document.getElementById("teacherModal");
    modal.style.display = "block";
}

function closeTeacherModal() {
    document.getElementById("teacherModal").style.display = "none";
}

function setTeacher() {
    let username = document.getElementById("setTeacherUsername").value;

    fetch("/api/forceTeacher", {
        method: "POST",
        body: JSON.stringify({
            user: username
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.status)
    .then(res => {
        success(document.getElementById("setTeacherButton"), res === 200);
    });
}

function setAdmin() {
    let username = document.getElementById("setAdminUsername").value;

    fetch("/api/forceAdmin", {
        method: "POST",
        body: JSON.stringify({
            user: username
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => res.status)
    .then(res => {
        success(document.getElementById("setAdminButton"), res === 200);
    });
}

function success(button, success) {
    if (success) {
        button.classList.add("succeeded");

        button.addEventListener("animationend", () => {
            button.classList.remove("succeeded");
        });
    } else {
        button.classList.add("failed");

        button.addEventListener("animationend", () => {
            button.classList.remove("failed");
        });
    }
}