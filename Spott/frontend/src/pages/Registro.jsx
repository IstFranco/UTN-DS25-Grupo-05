import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usuarioRegisterSchema } from '../validations/usuarioRegisterSchema';
import { empresaRegisterSchema } from '../validations/empresaRegisterSchema';
import { useAuth } from '../contexts/AuthContext';

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
            navigate(modo === 'empresa' ? '/empresa' : '/usuario');
        } else {
            if (result.details) {
                setServerError(extractZodMessage(result.details));
            } else {
                setServerError(result.error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-purple-900/30 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-700/20">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">
                    Registro
                </h2>

                {serverError && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-center text-sm">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {/* Selector de tipo */}
                    <div className="mb-4">
                        <p className="text-white font-semibold mb-2">
                            Selecciona tu tipo de cuenta:
                        </p>

                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer text-slate-300">
                                <input
                                    type="radio"
                                    value="usuario"
                                    checked={modo === "usuario"}
                                    onChange={(e) => handleModoChange(e.target.value)}
                                    className="mr-2 accent-purple-600"
                                />
                                Usuario
                            </label>

                            <label className="flex items-center cursor-pointer text-slate-300">
                                <input
                                    type="radio"
                                    value="empresa"
                                    checked={modo === "empresa"}
                                    onChange={(e) => handleModoChange(e.target.value)}
                                    className="mr-2 accent-purple-600"
                                />
                                Empresa
                            </label>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre"
                            {...register('nombre')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.nombre 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                            autoComplete="name"
                        />
                        {errors.nombre && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.nombre.message}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            {...register('email')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.email 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña (mínimo 6)"
                            {...register('password')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.password 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            {...register('confirmPassword')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.confirmPassword 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    {/* Ciudad */}
                    <div>
                        <input
                            type="text"
                            placeholder="Ciudad"
                            {...register('ciudad')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.ciudad 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                        />
                        {errors.ciudad && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.ciudad.message}
                            </span>
                        )}
                    </div>

                    {/* Edad (solo para usuarios) */}
                    {modo === "usuario" && (
                        <div>
                            <input
                                type="number"
                                placeholder="Edad"
                                {...register('edad')}
                                className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                    errors.edad 
                                        ? 'border-red-500 focus:ring-red-500' 
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                                min="1"
                                max="120"
                            />
                            {errors.edad && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.edad.message}
                                </span>
                            )}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isSubmitting ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                {/* Link para volver al login */}
                <div className="mt-6 text-center">
                    <p className="text-slate-300">
                        ¿Ya tenés cuenta?{' '}
                        <button
                            type="button"
                            className="text-purple-400 hover:text-purple-300 font-semibold underline transition"
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