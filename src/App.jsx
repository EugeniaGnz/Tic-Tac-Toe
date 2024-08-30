import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from './context/SocketContext';
import { TURNS } from './constants.js';
import { Square } from './components/Square.jsx';
import { WinnerModal } from './components/WinnerModal.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { ListaDeEspera } from './components/ListaDeEspera'; 
import { ListaDeEspectadores } from './components/ListaDeEspectadores';  
import { JuegosModal } from './components/JuegosModal.jsx';

function App() {
  const { socket } = useContext(SocketContext);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showJuegosModal, setShowJuegosModal] = useState(false);
  const [jugadorActual, setJugadorActual] = useState(null);
  const [perdedor, setPerdedor] = useState(null);

  useEffect(() => {
    if (!socket) return;

    console.log("Conectado al servidor");

    socket.on("IdJugador", ({id}) => {
      setJugadorActual(id);
    });

    socket.on("gameStart", ({ roomId, turn }) => {
      console.log(`Juego iniciado en la sala ${roomId}, turno: ${turn}`);
      setRoomId(roomId);
      setTurn(turn);
      setBoard(Array(9).fill(null));
      setWinner(null);
    });

    socket.on("updateBoard", ({ board, turn }) => {
      setBoard(board);
      console.log(board);
      setTurn(turn);
    });

    socket.on("gameEnd", ({ winner, id }) => {
      setPerdedor(id);
      setWinner(winner);
    });

    socket.on("gameReset", ({ board, turn }) => {
      setBoard(board);
      setTurn(turn);
      setWinner(null);
    });

    socket.on("disconnect", () => {
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

  const espectar = () => {
    socket.on("updateBoard", ({ board, turn }) => {
      setBoard(board);
      console.log(board);
      setTurn(turn);
    });
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    socket.emit("makeMove", { roomId, index });
    socket.on("actua")
    console.log(winner)
  };

  const volverAJugar = () => {
    if (!roomId) return; 
    console.log(`Volver a jugar en la sala ${roomId}`);
    socket.emit("volverAJugar", { roomId });
    setRoomId(null); 
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X); 
    setWinner(null); 
};

const irSalaEspera = () => {
  console.log("IrSalaEspera");
  socket.emit("crearSalas", "player");

  socket.on("actualizarListaDeEspera", (lista) => {
    console.log(lista);
  });
  setRoomId(null); 
  setBoard(Array(9).fill(null)); 
  setTurn(TURNS.X); 
  setWinner(null); 
}

const irEspectadores = () => {
  socket.emit("moverAEspectadores");
  socket.emit("crearSalas", "spectator")
  socket.on("actualizarListaDeEspectadores", (lista) => {
    console.log(lista);
  });
  setWinner(null);
}


  const handleLogin = () => {
    setShowLoginModal(false);
  };
  const mostrarModal = () => {
    setShowJuegosModal(true);
  };
  const esconderModal = () => {
    setShowJuegosModal(false);
  };


  if (showLoginModal) {
    return <LoginModal onLogin={handleLogin} handleJuegos={mostrarModal} />;
  }


  if (showJuegosModal) {
    return <JuegosModal esconder={esconderModal} espectar={espectar} />;
  }


  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <div className="juego">
        <section>
          <ListaDeEspera winner={winner}/>  {/* Agrega el componente de Lista de Espera */}
        </section>
        <section>
          <ListaDeEspectadores /> 
        </section>
        <section>
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
      <WinnerModal resetGame={volverAJugar} irSalaEspera={irSalaEspera} irEspecadores={irEspectadores} winner={winner} jugadorActual={jugadorActual} perdedor={perdedor}/>
    </main>
  );
}

export default App;
