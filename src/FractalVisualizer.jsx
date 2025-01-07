import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const FractalVisualizer = () => {
    const [fractalType, setFractalType] = React.useState('Julia');
    const [maxIterations, setMaxIterations] = React.useState(100);
    const [depth, setDepth] = React.useState(5);
    const canvasRef = useRef(null);
    const p5Instance = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(800, 800);
                canvas.parent(canvasRef.current);
                p.colorMode(p.HSB, 1);
                p.noLoop();
            };

            p.draw = () => {
                p.background(0);
                p.loadPixels();
                
                switch (fractalType) {
                    case 'Mandelbrot':
                        drawMandelbrot(p);
                        break;
                    case 'Julia':
                        drawJulia(p);
                        break;
                    case 'Newton':
                        drawNewton(p);
                        break;
                    case 'Sierpinski':
                        drawSierpinski(p);
                        break;
                    case 'Koch':
                        drawKoch(p);
                        break;
                    case 'Dragon':
                        drawDragon(p);
                        break;
                    case 'Barnsley':
                        drawBarnsleyFern(p);
                        break;
                }
                
                if (['Mandelbrot', 'Julia', 'Newton'].includes(fractalType)) {
                    p.updatePixels();
                }
            };

            const drawMandelbrot = (p) => {
                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        let a = p.map(x, 0, p.width, -2, 0.5);
                        let b = p.map(y, 0, p.height, -1.25, 1.25);
                        const ca = a;
                        const cb = b;
                        let n = 0;

                        while (n < maxIterations) {
                            const aa = a * a - b * b;
                            const bb = 2 * a * b;
                            a = aa + ca;
                            b = bb + cb;
                            if (a * a + b * b > 16) break;
                            n++;
                        }

                        if (n === maxIterations) {
                            p.set(x, y, p.color(0, 0, 0));
                        } else {
                            const hue = (0.5 + n - Math.log2(Math.log2(a * a + b * b))) / maxIterations;
                            p.set(x, y, p.color(hue, 1, n / maxIterations));
                        }
                    }
                }
            };

            const drawJulia = (p) => {
                const cRe = -0.7;
                const cIm = 0.272;

                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        let a = p.map(x, 0, p.width, -1.5, 1.5);
                        let b = p.map(y, 0, p.height, -1.5, 1.5);
                        let n = 0;

                        while (n < maxIterations) {
                            const aa = a * a - b * b;
                            const bb = 2 * a * b;
                            a = aa + cRe;
                            b = bb + cIm;
                            if (a * a + b * b > 16) break;
                            n++;
                        }

                        if (n === maxIterations) {
                            p.set(x, y, p.color(0, 0, 0));
                        } else {
                            const hue = (0.5 + n - Math.log2(Math.log2(a * a + b * b))) / maxIterations;
                            p.set(x, y, p.color(hue, 1, n / maxIterations));
                        }
                    }
                }
            };

            const drawNewton = (p) => {
                for (let x = 0; x < p.width; x++) {
                    for (let y = 0; y < p.height; y++) {
                        let a = p.map(x, 0, p.width, -1.5, 1.5);
                        let b = p.map(y, 0, p.height, -1.5, 1.5);
                        let n = 0;
                        
                        while (n < maxIterations) {
                            // z^3 - 1 = 0
                            let r = a * a + b * b;
                            if (r === 0) break;
                            
                            // z -> z - (z^3 - 1)/(3z^2)
                            let ca = (2 * a * a * a - 2 * a * b * b - a) / (3 * (a * a + b * b));
                            let cb = (2 * a * a * b - 2 * b * b * b - b) / (3 * (a * a + b * b));
                            
                            a = ca;
                            b = cb;
                            
                            if (Math.abs(a * a + b * b - r) < 0.000001) break;
                            n++;
                        }

                        if (n === maxIterations) {
                            p.set(x, y, p.color(0, 0, 0));
                        } else {
                            const angle = Math.atan2(b, a);
                            const hue = (angle + Math.PI) / (2 * Math.PI);
                            p.set(x, y, p.color(hue, 1, n / maxIterations));
                        }
                    }
                }
            };

            const drawSierpinski = (p) => {
                p.noStroke();
                
                const drawTriangle = (x1, y1, x2, y2, x3, y3, depth) => {
                    if (depth === 0) {
                        p.fill(depth / maxIterations, 1, 1);
                        p.triangle(x1, y1, x2, y2, x3, y3);
                        return;
                    }
                    
                    const mx1 = (x1 + x2) / 2;
                    const my1 = (y1 + y2) / 2;
                    const mx2 = (x2 + x3) / 2;
                    const my2 = (y2 + y3) / 2;
                    const mx3 = (x3 + x1) / 2;
                    const my3 = (y3 + y1) / 2;
                    
                    drawTriangle(x1, y1, mx1, my1, mx3, my3, depth - 1);
                    drawTriangle(mx1, my1, x2, y2, mx2, my2, depth - 1);
                    drawTriangle(mx3, my3, mx2, my2, x3, y3, depth - 1);
                };
                
                const size = Math.min(p.width, p.height) * 0.8;
                const centerX = p.width / 2;
                const centerY = p.height / 2;
                
                drawTriangle(
                    centerX, centerY - size/2,
                    centerX + size/2, centerY + size/2,
                    centerX - size/2, centerY + size/2,
                    depth
                );
            };

            const drawKoch = (p) => {
                p.stroke(1);
                p.noFill();
                
                const drawLine = (x1, y1, x2, y2, depth) => {
                    if (depth === 0) {
                        p.line(x1, y1, x2, y2);
                        return;
                    }
                    
                    const dx = (x2 - x1) / 3;
                    const dy = (y2 - y1) / 3;
                    
                    const x3 = x1 + dx;
                    const y3 = y1 + dy;
                    
                    const x4 = x1 + dx * 2;
                    const y4 = y1 + dy * 2;
                    
                    const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    
                    const x = x3 + len * Math.cos(angle);
                    const y = y3 + len * Math.sin(angle);
                    
                    drawLine(x1, y1, x3, y3, depth - 1);
                    drawLine(x3, y3, x, y, depth - 1);
                    drawLine(x, y, x4, y4, depth - 1);
                    drawLine(x4, y4, x2, y2, depth - 1);
                };
                
                const size = Math.min(p.width, p.height) * 0.8;
                const centerX = p.width / 2;
                const centerY = p.height / 2;
                
                // Draw Koch Snowflake
                const x1 = centerX;
                const y1 = centerY - size/2;
                const x2 = centerX + size/2;
                const y2 = centerY + size/2;
                const x3 = centerX - size/2;
                const y3 = centerY + size/2;
                
                drawLine(x1, y1, x2, y2, depth);
                drawLine(x2, y2, x3, y3, depth);
                drawLine(x3, y3, x1, y1, depth);
            };

            const drawDragon = (p) => {
                p.stroke(1);
                let points = [[p.width/4, p.height/2], [3*p.width/4, p.height/2]];
                
                for (let i = 0; i < depth; i++) {
                    const newPoints = [];
                    for (let j = 0; j < points.length - 1; j++) {
                        const [x1, y1] = points[j];
                        const [x2, y2] = points[j + 1];
                        const mx = (x1 + x2) / 2;
                        const my = (y1 + y2) / 2;
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        
                        if (j % 2 === 0) {
                            newPoints.push([x1, y1], [mx + dy/2, my - dx/2]);
                        } else {
                            newPoints.push([x1, y1], [mx - dy/2, my + dx/2]);
                        }
                    }
                    newPoints.push(points[points.length - 1]);
                    points = newPoints;
                }
                
                p.beginShape();
                for (const [x, y] of points) {
                    p.vertex(x, y);
                }
                p.endShape();
            };

            const drawBarnsleyFern = (p) => {
                p.stroke(0.3, 1, 1);
                p.strokeWeight(1);
                
                let x = 0, y = 0;
                
                for (let i = 0; i < maxIterations * 100; i++) {
                    const r = Math.random();
                    let nextX, nextY;
                    
                    if (r < 0.01) {
                        nextX = 0;
                        nextY = 0.16 * y;
                    } else if (r < 0.86) {
                        nextX = 0.85 * x + 0.04 * y;
                        nextY = -0.04 * x + 0.85 * y + 1.6;
                    } else if (r < 0.93) {
                        nextX = 0.2 * x - 0.26 * y;
                        nextY = 0.23 * x + 0.22 * y + 1.6;
                    } else {
                        nextX = -0.15 * x + 0.28 * y;
                        nextY = 0.26 * x + 0.24 * y + 0.44;
                    }
                    
                    x = nextX;
                    y = nextY;
                    
                    const px = p.map(x, -2.5, 2.5, 0, p.width);
                    const py = p.map(y, 0, 10, p.height, 0);
                    
                    p.point(px, py);
                }
            };
        };

        p5Instance.current = new p5(sketch);

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, [fractalType, maxIterations, depth]);

    return (
        <div>
            <div className="controls">
                <select 
                    onChange={(e) => setFractalType(e.target.value)} 
                    value={fractalType}
                    className="fractal-select"
                >
                    <option value="Mandelbrot">Mandelbrot Set</option>
                    <option value="Julia">Julia Set</option>
                    <option value="Newton">Newton Fractal</option>
                    <option value="Sierpinski">Sierpinski Triangle</option>
                    <option value="Koch">Koch Snowflake</option>
                    <option value="Dragon">Dragon Curve</option>
                    <option value="Barnsley">Barnsley Fern</option>
                </select>
                <div className="fractal-slider flex flex-col items-center gap-2">
                    <input
                        type="range"
                        value={maxIterations}
                        onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                        min="1"
                        max="200"
                        className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-300">
                        Iterations: {maxIterations}
                    </span>
                </div>
                <div className="fractal-slider flex flex-col items-center gap-2">
                        <input
                            type="range"
                            value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value))}
                            min="1"
                            max="12"
                            className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        <span className="text-sm text-gray-300">
                            Depth: {depth}
                        </span>
                    </div>
            </div>
            <div ref={canvasRef} id="fractal-container"></div>
        </div>
    );
};

export default FractalVisualizer;