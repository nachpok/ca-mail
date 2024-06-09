
import React, { useState } from 'react';

export default function StarCheckbox({ cb, defaultChecked, className }) {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const toggleStar = (e) => {
        e.preventDefault();
        setIsChecked(isChecked => !isChecked);
        cb(!isChecked);
    }
    return (
        <i
            className={`star-checkbox ${isChecked ? "fas fa-star" : "far fa-star"} ${className}`}
            onClick={toggleStar}

        ></i>
    );
}

