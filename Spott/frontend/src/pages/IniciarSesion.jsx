import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../app.css';

export default function IniciarSesion() {
    const { rol } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Email y contraseña son obligatorios');
            return;
        }

        try {
            setLoading(true);
            
            // URL diferente según el rol
            const url = rol === "empresa" 
                ? "http://localhost:3001/api/empresas/login"
                : "http://localhost:3001/api/usuarios/login";
            
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Credenciales inválidas");
                return;
            }
            
            // Guardar datos en localStorage según el tipo
            if (rol === "empresa") {
                localStorage.setItem("empresa", JSON.stringify(data.empresa));
                navigate("/empresa");
            } else {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
                navigate("/usuario");
            }
        } catch (err) {
            setError("No se pudo conectar al servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Iniciar sesión como {rol === 'empresa' ? 'Empresa' : 'Usuario'}</h2>
                
                {error && <p className="login-error">{error}</p>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Ingresar"}
                    </button>
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