/*
Get basic info
*/

const url = new URL(window.location.href);
let level = url.searchParams.get("level");
const user = localStorage.getItem("username");


if (!level) {
    level = "sandbox"
    console.log("hi :3")
}

/*
Check that the user has the level exists and that the user has it unlocked
The checking that it exists is kinda messy, it just checks if the level has instructions
This should work but for clarity should mabye be changed later
*/

async function checks() {
    /*
    TODO: reenable this when the login system is fixed

    await fetch(`/api/login?user=${user}&password=${localStorage.getItem("password")}`)
    .then(res => res.json())
    .then(res => {
        if (!res[0]) {
            window.location.href = "/login";
        }
    });

    await fetch(`/api/getUnlocked?user=${user}`)
    .then(res => res.json())
    .then(res => {
        if (!res.includes(level)) {
            window.location.href = "/tree";
        }
    });
    */

    await fetch(`/api/getInstructions?level=${level}`)
    .then(res => {
        console.log("hi!!!!")
        if (res.status == 404) {
            console.log("404")
            //window.location.href = "/tree";
        }
        console.log("heshr")
        return res.text();
    })
    .then(res => {
        console.log(res)
        document.getElementById("instructions").innerHTML = res;
    });
}

checks()

/*
Get the languages that this level uses
then only includes the abilty to change the files that are in use
*/


async function _editLangs() {
    let requiredLangs = await fetch(`/api/getRequiredLanguages?level=${level}`)
    .then(res => res.json())
    if (!requiredLangs.includes("html")) {
        document.getElementById("htmlButton").remove()
    }

    if (!requiredLangs.includes("js")) {
        document.getElementById("jsButton").remove()
    } 
}
//_editLangs()

/*
load ace
*/

let baseJsCode = "function fib(n) {\n    let out = [0,1];\n    for (let i=0;i<n;i++) {\n        out.push(out[i]+out[i+1]);\n    }\n    return out;\n}\n\nconsole.log(fib(10));";
let baseHTMLCode = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n\t<h1>Hello, world!</h1>\n</body>\n</html>';
let baseCSSCode = "body {\n    color: white;\n}";

let runButton = document.querySelector(".editor-run");
let resetButton = document.querySelector(".editor-reset");
let instructions = document.querySelector(".editor-instructions");

let codeEditor = ace.edit("editorCode");
let cnsl = document.getElementById("console");

let jsFile = ace.createEditSession(baseJsCode.split("\n"));
let htmlFile = ace.createEditSession(baseHTMLCode.split("\n"));
let cssFile = ace.createEditSession(baseCSSCode.split("\n"));

codeEditor.setSession(htmlFile);

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/html`);

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

function log([message], color, image=null) {
    if (image) {
        let img = document.createElement("img");
        img.src = image;
        img.classList.add("console-image");
        cnsl.appendChild(img);
    }
    let spn = document.createElement("span");
    spn.innerText = `${message}\n`;
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
run the code
*/

function runJS(iframe, code) {
    cnsl.innerHTML = "";
    let output = {};
    output.log = function(...message) {
        log(message, "#fff");
    };
    output.error = function(...message) {
        log(message, "red", "static/assets/images/error.svg");
    };
    output.warn = function(...message) {
        log(message, "yellow", "static/assets/images/warning.svg");
    };

    window.onmessage = function(e) {
        if (e.data.type == "log") {
            output.log(e.data.message);
        } else if (e.data.type == "error") {
            output.error(e.data.message);
        } else if (e.data.type == "warn") {
            output.warn(e.data.message);
        }
    };

    // handle errors:
    let doc = iframe.contentWindow.document;
    let scriptObj = doc.createElement("script");
    scriptObj.type = "text/javascript";
    scriptObj.innerHTML = `
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error(msg, url, lineNo, columnNo, error);
    }`;
    doc.body.appendChild(scriptObj);

    let tempcode = `console.log = function(...message) {
        window.parent.postMessage({type: "log", message: message}, "*");
    };
    console.error = function(...message) {
        window.parent.postMessage({type: "error", message: message}, "*");
    };
    console.warn = function(...message) {
        window.parent.postMessage({type: "warn", message: message}, "*");
    };
    try {
        ${code.replace("</script>", "<\\/script>")}\n
    } catch (e) {
        console.error(e.message);
    }`;
    scriptObj = doc.createElement("script");
    scriptObj.type = "text/javascript";
    scriptObj.innerHTML = tempcode;
    return scriptObj.outerHTML;
}

function runCSS(iframe, code) {
    let doc = iframe.contentWindow.document;
    let styleObj = doc.createElement("style");
    styleObj.type = "text/css";
    styleObj.innerHTML = code;
    return styleObj.outerHTML;
}

async function run() {
    let existing = document.getElementsByTagName("iframe");
    for (var i = 0; i < existing.length; i++) {
        existing[i].remove()
    }
    let iframe = document.createElement("iframe"); // create the iframe for sandboxing
    document.body.appendChild(iframe);
    iframe.id = "codeIframe"
    iframe.classList.add("code-iframe")
    let code = "";
    code += await htmlFile.getValue()
    code += await runJS(iframe, jsFile.getValue());
    code += runCSS(iframe, cssFile.getValue());
    iframe.srcdoc = code;
}


run()