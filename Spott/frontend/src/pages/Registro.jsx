import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usuarioRegisterSchema } from '../validations/usuarioRegisterSchema';
import { empresaRegisterSchema } from '../validations/empresaRegisterSchema';
import { useAuth } from '../contexts/AuthContext';
import "../app.css";

// Helper para extraer mensajes de error del backend (Zod)
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
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [modo, setModo] = useState("usuario");
    const [serverError, setServerError] = useState("");

    // Cambiar schema según el modo
    const schema = modo === "usuario" ? usuarioRegisterSchema : empresaRegisterSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        ciudad: '',
        edad: ''
        }
    });

    // Cambiar de modo resetea el formulario
    const handleModoChange = (nuevoModo) => {
        setModo(nuevoModo);
        reset();
        setServerError('');
    };

    const onSubmit = async (data) => {
        setServerError("");

        // Confirmación antes de proceder
        const modoTexto = modo === "usuario" ? "Usuario" : "Empresa";
        const confirmacion = window.confirm(
        `¿Estás seguro que quieres registrarte como ${modoTexto}?`
        );

        if (!confirmacion) return;

        // Llamar al register del AuthContext
        const result = await registerUser(data, modo);

        if (result.success) {
        // Redirigir según el tipo
        navigate(modo === 'empresa' ? '/empresa' : '/usuario');
        } else {
        // Intentar extraer mensaje Zod del backend
        if (result.details) {
            setServerError(extractZodMessage(result.details));
        } else {
            setServerError(result.error);
        }
        }
    };

    return (
        <div className="login-container">
        <div className="login-box">
            <h2>Registro</h2>

            {serverError && <p className="login-error">{serverError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            {/* Selector de tipo */}
            <div style={{ marginBottom: '15px' }}>
                <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                Selecciona tu tipo de cuenta:
                </p>

                <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input
                    type="radio"
                    value="usuario"
                    checked={modo === "usuario"}
                    onChange={(e) => handleModoChange(e.target.value)}
                    style={{ marginRight: '5px' }}
                />
                Usuario
                </label>

                <label style={{ cursor: 'pointer' }}>
                <input
                    type="radio"
                    value="empresa"
                    checked={modo === "empresa"}
                    onChange={(e) => handleModoChange(e.target.value)}
                    style={{ marginRight: '5px' }}
                />
                Empresa
                </label>
            </div>

            {/* Nombre */}
            <div>
                <input
                type="text"
                placeholder="Nombre"
                {...register('nombre')}
                className={errors.nombre ? 'input-error' : ''}
                autoComplete="name"
                />
                {errors.nombre && (
                <span className="field-error">{errors.nombre.message}</span>
                )}
            </div>

            {/* Email */}
            <div>
                <input
                type="email"
                placeholder="Correo electrónico"
                {...register('email')}
                className={errors.email ? 'input-error' : ''}
                autoComplete="email"
                />
                {errors.email && (
                <span className="field-error">{errors.email.message}</span>
                )}
            </div>

            {/* Password */}
            <div>
                <input
                type="password"
                placeholder="Contraseña (mínimo 6)"
                {...register('password')}
                className={errors.password ? 'input-error' : ''}
                autoComplete="new-password"
                />
                {errors.password && (
                <span className="field-error">{errors.password.message}</span>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <input
                type="password"
                placeholder="Confirmar contraseña"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'input-error' : ''}
                autoComplete="new-password"
                />
                {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword.message}</span>
                )}
            </div>

            {/* Ciudad */}
            <div>
                <input
                type="text"
                placeholder="Ciudad"
                {...register('ciudad')}
                className={errors.ciudad ? 'input-error' : ''}
                />
                {errors.ciudad && (
                <span className="field-error">{errors.ciudad.message}</span>
                )}
            </div>

            {/* Edad (solo para usuarios) */}
            {modo === "usuario" && (
                <div>
                <input
                    type="number"
                    placeholder="Edad"
                    {...register('edad')}
                    className={errors.edad ? 'input-error' : ''}
                    min="1"
                    max="120"
                />
                {errors.edad && (
                    <span className="field-error">{errors.edad.message}</span>
                )}
                </div>
            )}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando cuenta..." : "Registrarse"}
            </button>
            </form>

            {/* Link para volver al login */}
            <div style={{ marginTop: '15px' }}>
            <p className="signin-footer">
                ¿Ya tenés cuenta?{' '}
                <button
                type="button"
                className="link-registro"
                onClick={() => navigate('/')}
                >
                Iniciar sesión
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}