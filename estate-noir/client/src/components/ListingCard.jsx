import { Link } from 'react-router-dom';

const formatPrice = (price, category) => {
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(price);
  return `${formatted} FCFA${category === 'For Rent' ? '/mo' : ''}`;
};

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

const ListingCard = ({ property }) => {
  const { _id, title, price, city, country, category, images } = property;

  return (
    <Link to={`/properties/${_id}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '1/1' }}>
        <img
          src={images?.[0] || FALLBACK}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          loading="lazy"
        />

        {/* Bookmark / heart */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-ink-soft hover:text-gold hover:scale-110 transition-all duration-200 shadow-sm">
          <svg width="13" height="15" viewBox="0 0 11 13" fill="none">
            <path d="M1 1h9v11L5.5 9 1 12V1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm shadow-sm ${category === 'For Rent' ? 'text-blue-600' : 'text-gold'}`}>
            {category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-ink group-hover:text-gold transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>
        </div>
        <p className="text-sm text-ink-soft mt-0.5">{city}, {country}</p>
        <p className="text-ink font-semibold text-base mt-1.5">
          {formatPrice(price, category)}
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;
