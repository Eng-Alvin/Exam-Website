import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import ListingForm from '../components/ListingForm';

const NewEstate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await apiClient.post('/estates', payload);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col pt-16">
      <div className="flex-1 flex flex-col items-center py-12">
      <div className="w-full max-w-2xl px-6">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink mb-3">List a Property</h1>
          <p className="text-sm text-ink-soft leading-relaxed">Add your property to MyHome — for rent or sale</p>
        </div>
        <div className="border border-line bg-white rounded-2xl shadow-card p-8 md:p-10">
          <ListingForm onSubmit={handleSubmit} submitLabel="Publish Listing" />
        </div>
      </div>
      </div>
    </div>
  );
};

export default NewEstate;
