// src/data/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// 1. Obtenemos las variables de entorno que configuraste en Render
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// 2. Verificamos que existan
if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL o SUPABASE_SERVICE_KEY no están definidas.');
    throw new Error('Variables de entorno de Supabase no encontradas.');
}

// 3. Creamos y exportamos el cliente de Supabase
// Usamos la 'service_role' key para tener permisos de administrador
// y poder subir archivos sin problemas.
export const supabase = createClient(supabaseUrl, supabaseKey);