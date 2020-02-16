import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Input from '../general/form/input';
import Textarea from '../general/form/textarea';

class ContactFrom extends React.Component {
    userContact(formValues) {
        console.log('Contact form value', formValues)
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.userContact)}>
                <Field name="name" component={Input} placeholder="Name"/>
                <Field name="email" component={Input} type="email" placeholder="Email" />
                <Field name="phone" component={Input} type="tel" placeholder="Phone"/>
                <Field name="subject" component={Input} placeholder="Subject"/>
                <Field name="message" component={Textarea} placeholder="Message"/>
                <div>
                    <button type="submit">Send</button>
                </div>
            </form>
        )
    }
}

function validate(formValues) {
    const { name, email, phone, subject, message } = formValues;
    const errors = {};

    if (!name || name.indexOf(" ") < 0) {
        errors.name = "please enter first and last name"
    }

    if (!email || !(RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").test(email))) {
        errors.email = "please enter a valid email"
    }

    if (isNaN(phone) || phone.length != 10) {
        errors.phone = "please enter a valid US phone number, 10 numbers long"
    }

    if (!subject || subject.length < 2) {
        errors.subject = "please enter subject at least 2 characters long"
    }

    if (!message || message.length > 1000) {
        errors.message = "please enter message (no more than 1000 characters long)"
    }

    return errors;
}

export default reduxForm({
    form: "contact-form",
    validate: validate
})(ContactFrom);