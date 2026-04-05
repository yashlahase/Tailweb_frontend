import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiLogOut, FiFilter, FiUser, FiInfo, FiEdit2, FiTrash2, FiClock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import AssignmentCard from '../components/AssignmentCard';
import SubmissionsModal from '../components/SubmissionsModal';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Assignment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '' });
  
  // Submissions Modal
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  // Confirm Delete Modal
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', id: null });

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/assignments');
      setAssignments(data);
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate.split('T')[0]
      });
    } else {
      setEditingAssignment(null);
      setFormData({ title: '', description: '', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await api.put(`/assignments/${editingAssignment.id}`, formData);
        toast.success('Assignment updated');
      } else {
        await api.post('/assignments', formData);
        toast.success('Assignment created');
      }
      setIsModalOpen(false);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({ isOpen: true, type: 'assignment', id });
  };

  const handleTransition = async (id, action) => {
    try {
      await api.patch(`/assignments/${id}/transition`, { action });
      toast.success(`Assignment ${action === 'publish' ? 'published' : 'completed'}`);
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transition failed');
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      const { data } = await api.get(`/assignments/${assignment.id}/submissions`);
      setSubmissions(data);
      setViewingSubmissions(assignment);
    } catch (err) {
      toast.error('Failed to load submissions');
    }
  };

  const handleReviewSubmission = async (submissionId) => {
    try {
      await api.patch(`/assignments/${viewingSubmissions.id}/submissions/${submissionId}/review`);
      toast.success('Submission reviewed');
      const { data } = await api.get(`/assignments/${viewingSubmissions.id}/submissions`);
      setSubmissions(data);
    } catch (err) {
      toast.error('Failed to review submission');
    }
  };

  const handleDeleteSubmission = (submissionId) => {
    setConfirmDialog({ isOpen: true, type: 'submission', id: submissionId });
  };

  const executeDelete = async () => {
    if (confirmDialog.type === 'assignment') {
      try {
        await api.delete(`/assignments/${confirmDialog.id}`);
        toast.success('Assignment deleted');
        fetchAssignments();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete assignment');
      }
    } else if (confirmDialog.type === 'submission') {
      try {
        await api.delete(`/assignments/${viewingSubmissions.id}/submissions/${confirmDialog.id}`);
        toast.success('Submission deleted');
        const { data } = await api.get(`/assignments/${viewingSubmissions.id}/submissions`);
        setSubmissions(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete submission');
      }
    }
    setConfirmDialog({ isOpen: false, type: '', id: null });
  };

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === filter);

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Teacher Dashboard</h1>
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-2)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {['all', 'draft', 'published', 'completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '6px 16px', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-muted)',
                  transition: '0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <FiPlus size={18} /> Create Assignment
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <span className="spinner" />
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="glass-card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <FiLogOut size={48} style={{ opacity: 0.1, marginBottom: '20px', transform: 'rotate(180deg)' }} />
            <h3 style={{ margin: '0 0 8px' }}>No assignments found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Start by creating your first assignment or changing filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredAssignments.map(a => (
              <AssignmentCard 
                key={a.id} 
                assignment={a} 
                isTeacher={true}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onTransition={handleTransition}
                onViewSubmissions={handleViewSubmissions}
              />
            ))}
          </div>
        )}
      </main>

      {/* Assignment Create/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveAssignment} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label className="label">Assignment Title</label>
                <input 
                  className="input" 
                  required
                  placeholder="e.g. Introduction to Physics"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="label">Due Date</label>
                <div style={{ position: 'relative' }}>
                  <FiClock size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="date" 
                    className="input" 
                    style={{ paddingLeft: '40px' }}
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label className="label">Description & Instructions</label>
                <textarea 
                  className="input" 
                  style={{ minHeight: '120px' }}
                  required
                  placeholder="Explain the assignment details here..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingSubmissions && (
        <SubmissionsModal 
          assignment={viewingSubmissions}
          submissions={submissions}
          onClose={() => setViewingSubmissions(null)}
          onReview={handleReviewSubmission}
          onDeleteSubmission={handleDeleteSubmission}
        />
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="modal-overlay" onClick={() => setConfirmDialog({ isOpen: false, type: '', id: null })} style={{ zIndex: 1000 }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--danger)' }}>Confirm Deletion</h2>
              <button onClick={() => setConfirmDialog({ isOpen: false, type: '', id: null })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 24px', color: 'var(--text)' }}>
                {confirmDialog.type === 'assignment' 
                  ? 'Are you sure you want to delete this assignment? This action cannot be undone.' 
                  : 'Are you sure you want to delete this submission? This action cannot be undone.'}
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setConfirmDialog({ isOpen: false, type: '', id: null })} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button onClick={executeDelete} className="btn btn-danger" style={{ flex: 1 }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
