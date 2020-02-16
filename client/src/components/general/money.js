import React from 'react';

export default (props) => {
    const { penny } = props;
    const dollar = (penny / 100).toFixed(2);
    return (
        <span>${dollar}</span>
    )
}