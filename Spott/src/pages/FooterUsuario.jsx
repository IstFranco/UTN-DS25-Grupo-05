import React from 'react';
import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';
import '../app.css';

export default function FooterEmpresa() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <button className="footer-btn">
                <img src={explorarImg} className="footer-icon" alt="Explorar" />
                Explorar
            </button>
            <button className="footer-btn" onClick={() => navigate('/usuario')}>
                <img src={homeImg} className="footer-icon" alt="Inicio" />
                Inicio
            </button>
            <button className="footer-btn" onClick={() => navigate('/usuario/favoritos')}>
                <img src={favImg} className="footer-icon" alt="Crear Evento" />
                Favoritos
            </button>
        </footer>
    );
}