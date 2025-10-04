import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validations/loginSchema';
import { useAuth } from '../contexts/AuthContext';
import '../app.css';

export default function IniciarSesion() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
        email: '',
        password: ''
        }
    });

    const onSubmit = async (data) => {
    setServerError('');

    // Intentar primero como usuario
    let result = await login(data.email, data.password, 'usuario');

    // Si falla, intentar como empresa
    if (!result.success) {
        result = await login(data.email, data.password, 'empresa');
    }

    if (result.success) {
        // Redirigir según el tipo de usuario
        if (result.userType === 'usuario') {
        navigate('/usuario');
        } else if (result.userType === 'empresa') {
        navigate('/empresa');
        }
    } else {
        setServerError('Credenciales inválidas o cuenta no encontrada');
    }
    };

    return (
        <div className="login-container">
        <div className="login-box">
            <h2>Iniciar sesión</h2>

            {serverError && (
            <p className="login-error">{serverError}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div>
                <input
                type="email"
                placeholder="Correo electrónico"
                {...register('email')}
                className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                <span className="field-error">{errors.email.message}</span>
                )}
            </div>

            <div>
                <input
                type="password"
                placeholder="Contraseña"
                {...register('password')}
                className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                <span className="field-error">{errors.password.message}</span>
                )}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Ingresar"}
            </button>
            </form>

            <div style={{ marginTop: '15px' }}>
            <p className="signin-footer">
                ¿No tenés cuenta?{' '}
                <button
                type="button"
                className="link-registro"
                onClick={() => navigate('/registro')}
                >
                Registrate
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}