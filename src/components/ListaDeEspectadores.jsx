import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from './context/SocketContext';

export const ListaDeEspectadores = () => {
    const { socket } = useContext(SocketContext);
    const [espectadores, setEspectadores] = useState([]);
    const [conteo, setConteo] = useState(0);

    useEffect(() => {
        // Escucha cuando se actualiza la lista de espectadores
        socket.on('actualizarListaDeEspectadores', (nuevaListaDeEspectadores) => {
            setEspectadores(nuevaListaDeEspectadores);
        });

        // Escucha cuando se actualiza el conteo de espectadores
        socket.on('actualizarConteoDeEspectadores', (data) => {
            setConteo(data.conteo);
        });

        // Limpia la lista de espectadores y el conteo
        return () => {
            socket.off('actualizarListaDeEspectadores');
            socket.off('actualizarConteoDeEspectadores');
        };
    }, [socket]);

    return (
        <div>
            <h2>Espectadores ({conteo})</h2>
            <ul>
                {espectadores.map((espectador) => (
                    <li key={espectador.id}>ID: {espectador.id}</li>
                ))}
            </ul>
        </div>
    );
};

