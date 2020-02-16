import React from 'react';
import Money from '../general/money';

export default (props) => {
    const { id, caption, cost, name, thumbnail, goToDetails } = props;
    const { url, altText } = thumbnail;

    return (
        <div className="product-item center" id={id} onClick={goToDetails}>
            <h3 className="name">{name}</h3>
            <img className="thumbnail" src={url} alt={altText} />
            <p className="caption">{caption}</p>
            <Money className="cost" penny={cost} />
        </div>
    )
}