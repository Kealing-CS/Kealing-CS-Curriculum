/*
Get basic info
*/

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const url = new URL(window.location.href);
const level = url.searchParams.get("level") ? url.searchParams.get("level") : "sandbox";
const user = getCookie("username");

if (!level) level = "sandbox"

/*
Check that the user has the level exists and that the user has it unlocked
TODO:
The checking that it exists is kinda messy, it just checks if the level has instructions
This should work but for clarity should mabye be changed later
*/

function checks() {
    fetch("/api/login")
    .then(res => res.status)
    .then(res => {
        if (res != 200) {
            window.location.href = "/login";
        }
    });

    fetch(`/api/getUnlocked?user=${user}`)
    .then(res => res.json())
    .then(res => {
        if (!res.includes(level)) {
            window.location.href = "/tree";
        }
    });

    fetch(`/api/getInstructions?level=${level}`)
    .then(res => {
        if (res.status == 404) {
            window.location.href = "/tree";
        }
        return res.text();
    })
    .then(res => {
        document.getElementById("instructions").innerHTML = res;
    });
}
checks()

/*
get the code for the level
*/

async function baseCode() {
    let baseCode = await fetch(`/api/getBaseCode?level=${level}`)
    .then(res => res.json());

    return baseCode;
}

async function getCode() {
    let code = await fetch(`/api/getCode?level=${level}&user=${user}&token=${getCookie("token")}`)
    if (code.status !== 200) {
        return baseCode();
    }

    return code.json();
}

/*
TODO: give the browser some test data so it can tell the user if it works. Dont give it all the data though,
or the user can just console.log it instead of actually doing what they are meant to do
*/

/*
load ace
*/

let baseJsCode = "// loading...";
let baseHTMLCode = "<!-- loading... -->";
let baseCSSCode = "/* loading... */"

let runButton = document.querySelector(".editor-run");
let instructions = document.querySelector(".editor-instructions");
let submitButton = document.querySelector(".editor-submit");

let codeEditor = ace.edit("editorCode");
let cnsl = document.getElementById("console");

var langTools = ace.require("ace/ext/language_tools");

let jsFile = ace.createEditSession(baseJsCode.split("\n"));
let htmlFile = ace.createEditSession(baseHTMLCode.split("\n"));
let cssFile = ace.createEditSession(baseCSSCode.split("\n"));

codeEditor.setSession(htmlFile);

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/html`);

codeEditor.setOptions({
    fontSize: "12pt",
    fontFamily: "DSM",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    showGutter: true,
});

let instructionsContainer = document.querySelector(".instructions-container");
let instructionsClose = document.querySelector(".instructions-close");

instructions.addEventListener("click", function() {
    instructionsContainer.style.display = "flow";
});

instructionsClose.addEventListener("click", function() {
    instructionsContainer.style.display = "none";
});

/*
base log
*/

function log(message, color, image=null, end="\n") {
    if (image) {
        let img = document.createElement("img");
        img.src = image;
        img.classList.add("console-image");
        cnsl.appendChild(img);
    }
    let spn = document.createElement("span");
    spn.innerText = `${message}${end}`;
    spn.style.color = color;
    spn.style.overflowWrap = "anywhere";
    spn.classList.add("console-log");
    cnsl.appendChild(spn);
}

/*
change edit mode
*/

function jsButton() {
    codeEditor.setSession(jsFile);
    codeEditor.session.setMode(`ace/mode/javascript`);
}

function htmlButton() {
    codeEditor.setSession(htmlFile);
    codeEditor.session.setMode(`ace/mode/html`);
}

function cssButton() {
    codeEditor.setSession(cssFile);
    codeEditor.session.setMode(`ace/mode/css`);
}

/*
submit
*/

async function submit() {
    let works = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify({
            level: level,
            code: {
                html: htmlFile.getValue(),
                js: jsFile.getValue(),
                css: cssFile.getValue()
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(res => {
        return res.status
    });

    if (works === 200) {
        alert("Submitted. Your teacher will check it out shortly.")
    } else {
        alert("Your code might not work. This could mean you have a stray whitespace in your logs or your code simply gives an error. Either way, it has been submitted.")
    }
}
submitButton.onclick = submit

/*
run the code
*/

function runJS(iframe, code) {
    cnsl.innerHTML = "";
    let output = {};
    output.log = function(...message) {
        log(message, "#fff");
    };
    output.error = function(message, lineNo, columnNo) {
        log(`${message}\t`, "red", "static/assets/images/error.svg", "");
        let btn = document.createElement("button");
        btn.innerText = `(line ${lineNo-12}, column ${columnNo})`;
        btn.classList.add("error-pos");
        btn.onclick = function() {
            codeEditor.setSession(jsFile);
            codeEditor.gotoLine(lineNo-12, columnNo-1, true);
            codeEditor.focus();
        };
        cnsl.appendChild(btn);
    };
    output.warn = function(...message) {
        log(message, "yellow", "static/assets/images/warning.svg");
    };

    window.onmessage = function(e) {
        if (e.data.type == "log") {
            output.log(e.data.message);
        } else if (e.data.type == "error") {
            output.error(e.data.message, e.data.lineNo, e.data.columnNo);
        } else if (e.data.type == "warn") {
            output.warn(e.data.message);
        } else if (e.data.type == "clear") {
            cnsl.innerHTML = "";
        }
    };

    let out = "";
    // handle errors:
    let doc = iframe.contentWindow.document;
    let scriptObj = doc.createElement("script");
    scriptObj.type = "text/javascript";
    scriptObj.innerHTML = `
    console._clear = function() {window.parent.postMessage({type: "clear"});};window.onerror = function(msg, url, lineNo, columnNo, error) {console._clear();console.error(msg, lineNo, columnNo);return true;};console.log = function(...message) {window.parent.postMessage({type: "log", message: JSON.parse(JSON.stringify(message))}, "*");};console.error = function(message, lineNo, columnNo) {window.parent.postMessage({type: "error", message: JSON.parse(JSON.stringify(message)), lineNo: lineNo, columnNo: columnNo}, "*");};console.warn = function(...message) {window.parent.postMessage({type: "warn", message: JSON.parse(JSON.stringify(message))}, "*");};console.clear = function() {window.parent.postMessage({type: "clear"}, "*");};`;
    // TODO: undefine the parent variable so that it gives an error when you reference it
    // the problem is that all the console functions use the parent variable so it will give an error when you try to use them
    out += scriptObj.outerHTML;

    let tempcode = `\n${code.replace("</script>", "<\\/script>")}\n`;
    scriptObj = doc.createElement("script");
    scriptObj.type = "text/javascript";
    scriptObj.innerHTML = tempcode;
    out += scriptObj.outerHTML;
    return out;
}

function runCSS(iframe, code) {
    let doc = iframe.contentWindow.document;
    let styleObj = doc.createElement("style");
    styleObj.type = "text/css";
    styleObj.innerHTML = code;
    return styleObj.outerHTML;
}

async function run() {
    let existing = document.getElementsByClassName("code-iframe");
    for (var i = 0; i < existing.length; i++) {
        existing[i].remove()
    }
    let iframe = document.createElement("iframe"); // create the iframe for sandboxing
    document.body.appendChild(iframe);
    iframe.sandbox = "allow-scripts"
    iframe.id = "codeIframe"
    iframe.classList.add("code-iframe")
    let code = "";
    code += await htmlFile.getValue()
    code += runJS(iframe, jsFile.getValue());
    code += runCSS(iframe, cssFile.getValue());
    iframe.srcdoc = code;
}

function home() {
    window.location.href = "/";
}

getCode().then(res => {
    jsFile.setValue(res.js);
    htmlFile.setValue(res.html);
    cssFile.setValue(res.css);
    run();
});

// opens instructions container
instructionsContainer.style.display = "flow";

setInterval(() => {
    fetch("/api/setCode", {
        method: "POST",
        body: JSON.stringify({
            level: level,
            code: {
                html: htmlFile.getValue(),
                js: jsFile.getValue(),
                css: cssFile.getValue()
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}, 1000 * 30); // auto saves every 30 seconds