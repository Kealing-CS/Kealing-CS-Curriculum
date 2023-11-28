const url = new URL(window.location.href)
const level = url.searchParams.get("level")
const user = localStorage.getItem("username")

let levelExists = fetch(`/api/getInstructions?level=${level}`)
.then(res => {
    if (res.status == 404) {
        window.location.href = "/tree";
    }
    return res.text();
})
.then(res => {
    document.getElementById("instructions").innerHTML = res;
});

let levelUnlocked = fetch(`/api/getUnlocked?user=${user}`)
.then(res => res.json())
.then(res => {
    if (!res.includes(level)) {
        window.location.href = "/tree";
    }
})


let runButton = document.querySelector(".editor-run");
let resetButton = document.querySelector(".editor-reset");
let instructions = document.querySelector(".editor-instructions");

let codeEditor = ace.edit("editorCode");
let cnsl = document.getElementById("console")

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/javascript`);

let instructionsContainer = document.querySelector(".instructions-container");
let instructionsClose = document.querySelector(".instructions-close");

instructions.addEventListener("click", function() {
    instructionsContainer.style.display = "flow";
});

instructionsClose.addEventListener("click", function() {
    instructionsContainer.style.display = "none";
});

function log([message], color, image=null) {
    if (image) {
        let img = document.createElement("img")
        img.src = image
        img.classList.add("console-image")
        cnsl.appendChild(img)
    }
    let spn = document.createElement("span");
    spn.innerText = `${message}\n`;
    spn.style.color = color;
    spn.style.overflowWrap = "anywhere";
    spn.classList.add("console-log");
    cnsl.appendChild(spn);
}

async function run() {
    let code = codeEditor.getValue(); // get the code
    
    let iframe = document.createElement("iframe"); // create the iframe for sandboxing
    iframe.style.display = "none";
    iframe.src = "docs/runCodeIframe.html";
    document.body.appendChild(iframe);

    // console shit
    cnsl.innerHTML = "";
    let output = iframe.contentWindow.console;
    output.log = function(...message) {
        log(message, "#fff")
    }
    output.error = function(...message) {
        log(message, "red", "static/assets/images/error.svg")
    }
    output.warn = function(...message) {
        log(message, "yellow", "static/assets/images/warning.svg")
    }
    output.clear = function() {
        cnsl.innerHTML = ""
    }

    try {
        iframe.contentWindow.eval(code);
        // delete the iframe
        iframe.remove()
    } catch(e) {
        let line = `${e.lineNumber}: ${code.split("\n")[e.lineNumber-1]}`;
        let temp = "^".repeat(line.length);
        log(`${e}\n${line}\n${temp}\n`, "red", "static/assets/images/error.svg");
    }
}