import React from 'react';
import dots from '../../assets/images/dots-footer.png';
import phone from '../../assets/images/phone.png';

import './footer.scss';

export default props => {
    const year = (new Date()).getFullYear();

    return (
        <div className="footer">
            <div className="dots">
                <img src={dots} />
            </div>
            <div className="center">Copyright &copy; {year} Sweet Corner. All rights reserved</div>
            <div className="contact">
                <img src={phone} />
                <p>800 264 2699</p>
            </div>
        </div>
    )
}