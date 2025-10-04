// frontend/src/pages/Contacto.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactoSchema } from '../validations/contactoSchema';
import { useAuth } from '../contexts/AuthContext';
import Header from "../components/Header";
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import FooterUsuario from '../components/FooterUsuario';
import FooterEmpresa from '../components/FooterEmpresa';

export default function Contacto() {
    const { isEmpresa } = useAuth();
    const [enviado, setEnviado] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: yupResolver(contactoSchema),
        defaultValues: {
        nombre: '',
        email: '',
        mensaje: ''
        }
    });

    const onSubmit = async (data) => {
        // Aquí podrías enviar los datos a un endpoint
        console.log('Datos del formulario:', data);
        
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEnviado(true);
        reset();
        
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setEnviado(false), 3000);
    };

    return (
        <div>
        <Header
            title="Spott"
            leftButton={{ 
            type: 'image', 
            content: perfilImg, 
            to: isEmpresa ? '/empresa/perfil' : '/usuario/perfil' 
            }}
            rightButton={{ 
            type: 'image', 
            content: notiImg, 
            to: isEmpresa ? '/empresa/notificaciones' : '/usuario/notificaciones'
            }}
        />

        <div className="contacto">
            <h2 className="contacto_title">Contacto</h2>
            <p className="contacto_subtitle">
            Aquí tenés nuestra información de contacto o podés enviarnos un mensaje.
            </p>

            {/* Información de contacto */}
            <div className="contacto_card">
            <h3>Email</h3>
            <p>soporte@spott.com</p>
            </div>
            
            <div className="contacto_card">
            <h3>Teléfono</h3>
            <p>+54 2355 400119</p>
            </div>
            
            <div className="contacto_card">
            <h3>Redes sociales</h3>
            <p>Instagram: @spott_app</p>
            <p>Twitter: @spott_app</p>
            </div>

            {/* Formulario de contacto */}
            <div className="contacto_card">
            <h3>Envianos un mensaje</h3>
            
            {enviado && (
                <div style={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '5px',
                textAlign: 'center'
                }}>
                ¡Mensaje enviado con éxito! Te responderemos pronto.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Tu nombre"
                    {...register('nombre')}
                    className={errors.nombre ? 'input-error' : ''}
                    style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                    }}
                />
                {errors.nombre && (
                    <span className="field-error" style={{ display: 'block', marginTop: '5px' }}>
                    {errors.nombre.message}
                    </span>
                )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                <input
                    type="email"
                    placeholder="Tu email"
                    {...register('email')}
                    className={errors.email ? 'input-error' : ''}
                    style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                    }}
                />
                {errors.email && (
                    <span className="field-error" style={{ display: 'block', marginTop: '5px' }}>
                    {errors.email.message}
                    </span>
                )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                <textarea
                    placeholder="Tu mensaje"
                    {...register('mensaje')}
                    className={errors.mensaje ? 'input-error' : ''}
                    rows="5"
                    style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical'
                    }}
                />
                {errors.mensaje && (
                    <span className="field-error" style={{ display: 'block', marginTop: '5px' }}>
                    {errors.mensaje.message}
                    </span>
                )}
                </div>

                <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1
                }}
                >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
            </form>
            </div>
        </div>

        {isEmpresa ? <FooterEmpresa /> : <FooterUsuario />}
        </div>
    );
}