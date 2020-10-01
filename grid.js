var pickedColor = "black";

(function () {
  var colors = document.getElementsByClassName("color_block");
  for (const color of colors) {
    color.addEventListener("click", function () {
      pickedColor = color.getAttribute("class").split(" ")[1];
      cellsActivate(pickedColor);
      console.log(pickedColor);
    });
  }
})();

function cellDraw(size) {
  let brick = document.createElement("div");
  brick.setAttribute("class", "cell");
  brick.setAttribute(
    "style",
    ` height: ${size}px;
      width: ${size}px;`
  );
  return brick;
}

function cellsActivate(picked) {
  var cells = document.getElementsByClassName("cell");
  for (const cell of cells) {
    cell.addEventListener("mousedown", function () {
      cellColor = cell.setAttribute("class", `cell ${picked}`);
    });
  }
}

function gridDraw() {
  let grid = document.getElementById("_grid");

  height = document.getElementById("grid_height").value;
  height = height ? Number(height) : 24;
  width = document.getElementById("grid_width").value;
  width = width ? Number(width) : 48;
  size = document.getElementById("cell_size").value;
  size = size ? Number(size) : 16;

  if (1 <= height <= 64 || 1 <= width <= 96 || 12 <= size <= 54) {
    window.alert("Please enter according to the required form");
    return;
  }

  while (grid.lastElementChild) {
    grid.removeChild(grid.lastElementChild);
  }

  grid.setAttribute("style", ` width: ${2 * height * (size + 1)}px;`);

  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.setAttribute("class", " level");
    level.setAttribute(
      "style",
      `height: ${size + 1}px; width: ${width * size + 1}px;`
    );

    for (let j = 0; j < width; j++) {
      level.append(cellDraw(size));
    }
    grid.append(level);
  }

  cellsActivate(pickedColor);
}

const drawGridButton = document.querySelector("button");
drawGridButton.addEventListener("click", gridDraw);

gridDraw();
