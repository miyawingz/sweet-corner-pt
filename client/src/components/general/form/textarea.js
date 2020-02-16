import React from 'react';
import './form.scss';

export default (props) => {
    const { input, id = input.name, type = "text", meta, placeholder } = props;

    return (
        <div className="input-field textarea">
            <textarea {...input} id={id} type={type} placeholder={placeholder} />
            <p>{meta.touched && meta.error}</p>
        </div>
    )
}