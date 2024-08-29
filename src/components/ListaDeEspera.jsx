import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const ListaDeEspectadores = () => {
    const { socket } = useContext(SocketContext);
    const [listaDeEspera, setListaDeEspera] = useState([]);

    useEffect(() => {
        // Escuchar el evento para actualizar la lista de espera
        socket.on('actualizarListaDeEspera', (nuevaListaDeEspera) => {
            setListaDeEspera(nuevaListaDeEspera);
        });

        // Limpieza de listeners al desmontar el componente
        return () => {
            socket.off('actualizarListaDeEspera');
        };
    }, [socket]);

    const moverAEspectadores = (jugadorId) => {
        socket.emit('moverAEspectadores', { jugadorId });
    };

    return (
        <div>
            <h2>Lista de Espera</h2>
            <ul>
                {listaDeEspera.map((jugador) => (
                    <li key={jugador.id}>
                        ID: {jugador.id}
                        <button onClick={() => moverAEspectadores(jugador.id)}>
                            Mover a Espectadores
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
