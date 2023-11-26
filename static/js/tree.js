if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
    window.location.href = "/login";
}
let correctLogin = fetch(`/api/login?user=${localStorage.getItem('username')}&password=${localStorage.getItem('password')}`)
.then(res => res.text())
.then(res => {
    if (res == "false") {
        window.location.href = "/login";
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