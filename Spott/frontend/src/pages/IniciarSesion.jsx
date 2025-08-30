import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../app.css';

export default function IniciarSesion() {
    const { rol } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rol === 'usuario') {
        navigate('/usuario');
        } else if (rol === 'empresa') {
        navigate('/empresa');
        } else {
        navigate('/');
        }
    };

    return (
        <div className="login-container">
        <div className="login-box">
            <h2>Iniciar sesión como {rol === 'empresa' ? 'Empresa' : 'Usuario'}</h2>

            <form onSubmit={handleSubmit} className="login-form">
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Ingresar</button>
            </form>

            {/* Botón para ir al registro */}
            <div style={{ marginTop: '15px' }}>
            <p className="signin-footer">
                ¿No tenés cuenta?{' '}
                <button
                type="button"
                className="link-registro"
                onClick={() => navigate(`/registro/${rol}`)}
                >
                Registrate
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}
