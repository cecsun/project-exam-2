import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Nav() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        if (location.pathname.includes('profile')) {
            navigate('/');
        }
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            {user?.userType === 'venueManager' && (
                                <Link to="/profile">Venue Manager Profile</Link>
                            )}
                            {user?.userType === 'customer' && (
                                <Link to="/profile">Customer Profile</Link>
                            )}
                        </li>
                        <li>
                            <button onClick={handleLogout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;
