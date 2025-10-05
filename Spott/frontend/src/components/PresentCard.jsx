export default function PresentCard({ imageSrc = "", title, description, rating, onClick }) {
    return (
        <article 
            className="group bg-purple-900/30 backdrop-blur-sm border border-purple-700/20 rounded-xl overflow-hidden hover:border-purple-600/50 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-purple-900/50"
            onClick={onClick}
        >
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden bg-slate-900/50">
                {imageSrc ? (
                    <img 
                        src={imageSrc} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-600 text-4xl">🎉</span>
                    </div>
                )}
                
                {/* Rating superpuesto */}
                {rating && (
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-white text-sm font-semibold">{rating}</span>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2">
                    {description}
                </p>
            </div>
        </article>
    );
}