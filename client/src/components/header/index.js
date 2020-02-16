import React from 'react';
import Nav from '../nav';

import './header.scss';
import headerImage from '../../assets/images/header.png';
import logoImage from '../../assets/images/logo.png';

export default props => {
    return (
        <div className="header">
            <img src={headerImage} />
            <Nav />
            <img src={logoImage} />
            <p className="center">We delivery cupcakes for the important events of your life!</p>
        </div>
    )
}