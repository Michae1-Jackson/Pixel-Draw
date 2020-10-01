var pickedColor = "black";
var grid = document.getElementById("_grid");
var cells = document.getElementsByClassName("cell");
var colors = document.getElementsByClassName("color_block");

(function () {
  for (const color of colors) {
    color.addEventListener("click", function () {
      pickedColor = color.getAttribute("class").split(" ")[1];
      cellsActivate();
      console.log(pickedColor);
    });
  }
})();

function cellCreate(size) {
  let cell = document.createElement("div");
  cell.setAttribute("class", "cell");
  cell.setAttribute(
    "style",
    ` height: ${size}px;
      width: ${size}px;`
  );
  return cell;
}

function startDrawing() {
  for (let cell of cells) {
    cell.addEventListener("mouseover", changeColor);
  }
}

function stopDrawing() {
  for (let cell of cells) {
    cell.removeEventListener("mouseover", changeColor);
  }
}

function changeColor() {
  this.style.backgroundColor = pickedColor;
}

function cellsActivate() {
  for (let cell of cells) {
    cell.addEventListener("mousedown", changeColor);
  }
  grid.addEventListener("mouseenter", function () {
    grid.addEventListener("mousedown", startDrawing);
    grid.addEventListener("mouseup", stopDrawing);
    grid.addEventListener("mouseleave", stopDrawing);
  });
}

function gridDraw() {
  height = document.getElementById("grid_height").value;
  height = height ? Number(height) : 24;
  width = document.getElementById("grid_width").value;
  width = width ? Number(width) : 48;
  size = document.getElementById("cell_size").value;
  size = size ? Number(size) : 20;

  if (
    !(1 <= height && height <= 96) ||
    !(1 <= width && width <= 192) ||
    !(6 <= size && size <= 54)
  ) {
    window.alert("Please enter values according to the required form");
    return;
  }

  while (grid.lastElementChild) {
    grid.removeChild(grid.lastElementChild);
  }

  grid.setAttribute(
    "style",
    `height: ${height * size}px;
     width: ${width * size}px;`
  );

  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.setAttribute("class", " level");
    level.setAttribute(
      "style",
      ` height: ${size}px;
        width: ${width * size}px;
        line-height: ${0}`
    );

    for (let j = 0; j < width; j++) {
      level.append(cellCreate(size));
    }
    grid.append(level);
  }

  cellsActivate();
}

const drawGridButton = document.querySelector("button");
drawGridButton.addEventListener("click", gridDraw);

gridDraw();
