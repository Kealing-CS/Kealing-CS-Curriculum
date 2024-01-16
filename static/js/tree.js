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

const username = getCookie("username");
const token = getCookie("token");

if (!username || !token) {
    window.location.href = "/login";
}

let correctLogin = fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({
        user: username,
        token: token
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
.then(res => res.status)
.then(res => {
    if (res != 200) {
        window.location.href = "/login";
    }
});

const levels = [];
const lines = [];
const tree = document.querySelector(".tree");

fetch("/api/getAllLevels")
.then(res => res.json())
.then(res => {
    let level;
    res.forEach(level => {
        level = level.value
        const level_temp = document.createElement("a");
        level_temp.classList.add("level");
        level_temp.classList.add(level.id);
        
        level_temp.id = level.id;

        level_temp.style.gridColumn = level.position.x;
        level_temp.style.gridRow = level.position.y;

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

    fetch(`/api/getUnlocked?user=${username}`)
    .then(res => res.json())
    .then(res => {
        for (let i = 0; i < res.length; i++) {
            level = document.getElementById(res[i]);
            if (!level) continue
            level.href = "/ide?level=" + level.id;
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