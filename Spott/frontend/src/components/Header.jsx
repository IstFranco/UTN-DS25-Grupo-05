import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export default function Header({ title = '', leftButton = null, rightButton = null, className = '' }) {
    const navigate = useNavigate();

    const renderButton = (btn) => {
        if (!btn) return <div className="header-placeholder-btn"></div>;

        const { type = 'text', content, onClick, to } = btn;

        const handleClick = () => {
            if (onClick) onClick();
            else if (to) navigate(to);
        };

        return (
            <button onClick={handleClick} className="header-btn">
                {type === 'image' ? (
                    <img src={content} alt="icono" className="header-icon" />
                ) : (
                    <span className="header-text-btn">{content}</span>
                )}
            </button>
        );
    };

    return (
        <header className={`header ${className}`}>
            {renderButton(leftButton)}
            <h1>{title}</h1>
            {renderButton(rightButton)}
        </header>
    );
}