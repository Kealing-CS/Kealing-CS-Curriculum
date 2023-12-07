let correctLogin = fetch(`/api/login?user=${localStorage.getItem('username')}&password=${localStorage.getItem('password')}`)
.then(res => res.json())
.then(res => {
    console.log(res)
    if (!res[0]) {
        window.location.href = "/login";
    }
});