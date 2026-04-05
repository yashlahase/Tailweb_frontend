import { FiCalendar, FiEdit2, FiTrash2, FiSend, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';

export default function AssignmentCard({ assignment, onEdit, onDelete, onTransition, onViewSubmissions, isTeacher }) {
  const { title, description, dueDate, status, submissionCount } = assignment;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft': return <span className="badge badge-draft">Draft</span>;
      case 'published': return <span className="badge badge-published">Published</span>;
      case 'completed': return <span className="badge badge-completed">Completed</span>;
      default: return null;
    }
  };

  const isExpired = new Date() > new Date(dueDate);

  return (
    <div className="glass-card" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        {getStatusBadge(status)}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isExpired ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
          <FiCalendar size={14} />
          {format(new Date(dueDate), 'MMM dd, yyyy')}
          {isExpired && <span style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>(Overdue)</span>}
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 12px', color: 'var(--text)' }}>{title}</h3>
      <p style={{ 
        fontSize: '0.9rem', 
        color: 'var(--text-muted)', 
        margin: '0 0 20px', 
        lineHeight: 1.6,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flexGrow: 1
      }}>
        {description}
      </p>

      {isTeacher && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submissions</p>
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{submissionCount || 0}</p>
            </div>
            {submissionCount > 0 && (
                <button 
                  onClick={() => onViewSubmissions(assignment)}
                  className="btn btn-ghost btn-sm"
                  style={{ gap: '4px' }}
                >
                    View <FiChevronRight size={14} />
                </button>
            )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        {isTeacher ? (
          <>
            {status === 'draft' && (
              <>
                <button onClick={() => onEdit(assignment)} className="btn btn-ghost btn-sm" title="Edit">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => onDelete(assignment.id)} className="btn btn-danger btn-sm" title="Delete">
                  <FiTrash2 size={16} />
                </button>
                <button 
                  onClick={() => onTransition(assignment.id, 'publish')} 
                  className="btn btn-primary btn-sm" 
                  style={{ flex: 1 }}
                >
                  <FiSend size={16} /> Publish
                </button>
              </>
            )}
            {status === 'published' && (
              <button 
                onClick={() => onTransition(assignment.id, 'complete')} 
                className="btn btn-success btn-sm" 
                style={{ width: '100%' }}
              >
                <FiCheckCircle size={16} /> Mark Completed
              </button>
            )}
            {status === 'completed' && (
              <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                <button disabled className="btn btn-ghost btn-sm" style={{ flex: 1, opacity: 0.6 }}>
                    Workflow Closed
                </button>
                <button onClick={() => onDelete(assignment.id)} className="btn btn-danger btn-sm" title="Delete Permanent">
                  <FiTrash2 size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <button 
            onClick={() => onEdit(assignment)} 
            className="btn btn-primary btn-sm" 
            style={{ width: '100%' }}
            disabled={isExpired}
          >
            {isExpired ? 'Submissions Closed' : 'Submit Answer'}
          </button>
        )}
      </div>
    </div>
  );
}
