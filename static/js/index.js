const blob = document.getElementById('blob');
const title = document.querySelector('.title');
let interval = null;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
                "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "X", "Y", "Z"];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onmousemove = function(e) {
    const x = e.clientX;
    const y = e.clientY;

    const width = blob.clientWidth / 2;
    const height = blob.clientHeight / 2;

    blob.animate({
        left: `${x - width}px`,
        top: `${y - height}px`
    }, {duration: 5000, fill: 'forwards'});

    blob.style.display = 'block';
}

function randText() {
    let iters = 0
    const maxIters = title.innerText.length

    clearInterval(interval);
    title.innerText = title.dataset.value;

    interval = setInterval(() => {

        title.innerText = title.innerText.split("")
            .map((letter, index) => {
                let rand = letters[Math.floor(Math.random() * 26)];
                
                if (index < iters && Math.floor(Math.random() * 10) !== 0) {
                    return title.dataset.value[index];
                }
                return rand ? rand : letter;
            })
            .join("");

        if(iters >= title.dataset.value.length){ 
            title.innerText = title.dataset.value;
            clearInterval(interval);
        }

        iters++;
    }, 45);

    title.innerText = title.dataset.value;

    setTimeout(randText, rand(2000, 6000));
}

// title.onmouseover = randText

setTimeout(randText, rand(2500, 6000));