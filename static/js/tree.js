if (!localStorage.getItem('username') || !localStorage.getItem('token')) {
    window.location.href = "/login";
}

let correctLogin = fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
        user: localStorage.getItem("username"),
        token: localStorage.getItem("token")
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(res => res.json())
.then(res => {
    if (!res[0]) {
        window.location.href = "/login";
    }
});

const levels = [];
const lines = [];
const tree = document.querySelector(".tree");

fetch("/api/getAllLevels")
.then(res => res.json())
.then(res => {
    res.forEach(level => {
        level = level.value
        const level_temp = document.createElement("a");
        level_temp.classList.add("level");
        level_temp.classList.add(level.id);
        
        level_temp.id = level.id;

        const levelName = document.createElement("p");
        levelName.innerText = level.name;

        level_temp.appendChild(levelName);
        levels.push(level_temp);
        tree.appendChild(level_temp);
        if (level.parents) {
            level.parents.forEach(parent => {
                const line = new LeaderLine(
                    document.getElementById(parent),
                    document.getElementById(level.id)
                );
                lines.push(line);
            });
        }
    });

    fetch(`/api/getUnlocked?user=${localStorage.getItem('username')}`)
    .then(res => res.json())
    .then(res => {
        for (let i = 0; i < res.length; i++) {
            const level = document.getElementById(res[i]);
            if (!level) continue
            level_temp.href = "/ide?level=" + level.id;
            level.classList.add("unlocked");
        }
    });

    lines.forEach(line => {
        line.setOptions({
            // get rid of the arrow and change the color
            endPlug: 'behind',
            color: '#ccc',
            size: 8,
            path: "grid",
            startSocket: 'right',
            endSocket: 'left',
        });
    });
});