import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {

  return (
    <div className='Header'>
      <header id="header">
                <div className="header-inner;">
                    <div className="container">
                        <div id="mainMenu-trigger"> <a className="lines-button x"><span className="lines"></span></a> </div>
                        <div id="mainMenu" className="menu-center">
                            <div className="container">
                                <nav>
                                    <ul>
                                        <li><Link to="/">Home</Link></li>
                                        <li><Link to="/tables">Tables</Link></li>
                                        <li><Link to="/">Order</Link></li>
                                        <li><Link to="/">Delivery</Link></li>
                                        <li><Link to="/">About Us</Link></li>
                                        <li><Link to="/">Contact Us</Link></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
    </div>
  );
}

export default Header;
