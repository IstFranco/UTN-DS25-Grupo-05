export default function PresentCard({ imageSrc = "", title, description, rating, onClick }) {
    return (
        <article className="event-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="event-image">
                {imageSrc ? <img src={imageSrc} alt={title} /> : null}
            </div>
            <div className="event-info">
                <h3 className="event-title">{title}</h3>
                <p className="event-description">{description}</p>
                <div className="event-rating">⭐ {rating}</div>
            </div>
        </article>
    );
}