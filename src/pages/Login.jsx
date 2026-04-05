import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await login(form.email, form.password);
    if (!result.success) setError(result.message);
  };

  const fillDemo = (role) => {
    if (role === 'teacher') setForm({ email: 'teacher@school.com', password: 'password' });
    else setForm({ email: 'student@school.com', password: 'password' });
    setError(''); setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            marginBottom: '16px'
          }}>
            <FiBookOpen size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            EduPortal
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Your assignment workflow platform
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 24px', textAlign: 'center' }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '20px',
              color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  id="login-email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  style={{ paddingLeft: '40px' }}
                  type="email"
                  placeholder="you@school.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  id="login-password"
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  padding: '4px', display: 'flex'
                }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Quick Demo Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button id="demo-teacher" onClick={() => fillDemo('teacher')} className="btn btn-ghost btn-sm" style={{ flexDirection: 'column', padding: '10px 8px', gap: '2px' }}>
                <span style={{ fontSize: '1.1rem' }}>👨‍🏫</span>
                <span style={{ fontSize: '0.78rem' }}>Teacher</span>
              </button>
              <button id="demo-student" onClick={() => fillDemo('student')} className="btn btn-ghost btn-sm" style={{ flexDirection: 'column', padding: '10px 8px', gap: '2px' }}>
                <span style={{ fontSize: '1.1rem' }}>🎓</span>
                <span style={{ fontSize: '0.78rem' }}>Student</span>
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Join Now
            </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          EduPortal © 2024 · Assignment Workflow System
        </p>
      </div>
    </div>
  );
}
