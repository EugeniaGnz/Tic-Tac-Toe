export function LoginModal ({ onLogin}) {
    return (
        <section className="winner">
            <form className="text">
                <h3>Nombre</h3>
                <input className="username" />
                <article className="botones">
                    <button onClick={onLogin} className="loginButton" type="button">Espectar</button>
                    <button onClick={onLogin} className="loginButton" type="button">Jugar</button>
                </article>
            </form>
        </section>
    )
}