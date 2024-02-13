const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const redir = urlParams.get('redirect');

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

function wrong(element, error) {
    console.log("hi")

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

function login() {

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

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
        console.log(data)
        if (data[0]) {
            document.cookie = "username=".concat(username, "; SameSite=Strict");
            let token = data[1];
            document.cookie = "token=".concat(token, "; SameSite=Strict");
            window.location.href = redir || "/";
        } else {
            if (data[1] == "username does not exist") {
                wrong(document.getElementById("username"), "The username does not exist");
            } else if (data[1] == "password is incorrect") {
                wrong(document.getElementById("password"), "The password is incorrect");
            }
        }
    })
}

function register() {
    window.location.href = `/register?redirect=${redir || "/"}`;
}