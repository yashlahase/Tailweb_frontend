import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiBookOpen, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', secretCode: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    
    if (form.role === 'teacher' && !form.secretCode.trim()) {
      e.secretCode = 'Teacher secret code is required';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      navigate(data.user.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
            boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
            marginBottom: '16px'
          }}>
            <FiUserCheck size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Join EduPortal
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Create your account to get started
          </p>
        </div>

        <div className="glass-card" style={{ borderRadius: '20px', padding: '32px' }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {errors.name && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  style={{ paddingLeft: '40px' }}
                  type="email"
                  placeholder="you@school.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '18px' }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Role selection */}
            <div style={{ marginBottom: '20px' }}>
              <label className="label">I am a...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'student', secretCode: '' })}
                  className={`btn btn-sm ${form.role === 'student' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ width: '100%' }}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'teacher' })}
                  className={`btn btn-sm ${form.role === 'teacher' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ width: '100%' }}
                >
                  Teacher
                </button>
              </div>
            </div>

            {/* Teacher Secret Code */}
            {form.role === 'teacher' && (
              <div style={{ marginBottom: '24px' }}>
                <label className="label">Teacher Secret Code</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className={`input ${errors.secretCode ? 'input-error' : ''}`}
                    style={{ paddingLeft: '40px' }}
                    type="password"
                    placeholder="Enter Secret Code"
                    value={form.secretCode}
                    onChange={e => setForm({ ...form, secretCode: e.target.value })}
                  />
                </div>
                {errors.secretCode && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '4px' }}>{errors.secretCode}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '6px' }}>
                  Hint: Default is Teacher@18
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
