import { drawShapes } from './shapes';
import { startBouncing } from './bouncing';
import { startPaint } from './paint';

// Wire each demo to its canvas + controls

// 1. Shapes — draw once at load
const shapesCanvas = document.getElementById('shapes') as HTMLCanvasElement;
drawShapes(shapesCanvas);

// 2. Bouncing balls — animation loop with toggle/add controls
const bouncingCanvas = document.getElementById('bouncing') as HTMLCanvasElement;
const bouncing = startBouncing(bouncingCanvas);

const toggleBtn = document.getElementById('bouncing-toggle') as HTMLButtonElement;
toggleBtn.addEventListener('click', () => {
  const running = bouncing.toggle();
  toggleBtn.textContent = running ? 'Pause' : 'Resume';
});

const addBtn = document.getElementById('bouncing-add') as HTMLButtonElement;
addBtn.addEventListener('click', bouncing.addBall);

// 3. Paint — interactive drawing
const paintCanvas = document.getElementById('paint') as HTMLCanvasElement;
const colorInput = document.getElementById('paint-color') as HTMLInputElement;
const sizeInput = document.getElementById('paint-size') as HTMLInputElement;

// Controls is a shared mutable object — paint reads it on every stroke
const controls = { color: colorInput.value, size: Number(sizeInput.value) };
const paint = startPaint(paintCanvas, controls);

colorInput.addEventListener('change', () => (controls.color = colorInput.value));
sizeInput.addEventListener('input', () => (controls.size = Number(sizeInput.value)));

const clearBtn = document.getElementById('paint-clear') as HTMLButtonElement;
clearBtn.addEventListener('click', paint.clear);
