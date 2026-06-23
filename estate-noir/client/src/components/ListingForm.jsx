import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];
const LISTING_TYPES = ['For Sale', 'For Rent'];

const ListingForm = ({ initialValues = {}, onSubmit, submitLabel = 'Publish Listing' }) => {
  const [form, setForm] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    price: initialValues.price || '',
    city: initialValues.city || '',
    country: initialValues.country || '',
    category: initialValues.category || 'Apartment',
    listingType: initialValues.listingType || 'For Sale',
    imagesRaw: initialValues.images?.join(', ') || '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'A valid price is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.country.trim()) e.country = 'Country is required';
    if (!form.imagesRaw.trim()) e.imagesRaw = 'At least one image URL is required';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setServerError('');
    try {
      const images = form.imagesRaw.split(',').map((s) => s.trim()).filter(Boolean);
      await onSubmit({ ...form, price: Number(form.price), images });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
      {serverError && (
        <div className="px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm leading-relaxed">
          {serverError}
        </div>
      )}

      <Input
        label="Property Title"
        name="title"
        placeholder="e.g. Modern 3-Bedroom Apartment"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium tracking-wide text-ink-soft">Description</label>
        <textarea
          name="description"
          rows={4}
          placeholder="Describe the property — size, features, amenities..."
          value={form.description}
          onChange={handleChange}
          className={`w-full bg-white border ${errors.description ? 'border-red-400' : 'border-line'} text-ink placeholder-ink-faint px-4 py-3 text-sm rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all resize-none`}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={`Price (FCFA${form.listingType === 'For Rent' ? ' / month' : ''})`}
          name="price"
          type="number"
          placeholder="e.g. 150000"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          min="0"
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium tracking-wide text-ink-soft">Listing Type</label>
          <select
            name="listingType"
            value={form.listingType}
            onChange={handleChange}
            className="w-full bg-white border border-line text-ink px-4 py-3 text-sm rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all cursor-pointer"
          >
            {LISTING_TYPES.map((t) => (
              <option key={t} value={t} className="bg-white text-ink">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium tracking-wide text-ink-soft">Property Type</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full bg-white border border-line text-ink px-4 py-3 text-sm rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all cursor-pointer"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t} className="bg-white text-ink">{t}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="City"
          name="city"
          placeholder="e.g. Douala"
          value={form.city}
          onChange={handleChange}
          error={errors.city}
        />
        <Input
          label="Country"
          name="country"
          placeholder="e.g. Cameroon"
          value={form.country}
          onChange={handleChange}
          error={errors.country}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium tracking-wide text-ink-soft">
          Image URLs <span className="text-ink-faint font-normal">(comma-separated)</span>
        </label>
        <textarea
          name="imagesRaw"
          rows={2}
          placeholder="https://..., https://..."
          value={form.imagesRaw}
          onChange={handleChange}
          className={`w-full bg-white border ${errors.imagesRaw ? 'border-red-400' : 'border-line'} text-ink placeholder-ink-faint px-4 py-3 text-sm rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all resize-none`}
        />
        {errors.imagesRaw && <span className="text-xs text-red-500">{errors.imagesRaw}</span>}
      </div>

      <Button type="submit" loading={loading} className="w-full py-4 mt-1">
        {submitLabel}
      </Button>
    </form>
  );
};

export default ListingForm;
