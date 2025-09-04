import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import ApiService from '../services/api';
import '../app.css';

export default function CrearEvento() {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const [formulario, setFormulario] = useState({
        nombre: '',
        portada: null,
        imagenes: [],
        fecha: '',
        horaInicio: '',
        ciudad: '',
        barrio: '',
        estilo: '',
        tematica: '',
        musica: '',
        precio: '',
        cupo: '',
        descripcionLarga: '',
        edadMinima: '',
        entradasGenerales: '',
        entradasVIP: '',
        accesible: false,
        linkExterno: '',
        politicaCancelacion: '',
        hashtag: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        try {
            // Obtener y validar empresaId PRIMERO
            const empresaData = JSON.parse(localStorage.getItem('empresa') || '{}');
            const empresaId = empresaData.id;

            if (!empresaId) {
                setError('No se encontró información de la empresa. Inicia sesión nuevamente.');
                setCargando(false);
                return;
            }

            // Crear FormData para enviar archivos
            const formData = new FormData();
            
            // Agregar todos los campos del formulario
            Object.keys(formulario).forEach(key => {
                if (key === 'portada' && formulario.portada) {
                    formData.append('portada', formulario.portada);
                } else if (key === 'imagenes' && formulario.imagenes.length > 0) {
                    formulario.imagenes.forEach(imagen => {
                        formData.append('imagenes', imagen);
                    });
                } else if (key !== 'portada' && key !== 'imagenes') {
                    formData.append(key, formulario[key]);
                }
            });

            // Agregar empresaId
            formData.append('empresaId', empresaId);

            // Mapear campos del frontend al backend
            if (formulario.entradasGenerales) {
                formData.append('cupoGeneral', formulario.entradasGenerales);
            }
            if (formulario.entradasVIP) {
                formData.append('cupoVip', formulario.entradasVIP);
            }

            const response = await ApiService.crearEvento(formData);

            if (response.evento) {
                // Opcional: Mantener también en localStorage para transición
                const eventosGuardados = JSON.parse(localStorage.getItem('misEventos')) || [];
                eventosGuardados.push(response.evento);
                localStorage.setItem('misEventos', JSON.stringify(eventosGuardados));

                // Redirigir a la vista de empresa
                navigate('/empresa');
            }
        } catch (error) {
            console.error('Error al crear evento:', error);
            setError(error.message || 'Error al crear el evento');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="inicio">
            {/* Header */}
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            {/* Mostrar errores */}
            {error && (
                <div style={{ 
                    backgroundColor: '#ff4444', 
                    color: 'white', 
                    padding: '10px', 
                    margin: '10px', 
                    borderRadius: '5px' 
                }}>
                    {error}
                </div>
            )}

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
                    <input type="time" name="horaInicio" value={formulario.horaInicio} onChange={handleChange} />

                    <label>Ciudad:</label>
                    <select name="ciudad" value={formulario.ciudad} onChange={handleChange} required>
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
                    <input type="text" name="tematica" value={formulario.tematica} onChange={handleChange} placeholder="Ej: Neon party, Halloween, etc." />

                    <label>Género musical:</label>
                    <select name="musica" value={formulario.musica} onChange={handleChange} required>
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
                        placeholder="Ingrese el precio..."
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
                    <input type="url" name="linkExterno" value={formulario.linkExterno} onChange={handleChange} placeholder="https://..." />

                    <label>Política de cancelación:</label>
                    <textarea name="politicaCancelacion" value={formulario.politicaCancelacion} onChange={handleChange} placeholder="Describe las condiciones de cancelación..." />

                    <label>Etiqueta o hashtag del evento:</label>
                    <input type="text" name="hashtag" value={formulario.hashtag} onChange={handleChange} placeholder="#fiestaElectro2025" />

                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Creando evento...' : 'Crear evento'}
                    </button>
                </form>
            </div>

            {/* Footer Inferior */}
            <FooterEmpresa />
        </div>
    );
}