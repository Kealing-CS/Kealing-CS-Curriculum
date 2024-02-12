const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const redir = urlParams.get('redirect');

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

function wrong(element, error) {
    let errorBox = document.getElementById("error");

    // reset anim
    element.classList.remove("wrong");
    element.offsetHeight

    // add anim
    element.classList.add("wrong");

    element.addEventListener("animationend", () => {
        element.classList.remove("wrong");
    });

    errorBox.innerText = error;
}


function createAccount() {
    let usernameElement = document.getElementById("username");
    let passwordElement = document.getElementById("password");
    let passwordConfirmElement = document.getElementById("passwordConfirm");

    var username = usernameElement.value;
    var password = passwordElement.value;
    var retypedPassword = passwordConfirmElement.value;

    // Managing errors
    if (username === "") {
        wrong(usernameElement, "The username is empty");
        return;
    }

    if (username.length < 3) {
        wrong(usernameElement, "The username is too short");
        return;
    }

    if (username.length > 16) {
        wrong(usernameElement, "The username is too long");
        return;
    }

    if (password != retypedPassword) {
        wrong(passwordElement, "The passwords do not match");
        wrong(passwordConfirmElement, "The passwords do not match");
        return;
    }

    if (password === "") {
        wrong(passwordElement, "The password is empty");
        return;
    }

    if (password.length < 8) {
        wrong(passwordElement, "The password is too short");
        return;
    }

    if (password.length > 32) {
        wrong(passwordElement, "The password is too long");
        return;
    }


    for (const char of username.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(usernameElement, "The username contains invalid characters");
            return;
        }
    }

    for (const char of password.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(passwordElement, "The password contains invalid characters");
            return;
        }
    }    
    
    if (password !== retypedPassword) {
        wrong(document.getElementById("password"), "passwordConfirmDifference");
        wrong(document.getElementById("passwordConfirm"), "passwordConfirmDifference");
        return;
    }

    // Actually creating account
    fetch("api/createAccount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "user": username,
            "password": password
        })
    }).then(response => response.json())
    .then(data => {
        if (data[0]) {
            document.cookie = "username=".concat(username, "; SameSite=Strict");
            let token = data[1];
            document.cookie = "token=".concat(token, "; SameSite=Strict");
            window.location.href = redir || "/";
        } else {
            if (data[1] === "username_length") {
                wrong(document.getElementById("username"), "usernameBadLength");
            } else if (data[1] === "password_length") {
                wrong(document.getElementById("password"), "passwordBadLength");
            } else if (data[1] === "username_bad_text") {
                wrong(document.getElementById("username"), "usernameBadCharacters");
            } else if (data[1] === "password_bad_text") {
                wrong(document.getElementById("password"), "passwordBadCharacters");
            } else if (data[1] === "uat") {
                /* username already taken */
                wrong(document.getElementById("username"), "uat");
            } else {
                alert("Unknown error!");
            }
        }
    });
}
