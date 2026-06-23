import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
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
    try {
      const { data } = await apiClient.post('/auth/login', form);
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-gold">
              <path d="M7 0L9.33 4.67L14 7L9.33 9.33L7 14L4.67 9.33L0 7L4.67 4.67L7 0Z" fill="currentColor" />
            </svg>
            <span className="font-display text-base font-semibold tracking-tight text-ink">
              My<span className="text-gold">Home</span>
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink mb-2">Welcome back</h1>
          <p className="text-sm text-ink-soft">Sign in to manage your property listings</p>
        </div>

        {/* Card */}
        <div className="border border-line bg-white rounded-2xl shadow-card p-8 md:p-10">
          {serverError && (
            <div className="mb-7 px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm leading-relaxed">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} className="w-full mt-1 py-4">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-line-soft text-center">
            <p className="text-sm text-ink-soft">
              New to MyHome?{' '}
              <Link to="/register" className="text-gold font-medium hover:text-gold-light transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
