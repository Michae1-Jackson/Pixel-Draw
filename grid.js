var pickedColor = "#000000";
var grid = document.getElementById("_grid");
var cells = document.getElementsByClassName("cell");
var colors = document.getElementsByClassName("color_block");
var any_color = document.getElementById("any_color_picker");
var picked_color_block = document.getElementById("picked_wrap");

function paint() {
  this.style.backgroundColor = pickedColor;
}

function startDrawing() {
  for (let cell of cells) {
    cell.addEventListener("mouseover", paint);
  }
}

function stopDrawing() {
  for (let cell of cells) {
    cell.removeEventListener("mouseover", paint);
  }
}

function cellsActivate() {
  for (let cell of cells) {
    cell.addEventListener("mousedown", paint);
  }
  grid.addEventListener("mouseenter", function () {
    grid.addEventListener("mousedown", startDrawing);
    grid.addEventListener("mouseup", stopDrawing);
    grid.addEventListener("mouseleave", stopDrawing);
  });
}

function cellCreate(size) {
  let cell = document.createElement("div");
  cell.setAttribute("class", "cell");
  cell.style.width = `${size}px`;
  cell.style.height = `${size}px`;
  return cell;
}

function gridDraw() {
  height = document.getElementById("grid_height").value;
  height = height ? Number(height) : 24;
  width = document.getElementById("grid_width").value;
  width = width ? Number(width) : 48;
  size = document.getElementById("cell_size").value;
  size = size ? Number(size) : 20;
  if (
    !(1 <= height && height <= 192) ||
    !(1 <= width && width <= 192) ||
    !(6 <= size && size <= 64)
  ) {
    window.alert("Please enter values according to the required form");
    return;
  }
  while (grid.lastElementChild) {
    grid.removeChild(grid.lastElementChild);
  }
  grid.style.width = `${width * size}px`;
  grid.style.height = `${height * size}px`;
  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.className = "level";
    level.style.width = grid.style.width;
    level.style.height = `${size}px`;
    level.style.lineHeight = `${0}`;
    for (let j = 0; j < width; j++) {
      level.append(cellCreate(size));
    }
    grid.append(level);
  }
  cellsActivate();
}

function rgbToHex(rgb) {
  let hex = rgb.slice(4, -1).split(", ");
  hex = hex.map(Number).map((i) => i.toString(16));
  let rHex = hex[0].length == 1 ? `0${hex[0]}` : hex[0];
  let gHex = hex[1].length == 1 ? `0${hex[1]}` : hex[1];
  let bHex = hex[2].length == 1 ? `0${hex[2]}` : hex[2];
  return `#${rHex}${gHex}${bHex}`;
}

function newColor() {
  pickedColor = this.style.backgroundColor;
  cellsActivate();
  any_color.value = rgbToHex(pickedColor);
}

(function onStart() {
  const drawGridButton = document.querySelector("button");
  drawGridButton.addEventListener("click", gridDraw);
  for (let color of colors) {
    color.addEventListener("mousedown", newColor);
  }
  any_color.addEventListener("input", function (event) {
    pickedColor = event.target.value;
    cellsActivate();
  });
  gridDraw();
})();
