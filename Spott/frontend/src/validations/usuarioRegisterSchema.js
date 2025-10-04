import * as yup from 'yup';

const ALLOWED_EMAIL_RE = /@(gmail\.com|hotmail\.com|outlook\.com)$/i;

export const usuarioRegisterSchema = yup.object().shape({
    nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .trim(),
    
    email: yup
    .string()
    .required('El email es obligatorio')
    .email('Email inválido')
    .matches(
        ALLOWED_EMAIL_RE,
        'Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com'
    )
    .lowercase(),
    
    password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(72, 'La contraseña no puede superar 72 caracteres'),
    
    confirmPassword: yup
    .string()
    .required('Debe confirmar la contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
    
    ciudad: yup.string().optional(),
    
    edad: yup
    .number()
    .transform((value, originalValue) => {
      // Si es string vacío o null, retorna undefined
        return originalValue === '' || originalValue === null ? undefined : value;
    })
    .nullable()
    .optional()
    .min(1, 'La edad debe ser al menos 1')
    .max(120, 'La edad debe estar entre 1 y 120 años')
    .integer('La edad debe ser un número entero')
});