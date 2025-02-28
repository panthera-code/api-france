import validateMunicipality from '../dtos/municipality.js'
import { normalizeString, arrayToString } from '../modules/normalize.js'

export default class MunicipalityService {

    constructor(database) {
        this.municipalityUrl = 'https://geo.api.gouv.fr/communes?&fields=nom,code,codesPostaux,mairie,population,codeDepartement'
        this.database = database
    }

    async fetchMunicipalities() {

        const response = await fetch(this.municipalityUrl)
        const municipalities = await response.json()

        municipalities.sort((a, b) => a.code - b.code).forEach(async municipality => {
            municipality.nom = normalizeString(municipality.nom)
            await this.createMunicipality(municipality)
            console.log(`Municipality "${municipality.code} - ${municipality.nom}" created successfully`)
        })

    }

    async getMunicipalities() {

        const [ rows ] = await this.database.query('SELECT * FROM municipalities')
        return rows

    }

    async getMunicipalityById(id) {

        const [ rows ] = await this.database.query('SELECT * FROM municipalities WHERE id = ?', id)
        return rows[0]

    }

    async getMunicipalitiesByName(name) {

        const [ rows ] = await this.database.query('SELECT * FROM municipalities WHERE name = ?', name)
        return rows

    }

    async createMunicipality(municipality) {

        const validatedMunicipality = validateMunicipality(municipality)
        const transformedMunicipality = { id: validatedMunicipality.code, name: validatedMunicipality.nom, postalCodes: arrayToString(validatedMunicipality.codesPostaux), coordinates: arrayToString(validatedMunicipality.mairie.coordinates), population: validatedMunicipality.population || 0, department_id: validatedMunicipality.codeDepartement }
        const [ result ] = await this.database.query('INSERT INTO municipalities SET ?', transformedMunicipality)

        return { message: `Municipality "${transformedMunicipality.id} - ${transformedMunicipality.nom}" created successfully`, data: { id: result.insertId, ...transformedMunicipality } }

    }

    async updatedMunicipality(id, municipality) {

        const validatedMunicipality = validateMunicipality(municipality)
        const transformedMunicipality = { id: validatedMunicipality.code, name: validatedMunicipality.nom, postalCodes: arrayToString(validatedMunicipality.codesPostaux), coordinates: arrayToString(validatedMunicipality.mairie.coordinates), population: validatedMunicipality.population || 0, department_id: validatedMunicipality.codeDepartement }
        await this.database.query('UPDATE municipalities SET ? WHERE id = ?', [transformedMunicipality, id])

        return { message: `Municipality with id ${id} updated successfully`, data: { id, ...transformedMunicipality } }

    }

    async deleteMunicipality(id) {

        await this.database.query('DELETE FROM municipalities WHERE id = ?', id)
        return { message: `Municipality with id ${id} deleted successfully` }

    }
    
}