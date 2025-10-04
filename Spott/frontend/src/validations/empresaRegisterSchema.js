import * as yup from 'yup';

const ALLOWED_EMAIL_RE = /@(gmail\.com|hotmail\.com|outlook\.com)$/i;

export const empresaRegisterSchema = yup.object().shape({
    nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(1, 'El nombre no puede estar vacío'),
    
    email: yup
    .string()
    .required('El email es obligatorio')
    .email('Email inválido')
    .matches(
        ALLOWED_EMAIL_RE,
        'Solo se permiten correos @gmail.com, @hotmail.com o @outlook.com'
        ),
    
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
    
    descripcion: yup.string().optional(),
    
    telefono: yup.string().optional(),
    
    sitioWeb: yup
    .string()
    .optional()
    .nullable()
    .test('is-url-or-empty', 'Debe ser una URL válida', function(value) {
    if (!value || value === '') return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
    }
    })
});