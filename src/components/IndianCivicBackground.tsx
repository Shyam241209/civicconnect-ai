import { useEffect, useRef } from "react";

const IndianCivicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Indian Government Colors
  const colors = {
    saffron: "#FF9933",
    white: "#FFFFFF",
    deepBlue: "#004687",
  };

  // Indian city coordinates (relative positions)
  const cities = [
    { name: "Delhi", x: 0.48, y: 0.28 },
    { name: "Mumbai", x: 0.35, y: 0.52 },
    { name: "Kolkata", x: 0.68, y: 0.42 },
    { name: "Chennai", x: 0.52, y: 0.72 },
    { name: "Bangalore", x: 0.45, y: 0.68 },
    { name: "Hyderabad", x: 0.48, y: 0.58 },
    { name: "Ahmedabad", x: 0.32, y: 0.42 },
    { name: "Jaipur", x: 0.40, y: 0.35 },
    { name: "Lucknow", x: 0.55, y: 0.32 },
    { name: "Bhopal", x: 0.45, y: 0.45 },
  ];

  // Parliament position (Delhi area)
  const parliament = { x: 0.48, y: 0.28 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      speed: number;
      opacity: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.3 + Math.random() * 0.7,
          opacity: 0.1 + Math.random() * 0.3,
          size: 1 + Math.random() * 2,
        });
      }
    };

    let chakraRotation = 0;
    let lineProgress = 0;

    const drawIndiaMapOutline = () => {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = colors.deepBlue;
      ctx.lineWidth = 1;
      
      // Simplified India outline
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.beginPath();
      // Kashmir region
      ctx.moveTo(w * 0.35, h * 0.15);
      ctx.lineTo(w * 0.42, h * 0.12);
      ctx.lineTo(w * 0.50, h * 0.14);
      ctx.lineTo(w * 0.55, h * 0.18);
      // Northeast
      ctx.lineTo(w * 0.60, h * 0.22);
      ctx.lineTo(w * 0.72, h * 0.28);
      ctx.lineTo(w * 0.75, h * 0.35);
      ctx.lineTo(w * 0.70, h * 0.42);
      // East coast
      ctx.lineTo(w * 0.65, h * 0.50);
      ctx.lineTo(w * 0.58, h * 0.62);
      ctx.lineTo(w * 0.52, h * 0.72);
      // Southern tip
      ctx.lineTo(w * 0.48, h * 0.82);
      ctx.lineTo(w * 0.45, h * 0.78);
      // West coast
      ctx.lineTo(w * 0.38, h * 0.68);
      ctx.lineTo(w * 0.32, h * 0.55);
      ctx.lineTo(w * 0.28, h * 0.45);
      ctx.lineTo(w * 0.30, h * 0.35);
      ctx.lineTo(w * 0.35, h * 0.25);
      ctx.closePath();
      ctx.stroke();
      
      // State boundaries (simplified)
      ctx.globalAlpha = 0.04;
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.45);
      ctx.lineTo(w * 0.55, h * 0.45);
      ctx.moveTo(w * 0.45, h * 0.35);
      ctx.lineTo(w * 0.45, h * 0.55);
      ctx.moveTo(w * 0.40, h * 0.55);
      ctx.lineTo(w * 0.58, h * 0.55);
      ctx.stroke();
      
      ctx.restore();
    };

    const drawAshokaChakra = (cx: number, cy: number, radius: number, rotation: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = 0.15;
      
      // Outer circle
      ctx.strokeStyle = colors.deepBlue;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner circle
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      
      // 24 spokes
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI * 2) / 24;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius * 0.15, Math.sin(angle) * radius * 0.15);
        ctx.lineTo(Math.cos(angle) * radius * 0.95, Math.sin(angle) * radius * 0.95);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawParliamentSilhouette = (x: number, y: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = colors.deepBlue;
      
      // Simplified Parliament dome silhouette
      ctx.beginPath();
      // Base
      ctx.moveTo(-40, 20);
      ctx.lineTo(-40, 0);
      ctx.lineTo(-35, 0);
      ctx.lineTo(-35, -5);
      // Columns
      ctx.lineTo(-30, -5);
      ctx.lineTo(-30, -15);
      ctx.lineTo(-25, -15);
      ctx.lineTo(-25, -5);
      ctx.lineTo(-15, -5);
      ctx.lineTo(-15, -15);
      ctx.lineTo(-10, -15);
      ctx.lineTo(-10, -5);
      // Central dome
      ctx.lineTo(-8, -5);
      ctx.quadraticCurveTo(0, -35, 8, -5);
      // Right columns
      ctx.lineTo(10, -5);
      ctx.lineTo(10, -15);
      ctx.lineTo(15, -15);
      ctx.lineTo(15, -5);
      ctx.lineTo(25, -5);
      ctx.lineTo(25, -15);
      ctx.lineTo(30, -15);
      ctx.lineTo(30, -5);
      ctx.lineTo(35, -5);
      ctx.lineTo(35, 0);
      ctx.lineTo(40, 0);
      ctx.lineTo(40, 20);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const drawFlowingLines = (progress: number) => {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = colors.saffron;
      ctx.lineWidth = 1;
      
      const parliamentX = canvas.width * parliament.x;
      const parliamentY = canvas.height * parliament.y;
      
      cities.forEach((city, index) => {
        const cityX = canvas.width * city.x;
        const cityY = canvas.height * city.y;
        
        // Calculate animated progress for this line
        const lineStart = (index / cities.length);
        const lineEnd = lineStart + 0.3;
        const currentProgress = ((progress + lineStart) % 1);
        
        if (currentProgress > 0 && currentProgress < lineEnd - lineStart) {
          const segmentProgress = currentProgress / (lineEnd - lineStart);
          
          // Draw animated line segment
          ctx.beginPath();
          const startX = parliamentX + (cityX - parliamentX) * Math.max(0, segmentProgress - 0.3);
          const startY = parliamentY + (cityY - parliamentY) * Math.max(0, segmentProgress - 0.3);
          const endX = parliamentX + (cityX - parliamentX) * segmentProgress;
          const endY = parliamentY + (cityY - parliamentY) * segmentProgress;
          
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        
        // Draw city dot
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = colors.saffron;
        ctx.beginPath();
        ctx.arc(cityX, cityY, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = colors.deepBlue;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Move particle upward
        particle.y -= particle.speed;
        
        // Reset particle when it goes off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });
    };

    const drawTricolorGradient = () => {
      ctx.save();
      ctx.globalAlpha = 0.05;
      
      // Saffron band at top
      const saffronGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.33);
      saffronGradient.addColorStop(0, colors.saffron);
      saffronGradient.addColorStop(1, "transparent");
      ctx.fillStyle = saffronGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.33);
      
      // Green band at bottom
      const greenGradient = ctx.createLinearGradient(0, canvas.height * 0.67, 0, canvas.height);
      greenGradient.addColorStop(0, "transparent");
      greenGradient.addColorStop(1, "#046A38");
      ctx.fillStyle = greenGradient;
      ctx.fillRect(0, canvas.height * 0.67, canvas.width, canvas.height * 0.33);
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tricolor gradient overlay
      drawTricolorGradient();
      
      // Draw India map outline
      drawIndiaMapOutline();
      
      // Draw Ashoka Chakra at center
      const chakraRadius = Math.min(canvas.width, canvas.height) * 0.15;
      drawAshokaChakra(canvas.width * 0.5, canvas.height * 0.5, chakraRadius, chakraRotation);
      chakraRotation += 0.002; // Slow rotation
      
      // Draw Parliament silhouette
      drawParliamentSilhouette(
        canvas.width * parliament.x,
        canvas.height * parliament.y - 30,
        1.5
      );
      
      // Draw flowing connection lines
      drawFlowingLines(lineProgress);
      lineProgress += 0.003;
      if (lineProgress > 1) lineProgress = 0;
      
      // Draw rising particles
      drawParticles();
      
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.25 }}
    />
  );
};

export default IndianCivicBackground;
