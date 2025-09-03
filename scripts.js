const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];

// 文本设置
const textLines = [
    "新年快乐！", "万事顺遂！", "平安喜乐！", "银装素裹千山静",
    "寒梅傲雪映朝曦", "流云飘渺穿星汉", "新岁初临洒瑞气", "松涛阵阵迎春意",
    "翠竹摇曳诉岁华", "元宵悬影耀人间", "盈盈笑语贺丰年"
];

let currentLine = 0;  // 当前显示的文本
let showText = false; // 是否显示文本

// 获取背景音乐元素
const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.play(); // 播放背景音乐

// 绘制文本
function drawText() {
    if (!showText) return;  // 如果没有点击按钮，不绘制文本
    
    ctx.fillStyle = "yellow";
    ctx.font = "50px STXingka, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(textLines[currentLine], canvas.width / 2, canvas.height / 2);
}

// 创建烟花类
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height - 100);
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.radius = 3;
        this.exploded = false;
        this.particles = [];
        this.velY = -Math.random() * 3 - 2;
    }

    update() {
        if (!this.exploded) {
            this.y += this.velY;
            if (this.y < this.targetY) {
                this.explode();
            }
        } else {
            let newParticles = [];
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // Gravity effect
                p.radius *= 0.98; // Shrinking effect

                if (p.radius > 0.1) {
                    newParticles.push(p);
                }
            });
            this.particles = newParticles;
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
        }
    }

    explode() {
        this.exploded = true;
        const numParticles = 100;
        for (let i = 0; i < numParticles; i++) {
            let angle = Math.random() * 2 * Math.PI;
            let speed = Math.random() * 2 + 1;
            let p = {
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: this.color
            };
            this.particles.push(p);
        }
    }
}

// 创建烟花
function createFireworks() {
    for (let i = 0; i < 5; i++) {
        fireworks.push(new Firework());
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制文本
    drawText();

    // 创建烟花并更新它们
    if (Math.random() < 0.02) createFireworks();
    fireworks.forEach(fw => {
        fw.update();
        fw.draw();
    });

    // 继续绘制下一个帧
    requestAnimationFrame(animate);
}

// 设置按钮点击事件
document.getElementById('surpriseButton').addEventListener('click', () => {
    showText = true; // 点击按钮后开始显示文本内容
    document.getElementById('surpriseButton').style.display = 'none'; // 隐藏按钮
});

// ** 修正文本切换问题 **
// 控制文本显示顺序，每个文本显示 2 秒
function displayTextWithInterval() {
    const interval = setInterval(() => {
        if (currentLine < textLines.length - 1) {
            currentLine++; // 显示下一个文本
        } else {
            clearInterval(interval); // 如果已经显示完所有文本，停止切换
        }
    }, 2000);  // 每 2 秒切换一次文本
}

// 启动文本显示逻辑
displayTextWithInterval();

// 鼠标跟随效果
document.addEventListener('mousemove', (e) => {
    let circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.left = `${e.pageX - 15}px`;  // 让光圈跟随鼠标
    circle.style.top = `${e.pageY - 15}px`;
    document.body.appendChild(circle);

    setTimeout(() => circle.remove(), 1000);  // 1秒后移除光圈
});

// 启动动画
animate();
