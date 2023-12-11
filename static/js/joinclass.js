let correctLogin = fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
        user: localStorage.getItem("username"),
        token: localStorage.getItem("token")
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(res => res.json())
.then(res => {
    console.log(res)
    if (!res[0]) {
        window.location.href = "/login";
    }
});