type BoardProps = {
    board: number[][],
    trackerBoard: string[][],
    checkFunc: (val: string, i: number, j: number) => void
}


function Board(props: BoardProps) {
    return (
        <div className="sudoku-board" >
            {
                props.board.map((b, i) =>
                    <div className="sudoku-smallboard" key={i}>
                        {
                            b.map((_: any, j: number) =>
                                <div className="sudoku-cell" key={`${i}${j}`}>
                                    <input title="Sudoku cell" className={"input " + props.trackerBoard[i][j]} key={`${i}${j}`} maxLength={1} placeholder="" value={props.board[i][j] == 0 ? "" : props.board[i][j]}
                                        onChange={(e) => {
                                            props.checkFunc(e.target.value, i, j)
                                        }}
                                    />
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}



export default Board;