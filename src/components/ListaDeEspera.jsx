import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const ListaDeEspera = () => {
    const { socket } = useContext(SocketContext); 
    const [listaDeEspera, setListaDeEspera] = useState([]);

    useEffect(() => {
        // Escuchar lista de espera
        socket.on('actualizarListaDeEspera', (nuevaLista) => {
            setListaDeEspera(nuevaLista);
        });

        // Limpiar Lista
        return () => {
            socket.off('actualizarListaDeEspera');
        };
    }, [socket]);

    return (
        <div>
            <h2>Lista de Espera</h2>
            <ul>
                {listaDeEspera.map((jugador) => (
                    <li key={jugador.id}>{jugador.id}</li>
                ))}
            </ul>
        </div>
    );
};
