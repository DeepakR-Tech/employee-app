import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../api/employeeApi';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Other'];

function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', department: '', position: '',
        salary: '', joiningDate: '', status: 'Active',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await getEmployeeById(id);
                const emp = res.data.data;
                setForm({
                    name: emp.name,
                    email: emp.email,
                    phone: emp.phone,
                    department: emp.department,
                    position: emp.position,
                    salary: emp.salary,
                    joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
                    status: emp.status,
                });
            } catch (err) {
                setServerError('Failed to load employee data.');
            } finally {
                setFetching(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';
        if (!form.department) newErrors.department = 'Department is required';
        if (!form.position.trim()) newErrors.position = 'Position is required';
        if (!form.salary) newErrors.salary = 'Salary is required';
        if (!form.joiningDate) newErrors.joiningDate = 'Joining date is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validErrors = validate();
        if (Object.keys(validErrors).length > 0) {
            setErrors(validErrors);
            return;
        }
        try {
            setLoading(true);
            setServerError('');
            await updateEmployee(id, { ...form, salary: Number(form.salary) });
            navigate('/', { state: { toast: 'Employee updated successfully!' } });
        } catch (err) {
            setServerError(err.response?.data?.message || 'Failed to update employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="page-container">
                <div className="loading-state" style={{ minHeight: '60vh' }}>
                    <div className="spinner"></div>
                    <p>Loading employee data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Employee</h1>
                    <p className="page-subtitle">Update the employee's information below</p>
                </div>
                <Link to="/" className="btn btn-ghost">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                    </svg>
                    Back
                </Link>
            </div>

            <div className="form-card">
                {serverError && <div className="alert alert-error">{serverError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input type="text" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`}
                                    value={form.name} onChange={handleChange} />
                                {errors.name && <span className="error-msg">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input type="email" name="email" className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    value={form.email} onChange={handleChange} />
                                {errors.email && <span className="error-msg">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input type="tel" name="phone" className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                    value={form.phone} onChange={handleChange} />
                                {errors.phone && <span className="error-msg">{errors.phone}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-divider" />

                    <div className="form-section">
                        <h3 className="form-section-title">Job Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select name="department" className={`form-input ${errors.department ? 'input-error' : ''}`}
                                    value={form.department} onChange={handleChange}>
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {errors.department && <span className="error-msg">{errors.department}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Position / Role *</label>
                                <input type="text" name="position" className={`form-input ${errors.position ? 'input-error' : ''}`}
                                    value={form.position} onChange={handleChange} />
                                {errors.position && <span className="error-msg">{errors.position}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Salary (₹) *</label>
                                <input type="number" name="salary" className={`form-input ${errors.salary ? 'input-error' : ''}`}
                                    value={form.salary} onChange={handleChange} />
                                {errors.salary && <span className="error-msg">{errors.salary}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Joining Date *</label>
                                <input type="date" name="joiningDate" className={`form-input ${errors.joiningDate ? 'input-error' : ''}`}
                                    value={form.joiningDate} onChange={handleChange} />
                                {errors.joiningDate && <span className="error-msg">{errors.joiningDate}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select name="status" className="form-input" value={form.status} onChange={handleChange}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/" className="btn btn-ghost">Cancel</Link>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <><span className="spinner-sm"></span> Updating...</>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Update Employee
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmployee;
