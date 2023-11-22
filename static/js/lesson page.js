let runButton = document.querySelector(".editor-run");
let resetButton = document.querySelector(".editor-reset");

let codeEditor = ace.edit("editorCode");

codeEditor.setTheme(`ace/theme/tomorrow_night`);
codeEditor.session.setMode(`ace/mode/javascript`);