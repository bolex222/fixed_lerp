import "./style.css";
import Stats from "stats.js";
import GUI from "lil-gui";

const white = document.querySelector("#white") as HTMLElement;
const red = document.querySelector("#red") as HTMLElement;
const blue = document.querySelector("#blue") as HTMLElement;
const green = document.querySelector("#green") as HTMLElement;
const lerpProgDom = document.querySelector(".lerp_progress") as HTMLElement;
const screenY = window.innerHeight;
let y = 0;
const translateDom = (dom: HTMLElement, progress: number) => {
  dom.style.transform = `translate3d(0px, ${progress * screenY}px, 0px)`;
};

const t_factor = {
  t: 1,
  r: 0.3,
};

/////////////////////// DEMO //////////////////////

const lerp = (a: number, b: number, factor: number) => (b - a) * factor;

const deltalerp = (a: number, b: number, factor: number, delta: number) =>
  ((b - a) / 0.016) * factor * delta;

const superLerp = (a: number, b: number, r: number, t: number, delta: number) =>
(a - b) * Math.pow(r, delta * t) + b;

let prevA = 0;
let prevB = 0;
let prevC = 0;

const tick = (_: number, delta: number) => {
  const lerpYA = prevA + lerp(prevA, y, 0.05);
  const lerpYB = prevB + deltalerp(prevB, y, 0.05, delta);
  const sy = superLerp(prevC, y, t_factor.r, t_factor.t, delta)

  translateDom(white, y);
  translateDom(red, lerpYA);
  translateDom(blue, lerpYB);
  translateDom(green, sy);

  prevA = lerpYA;
  prevB = lerpYB;
  prevC = sy;
};

////////////////////// SETUP ////////////////////

const gui = new GUI();
const redElem = {
  classic_lerp: false,
} as const;

const blueElem = {
  delta_lerp: false,
} as const;

const greenElem = {
  super_lerp: false,
} as const;

const displayProg = {
  "display lerp progress": false,
};

gui.add(redElem, "classic_lerp").onChange((value: boolean) => {
  red.style.display = value ? "block" : "none";
});

gui.add(blueElem, "delta_lerp").onChange((value: boolean) => {
  blue.style.display = value ? "block" : "none";
});

gui.add(greenElem, "super_lerp").onChange((value: boolean) => {
  green.style.display = value ? "block" : "none";
});


gui.add(t_factor, "r").max(1).min(0).step(0.001)
gui.add(t_factor, "t").max(10).min(1).step(0.1)

gui.add(displayProg, "display lerp progress").onChange((value: boolean) => {
  lerpProgDom.style.display = value ? "block" : "none";
});



const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const handleMouseMove = (e: MouseEvent) => {
  y = e.clientY / screenY;
};

window.addEventListener("mousemove", handleMouseMove);

let elapsedTime = 0;

const globalRaf = (now: number) => {
  const delta = now - elapsedTime;
  stats.begin();
  tick(now, delta / 1000);
  stats.end();
  elapsedTime = now;
  requestAnimationFrame(globalRaf);
};

requestAnimationFrame(globalRaf);
