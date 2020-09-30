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

function cellsActivate() {
  var cells = document.getElementsByClassName("cell");
  console.log(cells);
  for (const cell of cells) {
    cell.addEventListener("click", function () {
      cell.setAttribute("class", "cell black");
    });
  }
}

function gridDraw() {
  let grid = document.getElementById("_grid");

  height = document.getElementById("grid_height").value;
  height = height ? height : "16";
  size = document.getElementById("cell_size").value;
  size = size ? size : "24";

  if (
    !height.match(/^[0-9]{1,2}$/)
    // !size.match(/^([8,9]{1})|([1,2]{1}[0-9]{1})|([3]{1}[0,1,2]{1})$/)
  ) {
    window.alert("Please enter according to the required form");
    return;
  }

  while (grid.lastElementChild) {
    grid.removeChild(grid.lastElementChild);
  }

  height = Number(height);
  size = Number(size);

  grid.setAttribute("style", ` width: ${2 * height * (size + 1)}px;`);

  for (let i = 0; i < height; i++) {
    let level = document.createElement("div");
    level.setAttribute("class", " level");
    level.setAttribute("style", `height: ${size + 1}px`);

    for (let j = 0; j < 2 * height; j++) {
      level.append(cellDraw(size));
    }
    grid.append(level);
  }

  cellsActivate();
}

const drawCellButton = document.querySelector("button");
drawCellButton.addEventListener("click", gridDraw);

gridDraw();
