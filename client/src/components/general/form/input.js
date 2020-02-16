import React from 'react';
import './form.scss';

export default (props) => {
    const { input, id = input.name, type = "text", meta, placeholder } = props;

    return (
        <div className="input-field">
            <input {...input} type={type} id={id} placeholder={placeholder} />
            <p>{meta.touched && meta.error}</p>
        </div>
    );
}