import React from 'react';
import PropTypes from 'prop-types';

/**
 * XIcon Stateless Functional Component
 * @returns {JSX.Element} HTML
 */
function XIcon({ size = 9, strokeWidth = 1, className = '', stroke, disabled, y }) {
    return (
        <svg viewBox={`0 0 ${size + 1} ${size + 1}`} className={className} height={size + 1} y={y}>
            <path
                d={`M 1 1 L ${size} ${size} M ${size} 1 L 1 ${size}`}
                fill="none"
                stroke={disabled ? '#ffffff' : stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
            />
        </svg>
    );
}

XIcon.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    stroke: PropTypes.string,
    disabled: PropTypes.bool,
    y: PropTypes.number
};

export default XIcon;
