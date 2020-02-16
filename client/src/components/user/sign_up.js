import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { signUp } from '../../actions';
import { connect } from 'react-redux';
import Input from '../general/form/input';
import './auth.scss';

class SignUp extends React.Component {
    userSignUp(formValues) {
        this.props.signUp(formValues)
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div className="auth sign-up center">
                <h1>User Sign Up</h1>
                <form onSubmit={handleSubmit(this.userSignUp.bind(this))}>
                    <Field name="firstName" component={Input} placeholder="First Name" />
                    <Field name="lastName" component={Input} placeholder="Last Name" />
                    <Field name="email" type="email" component={Input} placeholder="Email" />
                    <Field name="password" type="password" component={Input} placeholder="Password" />
                    <Field name="confirmPW" type="password" component={Input} placeholder="Confirm Password" />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
            </div>
        )
    }
}

function validate(formValues) {
    const errors = {}
    const { firstName, lastName, email, password, confirmPW } = formValues;

    if (!firstName) {
        errors.firstName = "please enter a first name"
    }

    if (!lastName) {
        errors.lastName = "please enter a last name"
    }

    if (!email || !(RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").test(email))) {
        errors.email = "please enter a valid email";
    }

    if (!password || !(RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").test(password))) {
        errors.password = "please enter a valid password, must have an uppercase letter, lowercase letter, number, special character, and be at least 8 characters long";
    }

    if (confirmPW !== password) {
        errors.confirmPW = "password do not match"
    }

    return errors;
}

export default connect(null, {
    signUp: signUp
})(reduxForm({
    form: 'sign-up',
    validate: validate
})(SignUp));