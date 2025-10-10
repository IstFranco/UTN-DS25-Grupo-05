import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { crearEventoSchema } from '../validations/eventoSchema';
import { useAuth } from '../contexts/AuthContext';
import perfilImg from '../img/LogoPerfil.jpeg';
import notiImg from '../img/LogoNotificaciones.jpeg';
import Header from '../components/Header';
import FooterEmpresa from '../components/FooterEmpresa';
import ApiService from '../services/api';
import { getProvincias, getLocalidades } from '../api/localidad';

export default function CrearEvento() {
    const navigate = useNavigate();
    const { userId, isEmpresa } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [serverError, setServerError] = useState(null);

    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [loadingProv, setLoadingProv] = useState(false);
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [errorLoc, setErrorLoc] = useState('');

    const [portada, setPortada] = useState(null);
    const [imagenes, setImagenes] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
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

            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });

            if (portada) {
                formData.append('portada', portada);
            }
            imagenes.forEach((imagen) => {
                formData.append('imagenes', imagen);
            });

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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 pt-20">
            <Header
                title="Spott"
                leftButton={{ type: 'image', content: perfilImg, to: '/empresa/perfil' }}
                rightButton={{ type: 'image', content: notiImg, to: '/empresa/notificaciones' }}
            />

            {serverError && (
                <div className="mx-4 mt-4 bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-center text-sm">
                    {serverError}
                </div>
            )}

            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="bg-purple-900/30 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-purple-700/20">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Crear nuevo evento
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Nombre del evento:
                            </label>
                            <input
                                type="text"
                                {...register('nombre')}
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                    errors.nombre
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.nombre && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.nombre.message}
                                </span>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Descripción detallada:
                            </label>
                            <textarea
                                {...register('descripcionLarga')}
                                rows="4"
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition resize-none ${
                                    errors.descripcionLarga
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.descripcionLarga && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.descripcionLarga.message}
                                </span>
                            )}
                        </div>

                        {/* Edad Mínima */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Edad mínima:
                            </label>
                            <input
                                type="number"
                                {...register('edadMinima')}
                                min="0"
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                    errors.edadMinima
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.edadMinima && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.edadMinima.message}
                                </span>
                            )}
                        </div>

                        {/* Portada */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Imagen de portada:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPortada(e.target.files[0] || null)}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-purple-700/50 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-700 file:text-white hover:file:bg-purple-600 transition"
                            />
                        </div>

                        {/* Galería */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Galería de imágenes:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setImagenes(Array.from(e.target.files))}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-purple-700/50 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-700 file:text-white hover:file:bg-purple-600 transition"
                            />
                        </div>

                        {/* Fecha y Hora en una fila */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Fecha:
                                </label>
                                <input
                                    type="date"
                                    {...register('fecha')}
                                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white focus:outline-none focus:ring-2 transition ${
                                        errors.fecha
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-purple-700/50 focus:ring-purple-600'
                                    }`}
                                />
                                {errors.fecha && (
                                    <span className="text-red-400 text-sm block mt-1">
                                        {errors.fecha.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Hora de inicio:
                                </label>
                                <input
                                    type="time"
                                    {...register('horaInicio')}
                                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                                />
                            </div>
                        </div>

                        {/* Ciudad */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Ciudad:
                            </label>
                            <select
                                {...register('ciudad')}
                                disabled={loadingProv}
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white focus:outline-none focus:ring-2 transition ${
                                    errors.ciudad
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            >
                                <option value="">Seleccioná una provincia…</option>
                                {provincias.map((p) => (
                                    <option key={p.nombre} value={p.nombre}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.ciudad && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.ciudad.message}
                                </span>
                            )}
                        </div>

                        {/* Barrio */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Barrio/Zona:
                            </label>
                            <select
                                {...register('barrio')}
                                disabled={!ciudadSeleccionada || loadingLoc || !!errorLoc}
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white focus:outline-none focus:ring-2 transition ${
                                    errors.barrio
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
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
                        </div>

                        {/* Estilo */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Estilo general:
                            </label>
                            <select
                                {...register('estilo')}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                            >
                                <option value="">Seleccione un estilo...</option>
                                <option>Casual</option>
                                <option>Elegante</option>
                                <option>Temático</option>
                                <option>Glam</option>
                                <option>Alternativo</option>
                            </select>
                        </div>

                        {/* Temática */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Temática:
                            </label>
                            <input
                                type="text"
                                {...register('tematica')}
                                placeholder="Ej: Neon party, Halloween, etc."
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-purple-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                            />
                        </div>

                        {/* Música */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Género musical:
                            </label>
                            <select
                                {...register('musica')}
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white focus:outline-none focus:ring-2 transition ${
                                    errors.musica
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
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
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.musica.message}
                                </span>
                            )}
                        </div>

                        {/* Precios en una fila */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Precio entrada general:
                                </label>
                                <input
                                    type="number"
                                    {...register('precio')}
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                        errors.precio
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-purple-700/50 focus:ring-purple-600'
                                    }`}
                                />
                                {errors.precio && (
                                    <span className="text-red-400 text-sm block mt-1">
                                        {errors.precio.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Precio entrada VIP:
                                </label>
                                <input
                                    type="number"
                                    {...register('precioVip')}
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                        errors.precioVip
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-purple-700/50 focus:ring-purple-600'
                                    }`}
                                />
                                {errors.precioVip && (
                                    <span className="text-red-400 text-sm block mt-1">
                                        {errors.precioVip.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Cupos en una fila */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Cupo entradas generales:
                                </label>
                                <input
                                    type="number"
                                    {...register('entradasGenerales')}
                                    min="0"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                        errors.entradasGenerales
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-purple-700/50 focus:ring-purple-600'
                                    }`}
                                />
                                {errors.entradasGenerales && (
                                    <span className="text-red-400 text-sm block mt-1">
                                        {errors.entradasGenerales.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-1">
                                    Cupo entradas VIP:
                                </label>
                                <input
                                    type="number"
                                    {...register('entradasVIP')}
                                    min="0"
                                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                        errors.entradasVIP
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-purple-700/50 focus:ring-purple-600'
                                    }`}
                                />
                                {errors.entradasVIP && (
                                    <span className="text-red-400 text-sm block mt-1">
                                        {errors.entradasVIP.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Accesible */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('accesible')}
                                className="w-4 h-4 accent-purple-600"
                            />
                            <label className="text-slate-300 text-sm font-medium">
                                Evento accesible
                            </label>
                        </div>

                        {/* Link Externo */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Enlace externo (tickets / más info):
                            </label>
                            <input
                                type="url"
                                {...register('linkExterno')}
                                placeholder="https://..."
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                    errors.linkExterno
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.linkExterno && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.linkExterno.message}
                                </span>
                            )}
                        </div>

                        {/* Política de Cancelación */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Política de cancelación:
                            </label>
                            <textarea
                                {...register('politicaCancelacion')}
                                placeholder="Describe las condiciones de cancelación..."
                                rows="3"
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition resize-none ${
                                    errors.politicaCancelacion
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.politicaCancelacion && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.politicaCancelacion.message}
                                </span>
                            )}
                        </div>

                        {/* Hashtag */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">
                                Etiqueta o hashtag del evento:
                            </label>
                            <input
                                type="text"
                                {...register('hashtag')}
                                placeholder="#fiestaElectro2025"
                                className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                                    errors.hashtag
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-purple-700/50 focus:ring-purple-600'
                                }`}
                            />
                            {errors.hashtag && (
                                <span className="text-red-400 text-sm block mt-1">
                                    {errors.hashtag.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
                        >
                            {cargando ? 'Creando evento...' : 'Crear evento'}
                        </button>
                    </form>
                </div>
            </div>

            <FooterEmpresa />
        </div>
    );
}