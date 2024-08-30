import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from './context/SocketContext';
import { TURNS } from './constants.js';
import { Square } from './components/Square.jsx';
import { WinnerModal } from './components/WinnerModal.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { ListaDeEspera } from './components/ListaDeEspera';  // Importa el componente de Lista de Espera
import { ListaDeEspectadores } from './components/ListaDeEspectadores';  // Importa el componente de Lista de Espectadores

function App() {
  const { socket } = useContext(SocketContext);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);

  useEffect(() => {
    if (!socket) return;

    console.log("Conectado al servidor");

    socket.on("gameStart", ({ roomId, turn }) => {
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
      setWinner(winner);
    });

    socket.on("gameReset", ({ board, turn }) => {
      setBoard(board);
      setTurn(turn);
      setWinner(null);
    });

    socket.on("disconnect", () => {
      // Opcional: Muestra el modal de inicio de sesión si el jugador se desconecta
      setShowLoginModal(true);
    });

    return () => {
      console.log("Desconectando del servidor");
      socket.off("gameStart");
      socket.off("updateBoard");
      socket.off("gameEnd");
      socket.off("gameReset");
      socket.off("disconnect"); // Limpia el evento de desconexión al desmontar
    };
  }, [socket]);

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    socket.emit("makeMove", { roomId, index });
  };

  const leaveGame = () => {
    console.log(`Dejar el juego en la sala ${roomId}`);
    socket.emit("leaveGame");
    setRoomId(null); // Resetea la sala actual en el cliente
    setBoard(Array(9).fill(null)); // Limpia el tablero
    setTurn(TURNS.X); // Resetea el turno
    setWinner(null); // Resetea el ganador
    setShowLoginModal(true); // Muestra el modal de inicio de sesión
  };

  const handleLogin = () => {
    setShowLoginModal(false);
  };

  if (showLoginModal) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <div className="juego">
        <section>
          <ListaDeEspera />  {/* Agrega el componente de Lista de Espera */}
        </section>
        <section>
          <ListaDeEspectadores /> 
        </section>
        <section>
          <button onClick={leaveGame}>Dejar el juego</button>
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
        </section>
      </div>
      <WinnerModal resetGame={leaveGame} winner={winner} />
      <ListaDeEspectadores />  {/* Agrega el componente de Lista de Espectadores */}
    </main>
  );
}

export default App;
