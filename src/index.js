const gameField = document.querySelector(".game__field");
const gameResult = document.querySelector(".game__result");
const gameName = document.querySelector(".game__name");
const restartButton = document.querySelector(".game__restart");

const CELL_COORDINATES = {
  1: [0, 0],
  2: [0, 1],
  3: [0, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [2, 0],
  8: [2, 1],
  9: [2, 2],
};

let state = {
  currentSide: "x",
  x: [],
  o: [],
};

const init = () => {
  //  добавить всем детям класс field__cell--x
  for (const cell of gameField.children) {
    cell.classList.add("field__cell--x");
  }
};

const restart = () => {
  state = {
    ifXturn: true,
    x: [],
    o: [],
  };

  for (const cell of gameField.children) {
    cell.className = "field__cell";
  }

  init();
};

const checkWin = (cells) => {
  if (cells[0][0] === cells[1][0] && cells[1][0] === cells[2][0]) {
    return true;
  } else if (cells[0][1] === cells[1][1] && cells[1][1] === cells[2][1]) {
    return true;
  } else if (
    cells[0][0] === cells[0][1] &&
    cells[1][0] === cells[1][1] &&
    cells[2][0] === cells[2][1]
  ) {
    return true;
  } else if (
    cells[0][0] + cells[0][1] === cells[1][0] + cells[1][1] &&
    cells[1][0] + cells[1][1] === cells[2][0] + cells[2][1]
  ) {
    return true;
  }
};

const changeSide = () => {
  const currentSide = state.currentSide;
  const newSide = currentSide === "x" ? "o" : "x";
  const emptyCells = gameField?.querySelectorAll(
    ":not(.field__cell--selected)"
  );
  for (const cell of emptyCells) {
    cell.classList.remove(`field__cell--${currentSide}`);
    cell.classList.add(`field__cell--${newSide}`);
  }
  state.currentSide = newSide;
  gameResult.textContent = `${state.currentSide.toUpperCase()}'s turn`;
};

const handleFieldClick = (event) => {
  // click на поле
  //  если это не само поле, то ячейка
  if (event.target !== event.currentTarget) {
    const cell = event.target;
    //  если ячейка не выбрана, то
    if (!cell.classList.contains("field__cell--selected")) {
      //  добавить к ячейке модификатор selected
      cell.classList.add("field__cell--selected");
      //   получить координаты ячейки
      const coordinates = CELL_COORDINATES[cell.dataset.id - 1]; //todo переписать на функцию
      // добавить координаты в соответствующий массив
      let currentSideCells = state[state.currentSide];
      // проверить длинну массива после добавления
      const newCurrentSideCellsLength = currentSideCells.push(coordinates);
      // если длинна массива = 3, то
      if (newCurrentSideCellsLength === 3) {
        // проверить на победу
        // если победа, то
        if (checkWin(currentSideCells)) {
          // вывести в статус победителя
          gameResult.textContent = `${state.currentSide.toUpperCase()} Win!!!`;
          // подменить текст на кнопку restart
          gameResult.classList.add("hide");
          restartButton.onclick = restart;
          restartButton.classList.remove("hide");
        } else {
          // если нет победы, то
          // проверить на ничью
          // если ничья, то
          // вывести в статус ничью
          // подменить текст на кнопку restart
          changeSide();
        }
      } else {
        changeSide();
      }
    }
  }
};

init();
gameField.onclick = handleFieldClick;
