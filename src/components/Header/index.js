import { useContext, useState } from "react";
import './header.css';
import { AuthContext } from '../../contexts/auth';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

export default function Header() {
    const { logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla o estado do menu hamburguer

    async function handlerLogout() {
        await logout();
    }

    // Alterna o estado do menu hamburguer
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <Link to="/">
                        <img src={Logo} alt="Logo" className="logo" />
                    </Link>
                </div>

                {/* Menu hamburguer */}
                <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/home" onClick={toggleMenu}>Início</Link>
                        </li>
                        <li>
                            <Link to="/credflex" onClick={toggleMenu}>Credflex</Link>
                        </li>
                        <li>
                            <Link to="/frequencia" onClick={toggleMenu}>Frequência</Link>
                        </li>

                        <li>
                            <Link to="/frequencia" onClick={toggleMenu}>WebCam</Link>
                        </li>

                        <li>
                            <Link to="/profile" onClick={toggleMenu}>Perfil</Link>
                        </li>
                    </ul>
                </nav>

                <button className="logout-button" onClick={handlerLogout}>
                    Sair
                </button>
            </div>
        </header>
    );
}
