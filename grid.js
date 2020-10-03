var pickedColor = "#000000";
var grid = document.getElementById("_grid");
var cells = document.getElementsByClassName("cell");
var colors = document.getElementsByClassName("color_block");
var any_color = document.getElementById("any_color_picker");
var picked_color_block = document.getElementById("picker_wrap");
var brush = document.getElementById("brush");
var filling = document.getElementById("filling");
var pipette = document.getElementById("pipette");

function toolHandler(tool) {
  switch (tool) {
    case "brush":
      switchOnBrush();
      break;
    case "filling":
      switchOnFilling();
      break;
    case "pipette":
      switchOnPipette();
      break;
  }
}

function cellCreate(size) {
  let cell = document.createElement("div");
  cell.setAttribute("class", "cell");
  cell.style.width = `${size}px`;
  cell.style.height = `${size}px`;
  cell.style.backgroundColor = "rgb(255, 255, 255)";
  return cell;
}

function gridCreate() {
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
  toolHandler(grid.className);
}

function toolSwitcher() {
  grid.removeEventListener("mouseenter", startBrushPainting);
  grid.removeEventListener("mousedown", startDrawing);
  for (let cell of cells) {
    cell.removeEventListener("mousedown", getColor);
    cell.removeEventListener("mousedown", startFilling);
    cell.removeEventListener("mousedown", paint);
  }
}

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

function startBrushPainting() {
  grid.addEventListener("mousedown", startDrawing);
  grid.addEventListener("mouseup", stopDrawing);
  grid.addEventListener("mouseleave", stopDrawing);
}

function switchOnBrush() {
  toolSwitcher();
  for (let cell of cells) {
    cell.addEventListener("mousedown", paint);
  }
  grid.addEventListener("mouseenter", startBrushPainting);
  grid.className = "brush";
}

function getNum(el) {
  let n = 0;
  while ((el = el.previousSibling)) n++;
  return n;
}

function nodeFill(block, areaColor) {
  if (block.style.backgroundColor == pickedColor) return;
  if (block.style.backgroundColor != areaColor) return;
  block.style.backgroundColor = pickedColor;
  let lvlPos = getNum(block);
  if (block.parentNode.nextSibling) {
    let lowerBlock = block.parentNode.nextSibling.childNodes[lvlPos];
    if (lowerBlock) nodeFill(lowerBlock, areaColor);
  }
  if (block.parentNode.previousSibling) {
    let upperBlock = block.parentNode.previousSibling.childNodes[lvlPos];
    if (upperBlock) nodeFill(upperBlock, areaColor);
  }
  let leftBlock = block.previousSibling;
  let rightBlock = block.nextSibling;
  if (leftBlock) nodeFill(leftBlock, areaColor);
  if (rightBlock) nodeFill(rightBlock, areaColor);
}

function startFilling(event) {
  areaColor = event.currentTarget.style.backgroundColor;
  nodeFill(event.currentTarget, areaColor);
}

function switchOnFilling() {
  toolSwitcher();
  for (let cell of cells) {
    cell.addEventListener("mousedown", startFilling);
  }
  grid.className = "filling";
}

function switchOnPipette() {
  toolSwitcher();
  for (let cell of cells) {
    cell.addEventListener("mousedown", getColor);
  }
  grid.className = "pipette";
}

function rgbToHex(rgb) {
  let hex = rgb.slice(4, -1).split(", ");
  hex = hex.map(Number).map((i) => i.toString(16));
  let rHex = hex[0].length == 1 ? `0${hex[0]}` : hex[0];
  let gHex = hex[1].length == 1 ? `0${hex[1]}` : hex[1];
  let bHex = hex[2].length == 1 ? `0${hex[2]}` : hex[2];
  return `#${rHex}${gHex}${bHex}`;
}

function getColor() {
  pickedColor = this.style.backgroundColor;
  any_color.value = rgbToHex(pickedColor);
}

(function onStart() {
  const drawGridButton = document.querySelector("button");
  drawGridButton.addEventListener("click", gridCreate);
  for (let color of colors) {
    color.addEventListener("mousedown", getColor);
  }
  any_color.addEventListener("input", (event) => {
    pickedColor = event.target.value;
  });
  filling.addEventListener("mousedown", switchOnFilling);
  brush.addEventListener("mousedown", switchOnBrush);
  pipette.addEventListener("mousedown", switchOnPipette);
  switchOnBrush();
  gridCreate();
})();
