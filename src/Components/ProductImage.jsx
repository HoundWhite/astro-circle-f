import React from 'react';

const ProductImage = ({ product, className = '', ...props }) => {
    const getFallbackImage = (productId) => {
        const imageMapping = {
            1: '/media/products/amulet.png',
            2: '/media/products/astro_book.png',
            3: '/media/products/astro_calendar.png',
            4: '/media/products/candles.png',
            5: '/media/products/crystal.png',
            6: '/media/products/num_book.png',
            7: '/media/products/num_calendar.png',
            8: '/media/products/tarot_cards.png',
        };
        return imageMapping[productId] || '/media/products/default.png';
    };

    const handleImageError = (e) => {
        e.target.src = getFallbackImage(product.id);
    };

    return (
        <img 
            src={product.image_url || product.image} 
            alt={product.name}
            className={className}
            onError={handleImageError}
            {...props}
        />
    );
};

export default ProductImage; 