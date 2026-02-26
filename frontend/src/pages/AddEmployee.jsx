import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEmployee } from '../api/employeeApi';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Other'];

const initialForm = {
    name: '', email: '', phone: '', department: '', position: '',
    salary: '', joiningDate: '', status: 'Active',
};

function AddEmployee() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';
        if (!form.department) newErrors.department = 'Department is required';
        if (!form.position.trim()) newErrors.position = 'Position is required';
        if (!form.salary) newErrors.salary = 'Salary is required';
        else if (Number(form.salary) < 0) newErrors.salary = 'Salary must be positive';
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
            await createEmployee({ ...form, salary: Number(form.salary) });
            navigate('/', { state: { toast: 'Employee added successfully!' } });
        } catch (err) {
            setServerError(err.response?.data?.message || 'Failed to add employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Add New Employee</h1>
                    <p className="page-subtitle">Fill in the details to add a new team member</p>
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
                                    placeholder="John Doe" value={form.name} onChange={handleChange} />
                                {errors.name && <span className="error-msg">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address *</label>
                                <input type="email" name="email" className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    placeholder="john@company.com" value={form.email} onChange={handleChange} />
                                {errors.email && <span className="error-msg">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input type="tel" name="phone" className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                    placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
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
                                    placeholder="Software Engineer" value={form.position} onChange={handleChange} />
                                {errors.position && <span className="error-msg">{errors.position}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Salary (₹) *</label>
                                <input type="number" name="salary" className={`form-input ${errors.salary ? 'input-error' : ''}`}
                                    placeholder="50000" value={form.salary} onChange={handleChange} />
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
                                <><span className="spinner-sm"></span> Saving...</>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                        <polyline points="17 21 17 13 7 13 7 21" />
                                        <polyline points="7 3 7 8 15 8" />
                                    </svg>
                                    Save Employee
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
