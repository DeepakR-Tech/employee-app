const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Other'],
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true,
        },
        salary: {
            type: Number,
            required: [true, 'Salary is required'],
            min: 0,
        },
        joiningDate: {
            type: Date,
            required: [true, 'Joining date is required'],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'On Leave'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
