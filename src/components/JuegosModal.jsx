import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

export const JuegosModal = ({ esconder, espectar }) => {
  const { socket } = useContext(SocketContext);
  const [activeGames, setActiveGames] = useState([]);

  useEffect(() => {
    socket.emit("getActiveGamessss");
    socket.on("getActiveGames", (activeGames) => {
      console.log(activeGames);
      setActiveGames(activeGames);
    });

    return () => {
      socket.off("getActiveGames");
    };
  }, [socket]);

  const agregarEspectador = (key) => {
    socket.emit("AgregarEspecador", key);
    esconder();
    espectar();
  };

  return (
    <section className="winner">
      <div className="text">
        <h3>Juegos disponibles</h3>
        <article>
          {Object.entries(activeGames).map(([key, game], index) => (
            <button onClick={() => agregarEspectador(key)} key={key}> 
              Sala: {index + 1}
            </button>
          ))}
        </article>
      </div>
    </section>
  );
};
