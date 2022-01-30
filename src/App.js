import './App.css';
import { useState, useEffect } from 'react';

import yellowCandy from './assets/yellowcandy.png'
import blueCandy from './assets/bluecandy.png'
import redCandy from './assets/redcandy.png'
import orangeCandy from './assets/orangecandy.png'
import greenCandy from './assets/greencandy.png'
import purpleCandy from './assets/purplecandy.png'
import blankImg from './assets/blank.png'

import ScoreBoard from './components/ScoreBoard';

const width = 8;
const candyColors = [
  redCandy, greenCandy, orangeCandy, blueCandy, yellowCandy, purpleCandy
];


const App = () => {

  const [currentCandyArr, setCurrentCandyArr] = useState([]);
  const [draggedSquare, setDraggedSquare] = useState(null);
  const [replacedSquare, setReplacedSquare] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  //match of three colors
  const checkColumnOfThree = () => {
    for (let i = 0; i <= 47; i++){
      const column = [i, i+width, i+(width*2)]
      const firstColor = currentCandyArr[i];
      const isBlank = currentCandyArr[i] === blankImg;

      if(column.every(cell => currentCandyArr[cell] === firstColor && !isBlank)){
        setTotalScore((score) => score + 3);
        column.forEach(cell => currentCandyArr[cell] = blankImg);
        return true;
      }
    }
  }

  const checkColumnOfFour = () => {
    for (let i = 0; i <= 39; i++){
      const column = [i, i+width, i+(width*2), i+(width*3)]
      const firstColor = currentCandyArr[i];
      const isBlank = currentCandyArr[i] === blankImg;

      if(column.every(cell => currentCandyArr[cell] === firstColor && !isBlank)){
        setTotalScore((score) => score + 4);
        column.forEach(cell => currentCandyArr[cell] = blankImg);
        return true;
      }
    }
  }

  const checkRowOfThree = () => {
    for (let i = 0; i < 64; i++){
      const row = [i, i+1, i+2];
      const firstColor = currentCandyArr[i];
      const isBlank = currentCandyArr[i] === blankImg;

      //invalid cells
      const invalidCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

      if (invalidCells.includes(i)) continue;

      if(row.every(cell => currentCandyArr[cell] === firstColor && !isBlank)){
        setTotalScore((score) => score + 3);
        row.forEach(cell => currentCandyArr[cell] = blankImg);
        return true;
      }
    }
  }

  const checkRowOfFour = () => {
    for (let i = 0; i < 64; i++){
      const row = [i, i+1, i+2, i+3];
      const firstColor = currentCandyArr[i];
      const isBlank = currentCandyArr[i] === blankImg;

      //invalid cells
      const invalidCells = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];

      if (invalidCells.includes(i)) continue;

      if(row.every(cell => currentCandyArr[cell] === firstColor && !isBlank)){
        setTotalScore((score) => score + 4);
        row.forEach(cell => currentCandyArr[cell] = blankImg);
        return true;
      }
    }
  }

  const moveToCellBelow = () => {

    for (let i=0; i <= 55; i++){

      const firstRowElements = [0,1,2,3,4,5,6,7];
      const isFirstRow = firstRowElements.includes(i);
  
      if (isFirstRow && currentCandyArr[i] === blankImg){
        let randomCandy = Math.floor(Math.random() * candyColors.length);
        currentCandyArr[i] = candyColors[randomCandy];
      }

      if ((currentCandyArr[i + width]) === blankImg){
        currentCandyArr[i + width] = currentCandyArr[i];
        currentCandyArr[i] = blankImg;
      }
    }
  }

  const dragStart = (e) => {
    setDraggedSquare(e.target);
  }

  const dragDrop = (e) => {
    setReplacedSquare(e.target);
  }

  const dragEnd = () => {
    const draggedSquareId = parseInt(draggedSquare.getAttribute('data-id'));
    const replacedSquareId = parseInt(replacedSquare.getAttribute('data-id'));

    currentCandyArr[replacedSquareId] = draggedSquare.getAttribute('src');
    currentCandyArr[draggedSquareId] = replacedSquare.getAttribute('src');

    const validMoves = [draggedSquareId - width, draggedSquareId + width, draggedSquareId + 1, draggedSquareId - 1];

    const validMove = validMoves.includes(replacedSquareId)

    const isColumnOfFour = checkColumnOfFour();
    const isRowOfFour = checkRowOfFour();
    const isColumnOfThree = checkColumnOfThree();
    const isRowOfThree = checkRowOfThree();

    if (replacedSquareId && validMove && (isRowOfThree || isRowOfFour || isColumnOfFour || isColumnOfThree)) {
        setDraggedSquare(null);
        setReplacedSquare(null);
    } else {
        currentCandyArr[replacedSquareId] = replacedSquare.getAttribute('src');
        currentCandyArr[draggedSquareId] = draggedSquare.getAttribute('src');
        setCurrentCandyArr([...currentCandyArr]);
    }
}

  const createGrid = () => {
    const randomCandyArr = []
    for (let i = 0; i < width*width; i++){
      const randomCandy = candyColors[Math.floor(Math.random()* candyColors.length)];
      randomCandyArr.push(randomCandy);
    }
    setCurrentCandyArr(randomCandyArr);
  }

  useEffect(() => {
    createGrid()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkColumnOfFour()
      checkRowOfFour()
      checkColumnOfThree()
      checkRowOfThree()
      moveToCellBelow()
      setCurrentCandyArr([...currentCandyArr])
    }, 100)
    return () => clearInterval(timer)

  }, [checkColumnOfFour, 
      checkRowOfFour, 
      checkColumnOfThree, 
      checkRowOfThree, 
      currentCandyArr,
      moveToCellBelow
    ])

  return (
    <div class="app">
      <div class="game">
        {currentCandyArr.map((candyColor, index)=> (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            draggable={true}
            data-id={index}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={(dragDrop)}
            onDragEnd={(dragEnd)}
          />
        ))}
      </div>
      <ScoreBoard score={totalScore}/>
    </div>
  )

}

export default App;
