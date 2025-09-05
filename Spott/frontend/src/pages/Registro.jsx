import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../app.css";

function extractZodMessage(data) {
  // Tu validate.ts devuelve: { message, errors: err.flatten(), details: err.issues }
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
    const { rol } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // NUEVO (solo se usa para usuario)
    const [ciudad, setCiudad] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Reglas mínimas en el front (el back también valida)
    if (!nombre || !email || !password) {
        setError("Todos los campos obligatorios deben estar completos");
        return;
    }
    if (password.trim().length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
    }
    // Solo exigimos confirmación para usuarios (no empresas)
    if (rol !== "empresa" && password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    try {
        setLoading(true);

        const url =
        rol === "empresa"
            ? "http://localhost:3001/api/empresas/registro"
            : "http://localhost:3001/api/usuarios/registro";

      // Enviamos confirmPassword solo para usuario (para que Zod la pueda validar si la pedimos)
        const payload =
        rol === "empresa"
            ? { nombre, email, password, ciudad }
            : { nombre, email, password, confirmPassword, ciudad };

        const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

      // Si hay error, mostramos mensaje del backend (Zod o genérico)
        if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(extractZodMessage(data) || "Error en registro");
        return;
        }

        const data = await res.json();

      // Guardar según rol
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
        <h2>Registro de {rol === "empresa" ? "Empresa" : "Usuario"}</h2>
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
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

            {rol !== "empresa" && (
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
            )}

            <input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            autoComplete="address-level2"
            />

            <button type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
        </form>
        </div>
    </div>
    );
}
