import './App.css';
import { DefaultButton } from "./styled_components/Button";
import { DefaultCheckbox } from "./styled_components/Checkbox";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { produce } from "immer"

function App() {

  // Global vars
  const gameBoardBlogExample: number[][] = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];


  // Board state
  const [board, setBoard] = useState(() => {
    const gameBoard: number[][] = new Array(9).fill([]);
    gameBoard.forEach((_, i) => gameBoard[i] = Array(9).fill(0));
    return gameBoard;
  }
  );

  // Board class tracker state
  const [trackerBoard, setTrackerBoard] = useState(() => {
    const classTrackerBoard = new Array(9).fill([]);
    classTrackerBoard.forEach((_, i) => classTrackerBoard[i] = Array(9).fill(""));
    return classTrackerBoard;
  });

  // Show steps
  const [showSteps, setShowSteps] = useState(false);

  // Solving state
  const [isSolving, setIsSolving] = useState(false);

  /**
   * The Solver Algorithm using backtracking
   * @param board 
   * @param trackerBoard 
   * @param row 
   * @param col 
   * @returns 
   */
  async function sudokuSolver(sudoku: number[][], tracker: string[][], s: number, c: number) {
    // The box is occupued
    if (c === 9) {
      s++; // New box
      c = 0; // Start with the first cell
      // All sudoku boxes are solved
      if (s === 9) {
        toast(`Sudoku solved`, {
          position: toast.POSITION.TOP_RIGHT,
          className: "toast-message-success",
        });
        setBoard(() => JSON.parse(JSON.stringify(sudoku)));
        setTrackerBoard(() => JSON.parse(JSON.stringify(tracker)));
        return true; // the board is solved
      }
    }

    // Move on to the next cell
    if (sudoku[s][c] !== 0) {
      return sudokuSolver(sudoku, tracker, s, c + 1);
    }

    // Check all possible values for this cell
    for (let num = 1; num <= 9; num++) {
      if (isValid(sudoku, s, c, num)) {

        // Change classname to mark this cell as solved if not already given from the start board
        if (tracker[s][c] !== "given") {
          tracker[s][c] = "solved";
          showSteps ? setTrackerBoard(() => JSON.parse(JSON.stringify(tracker))) : undefined;
        }

        // Place a number in this cell 
        sudoku[s][c] = num;
        showSteps ? setBoard(() => JSON.parse(JSON.stringify(sudoku))) : undefined;

        // Delay if we want to visualize the steps
        if (showSteps) await delay(10);

        // Check if solved by solving the next cell
        if (await sudokuSolver(sudoku, tracker, s, c + 1)) {
          return true;
        }

        // Backtrack on the board state
        sudoku[s][c] = 0;
        showSteps ? setBoard(() => JSON.parse(JSON.stringify(sudoku))) : undefined;

        // Backtrack the tracker classes board
        tracker[s][c] = ""
        showSteps ? setTrackerBoard(() => JSON.parse(JSON.stringify(tracker))) : undefined;
      }
    }

    // If we are here there is no solution for the sudoku problem
    return false;
  }


  /**
   * Validity check for our backtracking Solver Algorithm
   * @param board 
   * @param row 
   * @param col 
   * @param num 
   * @returns 
   */
  function isValid(board: number[][], s: number, c: number, num: number) {

    // Check row and column
    const boxStartRow = Math.floor(s / 3) * 3;
    const cellStartRow = Math.floor(c / 3) * 3;
    const boxStartCol = s % 3;
    const cellStartCol = c % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxStartRow+i][cellStartRow +j] === num ||
          board[boxStartCol+j*3][cellStartCol+j*3] === num) {
          return false;
        }
      }
 
    }

    // Check the sudoku box
    if (board[s].includes(num)) {
      return false;
    }

    // Default return
    return true;
  }




  /**
   * Check if the input value is valid a a given position in the sudoku board
   * @param val 
   * @param i 
   * @param j 
   * @returns 
   */
  function numberInputCheck(val: string, i: number, j: number) {
    let returnFlag = false;
    let inputValue = String(val);
    let boardTmp = [...board];

    console.log(Number(inputValue))

    // Only numbers allowed
    if (!isAlphanumeric(inputValue) && !(Number(inputValue) == 0 && board[i][j] != 0)) {
      toast(`You have to supply a number between 1 and 9`, {
        position: toast.POSITION.TOP_RIGHT,
        className: "toast-message-warning",
      });
      return;
    }

    // If the user wants to remove a value
    if (Number(inputValue) == 0 && board[i][j] != 0) {
      const newBoard = produce(board, draftBoard => {
        draftBoard[i][j] = Number(inputValue);
      })
      setBoard(() => newBoard);
      const newTracker = produce(trackerBoard, draftBoard => {
        draftBoard[i][j] = "";
      })
      setTrackerBoard(() => newTracker);
      return;
    }

    // Box check
    {
      if (boardTmp[i].includes(Number(inputValue))) {
        toast(`Number ${inputValue} already in this box!`, {
          position: toast.POSITION.TOP_RIGHT,
          className: "toast-message-warning",
        });
        return;
      }
    }

    // Column check
    {
      let boxNum = i % 3;
      let colNum = j % 3;
      boardTmp.forEach((b, k) => {
        b.forEach((_: any, l: number) => {
          if (boxNum == k % 3 && l % 3 == colNum && board[k][l] == Number(inputValue)) {
            toast(`Number ${inputValue} already in this column!`, {
              position: toast.POSITION.TOP_RIGHT,
              className: "toast-message-warning",
            });
            returnFlag = true;
          }
        })
      })

      // Row check
      {
        let rowCounter = Math.floor(i / 3);
        let rowNum = Math.floor(j / 3);
        boardTmp.forEach((b, k) => {
          b.forEach((_: any, l: number) => {
            if (Math.floor(k / 3) == rowCounter && Math.floor(l / 3) == rowNum && board[k][l] == Number(inputValue)) {
              toast(`Number ${inputValue} already in this row!`, {
                position: toast.POSITION.TOP_RIGHT,
                className: "toast-message-warning",
              });
              returnFlag = true;
            }
          })
        });
      }

      // Return if one of the prevoius checks failed
      if (returnFlag) return;

    }

    // Set number and update board state
    const newBoard = produce(board, draftBoard => {
      draftBoard[i][j] = Number(inputValue);
    })
    setBoard(() => newBoard);

    // Also care about the class tracker board
    const newTracker = produce(trackerBoard, draftBoard => {
      Number(inputValue) != 0 ? draftBoard[i][j] = "given" : draftBoard[i][j] = "";
    })
    setTrackerBoard(() => newTracker);
  }


  // Markup
  return (
    <>
      <div>
        <h1>Sudoku solver using Backtracking</h1>
        <div className="sudoku-controls">

          <DefaultButton disabled={isSolving} onClick={async () => {
            setIsSolving(true);
            let boardSync = JSON.parse(JSON.stringify(board));
            let trackerSync = JSON.parse(JSON.stringify(trackerBoard));
            // Solve the sudoku
            await sudokuSolver(boardSync, trackerSync, 0, 0);
            setIsSolving(false);
          }
          }>Solve Sudoku</DefaultButton>

          <DefaultButton disabled={isSolving} onClick={() => {
            setIsSolving(false);
            // Board update
            const newBoard = produce(board, draftBoard => {
              draftBoard.forEach(b => b.fill(0));
            })
            setBoard(newBoard);
            // Class tracker board update
            const newClassTracker = produce(trackerBoard, draftBoard => {
              draftBoard.forEach((_, i) => draftBoard[i] = Array(9).fill(""));
            })
            setTrackerBoard(newClassTracker);
          }}>New blank Sudoku</DefaultButton>

          <DefaultButton disabled={isSolving} onClick={() => {
            setIsSolving(false);
            // Board update to show the example board
            setBoard(() => gameBoardBlogExample);
            // Class tracker board update
            const newClassTracker = produce(trackerBoard, draftBoard => {
              draftBoard.forEach((_, i) => draftBoard[i] = draftBoard[i].map((_: string[], j: number) =>
                (gameBoardBlogExample[i][j] !== 0) ? "given" : ""
              ));
            })
            setTrackerBoard(newClassTracker);
            console.log(newClassTracker)
          }}>Load Example</DefaultButton>
          <label style={{ fontSize: "1.15rem" }}>Show Steps
            <DefaultCheckbox disabled={isSolving} onClick={(e) => {
              setShowSteps(e.currentTarget.checked);
            }}></DefaultCheckbox>
          </label>
        </div>

      </div >
      {/*<!-- Sudoku board -->*/}
      < div className="sudoku-board" >
        {
          board.map((b, i) =>
            <div className="sudoku-smallboard" key={i}>
              {
                b.map((_: any, j: number) =>
                  <div className="sudoku-cell" key={`${i}${j}`}>
                    <input title="Sudoku cell" className={"input " + trackerBoard[i][j]} key={`${i}${j}`} maxLength={1} placeholder="" value={board[i][j] == 0 ? "" : board[i][j]}
                      onChange={(e) => {
                        numberInputCheck(e.target.value, i, j)
                      }}
                    />
                  </div>
                )
              }
            </div>
          )
        }
      </div >
      <ToastContainer />
    </>
  )
}

/**
 * Helper func to determine if a string is a number
 * @param str 
 * @returns 
 */
function isAlphanumeric(str: string): boolean {
  return /^[1-9]+$/.test(str);
}

/**
 * Helper func to add a little delay inside async functions
 * @param ms 
 * @returns 
 */
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default App
