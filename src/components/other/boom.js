export default function clickBoomEffect() {
    const randomKey = 'EZp9H8oTHv';
    if (document.body.classList.contains(randomKey)) return;
    document.body.classList.add(randomKey);
    let boom = false;
    let balls = [];
    let longPressed = false;
    let longPress;
    let multiplier = 0;
    let width, height;
    let origin;
    let normal;
    let ctx;
    const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
    const canvas = document.createElement("canvas");
    init();
    function init() {
        document.body.appendChild(canvas);
        canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");

    }

    if (canvas.getContext && window.addEventListener) {
        addEventListener();
    } else {
        console.warn("canvas or addEventListener is unsupported!");
    }

    function randomBoom(){
        if (!boom) {
            boom = true;
            window.addEventListener("mousedown", function(e) {
                pushBalls(randBetween(6, 9), e.clientX, e.clientY);
                longPress = setTimeout(function(){
                    longPressed = true;
                }, 500);
                boom = false;
            }, {once:true});
            window.addEventListener("mouseup", function(e) {
                clearInterval(longPress);
                if (longPressed === true) {
                    pushBalls(randBetween(6, 9 + Math.ceil(multiplier)), e.clientX, e.clientY);
                    longPressed = false;
                }
                boom = false;
            }, {once:true});
        }
        setTimeout(randomBoom, 5*1000 + 15*1000 * Math.random());
    }

    function alwaysBoom() {
        window.addEventListener("mousedown", function(e) {
            pushBalls(randBetween(6, 9), e.clientX, e.clientY);
            longPress = setTimeout(function(){
                longPressed = true;
            }, 500);
        }, false);
        window.addEventListener("mouseup", function(e) {
            clearInterval(longPress);
            if (longPressed === true) {
                pushBalls(randBetween(6, 9 + Math.ceil(multiplier)), e.clientX, e.clientY);
                longPressed = false;
            }
        }, false);
    }

    function addEventListener() {
        ctx = canvas.getContext("2d");
        updateSize();
        loop();
        alwaysBoom();
        window.addEventListener('resize', updateSize, false);
    }



    function updateSize() {
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(2, 2);
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        origin = {
            x: width / 2,
            y: height / 2
        };
        normal = {
            x: width / 2,
            y: height / 2
        };
    }
    class Ball {
        constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed) {
                this.multiplier = randBetween(5, 9 + (multiplier / 2));
            } else {
                this.multiplier = randBetween(5, 9);
            }
            this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
            this.r = randBetween(8, 12) + 3 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
        }
        update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / window.innerWidth * Math.sin(this.angle);
            normal.y = -2 / window.innerHeight * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }

    function pushBalls(count = 1, x = origin.x, y = origin.y) {
        for (let i = 0; i < count; i++) {
            balls.push(new Ball(x, y));
        }
    }

    function randBetween(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    function loop() {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.r < 0) continue;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
        }
        if (longPressed) {
            multiplier += 0.2;
        } else if (multiplier >= 0) {
            multiplier -= 0.4;
        }
        removeBall();
        requestAnimationFrame(loop);
    }

    function removeBall() {
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
                balls.splice(i, 1);
            }
        }
    }
}