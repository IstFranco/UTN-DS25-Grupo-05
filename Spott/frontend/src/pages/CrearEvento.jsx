import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { crearEventoSchema } from '../validations/eventoSchema';
import { useAuth } from '../contexts/AuthContext';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import ApiService from '../services/api';
import { getProvincias, getLocalidades } from '../api/localidad';
import '../app.css';

export default function CrearEvento() {
    const navigate = useNavigate();
    const { userId, isEmpresa } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [serverError, setServerError] = useState(null);

    // Estados para provincias y localidades
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [loadingProv, setLoadingProv] = useState(false);
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [errorLoc, setErrorLoc] = useState('');

    // Estados para archivos (fuera de RHF)
    const [portada, setPortada] = useState(null);
    const [imagenes, setImagenes] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        control
    } = useForm({
        resolver: yupResolver(crearEventoSchema),
        defaultValues: {
        nombre: '',
        descripcionLarga: '',
        ciudad: '',
        barrio: '',
        estilo: '',
        tematica: '',
        musica: '',
        fecha: '',
        horaInicio: '',
        precio: '',
        precioVip: '',
        edadMinima: '',
        entradasGenerales: '',
        entradasVIP: '',
        accesible: false,
        linkExterno: '',
        politicaCancelacion: '',
        hashtag: ''
        }
    });

    const ciudadSeleccionada = watch('ciudad');

    // Cargar provincias al montar
    useEffect(() => {
        (async () => {
        try {
            setLoadingProv(true);
            const data = await getProvincias();
            setProvincias(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingProv(false);
        }
        })();
    }, []);

    // Cargar localidades cuando cambia la ciudad
    useEffect(() => {
        setValue('barrio', '');
        setLocalidades([]);
        setErrorLoc('');

        if (!ciudadSeleccionada) return;

        (async () => {
        try {
            setLoadingLoc(true);
            const data = await getLocalidades(ciudadSeleccionada);
            setLocalidades(data);
        } catch (e) {
            console.error(e);
            setErrorLoc('No se pudieron cargar las localidades.');
        } finally {
            setLoadingLoc(false);
        }
        })();
    }, [ciudadSeleccionada, setValue]);

    const onSubmit = async (data) => {
        setCargando(true);
        setServerError(null);

        try {
        if (!userId) {
            setServerError('No se encontró información de la empresa. Inicia sesión nuevamente.');
            setCargando(false);
            return;
        }

        // Construir FormData
        const formData = new FormData();

        // Agregar campos del formulario
        Object.keys(data).forEach((key) => {
            if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
            }
        });

        // Agregar archivos
        if (portada) {
            formData.append('portada', portada);
        }
        imagenes.forEach((imagen) => {
            formData.append('imagenes', imagen);
        });

        // Mapear campos al formato del backend
        formData.append('provincia', data.ciudad);
        formData.append('localidad', data.barrio);
        formData.append('empresaId', userId);
        formData.append('cupoGeneral', data.entradasGenerales);
        formData.append('cupoVip', data.entradasVIP || 0);

        const response = await ApiService.crearEvento(formData);

        if (response.evento) {
            navigate('/empresa');
        }
        } catch (error) {
        console.error('Error al crear evento:', error);
        setServerError(error.message || 'Error al crear el evento');
        } finally {
        setCargando(false);
        }
    };

    return (
        <div className="inicio">
        <Header
            title="Spott"
            leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
            rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
        />

        {serverError && (
            <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '10px',
            margin: '10px',
            borderRadius: '5px'
            }}>
            {serverError}
            </div>
        )}

        <div className="form-box">
            <form className="crear-evento-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Crear nuevo evento</h2>

            {/* Nombre */}
            <label>Nombre del evento:</label>
            <input 
                type="text" 
                {...register('nombre')} 
                className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && (
                <span className="field-error">{errors.nombre.message}</span>
            )}

            {/* Descripción */}
            <label>Descripción detallada:</label>
            <textarea 
                {...register('descripcionLarga')}
                className={errors.descripcionLarga ? 'input-error' : ''}
            />
            {errors.descripcionLarga && (
                <span className="field-error">{errors.descripcionLarga.message}</span>
            )}

            {/* Edad Mínima */}
            <label>Edad mínima:</label>
            <input 
                type="number" 
                {...register('edadMinima')} 
                min="0"
                className={errors.edadMinima ? 'input-error' : ''}
            />
            {errors.edadMinima && (
                <span className="field-error">{errors.edadMinima.message}</span>
            )}

            {/* Portada */}
            <label>Imagen de portada:</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPortada(e.target.files[0] || null)}
            />

            {/* Galería */}
            <label>Galería de imágenes:</label>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImagenes(Array.from(e.target.files))}
            />

            {/* Fecha */}
            <label>Fecha:</label>
            <input 
                type="date" 
                {...register('fecha')}
                className={errors.fecha ? 'input-error' : ''}
            />
            {errors.fecha && (
                <span className="field-error">{errors.fecha.message}</span>
            )}

            {/* Hora */}
            <label>Hora de inicio:</label>
            <input type="time" {...register('horaInicio')} />

            {/* Ciudad (Provincia) */}
            <label>Ciudad:</label>
            <select
                {...register('ciudad')}
                disabled={loadingProv}
                className={errors.ciudad ? 'input-error' : ''}
            >
                <option value="">Seleccioná una provincia…</option>
                {provincias.map((p) => (
                <option key={p.nombre} value={p.nombre}>
                    {p.nombre}
                </option>
                ))}
            </select>
            {errors.ciudad && (
                <span className="field-error">{errors.ciudad.message}</span>
            )}

            {/* Barrio (Localidad) */}
            <label>Barrio/Zona:</label>
            <select
                {...register('barrio')}
                disabled={!ciudadSeleccionada || loadingLoc || !!errorLoc}
                className={errors.barrio ? 'input-error' : ''}
            >
                <option value="">
                {!ciudadSeleccionada
                    ? 'Elegí primero una provincia…'
                    : loadingLoc
                    ? 'Cargando localidades…'
                    : errorLoc
                    ? 'Error al cargar localidades'
                    : 'Seleccioná una localidad…'}
                </option>
                {!loadingLoc && !errorLoc && localidades.map((l) => (
                <option key={l.nombre} value={l.nombre}>
                    {l.nombre}
                </option>
                ))}
            </select>

            {/* Estilo */}
            <label>Estilo general:</label>
            <select {...register('estilo')}>
                <option value="">Seleccione un estilo...</option>
                <option>Casual</option>
                <option>Elegante</option>
                <option>Temático</option>
                <option>Glam</option>
                <option>Alternativo</option>
            </select>

            {/* Temática */}
            <label>Temática:</label>
            <input
                type="text"
                {...register('tematica')}
                placeholder="Ej: Neon party, Halloween, etc."
            />

            {/* Música */}
            <label>Género musical:</label>
            <select 
                {...register('musica')}
                className={errors.musica ? 'input-error' : ''}
            >
                <option value="">Seleccione un género...</option>
                <option value="electronic">Electrónica</option>
                <option value="reggaeton">Reggaetón</option>
                <option value="rock">Rock</option>
                <option value="indie">Indie</option>
                <option value="pop">Pop</option>
                <option value="trap">Trap</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="jazz">Jazz</option>
                <option value="funk">Funk</option>
                <option value="soul">Soul</option>
                <option value="latin">Música Latina</option>
                <option value="alternative">Alternativo</option>
                <option value="house">House</option>
                <option value="techno">Techno</option>
                <option value="r-n-b">R&B</option>
                <option value="country">Country</option>
                <option value="classical">Clásica</option>
            </select>
            {errors.musica && (
                <span className="field-error">{errors.musica.message}</span>
            )}

            {/* Precio General */}
            <label>Precio entrada general:</label>
            <input
                type="number"
                {...register('precio')}
                step="0.01"
                min="0"
                placeholder="Ingrese el precio..."
                className={errors.precio ? 'input-error' : ''}
            />
            {errors.precio && (
                <span className="field-error">{errors.precio.message}</span>
            )}

            {/* Cupo General */}
            <label>Cupo entradas generales:</label>
            <input
                type="number"
                {...register('entradasGenerales')}
                min="0"
                className={errors.entradasGenerales ? 'input-error' : ''}
            />
            {errors.entradasGenerales && (
                <span className="field-error">{errors.entradasGenerales.message}</span>
            )}

            {/* Precio VIP */}
            <label>Precio entrada VIP:</label>
            <input
                type="number"
                {...register('precioVip')}
                step="0.01"
                min="0"
                placeholder="Ingrese el precio..."
                className={errors.precioVip ? 'input-error' : ''}
            />
            {errors.precioVip && (
                <span className="field-error">{errors.precioVip.message}</span>
            )}

            {/* Cupo VIP */}
            <label>Cupo entradas VIP:</label>
            <input
                type="number"
                {...register('entradasVIP')}
                min="0"
                className={errors.entradasVIP ? 'input-error' : ''}
            />
            {errors.entradasVIP && (
                <span className="field-error">{errors.entradasVIP.message}</span>
            )}

            {/* Accesible */}
            <label>
                <input 
                type="checkbox" 
                {...register('accesible')} 
                />
                Evento accesible
            </label>

            {/* Link Externo */}
            <label>Enlace externo (tickets / más info):</label>
            <input
                type="url"
                {...register('linkExterno')}
                placeholder="https://..."
                className={errors.linkExterno ? 'input-error' : ''}
            />
            {errors.linkExterno && (
                <span className="field-error">{errors.linkExterno.message}</span>
            )}

            {/* Política de Cancelación */}
            <label>Política de cancelación:</label>
            <textarea
                {...register('politicaCancelacion')}
                placeholder="Describe las condiciones de cancelación..."
                className={errors.politicaCancelacion ? 'input-error' : ''}
            />
            {errors.politicaCancelacion && (
                <span className="field-error">{errors.politicaCancelacion.message}</span>
            )}

            {/* Hashtag */}
            <label>Etiqueta o hashtag del evento:</label>
            <input
                type="text"
                {...register('hashtag')}
                placeholder="#fiestaElectro2025"
                className={errors.hashtag ? 'input-error' : ''}
            />
            {errors.hashtag && (
                <span className="field-error">{errors.hashtag.message}</span>
            )}

            <button type="submit" disabled={cargando}>
                {cargando ? 'Creando evento...' : 'Crear evento'}
            </button>
            </form>
        </div>

        <FooterEmpresa />
        </div>
    );
}