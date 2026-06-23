import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

const formatPrice = (price, listingType) => {
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(price);
  return `${formatted} FCFA${listingType === 'For Rent' ? '/mo' : ''}`;
};

const EstateDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get(`/estates/${id}`, { signal: controller.signal })
      .then(({ data }) => setProperty(data.estate))
      .catch((err) => { if (err.name !== 'CanceledError') setError('Property not found or unavailable.'); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/estates/${id}`);
      navigate('/dashboard');
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const isOwner = user && property?.agent?._id === user._id;

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Spinner size="lg" /></div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center"><ErrorState message={error} /></div>;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-5xl mx-auto px-6 pt-8">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">{property.title}</h1>
            <p className="text-sm text-ink-soft mt-1">{property.city}, {property.country}</p>
          </div>
          {isOwner && (
            <div className="flex gap-3 shrink-0">
              <Link to={`/properties/${id}/edit`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setShowConfirm(true)}>Remove</Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative h-[55vh] min-h-[360px] rounded-2xl overflow-hidden">
          <img
            src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.images?.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${i === activeImage ? 'bg-white w-6' : 'bg-white/60 w-2 hover:bg-white/90'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2">
            <Badge>{property.category}</Badge>
            <p className="text-ink-soft leading-relaxed mt-6 whitespace-pre-line">{property.description}</p>

            {property.agent && (
              <div className="mt-12 pt-8 border-t border-line">
                <p className="text-xs uppercase tracking-widest text-ink-faint mb-4">Listed by</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold text-sm font-semibold">
                    {property.agent.username?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">@{property.agent.username}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-line bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">
                {property.listingType === 'For Rent' ? 'Monthly Rent' : 'Asking Price'}
              </p>
              <p className="font-display text-3xl font-semibold text-ink mb-6">{formatPrice(property.price, property.listingType)}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-2.5 border-b border-line-soft">
                  <span className="text-ink-soft">Property Type</span>
                  <span className="text-ink font-medium">{property.category}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-line-soft">
                  <span className="text-ink-soft">Listing Type</span>
                  <span className="text-ink font-medium">{property.listingType}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-line-soft">
                  <span className="text-ink-soft">City</span>
                  <span className="text-ink font-medium">{property.city}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-ink-soft">Country</span>
                  <span className="text-ink font-medium">{property.country}</span>
                </div>
              </div>
              <Link to="/" className="mt-6 block text-center text-sm font-medium text-ink-soft hover:text-gold transition-colors">
                ← Back to Listings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white border border-line rounded-2xl shadow-card-hover p-8 max-w-sm w-full">
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Remove Listing</h3>
            <p className="text-sm text-ink-soft mb-6">
              This will permanently remove <strong className="text-ink">{property.title}</strong> from MyHome. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateDetail;
