import { FiX, FiCheckCircle, FiUser, FiClock, FiCheckSquare, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

export default function SubmissionsModal({ assignment, submissions, onClose, onReview, onDeleteSubmission }) {
  if (!assignment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Submissions</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{assignment.title}</p>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', display: 'flex' }}>
            <FiX size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <FiUser size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No submissions yet for this assignment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissions.map((s) => (
                <div key={s.id} className="glass-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        {s.studentName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{s.studentName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <FiClock size={12} /> {format(new Date(s.submittedAt), 'MMM dd, p')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => onDeleteSubmission(s.id)} className="btn btn-danger btn-sm" title="Delete Submission" style={{ padding: '4px 8px' }}>
                        <FiTrash2 size={14} />
                      </button>
                      {s.reviewed ? (
                        <span className="badge badge-published" style={{ gap: '4px' }}>
                          <FiCheckCircle size={10} /> Reviewed
                        </span>
                      ) : (
                        <button onClick={() => onReview(s.id)} className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                          Mark Reviewed
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: 'rgba(0,0,0,0.3)', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    color: 'var(--text)'
                  }}>
                    {s.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
