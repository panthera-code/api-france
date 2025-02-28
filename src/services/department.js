import validateDepartment from '../dtos/department.js'
import { normalizeString } from '../modules/normalize.js'

export default class DepartmentService {

    constructor(database) {

        this.departmentUrl = 'https://geo.api.gouv.fr/departements'
        this.database = database

        this.others = [
            { nom: 'Saint-Pierre-et-Miquelon', code: '975', codeRegion: '05' },
            { nom: 'Saint-Barthélemy', code: '977', codeRegion: '07' },
            { nom: 'Saint-Martin', code: '978', codeRegion: '08' },
            { nom: 'Terres australes et antarctiques françaises', code: '984', codeRegion: '14' },
            { nom: 'Wallis et Futuna', code: '986', codeRegion: '16' },
            { nom: 'Polynésie française', code: '987', codeRegion: '17' },
            { nom: 'Nouvelle-Calédonie', code: '988', codeRegion: '18' },
            { nom: 'Île de Clipperton', code: '989', codeRegion: '19' }
        ]

    }

    async fetchDepartments() {

        const response = await fetch(this.departmentUrl)
        const departments = await response.json()

        this.others.forEach(department => departments.push(department))
        departments.sort((a, b) => a.code - b.code).forEach(async department => {
            department.nom = normalizeString(department.nom)
            await this.createDepartment(department)
            console.log(`Department "${department.code} - ${department.nom}" created successfully`)
        })

    }

    async getDepartments() {

        const [ rows ] = await this.database.query('SELECT * FROM departments')
        return rows

    }

    async getDepartmentById(id) {

        const [ rows ] = await this.database.query('SELECT * FROM departments WHERE id = ?', id)
        return rows[0]

    }

    async getDepartmentsByName(name) {

        const [ rows ] = await this.database.query('SELECT * FROM departments WHERE name = ?', name)
        return rows

    }

    async createDepartment(department) {

        const validatedDepartment = validateDepartment(department)
        const transformedDepartment = { id: validatedDepartment.code, name: validatedDepartment.nom, region_id: validatedDepartment.codeRegion }
        const [ result ] = await this.database.query('INSERT INTO departments SET ?', transformedDepartment)

        return { message: `Department "${transformedDepartment.id} - ${transformedDepartment.nom}" created successfully`, data: { id: result.insertId, ...transformedDepartment } }

    }

    async updatedDepartment(id, department) {

        const validatedDepartment = validateDepartment(department)
        const transformedDepartment = { id: validatedDepartment.code, name: validatedDepartment.nom, region_id: validatedDepartment.codeRegion }
        await this.database.query('UPDATE departments SET ? WHERE id = ?', [transformedDepartment, id])

        return { message: `Department "${transformedDepartment.id} - ${transformedDepartment.nom}" updated successfully`, data: { id, ...transformedDepartment } }

    }

    async deleteDepartment(id) {

        await this.database.query('DELETE FROM departments WHERE id = ?', id)
        return { message: `Department with ID ${id} deleted successfully` }
        
    }

}