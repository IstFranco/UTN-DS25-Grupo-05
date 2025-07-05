import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import '../app.css';

export default function CrearEvento() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: '',
        fecha: '',
        ciudad: '',
        barrio: '',
        estilo: '',
        tematica: '',
        musica: '',
        propuesta: '',
        precio: '',
        cupo:''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del evento:', formulario);
        // Acá podrías mandar los datos al backend más adelante
    };

    return (
        <div className="inicio">
            {/* Header */}
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            {/*Formulario para crear evento*/}
            <div className='form-box'>
                <form className="crear-evento-form" onSubmit={handleSubmit}>
                    <h2>Crear nuevo evento</h2>

                    <label>Nombre del evento:</label>
                    <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} required />

                    <label>Fecha:</label>
                    <input type="date" name="fecha" value={formulario.fecha} onChange={handleChange} required />

                    <label>Ciudad:</label>
                    <select name="ciudad" value={formulario.ciudad} onChange={handleChange}>
                        <option value="">Seleccione una ciudad...</option>
                        <option>Buenos Aires</option>
                        <option>Córdoba</option>
                        <option>Rosario</option>
                        <option>Mendoza</option>
                    </select>

                    <label>Barrio/Zona:</label>
                    <select name="barrio" value={formulario.barrio} onChange={handleChange}>
                        <option value="">Seleccione un barrio...</option>
                        <option>Palermo</option>
                        <option>San Telmo</option>
                        <option>Nueva Córdoba</option>
                        <option>Centro</option>
                    </select>

                    <label>Estilo general:</label>
                    <select name="estilo" value={formulario.estilo} onChange={handleChange}>
                        <option value="">Seleccione un estilo...</option>
                        <option>Casual</option>
                        <option>Elegante</option>
                        <option>Temático</option>
                        <option>Glam</option>
                        <option>Alternativo</option>
                    </select>

                    <label>Temática:</label>
                    <select name="tematica" value={formulario.tematica} onChange={handleChange}>
                        <option value="">Seleccione una tematica...</option>
                        <option>Neon party</option>
                        <option>Halloween</option>
                        <option>Años 80 / 90 / 2000</option>
                        <option>White party</option>
                        <option>Carnaval</option>
                        <option>Cosplay / Anime</option>
                        <option>Interior</option>
                        <option>Exterior</option>
                        <option>Luces / Proyecciones</option>
                        <option>Inmersiva / Artística</option>
                    </select>

                    <label>Género musical:</label>
                    <select name="musica" value={formulario.musica} onChange={handleChange}>
                        <option value="">Seleccione un genero...</option>
                        <option>Electrónica</option>
                        <option>Reggaetón</option>
                        <option>Rock / Indie</option>
                        <option>Pop</option>
                        <option>Trap / Hip hop</option>
                        <option>Jazz / Funk / Soul</option>
                        <option>Música en vivo</option>
                    </select>

                    <label>Tipo de propuesta:</label>
                    <select name="propuesta" value={formulario.propuesta} onChange={handleChange}>
                        <option value="">Seleccione el tipo de propuesta...</option>
                        <option>DJ en vivo</option>
                        <option>Bandas en vivo</option>
                        <option>Karaoke</option>
                        <option>Chill</option>
                        <option>Open mic</option>
                    </select>

                    <label>Precio estimado:</label>
                    <input
                        type="number"
                        name="precio"
                        value={formulario.precio}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="ingrese el precio..."
                    />

                    <label>Cupo total de entradas:</label>
                    <input type="number" name="cupo" value={formulario.cupo} onChange={handleChange} min="1" placeholder="Ingrese la cantidad maxima de personas..." required />

                    <button type="submit">Crear evento</button>
                </form>
            </div>

            {/* Footer Inferior */}
            <FooterEmpresa />
        </div>
    );
}