import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const ListaDeEspectadores = () => {
    const { socket } = useContext(SocketContext);
    const [listaDeEspectadores, setListaDeEspectadores] = useState([]);

    useEffect(() => {
        // Escuchar el evento para actualizar la lista de espectadores
        socket.on('actualizarListaDeEspectadores', (nuevaListaDeEspectadores) => {
            setListaDeEspectadores(nuevaListaDeEspectadores);
        });

        // Limpieza de listeners al desmontar el componente
        return () => {
            socket.off('actualizarListaDeEspectadores');
        };
    }, [socket]);

    const moverAListaDeEspera = (espectadorId) => {
        socket.emit('moverAListaEspera', espectadorId);
    };

    return (
        <div>
            <h2>Lista de Espectadores</h2>
            <ul>
                {listaDeEspectadores.map((espectador) => (
                    <li key={espectador.id}>
                     {espectador.username}
                        <button onClick={() => moverAListaDeEspera(espectador.id)}>
                            Mover a Lista de Espera
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
