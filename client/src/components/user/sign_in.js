import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn } from '../../actions';
import Input from '../general/form/input';
import './auth.scss';

class SignIn extends React.Component {
    userSignIn(formValues) {
        const { signIn, history } = this.props;
        signIn(formValues);
        history.push('/products');
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div className="auth sign-in center">
                <h1>User Sign In</h1>
                <form onSubmit={handleSubmit(this.userSignIn.bind(this))}>
                    <Field name="email" component={Input} type="email" placeholder="Email" />
                    <Field name="password" component={Input} type="password" placeholder="Password" />
                    <button type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <Link to="/sign-up">Create Account</Link></p>
            </div>
        )
    }
}

function validate(formValues) {
    const { email, password } = formValues;
    const errors = {};

    if (!email || !(RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").test(email))) {
        errors.email = "please enter a valid email";
    }

    if (!password) {
        errors.password = "please enter a password";
    }

    return errors;
}

export default connect(null, {
    signIn: signIn
})(reduxForm({
    form: 'sign-in',
    validate: validate
})(SignIn));