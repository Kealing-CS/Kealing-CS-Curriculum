const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const redir = urlParams.get('redirect');

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

function wrong(element) {
    element.classList.remove("wrong");
    
    element.classList.add("wrong");
    
    element.addEventListener("animationend", () => {
        element.classList.remove("wrong");
    })
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    for (const char of username.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(document.getElementById("username"));
            return;
        }
    }

    for (const char of password.toLowerCase()) {
        if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
            wrong(document.getElementById("password"));
            return;
        }
    }

    fetch("api/freshLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "user": username,
            "password": password // TODO: should prob be encrypted
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data[0]) {
            document.cookie = "username=" + username;
            let token = data[2];
            document.cookie = "token=" + token;
            window.location.href = redir || "/";
        } else {
            if (data[1] == "username") {
                wrong(document.getElementById("username"));
            } else if (data[1] == "password") {
                wrong(document.getElementById("password"));
            }
        }
    })
}