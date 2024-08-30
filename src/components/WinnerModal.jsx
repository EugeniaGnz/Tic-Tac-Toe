import { Square } from './Square.jsx'

export function WinnerModal({ winner, resetGame, irSalaEspera, irEspecadores, jugadorActual, perdedor }) {
  if (winner === null) return null;

  const winnerText = winner === 'Empate' ? 'Empate' : `Ganó: ${winner}`;

  return (
      <section className='winner'>
          <div className='text'>
              <h2>{winnerText}</h2>
              <header className='win'>
                  {winner && <Square>{winner}</Square>}
              </header>
              <footer>
                <div>
                    <button onClick={irSalaEspera}>Seguir jugando</button>
                </div>

              </footer>
          </div>
      </section>
  );
}
