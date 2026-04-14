import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
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
      const result = await register(form);
      setSuccess(result.message);
      navigate('/dashboard');
    } catch (apiError) {
      const apiResponse = apiError?.response?.data;
      const validationText = Array.isArray(apiResponse?.errors)
        ? apiResponse.errors.map((item) => item.message).join(' ')
        : '';
      setError(validationText || apiResponse?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell auth-shell-full">
      <div className="auth-hero auth-hero-inline">
        <p className="eyebrow">Role-Based Access</p>
        <h1>Create account and start executing faster.</h1>
        <p className="muted">
          Register as user or admin and manage tasks through a simple and attractive interface.
        </p>
      </div>
      <div className="card auth-card">
        <p className="eyebrow">PrimeTradeAI</p>
        <h2>Create your account</h2>
        <p className="muted">Get started with role-based task management.</p>
        <form onSubmit={onSubmit} className="form">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
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
          minLength={6}
        />
        <select name="role" value={form.role} onChange={onChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create Account'}
        </button>
        </form>
        {error && <p className="message error">{error}</p>}
        {success && <p className="message success">{success}</p>}
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
