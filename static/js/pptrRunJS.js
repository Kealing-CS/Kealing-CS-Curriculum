let logs = []
let errors = []
window.onerror = function(msg, url, lineNo, columnNo, error) {
    errors.push({"msg": msg, "lineNo": lineNo, "column": columnNo})
};
console.log = function(...message) {
    logs.push({"type": "log", "message": message})
}
console.warn = function(...message) {
    logs.push({"type": "warn", "message": message})
}
console.error = function(...message) {
    logs.push({"type": "error", "message": message})
}