import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { useAuth } from '../context/AuthContext';

const FALLBACK_HERO = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [params] = useSearchParams();
  const listingsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiClient
      .get('/estates', { params: Object.fromEntries(params), signal: controller.signal })
      .then(({ data }) => {
        setProperties(data.estates);
        if (data.estates.length > 0 && !hero) setHero(data.estates[0]);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') setError('Unable to load properties. Please try again.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [params.toString(), retryKey]);

  const scrollToListings = () => listingsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ─── */}
      <section className="pt-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
          <div className="relative h-[78vh] min-h-[560px] rounded-3xl overflow-hidden">
            <img
              src={hero?.images?.[0] || FALLBACK_HERO}
              alt="Featured property"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              <span className="inline-flex w-fit items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-muted" />
                Premium Real Estate
              </span>

              <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-5">
                Find the space<br />you deserve
              </h1>

              <p className="text-base md:text-lg text-white/85 leading-relaxed mb-9 max-w-md">
                Discover handpicked properties for rent and sale — from city apartments to family homes. Your next chapter starts here.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={scrollToListings}
                  className="inline-flex items-center justify-center gap-3 bg-gold text-white text-sm font-semibold px-8 py-4 rounded-xl hover:bg-gold-light transition-colors duration-200 cursor-pointer shadow-lg"
                >
                  Browse Properties
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none"><path d="M1 4.5h14M10 1l5 3.5-5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <Link
                  to="/properties/new"
                  className="inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-ink text-sm font-semibold px-8 py-4 rounded-xl hover:bg-white transition-colors duration-200 shadow-lg"
                >
                  List a Property
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <div className="mt-12">
        <SearchBar count={properties.length} />
      </div>

      {/* ─── LISTINGS ─── */}
      <section ref={listingsRef} id="listings" className="max-w-[1400px] mx-auto px-6 md:px-12 pt-14 pb-20">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Available now</h2>
            <p className="text-sm text-ink-soft mt-2 max-w-md">
              Browse properties for rent and sale — apartments, houses, villas, and more across all regions.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : properties.length === 0 ? (
          <EmptyState
            title="No properties found"
            message="Try adjusting your filters or browse the full listing."
            action={
              <Link to="/" className="text-sm font-medium text-gold border border-gold/50 rounded-xl px-5 py-2.5 hover:bg-gold/10 transition-colors">
                Clear Filters
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[...properties].reverse().map((property) => (
              <ListingCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {properties.length >= 3 && (
          <div className="text-center mt-16">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 bg-ink text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-black transition-colors duration-200"
            >
              View All Listings
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 4h10M8 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
