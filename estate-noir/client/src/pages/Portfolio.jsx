import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

const formatPrice = (price, listingType) => {
  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(price);
  return `${formatted} FCFA${listingType === 'For Rent' ? '/mo' : ''}`;
};

const Portfolio = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiClient
      .get('/estates/mine', { signal: controller.signal })
      .then(({ data }) => setProperties(data.estates))
      .catch((err) => { if (err.name !== 'CanceledError') setError('Failed to load your listings.'); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [retryKey]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/estates/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // keep item on failure
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium tracking-wide text-gold mb-2">MY LISTINGS</p>
            <h1 className="font-display text-4xl font-semibold text-ink">Dashboard</h1>
            {user && (
              <p className="text-sm text-ink-soft mt-2">@{user.username}</p>
            )}
          </div>
          <Link to="/properties/new">
            <Button>+ Add New Property</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        ) : properties.length === 0 ? (
          <EmptyState
            title="No listings yet"
            message="Start by adding your first property for rent or sale."
            action={
              <Link to="/properties/new">
                <Button>Add Your First Property</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white border border-line rounded-2xl hover:shadow-card transition-shadow p-4 flex gap-5 items-center"
              >
                {/* Thumbnail */}
                <div className="w-24 h-20 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge>{property.category}</Badge>
                    <Badge>{property.listingType}</Badge>
                  </div>
                  <h3 className="text-ink font-semibold truncate">{property.title}</h3>
                  <p className="text-sm text-ink-soft">{property.city}, {property.country}</p>
                </div>

                {/* Price */}
                <div className="hidden sm:block text-ink font-semibold shrink-0">
                  {formatPrice(property.price, property.listingType)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Link to={`/properties/${property._id}`}>
                    <Button variant="ghost" className="text-sm px-3 py-2">View</Button>
                  </Link>
                  <Link to={`/properties/${property._id}/edit`}>
                    <Button variant="outline" className="text-sm px-3 py-2">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="text-sm px-3 py-2"
                    onClick={() => setConfirmId(property._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white border border-line rounded-2xl shadow-card-hover p-8 max-w-sm w-full">
            <h3 className="font-display text-xl font-semibold text-ink mb-2">Remove Listing</h3>
            <p className="text-sm text-ink-soft mb-6">
              Permanently remove <strong className="text-ink">{properties.find((p) => p._id === confirmId)?.title}</strong> from MyHome?
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deletingId === confirmId}
                onClick={() => handleDelete(confirmId)}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
