import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../app.css";

function extractZodMessage(data) {
    try {
    if (data?.errors?.fieldErrors) {
        const firstKey = Object.keys(data.errors.fieldErrors)[0];
        const msgs = data.errors.fieldErrors[firstKey];
        if (Array.isArray(msgs) && msgs.length) return msgs[0];
    }
    if (Array.isArray(data?.details) && data.details.length) {
        return data.details[0]?.message || "Error de validación";
    }
    if (typeof data?.message === "string" && data.message.trim()) {
        return data.message;
    }
    } catch {}
    return "Error de validación";
}

export default function Registro() {
    const { rol } = useParams(); // "usuario" | "empresa"
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [edad, setEdad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [modo, setModo] = useState("usuario"); // Inicializado con un valor por defecto

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación: el usuario debe seleccionar un modo
        if (!modo) {
            setError("Debe seleccionar si es Usuario o Empresa");
            return;
        }

        // Confirmación antes de proceder
        const modoTexto = modo === "usuario" ? "Usuario" : "Empresa";
        const confirmacion = window.confirm(`¿Estás seguro que quieres entrar como ${modoTexto}?`);
        
        if (!confirmacion) {
            return; // Si cancela, no continúa
        }

        if (!nombre || !email || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        // mismo filtro que el back (gmail/hotmail/outlook)
        if (!/^[\w.+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/i.test(email)) {
            setError("Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com");
            return;
        }

        if (password.trim().length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (password.trim().length > 72) {
            setError("La contraseña no puede superar 72 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        // Edad solo para usuario
        let edadNumber;
        if (modo === "usuario") {
            edadNumber = parseInt(edad, 10);
            if (isNaN(edadNumber) || edadNumber < 1 || edadNumber > 120) {
                setError("Debe ingresar una edad válida (1-120 años)");
                return;
            }
        }

        try {
            setLoading(true);

            const url =
                modo === "empresa"
                    ? "http://localhost:3001/api/empresas/registro"
                    : "http://localhost:3001/api/usuarios/registro";

            const bodyData =
                modo === "empresa"
                    ? { nombre, email, password, confirmPassword, ciudad }
                    : { nombre, email, password, confirmPassword, edad: edadNumber, ciudad };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(extractZodMessage(data) || "Error en registro");
                return;
            }

            if (modo === "empresa") {
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
                <h2>Registro</h2>
                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    <div style={{ marginBottom: '15px' }}>
                        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Selecciona tu tipo de cuenta:</p>
                        <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                            <input 
                                type="radio"
                                value="usuario"
                                checked={modo === "usuario"}
                                onChange={(e) => setModo(e.target.value)}
                                style={{ marginRight: '5px' }}
                            />
                            Usuario
                        </label>
                        <label style={{ cursor: 'pointer' }}>
                            <input 
                                type="radio"
                                value="empresa"
                                checked={modo === "empresa"}
                                onChange={(e) => setModo(e.target.value)}
                                style={{ marginRight: '5px' }}
                            />
                            Empresa
                        </label>
                    </div>

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña (mínimo 6)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        maxLength={72}
                        autoComplete="new-password"
                    />

                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        maxLength={72}
                        autoComplete="new-password"
                    />

                    <input
                        type="text"
                        placeholder="Ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />

                    {modo === "usuario" && (
                        <input
                            type="number"
                            placeholder="Edad"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            min="1"
                            max="120"
                            required
                        />
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    );
}