const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const RESOLUTION = 1;
let w = canvas.width = canvas.offsetWidth * RESOLUTION;
let h = canvas.height = canvas.offsetHeight * RESOLUTION;
const PARTICLE_COUNT = 400;
const CONNECT_DISTANCE = w * 0.06;
const FORCE_DISTANCE = w * 0.05; // Радиус влияния мышки
const r = (n = 1) => Math.random() * n;
const PI = Math.PI;
const TAU = PI * 2;
let time = new Date;
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const angle = (cx, cy, ex, ey) => Math.atan2(ey - cy, ex - cx);

const mouseX = w / 2;
const mouseY = h / 2;

const createParticle = () => {
    let x, y;
    do {
        x = r(w);
        y = r(h - h/10) + h/10;
    } while (distance(x, y, mouseX, mouseY) < FORCE_DISTANCE * 3.5); // Генерируем, пока частица не окажется за зоной мыши

    return {
        x, y,
        angle: r(TAU),
        speed: r(0.0025), // Уменьшенная скорость
        normalSpeed: r(0.0025),
        oscAmplitudeX: r(1),
        oscSpeedX: 0.00025 + r(0.002),
        oscAmplitudeY: r(1),
        oscSpeedY: 0.00025 + r(0.002),
        connectDistance: r(CONNECT_DISTANCE),
    };
};

const particles = new Array(PARTICLE_COUNT).fill({}).map(createParticle);

const update = () => {
    particles.forEach(p1 => {
        p1.x += (Math.cos(p1.angle) + Math.cos(time * p1.oscSpeedX) * p1.oscAmplitudeX) * p1.speed;
        p1.y += (Math.sin(p1.angle) + Math.cos(time * p1.oscSpeedY) * p1.oscAmplitudeY) * p1.speed;
        p1.speed = lerp(p1.speed, p1.normalSpeed * RESOLUTION, 0.1);

        if (p1.x > w) {
          p1.x = w - 0.1; // Плавно отталкиваем от правого края
          p1.angle = PI - p1.angle; // Отражаем угол
      } else if (p1.x < 0) {
          p1.x = 0.1; // Плавно отталкиваем от левого края
          p1.angle = PI - p1.angle; // Отражаем угол
      }
      
      if (p1.y > h) {
          p1.y = h - 0.1; // Плавно отталкиваем от нижнего края
          p1.angle = -p1.angle; // Отражаем угол
      } else if (p1.y < 0) {
          p1.y = 0.1; // Плавно отталкиваем от верхнего края
          p1.angle = -p1.angle; // Отражаем угол
      }

        if (r() < 0.005) p1.oscAmplitudeX = r(2);
        if (r() < 0.005) p1.oscSpeedX = 0.00025 + r(0.002);
        if (r() < 0.005) p1.oscAmplitudeY = r(2);
        if (r() < 0.005) p1.oscSpeedY = 0.00025 + r(0.002);

        p1.x = Math.max(-0.01, Math.min(p1.x, w + 0.01));
        p1.y = Math.max(-0.01, Math.min(p1.y, h + 0.01));
    });
};

const render = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#171717"; // Чёрный фон
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p1 => {
        particles
            .filter(p2 => p1 !== p2 && distance(p1.x, p1.y, p2.x, p2.y) <= p1.connectDistance)
            .map(p2 => {
                const dist = distance(p1.x, p1.y, p2.x, p2.y);
                p1.speed = lerp(p1.speed, p1.speed + (0.01 / p1.connectDistance * dist), 0.2);
                return {
                    p1, p2,
                    opacity: Math.floor(100 / p1.connectDistance * (p1.connectDistance - dist)) / 100
                };
            })
            .forEach(line => {
                ctx.beginPath();
                ctx.globalAlpha = line.opacity;
                ctx.moveTo(line.p1.x, line.p1.y);
                ctx.lineTo(line.p2.x, line.p2.y);
                ctx.strokeStyle = "#D9D9D9"; // Белые линии
                ctx.lineWidth = line.opacity * 1.2; // Чуть тоньше
                ctx.stroke();
                ctx.closePath();
            });
    });
};

const loop = () => {
    time = new Date;
    update();
    render();
    window.requestAnimationFrame(loop);
};

loop();

window.addEventListener('mousemove', e => {
    const mouseX = (e.clientX - canvas.getBoundingClientRect().left) * RESOLUTION;
    const mouseY = (e.clientY - canvas.getBoundingClientRect().top) * RESOLUTION;
    particles.forEach(p => {
        const dist = distance(mouseX, mouseY, p.x, p.y);
        if (dist < FORCE_DISTANCE && dist > 0) {
            p.angle = angle(mouseX, mouseY, p.x, p.y);
            const force = (FORCE_DISTANCE - dist) * 0.2;
            p.speed = lerp(p.speed, force, 0.1);
        }
    });
});
