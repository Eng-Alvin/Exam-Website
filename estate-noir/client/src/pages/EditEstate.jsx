import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import ListingForm from '../components/ListingForm';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';

const EditEstate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get(`/estates/${id}`, { signal: controller.signal })
      .then(({ data }) => setProperty(data.estate))
      .catch((err) => { if (err.name !== 'CanceledError') setError('Unable to load this property.'); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const handleSubmit = async (payload) => {
    await apiClient.put(`/estates/${id}`, payload);
    navigate(`/properties/${id}`);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Spinner size="lg" /></div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center"><ErrorState message={error} /></div>;

  return (
    <div className="min-h-screen bg-surface-alt pt-16">
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs font-medium tracking-wide text-gold mb-3">EDITING</p>
          <h1 className="font-display text-4xl font-semibold text-ink mb-2">Update Property</h1>
          <p className="text-sm text-ink-soft mt-2 truncate">{property.title}</p>
        </div>
        <div className="border border-line bg-white rounded-2xl shadow-card p-8 md:p-10">
          <ListingForm initialValues={property} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </div>
      </div>
    </div>
  );
};

export default EditEstate;
