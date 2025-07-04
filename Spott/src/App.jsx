import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsuarioInicio from './components/UsuarioInicio';
import UsuarioPerfil from './components/UsuarioPerfil';
import UsuarioFavoritos from './components/UsuarioFavoritos';
import UsuarioNotificaciones from './components/UsuarioNotificaciones';
import UsuarioAyuda from './components/UsuarioAyuda';
import EmpresaInicio from './components/EmpresaInicio';
import EmpresaPerfil from './components/EmpresaPerfil';
import EmpresaNotificaciones from './components/EmpresaNotificaciones';
import CrearEvento from './components/CrearEvento';
import SelectorDeRol from './components/SelectorDeRol';

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

        {/* Empresa */}
        <Route path="/empresa" element={<EmpresaInicio />} />
        <Route path="/empresa/perfil" element={<EmpresaPerfil />} />
        <Route path="/empresa/crearevento" element={<CrearEvento />} />
        <Route path="/empresa/notificaciones" element={<EmpresaNotificaciones />} />

        {/* Selector inicial */}
        <Route path="/" element={<SelectorDeRol />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;