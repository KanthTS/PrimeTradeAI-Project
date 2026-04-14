import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { title: '', description: '', status: 'pending' };

function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/v1/tasks');
      setTasks(response.data.data);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Unable to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (editingId) {
        const response = await api.put(`/api/v1/tasks/${editingId}`, form);
        setMessage(response.data.message);
      } else {
        const response = await api.post('/api/v1/tasks', form);
        setMessage(response.data.message);
      }
      resetForm();
      fetchTasks();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Task operation failed');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const removeTask = async (taskId) => {
    setError('');
    setMessage('');
    try {
      const response = await api.delete(`/api/v1/tasks/${taskId}`);
      setMessage(response.data.message);
      fetchTasks();
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Delete failed');
    }
  };

  const counts = {
    all: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    'in-progress': tasks.filter((task) => task.status === 'in-progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  };

  const filteredTasks =
    statusFilter === 'all' ? tasks : tasks.filter((task) => task.status === statusFilter);

  return (
    <div className="card wide dashboard-card premium-dashboard">
      <div className="row header-row dashboard-hero">
        <div className="header-block">
          <p className="eyebrow">PrimeTradeAI Dashboard</p>
          <h2>Task Workspace</h2>
          <p className="hero-copy">
            Signed in as <strong>{user?.name}</strong>{' '}
            <span className={`pill ${user?.role === 'admin' ? 'admin' : 'user'}`}>{user?.role}</span>
          </p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Total Tasks</p>
          <strong>{counts.all}</strong>
        </article>
        <article className="stat-card">
          <p>Pending</p>
          <strong>{counts.pending}</strong>
        </article>
        <article className="stat-card">
          <p>In Progress</p>
          <strong>{counts['in-progress']}</strong>
        </article>
        <article className="stat-card">
          <p>Done</p>
          <strong>{counts.done}</strong>
        </article>
      </section>

      <section className="dashboard-layout">
        <form onSubmit={onSubmit} className="form task-form-card">
          <h3>{editingId ? 'Update Task' : 'Create New Task'}</h3>
          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <select
            name="status"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="row">
            <button type="submit">{editingId ? 'Update Task' : 'Create Task'}</button>
            {editingId && (
              <button type="button" onClick={resetForm} className="secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="tasks-panel">
          <div className="row">
            <h3>Tasks ({filteredTasks.length})</h3>
            {user?.role === 'admin' && <span className="pill admin">Admin can view all users tasks</span>}
          </div>

          <div className="filter-row">
            <button
              type="button"
              className={`chip ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`chip ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button
              type="button"
              className={`chip ${statusFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setStatusFilter('in-progress')}
            >
              In Progress
            </button>
            <button
              type="button"
              className={`chip ${statusFilter === 'done' ? 'active' : ''}`}
              onClick={() => setStatusFilter('done')}
            >
              Done
            </button>
          </div>
        </div>
      </section>

      {error && <p className="message error">{error}</p>}
      {message && <p className="message success">{message}</p>}
      {filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks found for this filter.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task._id}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || 'No description'}</p>
                <small>
                  Status: <span className={`status ${task.status}`}>{task.status}</span>
                </small>
              </div>
              <div className="row">
                <button onClick={() => startEdit(task)} className="secondary">
                  Edit
                </button>
                <button onClick={() => removeTask(task._id)} className="danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;
