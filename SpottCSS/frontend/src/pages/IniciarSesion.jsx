import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
        
            const url = rol === "empresa"
                ? "http://localhost:3000/api/empresas/login"
                : "http://localhost:3000/api/usuarios/login";
        
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

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
        
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
        <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
            <div className="bg-red-600 rounded-2xl shadow-2xl p-8 w-full max-w-md border-4 border-red-800">
                <h2 className="text-4xl font-bold text-white text-center mb-8">
                    Iniciar sesión
                </h2>
                {error && (
                    <div className="bg-red-200 border-2 border-red-900 text-red-900 px-4 py-3 rounded-lg mb-4 font-semibold">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-red-300 focus:ring-4 focus:ring-red-300 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-red-300 focus:ring-4 focus:ring-red-300 outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-red-900 text-white font-bold py-4 rounded-lg hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {loading ? "Iniciando sesión..." : "Ingresar"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-white font-semibold">
                        ¿No tenés cuenta? Sos un boludo{' '}
                        <button
                            type="button"
                            onClick={() => navigate(`/registro`)}
                            className="bg-red-950 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors font-bold ml-2"
                        >
                            Mejor Registrate burro xs
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}