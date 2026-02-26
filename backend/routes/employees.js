const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create employee
router.post('/', async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT update employee
router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
