import validateRegion from '../dtos/region.js'
import { normalizeString } from '../modules/normalize.js'

export default class RegionService {

    constructor(database) {

        this.regionUrl = 'https://geo.api.gouv.fr/regions'
        this.database = database

        this.others = [
            { nom: 'Saint-Pierre-et-Miquelon', code: '05' },
            { nom: 'Saint-Barthélemy', code: '07' },
            { nom: 'Saint-Martin', code: '08' },
            { nom: 'Terres australes et antarctiques françaises', code: '14' },
            { nom: 'Wallis et Futuna', code: '16' },
            { nom: 'Polynésie française', code: '17' },
            { nom: 'Nouvelle-Calédonie', code: '18' },
            { nom: 'Île de Clipperton', code: '19' }
        ]

    }

    async fetchRegions() {

        const response = await fetch(this.regionUrl)
        const regions = await response.json()
        
        this.others.forEach(region => regions.push(region))
        regions.sort((a, b) => a.code - b.code).forEach(async region => {
            region.nom = normalizeString(region.nom)
            await this.createRegion(region)
            console.log(`Region "${region.code} - ${region.nom}" created successfully`)
        })

    }

    async getRegions() {

        const [ rows ] = await this.database.query('SELECT * FROM regions')
        return rows

    }

    async getRegionById(id) {

        const [ rows ] = await this.database.query('SELECT * FROM regions WHERE id = ?', id)
        return rows[0]

    }

    async getRegionsByName(name) {

        const [ rows ] = await this.database.query('SELECT * FROM regions WHERE name = ?', name)
        return rows

    }

    async createRegion(region) {

        const validatedRegion = validateRegion(region)
        const transformedRegion = { id: validatedRegion.code, name: validatedRegion.nom, country_id: "FR" }
        const [ result ] = await this.database.query('INSERT INTO regions SET ?', transformedRegion)

        return { message: `Region "${transformedRegion.id} - ${transformedRegion.name}" created successfully`, data: { id: result.insertId, ...transformedRegion } }

    }

    async updatedRegion(id, region) {

        const validatedRegion = validateRegion(region)
        const transformedRegion = { id: validatedRegion.code, name: validatedRegion.nom, country_id: "FR" }
        await this.database.query('UPDATE regions SET ? WHERE id = ?', [transformedRegion, id])

        return { message: `Region with ID ${transformedRegion.id} updated successfully`, data: { id, ...transformedRegion } }

    }

    async deleteRegion(id) {

        await this.database.query('DELETE FROM regions WHERE id = ?', id)
        return { message: `Region with ID ${id} deleted successfully` }
        
    }

}