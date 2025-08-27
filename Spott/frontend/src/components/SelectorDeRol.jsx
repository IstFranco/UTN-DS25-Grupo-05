import { useNavigate } from 'react-router-dom';
import '../app.css'; 

export default function SelectorDeRol() {
    const navigate = useNavigate();

    return (
        <div className="selector-container">
            <h1 className="selector-title">Bienvenido a Spott✨</h1>
            <p className="selector-subtitle">Seleccioná tu rol para continuar</p>

            <div className="selector-buttons">
                <button className="selector-btn usuario" onClick={() => navigate('/iniciar-sesion/usuario')}>
                    Entrar como Usuario
                </button>
                <button className="selector-btn empresa" onClick={() => navigate('/iniciar-sesion/empresa')}>
                    Entrar como Empresa
                </button>
            </div>
        </div>
    );
}