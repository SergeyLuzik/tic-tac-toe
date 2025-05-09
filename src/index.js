const gameField = document.querySelector(".game__field");
const gameResult = document.querySelector(".game__result");
const gameName = document.querySelector(".game__name");
const restartButton = document.querySelector(".game__restart");

// Битовые маски соответствующие выигрышным комбинациям
const WIN_MASKS = [
  0b000000111, // верхняя строка
  0b000111000, // средняя строка
  0b111000000, // нижняя строка
  0b001001001, // левая колонка
  0b010010010, // средняя колонка
  0b100100100, // правая колонка
  0b100010001, // диагональ \
  0b001010100, // диагональ /
];

// Функция возвращает новый объект состояния игры, чтобы избежать копирования по ссылке
const getInitialState = () => ({
  currentSide: "x",
  endGame: false,
  x: { cells: [], mask: 0 },
  o: { cells: [], mask: 0 },
});

let state = getInitialState();

const init = () => {
  //  добавить всем детям класс field__cell--x
  for (const cell of gameField.children) {
    cell.classList.add("field__cell--x");
  }
};

const restart = () => {
  state = getInitialState();

  for (const cell of gameField.children) {
    cell.className = "field__cell";
  }
  gameResult.textContent = "Result";
  gameName.textContent = "Tic Tac Toe";
  gameName.classList.remove("hide");
  restartButton.classList.add("hide");

  // задержка для того чтобы успела отработать анимация отжатия полей
  setTimeout(() => {
    init();
  }, 500);
};

const checkWin = (currentSideMask) =>
  WIN_MASKS.some((winMask) => (winMask & currentSideMask) === winMask);

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
};

const endGame = () => {
  state.endGame = true;
  // подменить текст на кнопку restart
  gameName.classList.add("hide");
  restartButton.classList.remove("hide");
};

const handleFieldClick = (event) => {
  // click на поле
  //  если это не само поле, то ячейка
  if (event.target !== event.currentTarget) {
    const cell = event.target;
    //  если ячейка не выбрана и игра не окончена, то
    if (!cell.classList.contains("field__cell--selected") && !state.endGame) {
      //  добавить к ячейке модификатор selected
      cell.classList.add("field__cell--selected");
      const cellIndex = cell.dataset.id - 1;
      let currentSideState = state[state.currentSide];
      // добавить id в соответствующий массив
      // записать длину массива после добавления
      const newCurrentSideCellsLength = currentSideState.cells.push(cellIndex);
      // добавить маску
      currentSideState.mask |= 1 << cellIndex;

      // если длинна массива >= 3, то
      if (newCurrentSideCellsLength >= 3) {
        // проверить на победу
        // если победа, то
        if (checkWin(currentSideState.mask)) {
          // вывести в статус победителя
          gameResult.textContent = `${state.currentSide.toUpperCase()} Win!!!`;
          endGame();
        } else {
          // проверить что есть свободные клетки
          if ((state.x.mask | state.o.mask) !== 0b111111111) {
            changeSide();
          } else {
            // вывести в статус ничью
            gameResult.textContent = "Draw!!!";
            endGame();
          }
        }
      } else {
        changeSide();
      }
    }
  }
};

init();
gameField.onclick = handleFieldClick;
restartButton.onclick = restart;
