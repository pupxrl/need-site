(() => {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let width, height;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = 0.5 + Math.random() * 1.5;
      this.alpha = 0;
      this.fadeIn = true;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.2;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 300;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;

      const maxAlpha = 0.6;

      if (this.fadeIn) {
        this.alpha += 0.01;
        if (this.alpha >= maxAlpha) {
          this.alpha = maxAlpha;
          this.fadeIn = false;
        }
      } else {
        if (this.life > this.maxLife) {
          this.alpha -= 0.005;
          if (this.alpha <= 0) {
            this.reset();
          }
        }
      }

      const twinkleAmount = 0.02;
      this.alpha += (Math.random() - 0.5) * twinkleAmount;
      if (this.alpha > maxAlpha) this.alpha = maxAlpha;
      if (this.alpha < 0) this.alpha = 0;

      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;

      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  let particles = [];
  const particleCount = 15;

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    animate();
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", resize);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }

  init();
})();
