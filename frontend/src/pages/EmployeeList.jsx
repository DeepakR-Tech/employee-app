import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee } from '../api/employeeApi';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await getAllEmployees();
            setEmployees(res.data.data);
        } catch (err) {
            showToast('Failed to fetch employees', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteEmployee(deleteModal.id);
            setEmployees(employees.filter((e) => e._id !== deleteModal.id));
            setDeleteModal({ show: false, id: null, name: '' });
            showToast('Employee deleted successfully', 'success');
        } catch (err) {
            showToast('Failed to delete employee', 'error');
        }
    };

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDept === '' || emp.department === filterDept;
        return matchesSearch && matchesDept;
    });

    const departments = [...new Set(employees.map((e) => e.department))];

    const getStatusClass = (status) => {
        if (status === 'Active') return 'badge badge-active';
        if (status === 'Inactive') return 'badge badge-inactive';
        return 'badge badge-leave';
    };

    const getInitials = (name) => {
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getAvatarColor = (name) => {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
        const idx = name.charCodeAt(0) % colors.length;
        return colors[idx];
    };

    return (
        <div className="page-container">
            {/* Toast */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employee Directory</h1>
                    <p className="page-subtitle">Manage and track your workforce</p>
                </div>
                <Link to="/add" className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Add Employee
                </Link>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div>
                        <p className="stat-label">Total Employees</p>
                        <p className="stat-value">{employees.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div>
                        <p className="stat-label">Active</p>
                        <p className="stat-value">{employees.filter((e) => e.status === 'Active').length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                    </div>
                    <div>
                        <p className="stat-label">Departments</p>
                        <p className="stat-value">{departments.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-orange">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="stat-label">Avg. Salary</p>
                        <p className="stat-value">
                            {employees.length
                                ? '₹' + Math.round(employees.reduce((s, e) => s + e.salary, 0) / employees.length).toLocaleString()
                                : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-bar">
                <div className="search-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, email or position..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="select-input" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                    <option value="">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="table-card">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading employees...</p>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <h3>No employees found</h3>
                        <p>{employees.length === 0 ? 'Start by adding your first employee.' : 'Try adjusting your search or filter.'}</p>
                        {employees.length === 0 && (
                            <Link to="/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add First Employee</Link>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Contact</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Salary</th>
                                    <th>Joining Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp._id}>
                                        <td>
                                            <div className="employee-cell">
                                                <div className="avatar" style={{ backgroundColor: getAvatarColor(emp.name) }}>
                                                    {getInitials(emp.name)}
                                                </div>
                                                <span className="employee-name">{emp.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-cell">
                                                <span>{emp.email}</span>
                                                <span className="phone">{emp.phone}</span>
                                            </div>
                                        </td>
                                        <td><span className="dept-tag">{emp.department}</span></td>
                                        <td>{emp.position}</td>
                                        <td className="salary">₹{emp.salary.toLocaleString()}</td>
                                        <td>{new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td><span className={getStatusClass(emp.status)}>{emp.status}</span></td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon btn-edit" onClick={() => navigate(`/edit/${emp._id}`)} title="Edit">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(emp._id, emp.name)} title="Delete">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, id: null, name: '' })}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        </div>
                        <h3 className="modal-title">Delete Employee</h3>
                        <p className="modal-msg">Are you sure you want to delete <strong>{deleteModal.name}</strong>? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setDeleteModal({ show: false, id: null, name: '' })}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;
