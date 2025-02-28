const express = require('express')
const router = express.Router()

const DepartmentService = require('../services/department')
const connection = require('../middlewares/connection')

router.get('/', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const departments = await departmentService.getDepartments()

        res.status(200).json(departments)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:id', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const department = await departmentService.getDepartmentsById(req.params.id)

        if (!department) return res.status(404).json({ exception: 'Department not found' })
        res.status(200).json(department)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:name', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const departments = await departmentService.getDepartmentsByName(req.params.name)

        if (!departments.length) return res.status(404).json({ exception: 'Departments not found' })
        res.status(200).json(departments)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.post('/', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const result = await departmentService.createDepartment(req.body)

        res.status(201).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.put('/:id', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const result = await departmentService.updateDepartment(req.params.id, req.body)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete('/:id', connection, async (req, res) => {

    try {
        
        const departmentService = new DepartmentService(req.database)
        const result = await departmentService.deleteDepartment(req.params.id)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router