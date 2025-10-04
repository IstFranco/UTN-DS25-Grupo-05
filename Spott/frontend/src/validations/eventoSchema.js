import * as yup from 'yup';

export const crearEventoSchema = yup.object().shape({
    nombre: yup
    .string()
    .required('El nombre del evento es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
    
    descripcionLarga: yup
    .string()
    .nullable()
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),
    
    ciudad: yup
    .string()
    .required('La ciudad es requerida')
    .min(2, 'La ciudad debe tener al menos 2 caracteres'),
    
    barrio: yup.string().nullable().optional(),
    
    tematica: yup.string().nullable().optional(),
    
    musica: yup
    .string()
    .required('El género musical es requerido')
    .min(2, 'El género musical es requerido'),
    
    fecha: yup
    .string()  // Cambiado de .date() a .string()
    .required('La fecha es obligatoria')
    .test('is-valid-date', 'Debe ser una fecha válida', function(value) {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
    })
    .test('not-in-past', 'La fecha no puede ser en el pasado', function(value) {
        if (!value) return true;
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
    }),
    
    horaInicio: yup.string().nullable().optional(),
    
    precio: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
    })
    .min(0, 'El precio no puede ser negativo'),
    
    precioVip: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
    })
    .min(0, 'El precio VIP no puede ser negativo'),
    
    entradasGenerales: yup
    .number()
    .transform((value, originalValue) => {
        return originalValue === '' ? 0 : value;
    })
    .min(1, 'Debe especificar al menos una entrada general')
    .integer('Las entradas deben ser un número entero')
    .required('El cupo general es obligatorio'),
    
    entradasVIP: yup
    .number()
    .transform((value, originalValue) => {
        return originalValue === '' ? 0 : value;
    })
    .min(0, 'El cupo VIP no puede ser negativo')
    .integer('Las entradas deben ser un número entero'),
    
    edadMinima: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
    })
    .min(0, 'La edad mínima no puede ser negativa')
    .max(100, 'La edad mínima debe estar entre 0 y 100'),
    
    estilo: yup.string().nullable().optional(),
    
    accesible: yup.boolean().default(false),
    
    linkExterno: yup
    .string()
    .nullable()
    .optional()
    .test('is-url-or-empty', 'Debe ser una URL válida', function(value) {
    if (!value || value === '') return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
    }
    }),
    
    politicaCancelacion: yup
    .string()
    .nullable()
    .max(500, 'La política no puede exceder 500 caracteres'),
    
    hashtag: yup
    .string()
    .nullable()
    .max(50, 'El hashtag no puede exceder 50 caracteres')
}).test(
    'vip-price-required',
    'Si hay cupo VIP, debe especificar un precio VIP válido',
    function(values) {
        const { entradasVIP, precioVip } = values;
        if (entradasVIP && entradasVIP > 0) {
        if (!precioVip || precioVip <= 0) {
            return this.createError({
            path: 'precioVip',
            message: 'Si hay cupo VIP, debe especificar un precio VIP válido'
            });
        }
        }
        return true;
    }
);