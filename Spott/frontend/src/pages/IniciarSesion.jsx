import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validations/loginSchema';
import { useAuth } from '../contexts/AuthContext';

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
        let result = await login(data.email, data.password, 'usuario');
        
        if (!result.success) {
            result = await login(data.email, data.password, 'empresa');
        }
        
        if (result.success) {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-purple-900/30 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-700/20">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">
                    Iniciar sesión
                </h2>
                
                {serverError && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-center text-sm">
                        {serverError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        />
                        {errors.email && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            {...register('password')}
                            className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                errors.password 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-purple-700/50 focus:ring-purple-600'
                            }`}
                        />
                        {errors.password && (
                            <span className="text-red-400 text-sm block mt-1">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isSubmitting ? "Iniciando sesión..." : "Ingresar"}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-slate-300">
                        ¿No tenés cuenta?{' '}
                        <button
                            type="button"
                            className="text-purple-400 hover:text-purple-300 font-semibold underline transition"
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