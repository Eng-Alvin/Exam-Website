import { useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Account = () => {
  const { user, patchUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwServerError, setPwServerError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (profileErrors[e.target.name]) setProfileErrors((p) => ({ ...p, [e.target.name]: '' }));
    setProfileSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileForm.username.trim()) errs.username = 'Username is required';
    if (Object.keys(errs).length) return setProfileErrors(errs);
    setProfileLoading(true);
    try {
      const { data } = await apiClient.put('/auth/profile', profileForm);
      patchUser(data.user);
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileErrors({ username: err.response?.data?.message || 'Update failed' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (pwErrors[e.target.name]) setPwErrors((p) => ({ ...p, [e.target.name]: '' }));
    setPwSuccess('');
    setPwServerError('');
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.oldPassword) errs.oldPassword = 'Current password is required';
    if (!pwForm.newPassword) errs.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 8) errs.newPassword = 'Must be at least 8 characters';
    if (!pwForm.confirmPassword) errs.confirmPassword = 'Please confirm your new password';
    else if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (pwForm.oldPassword && pwForm.newPassword && pwForm.oldPassword === pwForm.newPassword) {
      errs.newPassword = 'New password must differ from current password';
    }
    if (Object.keys(errs).length) return setPwErrors(errs);
    setPwLoading(true);
    try {
      await apiClient.put('/auth/password', { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      setPwSuccess('Password updated. Use your new password next time you sign in.');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwServerError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt pt-16">
      <div className="max-w-xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-wide text-gold mb-3">SETTINGS</p>
          <h1 className="font-display text-4xl font-semibold text-ink">Account</h1>
        </div>

        {/* Profile section */}
        <section className="border border-line bg-white rounded-2xl shadow-card p-8 md:p-10 mb-5">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-2">Identity</h2>
            <p className="text-sm text-ink-soft leading-relaxed">Update your public profile information</p>
          </div>

          {profileSuccess && (
            <div className="mb-8 px-5 py-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm leading-relaxed">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-7" noValidate>
            <Input
              label="Username"
              name="username"
              value={profileForm.username}
              onChange={handleProfileChange}
              error={profileErrors.username}
              placeholder="your handle"
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="+1 555 000 0000"
            />
            <Input
              label="Avatar URL"
              name="avatar"
              type="url"
              value={profileForm.avatar}
              onChange={handleProfileChange}
              placeholder="https://..."
            />
            {profileForm.avatar && (
              <div className="flex items-center gap-4 pt-1">
                <img
                  src={profileForm.avatar}
                  alt="avatar preview"
                  className="w-14 h-14 rounded-full object-cover border border-gold/30"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <p className="text-xs text-ink-faint uppercase tracking-widest">Preview</p>
              </div>
            )}
            <Button type="submit" loading={profileLoading} className="w-full py-4 mt-2">
              Save Profile
            </Button>
          </form>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6 px-2">
          <div className="flex-1 h-px bg-line" />
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="text-gold/40">
            <path d="M7 0L9.33 4.67L14 7L9.33 9.33L7 14L4.67 9.33L0 7L4.67 4.67L7 0Z" fill="currentColor" />
          </svg>
          <div className="flex-1 h-px bg-line" />
        </div>

        {/* Password section */}
        <section className="border border-line bg-white rounded-2xl shadow-card p-8 md:p-10">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-2">Security</h2>
            <p className="text-sm text-ink-soft leading-relaxed">Change your account password</p>
          </div>

          {pwSuccess && (
            <div className="mb-8 px-5 py-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm leading-relaxed">
              {pwSuccess}
            </div>
          )}
          {pwServerError && (
            <div className="mb-8 px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm leading-relaxed">
              {pwServerError}
            </div>
          )}

          <form onSubmit={handlePwSubmit} className="flex flex-col gap-7" noValidate>
            <Input
              label="Current Password"
              name="oldPassword"
              type="password"
              value={pwForm.oldPassword}
              onChange={handlePwChange}
              error={pwErrors.oldPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={pwForm.newPassword}
              onChange={handlePwChange}
              error={pwErrors.newPassword}
              placeholder="min. 8 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
              error={pwErrors.confirmPassword}
              placeholder="repeat new password"
              autoComplete="new-password"
            />
            <Button type="submit" loading={pwLoading} className="w-full py-4 mt-2">
              Update Password
            </Button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default Account;
