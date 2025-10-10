import React from 'react';
import { useNavigate } from 'react-router-dom';
import explorarImg from '../img/LogoExplorar.jpeg';
import homeImg from '../img/HomeLogo.jpeg';
import favImg from '../img/LogoFav.jpeg';

export default function FooterUsuario() {
    const navigate = useNavigate();
    
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-purple-700/20">
            <div className="flex items-center justify-around py-3 px-4">
                <button 
                    className="flex flex-col items-center gap-1 text-slate-300 hover:text-purple-400 transition-colors"
                    onClick={() => navigate('/usuario/mis-eventos')}
                >
                    <img 
                        src={explorarImg} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-600/50" 
                        alt="Explorar" 
                    />
                    <span className="text-xs font-medium">Mis Eventos</span>
                </button>
                
                <button 
                    className="flex flex-col items-center gap-1 text-slate-300 hover:text-purple-400 transition-colors"
                    onClick={() => navigate('/usuario')}
                >
                    <img 
                        src={homeImg} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-600/50" 
                        alt="Inicio" 
                    />
                    <span className="text-xs font-medium">Inicio</span>
                </button>
                
                <button 
                    className="flex flex-col items-center gap-1 text-slate-300 hover:text-purple-400 transition-colors"
                    onClick={() => navigate('/usuario/favoritos')}
                >
                    <img 
                        src={favImg} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-600/50" 
                        alt="Favoritos" 
                    />
                    <span className="text-xs font-medium">Favoritos</span>
                </button>
            </div>
        </footer>
    );
}