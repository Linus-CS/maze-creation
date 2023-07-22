let canvas = document.getElementById("maze");

let ctx = canvas.getContext("2d");


const count = 20;
const xOffset = canvas.width / count;
const yOffset = canvas.height / count;
const vertices = [];

const lines = new Set();
const goals = new Set();

function init() {
}

function generate() {
    goals.add(Math.floor(Math.random() * count * count));
    const row = goals.values().next().value % count;
    const col = Math.floor(goals.values().next().value / count);
    ctx.fillStyle = "red";
    ctx.fillRect(row * xOffset, col * yOffset, xOffset, yOffset)
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, xOffset, yOffset)
    while (goals.size < count * count) {
        const [first, path] = createPath();
        travaersePath(first, path);
    }
}

function createPath() {
    const path = new Map();

    let first;
    do first = Math.floor(Math.random() * count * count);
    while (goals.has(first));

    let current = first;
    let i = 0;
    while (!goals.has(current)) {
        let directions = [current - 1, current + 1, current - count, current + count].filter(v => v >= 0 && v < count * count);
        directions = directions.filter(v => (current % count) == (v % count) || Math.floor(current / count) == Math.floor(v / count));
        const next = directions[Math.floor(Math.random() * directions.length)];
        path.set(current, next);
        current = next;
    }
    return [first, path];
}

function travaersePath(first, path) {
    let last, current = first;
    while (!goals.has(current)) {
        const next = path.get(current);
        let borders = [current + 1, current - 1, current + count, current - count].filter(v => ![last, next].includes(v));
        borders = borders.filter(v => v >= 0 && v < count * count);
        borders = borders.filter(v => (current % count) == (v % count) || Math.floor(current / count) == Math.floor(v / count))
        wallBetween(current, next, "white");
        borders.map(n => wallBetween(current, n, "black"));
        goals.add(current);
        last = current;
        current = next;
    }
}

generate();

function wallBetween(box1, box2, color = "black") {
    const row1 = Math.floor(box1 / count);
    const col1 = box1 % count;
    const row2 = Math.floor(box2 / count);
    const col2 = box2 % count;

    const rmBuffer = 5;

    if (col1 + 1 === col2)
        drawLine([col2 * xOffset, row1 * yOffset - rmBuffer], [col2 * xOffset, (row2 + 1) * yOffset + rmBuffer], color);
    if (col1 - 1 === col2)
        drawLine([col1 * xOffset, row1 * yOffset - rmBuffer], [col1 * xOffset, (row2 + 1) * yOffset + rmBuffer], color);
    if (row1 + 1 === row2)
        drawLine([col1 * xOffset - rmBuffer, row2 * yOffset], [(col2 + 1) * xOffset + rmBuffer, row2 * yOffset], color);
    if (row1 - 1 === row2)
        drawLine([col1 * xOffset - rmBuffer, row1 * yOffset], [(col2 + 1) * xOffset + rmBuffer, row1 * yOffset], color);

}


function drawLine(dot1, dot2, color = "black") {
    if (dot1[0] !== dot2[0] && dot1[1] !== dot2[1]) {
        return;
    }
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(dot1[0], dot1[1]);
    ctx.lineTo(dot2[0], dot2[1]);
    ctx.stroke();
}


function fillOutline() {
    drawLine([0, 0], [xOffset * count, 0]);
    drawLine([0, 0], [0, yOffset * count]);
    drawLine([xOffset * count, 0], [xOffset * count, yOffset * count]);
    drawLine([0, yOffset * count], [xOffset * count, yOffset * count]);
}
