let canvas = document.getElementById("maze");

let ctx = canvas.getContext("2d");

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
}

const count = 20;
const xOffset = canvas.width / count;
const yOffset = canvas.height / count;
const dots = []

for (let row = 1; row < count; row++) {
    for (let column = 1; column < count; column++) {
        dots.push([column * xOffset, row * yOffset, 'black'])
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    checkDot(x, y)
}

function render() {
    for (const dot of dots) {
        drawCircle(dot[0], dot[1], 1, dot[2]);
    }
}

let first = null;

function checkDot(x, y) {
    for (const dot of dots) {
        if (dot[0] + 10 < x || dot[0] - 10 > x || dot[1] + 10 < y || dot[1] - 10 > y)
            continue;
        dot[2] = "#33FF33";
        if (first === null) {
            first = dot;
        } else {
            first[2] = "black";
            dot[2] = "black";
            drawLine(first, dot);
            first = null;
        }
    }
    render();
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

canvas.onmousedown = (event) => getMousePosition(canvas, event);

const boxes = []

function init() {
    for (let row = 0; row < count; row++) {
        for (let column = 0; column < count; column++) {
            boxes.push({ row, column, lines: [], neighbours: [] });
        }
    }

    for (const box of boxes) {
        box.lines.push({ first: { x: box.column * xOffset, y: box.row * yOffset }, second: { x: box.column * xOffset, y: (box.row + 1) * yOffset } });
        box.lines.push({ first: { x: box.column * xOffset, y: (box.row + 1) * yOffset }, second: { x: (box.column + 1) * xOffset, y: (box.row + 1) * yOffset } });
        box.lines.push({ first: { x: box.column * xOffset, y: box.row * yOffset }, second: { x: (box.column + 1) * xOffset, y: box.row * yOffset } });
        box.lines.push({ first: { x: (box.column + 1) * xOffset, y: box.row * yOffset }, second: { x: (box.column + 1) * xOffset, y: (box.row + 1) * yOffset } });
    }

    for (const box1 of boxes) {
        for (const box2 of boxes) {
            if (box2.row == box1.row + 1 && box2.column == box1.column) {
                box1.neighbours.push(box2);
            }
            if (box2.row == box1.row - 1 && box2.column == box1.column) {
                box1.neighbours.push(box2);
            }
            if (box2.row == box1.row && box2.column == box1.column + 1) {
                box1.neighbours.push(box2);
            }
            if (box2.row == box1.row && box2.column == box1.column - 1) {
                box1.neighbours.push(box2);
            }
        }
    }

}

function generate() {
    const stack = [Math.floor(Math.random() * boxes.length)]
    const visited = [stack[0]];

    while (stack.length != 0) {
        const current = stack.pop();
        const neighbour = someNeighbour(current, visited);
        if (neighbour !== null) {
            visited.push(neighbour)
            stack.push(current);
            stack.push(neighbour);
            drawLine(current)
        }
    }
}

function fill() {
    for (let i = 1; i < count; i++) {
        drawLine([xOffset * i, 0, "black"], [xOffset * i, yOffset * (yOffset - 1), "black"]);
        drawLine([0, yOffset * i, "black"], [xOffset * count, yOffset * i, "black"]);
    }
}

function someNeighbour(box, visited) {
    for (const neighbour of box.neighbours) {
        if (!visited.includes(neighbour)) {
            return neighbour;
        }
    }
    return null;
}


// init();
// generate();
// fill();
render();