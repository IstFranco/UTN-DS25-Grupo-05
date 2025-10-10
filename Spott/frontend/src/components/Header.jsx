import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title = '', leftButton = null, rightButton = null, className = '' }) {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const renderButton = (btn) => {
        if (!btn) return <div className="w-10"></div>;
        const { type = 'text', content, onClick, to } = btn;
        
        const handleClick = () => {
            if (onClick) onClick();
            else if (to) navigate(to);
        };

        return (
            <button 
                onClick={handleClick} 
                className="text-white hover:text-purple-300 transition-colors duration-200"
            >
                {type === 'image' ? (
                    <img 
                        src={content} 
                        alt="icono" 
                        className={`transition-all duration-300 rounded-full object-cover border-2 border-purple-600/50 ${
                            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                        }`} 
                    />
                ) : (
                    <span className="font-medium">{content}</span>
                )}
            </button>
        );
    };

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-purple-700/20 transition-all duration-300 ${
                isScrolled ? 'py-3' : 'py-5'
            } ${className}`}
        >
            <div className="w-full px-3 flex items-center justify-between">
                <div className="flex-shrink-0">
                    {renderButton(leftButton)}
                </div>
                <h1 className={`text-white font-bold transition-all duration-300 ${
                    isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                    {title}
                </h1>
                <div className="flex-shrink-0">
                    {renderButton(rightButton)}
                </div>
            </div>
        </header>
    );
}