(() => {
  const canvas = document.getElementById("particles");
  if (!canvas) {
    console.error('Canvas element with id "particles" not found.');
    return;
  }
  const ctx = canvas.getContext("2d");

  const settings = {
    particleCount: 10,
    maxSize: 6,
    minSize: 2,
    maxSpeed: 0.5,
    minSpeed: 0.1,
    glow: 10,
    fadeStrength: 0.05,
    colors: ["#7d7d7d", "#adadad", "#c8c8c8"],
    pulseFrequency: 0.005,
  };

  let width = 0;
  let height = 0;
  let particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size =
        Math.random() * (settings.maxSize - settings.minSize) +
        settings.minSize;
      this.speedX = (Math.random() * 2 - 1) * settings.maxSpeed;
      this.speedY = (Math.random() * 2 - 1) * settings.maxSpeed;
      this.color =
        settings.colors[Math.floor(Math.random() * settings.colors.length)];
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      this.speedX += (Math.random() - 0.5) * 0.1;
      this.speedY += (Math.random() - 0.5) * 0.1;

      this.speedX = Math.max(
        -settings.maxSpeed,
        Math.min(settings.maxSpeed, this.speedX)
      );
      this.speedY = Math.max(
        -settings.maxSpeed,
        Math.min(settings.maxSpeed, this.speedY)
      );

      this.phase += settings.pulseFrequency;
    }

    draw() {
      const opacity = 0.6 + 0.4 * Math.sin(this.phase);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.fill();
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    init();
  }

  function init() {
    particles = [];
    for (let i = 0; i < settings.particleCount; i++) {
      particles.push(new Particle());
    }
    ctx.filter = `blur(${settings.glow}px)`;
  }

  function animate() {
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(animate);
})();
