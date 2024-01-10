const user = localStorage.getItem("username");
const token = localStorage.getItem("token");

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