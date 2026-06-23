import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const LISTING_TYPES = ['', 'For Sale', 'For Rent'];

const fieldCls =
  'w-full bg-white border border-line text-ink text-sm placeholder-ink-faint ' +
  'px-4 py-3 rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all duration-200 appearance-none h-12';

const SearchBar = ({ count }) => {
  const [params, setParams] = useSearchParams();
  const [form, setForm] = useState({
    city: params.get('city') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    listingType: params.get('listingType') || '',
  });

  const hasFilters = form.city || form.minPrice || form.maxPrice || form.listingType;

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (form.city) next.set('city', form.city);
    if (form.minPrice) next.set('minPrice', form.minPrice);
    if (form.maxPrice) next.set('maxPrice', form.maxPrice);
    if (form.listingType) next.set('listingType', form.listingType);
    setParams(next);
  };

  const handleReset = () => {
    setForm({ city: '', minPrice: '', maxPrice: '', listingType: '' });
    setParams(new URLSearchParams());
  };

  return (
    <div className="bg-surface-alt border-b border-line">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">

        <div className="flex items-center justify-between gap-4 mb-7 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Find your space</h2>
            <p className="text-sm text-ink-soft mt-1">Filter by location, price and type</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-gold leading-none">{count ?? 0}</span>
            <span className="text-sm text-ink-soft">properties</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="bg-white border border-line rounded-2xl shadow-card p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2">Location</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City or region"
                className={fieldCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2">Min Price (FCFA)</label>
              <input
                name="minPrice"
                type="number"
                value={form.minPrice}
                onChange={handleChange}
                placeholder="e.g. 50 000"
                className={fieldCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2">Max Price (FCFA)</label>
              <input
                name="maxPrice"
                type="number"
                value={form.maxPrice}
                onChange={handleChange}
                placeholder="e.g. 5 000 000"
                className={fieldCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2">Listing Type</label>
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className={fieldCls + ' cursor-pointer'}
                style={{ WebkitAppearance: 'none' }}
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-white text-ink">
                    {t || 'All Types'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gold text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-gold-light transition-colors duration-200 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              Search Properties
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-ink-soft hover:text-ink underline underline-offset-4 px-3 py-3 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
