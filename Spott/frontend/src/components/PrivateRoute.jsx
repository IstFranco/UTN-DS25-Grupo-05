import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rutas
 * @param {React.ReactNode} children 
 * @param {string} requiredType 
 */
export function PrivateRoute({ children, requiredType = null }) {
    const { isAuthenticated, userType, loading } = useAuth();

    // Mientras carga, mostrar spinner o placeholder
    if (loading) {
        return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.2rem'
        }}>
            Verificando autenticación...
        </div>
        );
    }

    // No autenticado → redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Autenticado pero tipo incorrecto → redirigir
    if (requiredType && userType !== requiredType) {
        // Si es empresa intentando acceder a ruta de usuario, enviarlo a su panel
        // Si es usuario intentando acceder a ruta de empresa, enviarlo a su panel
        const redirectTo = userType === 'empresa' ? '/empresa' : '/usuario';
        return <Navigate to={redirectTo} replace />;
    }

    // Todo OK, renderizar el componente
    return children;
}