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
        portada: null,
        imagenes: [],
        fecha: '',
        ciudad: '',
        barrio: '',
        estilo: '',
        tematica: '',
        musica: '',
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

    const nuevoEvento = {
        imageSrc: formulario.portada ? URL.createObjectURL(formulario.portada) : '',
        title: formulario.nombre,
        description: `Temática: ${formulario.tematica}, Música: ${formulario.musica}`,
        rating: (4 + Math.random()).toFixed(1) // Valor ficticio
    };

    // Guardar en localStorage
    const eventosGuardados = JSON.parse(localStorage.getItem('misEventos')) || [];
    eventosGuardados.push(nuevoEvento);
    localStorage.setItem('misEventos', JSON.stringify(eventosGuardados));

    // Redirigir a la vista de inicio
    navigate('/empresa');
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

                    <label>Descripción detallada:</label>
                    <textarea name="descripcionLarga" value={formulario.descripcionLarga} onChange={handleChange} />

                    <label>Edad mínima:</label>
                    <input type="number" name="edadMinima" value={formulario.edadMinima} onChange={handleChange} min="0" />

                    <label>Imagen de portada:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setFormulario((prev) => ({
                                ...prev,
                                portada: e.target.files[0] || null
                            }))
                        }
                    />

                    <label>Galería de imágenes:</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                            setFormulario((prev) => ({
                                ...prev,
                                imagenes: Array.from(e.target.files)
                            }))
                        }
                    />

                    <label>Fecha:</label>
                    <input type="date" name="fecha" value={formulario.fecha} onChange={handleChange} required />

                    <label>Hora de inicio:</label>
                    <input type=   "time" name="horaInicio" value={formulario.horaInicio} onChange={handleChange} />

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

                    <label>Cupo entradas generales:</label>
                    <input type="number" name="entradasGenerales" value={formulario.entradasGenerales} onChange={handleChange} min="0" />

                    <label>Cupo entradas VIP:</label>
                    <input type="number" name="entradasVIP" value={formulario.entradasVIP} onChange={handleChange} min="0" />

                    <label>
                    <input type="checkbox" name="accesible" checked={formulario.accesible} onChange={handleChange} />
                    Evento accesible
                    </label>
            
                    <label>Enlace externo (tickets / más info):</label>
                    <input type="url" name="linkExterno" value={formulario.linkExterno} onChange={handleChange} />

                    <label>Política de cancelación:</label>
                    <textarea name="politicaCancelacion" value={formulario.politicaCancelacion} onChange={handleChange} />

                    <label>Etiqueta o hashtag del evento:</label>
                    <input type="text" name="hashtag" value={formulario.hashtag} onChange={handleChange} placeholder="#fiestaElectro2025" />

                    <button type="submit">Crear evento</button>
                </form>
            </div>

            {/* Footer Inferior */}
            <FooterEmpresa />
        </div>
    );
}