import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from './context/SocketContext';
import { TURNS } from './constants.js';
import { Square } from './components/Square.jsx';
import { WinnerModal } from './components/WinnerModal.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { ListaDeEspera } from './components/ListaDeEspera';  // Importa el componente de Lista de Espera
import { ListaDeEspectadores } from './components/ListaDeEspectadores';  // Importa el componente de Lista de Espectadores
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
    socket.on("actua")
    console.log(winner)
  };

  const volverAJugar = () => {
    if (!roomId) return; // Asegúrate de que haya una sala activa
    console.log(`Volver a jugar en la sala ${roomId}`);
    socket.emit("volverAJugar", { roomId }); // Envía la sala actual al servidor
    setRoomId(null); // Resetea la sala actual en el cliente
    setBoard(Array(9).fill(null)); // Limpia el tablero
    setTurn(TURNS.X); // Resetea el turno
    setWinner(null); // Resetea el ganador
};

const irSalaEspera = () => {
  console.log("IrSalaEspera");
  socket.emit("crearSalas", "player");

  socket.on("actualizarListaDeEspera", (lista) => {
    console.log(lista);
  });
  setRoomId(null); // Resetea la sala actual en el cliente
  setBoard(Array(9).fill(null)); // Limpia el tablero
  setTurn(TURNS.X); // Resetea el turno
  setWinner(null); // Resetea el ganador
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
    return <JuegosModal esconder={esconderModal} />;
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
          {/* <button onClick={volverAJugar}>Volver a jugar</button> */}
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
