import React from 'react';

const DiscountPricePer = ({ originalPrice, discountedPrice, sub }) => {
    let savings = originalPrice - discountedPrice;
    let percentage = (savings / originalPrice) * 100;
    let result = Math.trunc(percentage);

    return (
        <div>
            {sub ? "-" : ""}{result}%
        </div>
    );
}

export default DiscountPricePer;