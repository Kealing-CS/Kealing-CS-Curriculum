let BGVavnha2vyCqDt6tGrjWWHwn = [] // logs
console.log = function(...message) {
    BGVavnha2vyCqDt6tGrjWWHwn.push({"type": "log", "message": message})
};
console.warn = function(...message) {
    BGVavnha2vyCqDt6tGrjWWHwn.push({"type": "warn", "message": message})
};
console.error = function(...message) {
    BGVavnha2vyCqDt6tGrjWWHwn.push({"type": "error", "message": message})
};
