const createGridButton = document.getElementById("create_grid");
const savePictureButton = document.getElementById("save_button");
const loadPictureButton = document.getElementById("load_button");
var pickedColor = "#000000";
var gridVisibility = 1;
var grid = document.getElementById("_grid");
var grid_wrap = document.getElementById("grid_wrap");
var cells = document.getElementsByClassName("cell");
var colors = document.getElementsByClassName("color_block");
var any_color = document.getElementById("any_color_picker");
var picker_wrap = document.getElementById("picker_wrap");
var brush = document.getElementById("brush_icon");
var filling = document.getElementById("filling_icon");
var pipette = document.getElementById("pipette_icon");
var gridSwitch = document.getElementById("switch_grid_vis");

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
  cell.setAttribute("class", "cell gridVis");
  cell.style.width = `${size}px`;
  cell.style.height = `${size}px`;
  cell.style.backgroundColor = "rgb(255, 255, 255)";
  return cell;
}

function gridCreate(height, width, size) {
  height = document.getElementById("grid_height").value;
  height = height ? Number(height) : 96;
  width = document.getElementById("grid_width").value;
  width = width ? Number(width) : 96;
  size = document.getElementById("cell_size").value;
  size = size ? Number(size) : 12;
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
  grid_wrap.removeChild(grid_wrap.lastChild);
  grid_wrap.style.width = `${width * size}px`;
  grid_wrap.style.height = `${height * size}px`;
  grid.style.width = `${width * size}px`;
  grid.style.height = `${height * size}px`;
  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.className = "level";
    level.style.width = grid.style.width;
    level.style.height = `${size}px`;
    level.style.lineHeight = `${0}`;
    for (let j = 0; j < width; j++) {
      level.appendChild(cellCreate(size));
    }
    grid.appendChild(level);
  }
  grid_wrap.appendChild(grid);
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

function switchGridVis() {
  if (gridVisibility) {
    gridVisibility = 0;
    for (let cell of cells) {
      cell.classList.remove("gridVis");
    }
  } else {
    gridVisibility = 1;
    for (let cell of cells) {
      cell.setAttribute("class", "cell gridVis");
    }
  }
}

function savePicture() {
  let pictureName = "Test Picture";
  localStorage.setItem(pictureName, grid.outerHTML);
}

function loadPicture() {
  let pictureName = "Test Picture";
  grid_wrap.removeChild(grid_wrap.lastChild);
  let grid_wrapOnLoad = document.createElement("div");
  grid_wrapOnLoad.innerHTML = localStorage.getItem(pictureName);
  let gridOnLoad = grid_wrapOnLoad.firstChild;
  grid_wrap.style.width = gridOnLoad.style.width;
  grid_wrap.style.height = gridOnLoad.style.height;
  grid.style.width = gridOnLoad.style.width;
  grid.style.height = gridOnLoad.style.height;
  let currentTool = grid.className;
  grid = gridOnLoad;
  grid_wrap.appendChild(grid);
  toolHandler(currentTool);
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
  createGridButton.addEventListener("click", gridCreate);
  savePictureButton.addEventListener("click", savePicture);
  loadPictureButton.addEventListener("click", loadPicture);
  localStorage.clear();
  for (let color of colors) {
    color.addEventListener("mousedown", getColor);
  }
  any_color.addEventListener("input", (event) => {
    pickedColor = event.target.value;
  });
  filling.addEventListener("mousedown", switchOnFilling);
  brush.addEventListener("mousedown", switchOnBrush);
  pipette.addEventListener("mousedown", switchOnPipette);
  gridSwitch.addEventListener("mousedown", switchGridVis);
  switchOnBrush();
  gridCreate();
})();
