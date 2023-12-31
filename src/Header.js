import { NavLink } from 'react-router-dom';
import './Header.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Header() {
    const [showNavbar, setShowNavbar] = useState(false);

    const handleShowNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        };
    }, []);

    let navigate = useNavigate();

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate(`/`);
                window.history.replaceState(null, null, '/');
                console.log("sign out successfull");
                Swal.fire({
                    icon: 'success',
                    title: `Signed Out Successfully`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                });

            })
            .catch((error) => console.log(error));
    };

    const userSignIn = () => {
        navigate(`/`);
    }
    return (
        <div className="Header">
            <header id="header">
                <div className="header-inner">
                    <nav className="navbar">
                        <div className="container">
                            <div className="menu-icon" onClick={handleShowNavbar}>
                                {showNavbar ? (
                                    // Render the cross mark when the navbar is shown
                                    <div className="cross-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                        </svg>
                                    </div>
                                ) : (
                                    // Render the hamburger icon when the navbar is hidden
                                    <div className="hamburger-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className={`nav-elements ${showNavbar && 'active'}`}>
                                <ul>
                                    <li>
                                        <NavLink to="/order">Take Away</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/tables">Dine In</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/addcash">Add Cash</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/report">Report</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/adduser">Add User</NavLink>
                                    </li>
                                    <li className='sign-out'>
                                            {authUser ? (
                                                <>
                                                    <span>{`${authUser.displayName}`}</span>
                                                    <button type="button" className="btn btn-danger" onClick={userSignOut}>Logout</button>
                                                </>
                                            ) : (
                                                <button type="button" className="btn btn-success" onClick={userSignIn}>Login</button>
                                            )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}

export default Header;
