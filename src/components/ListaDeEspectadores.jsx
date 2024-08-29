import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from './context/SocketContext';

export const ListaDeEspectadores = () => {
    const { socket } = useContext(SocketContext);
    const [espectadores, setEspectadores] = useState([]);
    const [conteo, setConteo] = useState(0);

    useEffect(() => {
        // Emitir lista de espectadores
        socket.on('actualizarListaDeEspectadores', (nuevaListaDeEspectadores) => {
            setEspectadores(nuevaListaDeEspectadores);
        });

        // Emitir el conteo de espectadores
        socket.on('actualizarConteoDeEspectadores', (data) => {
            setConteo(data.conteo);
        });

        // Reiniciar listas
        return () => {
            socket.off('actualizarListaDeEspectadores');
            socket.off('actualizarConteoDeEspectadores');
        };
    }, [socket]);

    const moverAListaDeEspera = (jugadorId) => {
        socket.emit('moverAListaEspera', { jugadorId });
    };

    return (
        <div>
            <h2>Espectadores ({conteo})</h2>
            <ul>
                {espectadores.map((espectador) => (
                    <li key={espectador.id}>
                        ID: {espectador.id}
                        <button onClick={() => moverAListaDeEspera(espectador.id)}>
                            Mover a Lista de Espera
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

