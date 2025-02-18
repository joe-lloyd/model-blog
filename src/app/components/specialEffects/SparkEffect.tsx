import React, { useEffect, useRef } from 'react';

const SparkEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speedX: number;
      speedY: number;
    }[] = [];
    const maxParticles = 150;

    // Create particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        opacity: Math.random(),
        speedX: Math.random() * 2 - 1, // Horizontal drift
        speedY: Math.random() * -3 - 1, // Rising upward
      });
    }

    function drawParticles() {
      particles.forEach((p, i) => {
        if (!ctx || !canvas) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${p.opacity})`;
        ctx.fill();

        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset particle if out of bounds
        if (p.y < 0 || p.x < 0 || p.x > canvas.width) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height,
            size: Math.random() * 3 + 1,
            opacity: Math.random(),
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * -3 - 1,
          };
        }
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawParticles();
      requestAnimationFrame(animate);
    }

    animate();

    // Resize canvas on window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    ></canvas>
  );
};

export default SparkEffect;
