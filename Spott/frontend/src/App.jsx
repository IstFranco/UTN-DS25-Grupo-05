import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Páginas
import UsuarioInicio from './pages/UsuarioInicio';
import UsuarioPerfil from './pages/UsuarioPerfil';
import UsuarioFavoritos from './pages/UsuarioFavoritos';
import UsuarioNotificaciones from './pages/UsuarioNotificaciones';
import UsuarioAyuda from './pages/UsuarioAyuda';
import EmpresaInicio from './pages/EmpresaInicio';
import EmpresaPerfil from './pages/EmpresaPerfil';
import EmpresaNotificaciones from './pages/EmpresaNotificaciones';
import EmpresaAyuda from './pages/EmpresaAyuda';
import CrearEvento from './pages/CrearEvento';
import MostrarEvento from './pages/MostrarEvento';
import IniciarSesion from './pages/IniciarSesion';
import EventoInscripto from './pages/EventoInscripto';
import EditarEvento from './pages/EditarEvento';
import MisEventos from './pages/MisEventos';
import Registro from './pages/Registro';
import Contacto from './pages/Contacto';
import EmpresaVerEvento from './pages/EmpresaVerEvento';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== RUTAS PÚBLICAS ===== */}
          <Route path="/" element={<IniciarSesion />} />
          <Route path="/registro" element={<Registro />} />

          {/* ===== RUTAS PROTEGIDAS - USUARIO ===== */}
          <Route 
            path="/usuario" 
            element={
              <PrivateRoute requiredType="usuario">
                <UsuarioInicio />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuario/perfil" 
            element={
              <PrivateRoute requiredType="usuario">
                <UsuarioPerfil />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuario/favoritos" 
            element={
              <PrivateRoute requiredType="usuario">
                <UsuarioFavoritos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuario/notificaciones" 
            element={
              <PrivateRoute requiredType="usuario">
                <UsuarioNotificaciones />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuario/ayuda" 
            element={
              <PrivateRoute requiredType="usuario">
                <UsuarioAyuda />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/usuario/mis-eventos" 
            element={
              <PrivateRoute requiredType="usuario">
                <MisEventos rol="usuario" />
              </PrivateRoute>
            } 
          />

          {/* ===== RUTAS PROTEGIDAS - EMPRESA ===== */}
          <Route 
            path="/empresa" 
            element={
              <PrivateRoute requiredType="empresa">
                <EmpresaInicio />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/perfil" 
            element={
              <PrivateRoute requiredType="empresa">
                <EmpresaPerfil />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/crearevento" 
            element={
              <PrivateRoute requiredType="empresa">
                <CrearEvento />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/notificaciones" 
            element={
              <PrivateRoute requiredType="empresa">
                <EmpresaNotificaciones />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/mis-eventos" 
            element={
              <PrivateRoute requiredType="empresa">
                <MisEventos rol="empresa" />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/editar-evento" 
            element={
              <PrivateRoute requiredType="empresa">
                <EditarEvento />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/empresa/ayuda" 
            element={
              <PrivateRoute requiredType="empresa">
                <EmpresaAyuda />
              </PrivateRoute>
            }
          />
          <Route 
            path="/empresa/ver-evento" 
            element={
              <PrivateRoute requiredType="empresa">
                <EmpresaVerEvento />
              </PrivateRoute>
            }
          />

          {/* ===== RUTAS PROTEGIDAS - AMBOS ===== */}
          <Route 
            path="/contacto" 
            element={
              <PrivateRoute>
                <Contacto />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/evento" 
            element={
              <PrivateRoute>
                <MostrarEvento />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/evento-inscripto" 
            element={
              <PrivateRoute requiredType="usuario">
                <EventoInscripto />
              </PrivateRoute>
            } 
          />

          {/* ===== 404 ===== */}
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;