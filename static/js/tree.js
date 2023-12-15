if (!localStorage.getItem('username') || !localStorage.getItem('token')) {
    window.location.href = "/login";
}

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


const levels = document.querySelectorAll(".level");
levels.forEach(level => {
    level.classList.add("locked");
});

let unlocked = fetch(`/api/getUnlocked?user=${localStorage.getItem('username')}`)
.then(res => res.json())
.then(res => {
    console.log(res)
    let level;
    for (let i = 0; i < res.length; i++) {
        const level = document.getElementById(res[i]);
        if (!level) continue
        level.classList.add("unlocked");
        level.classList.remove("locked");
    }
});


let start_js = new LeaderLine(
    document.getElementById('start'),
    document.getElementById('js')
);

let start_html = new LeaderLine(
    document.getElementById('start'),
    document.getElementById('html')
);

let start_css = new LeaderLine(
    document.getElementById('start'),
    document.getElementById('css')
);

start_js.setOptions({
    // get rid of the arrow and change the color
    endPlug: 'behind',
    color: '#ccc',
    size: 10,
});

start_html.setOptions({
    // get rid of the arrow and change the color
    endPlug: 'behind',
    color: '#ccc',
    size: 10,
});

start_css.setOptions({
    // get rid of the arrow and change the color
    endPlug: 'behind',
    color: '#ccc',
    size: 10,
});