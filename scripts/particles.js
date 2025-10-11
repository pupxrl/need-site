(() => {
  const canvas = document.getElementById("particles");
  if (!canvas) {
    console.error('Canvas element with id "particles" not found.');
    return;
  }
  const ctx = canvas.getContext("2d");

  const settings = {
    orbitCount: 2,
    electronsPerOrbit: 1,
    baseRadius: 180,
    orbitTilt: [0, 45, 90],
    globalAlphaFade: 0.02,
    cometOpacity: 0.2,
    cometSpeed: 0.015,
    baseLineWidth: 1,
    dotOpacity: 0.1,
    nucleusGlow: 0.4,
    fadeStrength: 0.04,
  };

  let width = 0;
  let height = 0;
  let orbits = [];
  let electrons = [];
  let comets = [];

  class Orbit {
    constructor(radius, tilt) {
      this.radius = radius;
      this.tilt = (tilt * Math.PI) / 180;
    }
    getPosition(angle, cx, cy) {
      const x = cx + Math.cos(angle) * this.radius;
      const y = cy + Math.sin(angle) * this.radius * Math.cos(this.tilt);
      return { x, y };
    }
  }

  class Electron {
    constructor(orbit) {
      this.orbit = orbit;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.01 + Math.random() * 0.005;
    }
    update() {
      this.angle += this.speed;
    }
    draw(ctx, cx, cy) {
      const pos = this.orbit.getPosition(this.angle, cx, cy);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${settings.dotOpacity})`;
      ctx.fill();
    }
  }

  class Comet {
    constructor(orbit) {
      this.orbit = orbit;
      this.angle = Math.random() * Math.PI * 2;
      this.t = 0;
      this.active = Math.random() < 0.5;
    }
    update() {
      if (!this.active && Math.random() < 0.002) this.active = true;
      if (this.active) {
        this.t += settings.cometSpeed;
        if (this.t > 1) {
          this.active = false;
          this.t = 0;
        }
      }
    }
    draw(ctx, cx, cy) {
      if (!this.active) return;
      const startA = this.angle;
      const endA = this.angle + this.t * Math.PI * 0.7;

      const start = this.orbit.getPosition(startA, cx, cy);
      const end = this.orbit.getPosition(endA, cx, cy);

      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0, `rgba(255,255,255,${settings.cometOpacity * 0.1})`);
      grad.addColorStop(1, `rgba(255,255,255,${settings.cometOpacity})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = settings.baseLineWidth;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
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
    orbits = [];
    electrons = [];
    comets = [];

    const base = settings.baseRadius;
    for (let i = 0; i < settings.orbitCount; i++) {
      const o = new Orbit(
        base - i * 40,
        settings.orbitTilt[i % settings.orbitTilt.length]
      );
      orbits.push(o);

      for (let j = 0; j < settings.electronsPerOrbit; j++) {
        electrons.push(new Electron(o));
      }
      comets.push(new Comet(o));
    }
  }

  function animate(t) {
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = `rgba(7, 10, 20, ${settings.globalAlphaFade})`;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(7,10,20,${settings.fadeStrength})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (const o of orbits) {
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.02) {
        const pos = o.getPosition(a, cx, cy);
        if (a === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }
      ctx.stroke();
    }

    for (const e of electrons) {
      e.update();
      e.draw(ctx, cx, cy);
    }

    for (const c of comets) {
      c.update();
      c.draw(ctx, cx, cy);
    }

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    g.addColorStop(0, `rgba(255,255,255,${settings.nucleusGlow})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(animate);
})();
