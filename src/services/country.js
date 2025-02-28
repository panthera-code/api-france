import validateCountry from '../dtos/country.js'

export default class CountryService {

    constructor(database) {
        this.database = database
    }

    async fetchCountries() {
        
        const countries = [{ "name": "France", "code": "FR"}]
        countries.forEach(async country => {
            await this.createCountry(country)
            console.log(`Country "${country.code} - ${country.name}" created successfully`)
        })

    }

    async getCountries() {
        
        const [ rows ] = await this.database.query('SELECT * FROM countries')
        return rows

    }

    async getCountryById(id) {

        const [ rows ] = await this.database.query('SELECT * FROM countries WHERE id = ?', id)
        return rows[0]

    }

    async getCountriesByName(name) {

        const [ rows ] = await this.database.query('SELECT * FROM countries WHERE name = ?', name)
        return rows

    }

    async createCountry(country) {

        const validatedCountry = validateCountry(country)
        const transformedCountry = { id: validatedCountry.code, name: validatedCountry.name }
        const [ result ] = await this.database.query('INSERT INTO countries SET ?', transformedCountry)
        
        return { message: `Country "${transformedCountry.id} - ${transformedCountry.name}" created successfully`, data: { id: result.insertId, ...transformedCountry } }
        
    }
    
    async updatedCountry(id, country) {
        
        const validatedCountry = validateCountry(country)
        const transformedCountry = { id: validatedCountry.code, name: validatedCountry.name }
        await this.database.query('UPDATE countries SET ? WHERE id = ?', [transformedCountry, id])

        return { message: `Country with ID ${transformedCountry.id} updated successfully`, data: { id, ...transformedCountry } }

    }

    async deleteCountry(id) {

        await this.database.query('DELETE FROM countries WHERE id = ?', id)
        return { message: `Country with ID ${id} deleted successfully` }

    }
    
}