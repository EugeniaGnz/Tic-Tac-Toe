import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const ListaDeEspera = ({winner}) => {
    const { socket } = useContext(SocketContext);
    const [listaDeEspera, setListaDeEspera] = useState([]);

    socket.on('actualizarListaDeEspera', (nuevaListaDeEspera) => {
        setListaDeEspera(nuevaListaDeEspera);
    });

    useEffect(() => {
        // Escuchar el evento para actualizar la lista de espera
        socket.on('actualizarListaDeEspera', (nuevaListaDeEspera) => {
            console.log(nuevaListaDeEspera);
            setListaDeEspera(nuevaListaDeEspera);
        });

        // Limpieza de listeners al desmontar el componente
        return () => {
            socket.off('actualizarListaDeEspera');
        };
    }, [socket, winner]);

    const moverAEspectadores = (jugadorId) => {
        socket.emit('moverAEspectadores', jugadorId);
    };

    return (
        <div>
            <h2>Lista de Espera</h2>
            <ul>
                {listaDeEspera.map((jugador) => (
                    <li key={jugador.id}>
                      {jugador.username}
                        <button onClick={() => moverAEspectadores(jugador.id)}>
                            Mover a Espectadores
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
