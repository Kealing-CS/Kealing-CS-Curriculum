let runButton = document.querySelector(".editor-run");
let resetButton = document.querySelector(".editor-reset");

let codeEditor = ace.edit("editorCode");
let cnsl = document.getElementById("console")

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/javascript`);


async function run() {
    let code = codeEditor.getValue();
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "docs/runCodeIframe.html";
    document.body.appendChild(iframe);
    let output = iframe.contentWindow.console;
    console.log("gtoif")
    output.log = function (message) {
        let spn = document.createElement("span");
        spn.innerText = `${message}\n`;
        spn.style.color = "white";
        cnsl.appendChild(spn);
    }
    output.error = function (message) {
        let spn = document.createElement("span");
        spn.innerText = `${message}\n`;
        spn.style.color = "red";
        cnsl.appendChild(spn);
    }
    output.warn = function (message) {
        let spn = document.createElement("span");
        spn.innerText = `${message}\n`;
        spn.style.color = "yellow";
        cnsl.appendChild(spn);
    }

    iframe.contentWindow.eval(code);

}