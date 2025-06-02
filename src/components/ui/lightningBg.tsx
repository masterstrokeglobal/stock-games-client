"use client";
import React, { useEffect, useRef } from 'react';
import styles from '../../app/LightningBackground.module.css';

interface LightningBackgroundProps {
  children: React.ReactNode;
}

const LightningBackground: React.FC<LightningBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lightningRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw a single lightning bolt
    const drawLightningBolt = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(200, 220, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      let x = Math.random() * canvas.width * 0.6 + canvas.width * 0.2; // Start in middle 60% of canvas
      let y = 0;
      ctx.moveTo(x, y);

      // Draw jagged path
      while (y < canvas.height * 0.85) { // Extended to 85% of canvas height
        y += Math.random() * 40 + 30; // Increased step size for longer segments
        x += Math.random() * 50 - 25; // Wider horizontal variation
        ctx.lineTo(x, y);
      }

      // Add multiple secondary branches
      const branchCount = Math.floor(Math.random() * 3) + 2; // 2-4 branches
      for (let i = 0; i < branchCount; i++) {
        const branchStartY = y * (0.4 + i * 0.2); // Start branches at different points
        ctx.moveTo(x * 0.9, branchStartY);
        let branchX = x * 0.9;
        let branchY = branchStartY;
        while (branchY < y * 1.1 && branchY < canvas.height * 0.85) { // Branches extend further
          branchY += Math.random() * 30 + 15;
          branchX += Math.random() * 40 - 20;
          ctx.lineTo(branchX, branchY);
        }
      }

      ctx.stroke();
      ctx.closePath();

      // Clear canvas after 200ms to match flash duration
      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 200);
    };

    // Trigger lightning effect
    const triggerLightning = () => {
      const lightning = lightningRef.current;
      if (!lightning) return;

      lightning.classList.add(styles.lightningFlash);
      drawLightningBolt();

      setTimeout(() => {
        lightning.classList.remove(styles.lightningFlash);
      }, 200);

      // Increased interval to 2-6 seconds for less frequent strikes
      const randomInterval = Math.random() * 4000 + 2000;
      setTimeout(triggerLightning, randomInterval);
    };

    triggerLightning();

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.cloudLayer}></div>
      <div className={styles.lightning} ref={lightningRef}></div>
      <canvas className={styles.lightningCanvas} ref={canvasRef}></canvas>
      <div className='w-full h-full bg-background-secondary z-40'>{children}</div>
    </div>
  );
};

export default LightningBackground;