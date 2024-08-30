import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

export function LoginModal({ onLogin, handleJuegos }) {
  const { socket } = useContext(SocketContext);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);

  const handleLogin = (selectedRole) => {
    if (!username.trim()) {
      // Verifica si el nombre de usuario no está vacío
      alert("Por favor, ingrese un nombre de usuario.");
      return;
    }

    if(selectedRole == "spectator"){
      handleJuegos();
    } else {
      // Envía el evento 'login' al servidor
    socket.emit("login", { username, role: selectedRole });
    }
    
        // Agrega un listener para manejar la respuesta del servidor
        socket.once("loginSuccess", () => {
          onLogin();  // Llama a onLogin después de recibir la confirmación del servidor
        });
    
        // Opcionalmente, podrías agregar un listener para manejar errores o fallos en el login
        socket.once("loginError", (message) => {
          alert(message);  // Muestra el mensaje de error del servidor
        });

    setRole(selectedRole);

    
  };

  return (
    <section className="winner">
      <form className="text" onSubmit={(e) => e.preventDefault()}>
        <h3>Nombre</h3>
        <input
          className="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <article className="botones">
          <button
            onClick={() => {
              handleLogin("spectator");
              onLogin(); // Cierra el modal al hacer clic en el botón
            }}
            className="loginButton"
            type="button"
          >
            Espectar
          </button>
          <button
            onClick={() => {
              handleLogin("player");
              onLogin(); // Cierra el modal al hacer clic en el botón
            }}
            className="loginButton"
            type="button"
          >
            Jugar
          </button>
        </article>
      </form>
    </section>
  );
}
