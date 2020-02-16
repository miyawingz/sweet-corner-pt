import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../../actions';
import CartWidget from './cart_widget';
import './nav.scss';

class Nav extends React.Component {

    authLink = (props) => {
        const { auth, signOut } = this.props;
        const userAuth = localStorage.getItem('Authorization')
        if (auth || userAuth) {
            return (
                <>
                    <li><Link to="/" onClick={signOut}>SIGN OUT</Link></li>
                </>
            )
        }

        return (
            <>
                <li><Link to="/sign-in">SIGN IN</Link></li>
            </>
        )
    }

    render() {
        return (
            <ul className="main-nav center">
                <li><Link to="/">HOME</Link></li>
                <li><Link to="/about">ABOUT US</Link></li>
                <li><Link to="/products">PRODUCTS</Link></li>
                <li><Link to="/services">SERVICES</Link></li>
                <li><Link to="/contact">CONTACT</Link></li>
                <this.authLink />
                <CartWidget />
            </ul>
        )
    }
}

function mapStateToProps(state) {
    return ({
        auth: state.user.auth
    })
}

export default connect(mapStateToProps, {
    signOut: signOut
})(Nav);
// export default props => {
//     return (
//         <ul className="main-nav center">
//             <li><Link to="/">HOME</Link></li>
//             <li><Link to="/about">ABOUT US</Link></li>
//             <li><Link to="/products">PRODUCTS</Link></li>
//             <li><Link to="/services">SERVICES</Link></li>
//             <li><Link to="/contact">CONTACT</Link></li>
//             <li><Link to="/sign-in">SIGN IN</Link></li>
//             <CartWidget />
//         </ul>
//     )
// }