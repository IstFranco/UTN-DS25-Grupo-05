import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup
    .string()
    .required('El email es obligatorio')
    .email('Debe ser un email válido'),
    password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(1, 'La contraseña no puede estar vacía')
});