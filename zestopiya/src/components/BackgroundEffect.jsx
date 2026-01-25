import React, { useEffect, useRef } from 'react';

const BackgroundEffect = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height, gridSize;

        // Mobile Optimization: Reduce grid count on small screens to save GPU
        const isMobile = window.innerWidth < 768;

        const config = {
            gridCount: isMobile ? 5 : 10,       // Constraint: 18 squares wide
            speed: 0.0025,        // Speed of the loop
            phaseStrength: 0.05, // How much the ripple delays the outer edges
            lineWidth: 1,        // Thickness of the white lines
            pauseDuration: 0.5   // How "steppy" the animation feels (0.0 = continuous, 0.5 = long pause)
        };

        function ease(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function init() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            gridSize = width / config.gridCount / 2;
        }

        function drawCell(x, y, size, progress) {
            const half = size / 2;

            ctx.beginPath();
            ctx.rect(x - half, y - half, size, size);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Dimmed default lines
            ctx.lineWidth = config.lineWidth;
            ctx.stroke();

            if (progress > 0.01) {
                ctx.beginPath();
                ctx.moveTo(x, y - half);
                ctx.lineTo(x, y + half);
                ctx.moveTo(x - half, y);
                ctx.lineTo(x + half, y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${progress})`; // Dynamic brightness
                ctx.stroke();
            }
        }

        let time = 0;

        function animate() {
            // Clear rect instead of filling with black to support transparency
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Calculate columns dynamically to cover the entire width
            const cols = Math.ceil(width / gridSize) + 4;
            const rows = Math.ceil(height / gridSize) + 4;

            for (let i = -cols / 2; i <= cols / 2; i++) {
                for (let j = -rows / 2; j <= rows / 2; j++) {
                    const x0 = i * gridSize;
                    const y0 = j * gridSize;
                    const dist = Math.sqrt(i * i + j * j);

                    let t = (time - dist * config.phaseStrength) % 1;
                    if (t < 0) t += 1;

                    const easedT = ease(t);
                    const scale = 1 / Math.pow(2, easedT);

                    const x = cx + x0 * scale;
                    const y = cy + y0 * scale;
                    const size = gridSize * scale;

                    if (x > -size && x < width + size && y > -size && y < height + size) {
                        drawCell(x, y, size, easedT);
                    }
                }
            }

            time += config.speed;
            animationFrameId = requestAnimationFrame(animate);
        }

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};

export default BackgroundEffect;
