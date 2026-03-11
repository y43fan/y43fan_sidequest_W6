// src/ParticleEffect.js
// Particle effects system (VIEW layer).
//
// Responsibilities:
// - Draw simple particle effects for collisions and player actions
// - Create dust/spark particles on demand
// - Update and manage particle lifecycles
//
// Non-goals:
// - Does NOT manage physics or sprites (just visual candy)
// - Does NOT subscribe to events (Game wires triggers)

export class ParticleEffect {
  constructor() {
    this.particles = [];
  }

  /**
   * Emit particles at a position with given properties.
   * @param {number} x - center x
   * @param {number} y - center y
   * @param {string} type - "dust" or "spark"
   * @param {number} count - number of particles to spawn
   */
  emit(x, y, type = "dust", count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1 + Math.random() * 2;
      const particle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // slight upward bias
        life: 1.0, // 0 = dead, 1 = full opacity
        maxLife: 1.0,
        type,
        size: 2 + Math.random() * 2,
      };
      this.particles.push(particle);
    }
  }

  /**
   * Update all particles (called each frame).
   */
  update() {
    this.particles = this.particles.filter((p) => {
      // Gravity
      p.vy += 0.15;

      // Position
      p.x += p.vx;
      p.y += p.vy;

      // Fade
      p.life -= 0.05;

      return p.life > 0;
    });
  }

  /**
   * Draw all particles.
   */
  draw() {
    noStroke();

    for (const p of this.particles) {
      const alpha = (p.life / p.maxLife) * 200; // fade to transparent

      if (p.type === "dust") {
        fill(200, 200, 200, alpha);
      } else if (p.type === "spark") {
        // yellow-orange sparks
        fill(255, 200, 100, alpha);
      }

      ellipse(p.x, p.y, p.size, p.size);
    }
  }
}
