import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsuarioInicio from './pages/UsuarioInicio';
import UsuarioPerfil from './pages/UsuarioPerfil';
import UsuarioFavoritos from './pages/UsuarioFavoritos';
import UsuarioNotificaciones from './pages/UsuarioNotificaciones';
import UsuarioAyuda from './pages/UsuarioAyuda';
import EmpresaInicio from './pages/EmpresaInicio';
import EmpresaPerfil from './pages/EmpresaPerfil';
import EmpresaNotificaciones from './pages/EmpresaNotificaciones';
import CrearEvento from './pages/CrearEvento';
import SelectorDeRol from './components/SelectorDeRol';
import MostrarEvento from './pages/MostrarEvento';
import IniciarSesion from './pages/IniciarSesion';
import EventoInscripto from './pages/EventoInscripto';
import EditarEvento from './pages/EditarEvento';
import MisEventos from './pages/MisEventos';
import Registro from './pages/Registro';   // ✅ importamos Registro


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Usuario */}
        <Route path="/usuario" element={<UsuarioInicio />} />
        <Route path="/usuario/perfil" element={<UsuarioPerfil />} />
        <Route path="/usuario/favoritos" element={<UsuarioFavoritos />} />
        <Route path="/usuario/notificaciones" element={<UsuarioNotificaciones />} />
        <Route path="/usuario/ayuda" element={<UsuarioAyuda />} />
        <Route path="/evento" element={<MostrarEvento />} />
        <Route path="/evento-inscripto" element={<EventoInscripto />} />
        <Route path="/usuario/mis-eventos" element={<MisEventos rol="usuario"/>} />

        {/* Empresa */}
        <Route path="/empresa" element={<EmpresaInicio />} />
        <Route path="/empresa/perfil" element={<EmpresaPerfil />} />
        <Route path="/empresa/crearevento" element={<CrearEvento />} />
        <Route path="/empresa/notificaciones" element={<EmpresaNotificaciones />} />
        <Route path="/empresa/mis-eventos" element={<MisEventos rol="empresa"/>} />
        <Route path="/empresa/editar-evento" element={<EditarEvento />} />

        {/* Selector inicial */}
        <Route path="/" element={<SelectorDeRol />} />
        <Route path="/iniciar-sesion/:rol" element={<IniciarSesion />} />

        {/* Nuevo: Registro */}
        <Route path="/registro/:rol" element={<Registro />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
