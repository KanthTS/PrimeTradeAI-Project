import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const result = await login(form.email, form.password);
      setSuccess(result.message);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell auth-shell-full">
      <div className="auth-hero auth-hero-inline">
        <p className="eyebrow">Smart Task Platform</p>
        <h1>Build faster. Track better. Deliver confidently.</h1>
        <p className="muted">
          Secure JWT authentication, role-based control, and a clean workflow for admins and users.
        </p>
      </div>
      <div className="card auth-card">
        <p className="eyebrow">PrimeTradeAI</p>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to manage your tasks securely.</p>
        <form onSubmit={onSubmit} className="form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
        <p className="muted">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
