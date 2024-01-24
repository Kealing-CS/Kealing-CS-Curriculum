const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const redir = urlParams.get('redirect');

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

function wrong(element, error) {
    var errorBox = document.getElementById("error");

    // Reset animation if spammed
    element.classList.remove("wrong");
    element.offsetHeight;
    element.classList.add("wrong");

    element.addEventListener("animationend", () => {
        element.classList.remove("wrong");
    })

    if (error) {
        switch (error) {
            case "empty":
                errorBox.innerText = "One or more fields are empty";
                return;
            case "uat":
                errorBox.innerText = "Username already taken";
                return;
            case "usernameBadLength":
                errorBox.innerText = "Username must be between 3 and 16 characters";
                return;
            case "passwordBadLength":
                errorBox.innerText = "Password must be between 8 and 32 characters";
                return;
            case "usernameBadCharacters":
                errorBox.innerText = "Username can only have numbers, letters, and _";
                return;
            case "passwordBadCharacters":
                errorBox.innerText = "Password can only have numbers, letters, and _";
                return;
            case "passwordConfirmDifference":
                errorBox.innerText = "Entered passwords are different";
                return;
        }
    }
}


function createAccount() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var retypedPassword = document.getElementById("passwordConfirm").value;
    var errIndex = [];

    // Managing errors
    if (username == "") {
        errIndex.push("username");
    }

    if (password == "") {
        errIndex.push("password");
    }

    // Pushes errors for empty fields
    // Not doing this for all fields since somebody thinks that it's best to spoonfeed the user what's wrong
    if (errIndex.length > 0) {
        errIndex.forEach((badField) => {
            wrong(document.getElementById(badField), "empty");
        })
        return;
    }
    // No error for password confirmation because that's covered in field comparison

    for (const char of username.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(document.getElementById("username"), "usernameBadCharacters");
            return;
        }
    }

    for (const char of password.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(document.getElementById("password"), "passwordBadCharacters");
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
            document.cookie = "username=" + username;
            let token = data[2];
            console.log(token)
            document.cookie = "token=" + token;
            window.location.href = redir || "/";
        } else {
            if (data[1] === "username") {
                wrong(document.getElementById("username"), "usernameBadLength");
            } else if (data[1] === "password") {
                wrong(document.getElementById("password"), "passwordBadLength");
            } else if (data[1] === "uat") {
                /* username already taken */
                wrong(document.getElementById("username"), "uat");
            } else {
                alert("Unknown error!");
            }
        }
    })
}
