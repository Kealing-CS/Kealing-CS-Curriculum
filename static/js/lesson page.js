let runButton = document.querySelector(".editor-run");
let resetButton = document.querySelector(".editor-reset");

let codeEditor = ace.edit("editorCode");
let console = document.getElementById("console")

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/javascript`);


function run() {
    /*
    let output = await fetch("/api/run", {
        method: "POST",
        body: JSON.stringify({
            code: codeEditor.getValue()
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    */
}

