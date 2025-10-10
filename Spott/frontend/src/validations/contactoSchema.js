import * as yup from 'yup';

export const contactoSchema = yup.object().shape({
    nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
    
    email: yup
    .string()
    .required('El email es obligatorio')
    .email('Debe ser un email válido'),
    
    mensaje: yup
    .string()
    .required('El mensaje es obligatorio')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
});