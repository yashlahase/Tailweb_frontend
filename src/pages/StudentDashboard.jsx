import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiSend, FiCheckCircle, FiInfo, FiBook, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import AssignmentCard from '../components/AssignmentCard';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Submission Modal
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/submissions/my')
      ]);
      setAssignments(assignmentsRes.data);
      setMySubmissions(submissionsRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenSubmitModal = (assignment) => {
    const existing = mySubmissions.find(s => s.assignmentId === assignment.id);
    if (existing) {
      setSubmittingAssignment({ ...assignment, existingAnswer: existing.answer });
      setAnswer(existing.answer);
    } else {
      setSubmittingAssignment(assignment);
      setAnswer('');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return toast.error('Please enter an answer');
    
    setIsSubmitting(true);
    try {
      await api.post('/submissions', { 
        assignmentId: submittingAssignment.id, 
        answer: answer.trim() 
      });
      toast.success('Assignment submitted successfully!');
      setSubmittingAssignment(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh" style={{ padding: '32px' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Student Portal</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser /> Welcome, {user.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={logout} className="btn btn-ghost" style={{ padding: '10px 14px' }}>
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiBook /> Available Assignments
        </h2>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <span className="spinner" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="glass-card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <FiInfo size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
            <h3 style={{ margin: '0 0 8px' }}>No active assignments</h3>
            <p style={{ color: 'var(--text-muted)' }}>There are no published assignments for you to work on at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {assignments.map(a => {
              const submission = mySubmissions.find(s => s.assignmentId === a.id);
              return (
                <div key={a.id} style={{ position: 'relative' }}>
                    <AssignmentCard 
                      assignment={a} 
                      isTeacher={false}
                      onEdit={() => handleOpenSubmitModal(a)}
                    />
                    {submission && (
                        <div style={{ 
                            position: 'absolute', 
                            top: '-8px', 
                            right: '-8px', 
                            backgroundColor: 'var(--success)', 
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            zIndex: 10
                        }}>
                            <FiCheckCircle size={12} /> SUBMITTED
                        </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Submission Modal */}
      {submittingAssignment && (
        <div className="modal-overlay" onClick={() => setSubmittingAssignment(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {submittingAssignment.existingAnswer ? 'Your Submission' : 'Submit Answer'}
                   </h2>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{submittingAssignment.title}</p>
                </div>
              <button onClick={() => setSubmittingAssignment(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
                <div style={{ 
                    backgroundColor: 'rgba(0,0,0,0.2)', 
                    padding: '16px', 
                    borderRadius: '10px', 
                    marginBottom: '24px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: 'var(--text-muted)'
                }}>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginTop: 0 }}>Description:</p>
                    {submittingAssignment.description}
                </div>

                <form onSubmit={handleSubmitAnswer}>
                    <div style={{ marginBottom: '24px' }}>
                        <label className="label">Your Answer</label>
                        <textarea 
                            className="input" 
                            style={{ minHeight: '180px' }}
                            required
                            placeholder="Type your response here..."
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            disabled={!!submittingAssignment.existingAnswer}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={() => setSubmittingAssignment(null)} className="btn btn-ghost" style={{ flex: 1 }}>Close</button>
                        {!submittingAssignment.existingAnswer && (
                            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : <><FiSend /> Submit Answer</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
