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
  height = height ? height : "16";
  width = document.getElementById("grid_width").value;
  width = width ? width : "32";
  size = document.getElementById("cell_size").value;
  size = size ? size : "24";

  if (
    !height.match(/^[0-9]{1,2}$/) ||
    !size.match(/^([1]{1}[2-9]{1})|([2-4]{1}[0-9]{1})|([5]{1}[0-4]{1})$/)
  ) {
    window.alert("Please enter according to the required form");
    return;
  }

  while (grid.lastElementChild) {
    grid.removeChild(grid.lastElementChild);
  }

  height = Number(height);
  width = Number(width);
  size = Number(size);

  grid.setAttribute("style", ` width: ${2 * height * (size + 1)}px;`);

  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.setAttribute("class", " level");
    level.setAttribute("style", `height: ${size + 1}px`);

    for (let j = 0; j < width; j++) {
      level.append(cellDraw(size));
    }
    grid.append(level);
  }

  cellsActivate(pickedColor);
}

const drawCellButton = document.querySelector("button");
drawCellButton.addEventListener("click", gridDraw);

gridDraw();
