
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function StarCheckbox({ cb, defaultChecked, className }) {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const toggleStar = () => {
        setIsChecked(isChecked => !isChecked);
        cb(isChecked);
    }
    return (
        <i
            className={`star-checkbox ${isChecked ? "fas fa-star" : "far fa-star"} ${className}`}
            onClick={toggleStar}

        ></i>
    );
}

