import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaPen } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">Blogify</Link>
                <nav>
                    <ul>
                        <li>
                            <button onClick={toggleTheme} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-color)", fontSize: "1.2rem", marginRight: "10px" }}>
                                {theme === "light" ? <FaMoon /> : <FaSun />}
                            </button>
                        </li>
                        <li><Link to="/">Home</Link></li>
                        {user ? (
                            <>
                                <li><Link to="/write"><FaPen /> Write</Link></li>
                                <li><Link to="/profile"><FaUser /> {user.name}</Link></li>
                                {user.isAdmin && <li><Link to="/admin">Admin</Link></li>}
                                <li><button onClick={logout} className="btn-logout"><FaSignOutAlt /></button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
