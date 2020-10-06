function animate({ timing, draw, duration }) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
function timing(timeFraction) {
  return Math.pow(timeFraction, 2);
}
function makeEaseOut(timing) {
  return function (timeFraction) {
    return 1 - timing(1 - timeFraction);
  };
}
function makeEaseIn(timing) {
  return function (timeFraction) {
    return timing(timeFraction);
  };
}
const easeOut = makeEaseOut(timing);
const easeIn = makeEaseIn(timing);
const nameInput = document.getElementById("pic_name");
const brushButton = document.getElementById("brush_icon");
const anyColorButton = document.getElementById("any_color_picker");
const createGridButton = document.getElementById("create_grid");
const loadPictureButton = document.getElementById("load_button");
const clearHistoryButton = document.getElementById("clear_history");
const fillingButton = document.getElementById("filling_icon");
const pipetteButton = document.getElementById("pipette_icon");
const gridVisButton = document.getElementById("switch_grid_vis");
var pickedColor = "#000000";
var paintableColor = "#FFFFFF";
var gridVisibility = 1;
var drawing = 0;
var grid = document.getElementById("_grid");
var cells = $(".cell");
var colors = document.getElementsByClassName("color_block");
var grid_wrap = document.getElementById("grid_wrap");

(function onStart() {
  createGridButton.addEventListener("click", gridCreate);
  fillingButton.addEventListener("mousedown", switchOnFilling);
  brushButton.addEventListener("mousedown", switchOnBrush);
  pipetteButton.addEventListener("mousedown", switchOnPipette);
  gridVisButton.addEventListener("mousedown", switchGridVis);
  loadPictureButton.disabled = localStorage.length ? false : true;
  for (let color of colors) {
    color.addEventListener("mousedown", (event) =>
      getColor(event.currentTarget)
    );
  }
  anyColorButton.addEventListener("input", (event) => {
    pickedColor = event.target.value;
  });
  switchOnBrush();
  gridCreate();
})();

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
  grid_wrap.style.display = "block";
  grid.addEventListener("mouseup", stopDrawing);
  grid.addEventListener("mouseleave", stopDrawing);
  cells = $(".cell");
  toolHandler(grid.className);
}

function toolSwitcher() {
  cells.each((i, cell) => {
    cell.removeEventListener("mouseover", changeColor);
    cell.removeEventListener("mousedown", startDrawing);
    cell.removeEventListener("mousedown", absorption);
    cell.removeEventListener("mousedown", startFilling);
  });
}

function changeColor() {
  if (drawing) {
    this.style.backgroundColor = pickedColor;
  }
}

function startDrawing() {
  drawing = 1;
  this.style.backgroundColor = pickedColor;
}

function stopDrawing() {
  drawing = 0;
}

function switchOnBrush() {
  toolSwitcher();
  cells.each((i, cell) => {
    cell.addEventListener("mousedown", startDrawing);
    cell.addEventListener("mouseover", changeColor);
  });
  grid.className = "brush";
}

function getLocation(element) {
  let elementLocation = 0;
  while ((element = element.previousSibling)) elementLocation++;
  return elementLocation;
}

function isFillable(block) {
  let bgCol = block.style.backgroundColor;
  return bgCol != pickedColor && bgCol == paintableColor;
}

function floodFill(block) {
  if (isFillable(block)) {
    let loc, curBlock, curLevel, nextLevel, leftBlock, prevLevel, rightBlock;
    let fillingBlocks = new Array(block);
    while (fillingBlocks.length) {
      curBlock = fillingBlocks.pop();
      curBlock.style.backgroundColor = pickedColor;
      loc = getLocation(curBlock);
      curLevel = curBlock.parentNode;
      rightBlock = curBlock.nextSibling;
      nextLevel = curLevel.nextSibling;
      leftBlock = curBlock.previousSibling;
      prevLevel = curLevel.previousSibling;
      if (
        prevLevel.childNodes.length &&
        isFillable(prevLevel.childNodes[loc])
      ) {
        fillingBlocks.push(prevLevel.childNodes[loc]);
      }
      if (leftBlock && isFillable(leftBlock)) {
        fillingBlocks.push(leftBlock);
      }
      if (nextLevel && isFillable(nextLevel.childNodes[loc])) {
        fillingBlocks.push(nextLevel.childNodes[loc]);
      }
      if (rightBlock && isFillable(rightBlock)) {
        fillingBlocks.push(rightBlock);
      }
    }
  }
}

function startFilling(event) {
  paintableColor = event.currentTarget.style.backgroundColor;
  floodFill(event.currentTarget);
}

function switchOnFilling() {
  toolSwitcher();
  cells.each((i, cell) => {
    cell.addEventListener("mousedown", startFilling);
  });
  grid.className = "filling";
}

function absorption() {
  getColor(this);
  switchOnBrush();
}

function switchOnPipette() {
  toolSwitcher();
  cells.each((i, cell) => {
    cell.addEventListener("mousedown", absorption);
  });
  grid.className = "pipette";
}

function switchGridVis() {
  if (gridVisibility) {
    gridVisibility = 0;
    cells.each((i, cell) => {
      $(cell).css({ "box-shadow": "none" });
    });
  } else {
    gridVisibility = 1;
    cells.each((i, cell) => {
      $(cell).css({ "box-shadow": "0 0 1px 0 black" });
    });
  }
}

function savePicture() {
  let pictureName = "Test Picture";
  localStorage.setItem(pictureName, grid.outerHTML);
  loadPictureButton.disabled = false;
  saved();
  hidePicNameInput();
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
  grid.addEventListener("mouseup", stopDrawing);
  grid.addEventListener("mouseleave", stopDrawing);
  grid_wrap.appendChild(grid);
  cells = $(".cell");
  toolHandler(currentTool);
}

function clearHistory() {
  localStorage.clear();
  loadPictureButton.disabled = true;
}

function rgbToHex(rgb) {
  let hex = rgb.slice(4, -1).split(", ");
  hex = hex.map(Number).map((i) => i.toString(16));
  let rHex = hex[0].length == 1 ? `0${hex[0]}` : hex[0];
  let gHex = hex[1].length == 1 ? `0${hex[1]}` : hex[1];
  let bHex = hex[2].length == 1 ? `0${hex[2]}` : hex[2];
  return `#${rHex}${gHex}${bHex}`;
}

function getColor(element) {
  pickedColor = element.style.backgroundColor;
  anyColorButton.value = rgbToHex(pickedColor);
}

// Animations Section

function saved() {
  animate({
    duration: 600,
    timing: easeOut,
    draw(progress) {
      if (progress <= 0.9) {
        g = 200 + 55 * progress;
        saveWrap.setAttribute("style", `background-color: rgb(0, ${g}, 0);`);
      } else {
        saveWrap.style.backgroundColor = `white`;
      }
    },
  });
}

function hidePicNameInput() {
  animate({
    duration: 300,
    timing: easeIn,
    draw(progress) {
      nameInput.style.zIndex = 2;
      acceptSave.setAttribute("style", `left: ${220 - progress * 50}px`);
      deniSave.setAttribute("style", `right: ${220 - progress * 53}px`);
      savePictureButton.style.opacity = progress;
      savePictureButton.style.display = "block";
      savePictureButton.style.zIndex = 3;
    },
  });
}

function showPicNameInput() {
  animate({
    duration: 300,
    timing: easeOut,
    draw(progress) {
      nameInput.style.zIndex = 3;
      acceptSave.setAttribute("style", `left: ${170 + progress * 50}px;`);
      deniSave.setAttribute("style", `right: ${170 + progress * 53}px;`);
      savePictureButton.style.zIndex = 0;
      savePictureButton.style.opacity = 1 - progress;
      if (progress == 1) {
        savePictureButton.style.display = "none";
      }
    },
  });
}

const saveWrap = document.querySelector(".save_wrap");
const savePictureButton = document.querySelector("#save_button");
const acceptSave = document.querySelector("#accept_save");
const deniSave = document.querySelector("#deni_save");
savePictureButton.addEventListener("click", showPicNameInput);
acceptSave.addEventListener("click", savePicture);
deniSave.addEventListener("click", hidePicNameInput);
loadPictureButton.addEventListener("mousedown", loadPicture);
clearHistoryButton.addEventListener("mousedown", clearHistory);
