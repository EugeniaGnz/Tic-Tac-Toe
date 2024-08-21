import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import { TURNS } from "./constants.js";
import { Square } from "./components/Square.jsx";
import { WinnerModal } from "./components/WinnerModal.jsx";

const socket = io("http://localhost:3300");

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    console.log("Conectado al servidor");

    socket.on("gameStart", ({ roomId, turn }) => {0
      console.log(`Juego iniciado en la sala ${roomId}, turno: ${turn}`);
      setRoomId(roomId);
      setTurn(turn);
      setBoard(Array(9).fill(null));
      setWinner(null);
    });

    socket.on("updateBoard", ({ board, turn }) => {
      setBoard(board);
      setTurn(turn);
    });

    socket.on("gameEnd", ({ winner }) => {
      // console.log(`Juego terminado en la sala ${roomId}, ganador: ${winner}`);
      setWinner(winner);
    });

    socket.on("gameReset", ({ board, turn }) => {
      // console.log(`Juego reiniciado en la sala ${roomId}, turno: ${turn}`);
      setBoard(board);
      setTurn(turn);
      setWinner(null);
    });

    return () => {
      console.log("Desconectando del servidor");
      socket.off("gameStart");
      socket.off("updateBoard");
      socket.off("gameEnd");
      socket.off("gameReset");
    };
  }, [roomId]);

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    socket.emit("makeMove", { roomId, index });
  };

  // const resetGame = () => {
  //   console.log(`reiniciar el juego en la sala ${roomId}`);
  //   socket.emit("resetGame");
  // };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((square, index) => (
          <Square key={index} index={index} updateBoard={updateBoard}>
            {square}
          </Square>
        ))}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
