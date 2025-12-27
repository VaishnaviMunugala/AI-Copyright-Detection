const Card = ({ children, className = '', hover = true }) => {
    const hoverClass = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';

    return (
        <div className={`card ${hoverClass} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
