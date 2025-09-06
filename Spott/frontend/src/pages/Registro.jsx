import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../app.css";

export default function Registro() {
    const { rol } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [edad, setEdad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
   
        if (!nombre || !email || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        // Validar edad solo para usuarios
        if (rol === "usuario" && (!edad || edad < 1 || edad > 120)) {
            setError("Debe ingresar una edad válida (1-120 años)");
            return;
        }

        try {
            setLoading(true);
       
            // Cambiar URL según el rol
            const url = rol === "empresa"
                ? "http://localhost:3001/api/empresas/registro"
                : "http://localhost:3001/api/usuarios/registro";
       
            // Preparar datos según el tipo de registro
            const bodyData = rol === "empresa" 
                ? { nombre, email, password, ciudad }
                : { nombre, email, password, edad: parseInt(edad), ciudad };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
            });
            const data = await res.json();
           
            if (!res.ok) {
                setError(data.message || "Error en registro");
                return;
            }

            // Guardar datos según el tipo de entidad creada
            if (rol === "empresa") {
                localStorage.setItem("empresa", JSON.stringify(data.empresa));
            } else {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
            }

            // Redirigir al inicio según rol
            if (rol === "usuario") {
                navigate("/usuario");
            } else {
                navigate("/empresa");
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
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
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
                    {/* Campo edad solo para usuarios */}
                    {rol === "usuario" && (
                        <input
                            type="number"
                            placeholder="Edad"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            min="1"
                            max="120"
                        />
                    )}
                    <input
                        type="text"
                        placeholder="Ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    );
}