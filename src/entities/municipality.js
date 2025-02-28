export default class Municipality {

    constructor(name, code, postalCodes, coordinates, population, departmentId) {
        this.id = code
        this.name = name
        this.postalCodes = postalCodes
        this.coordinates = coordinates
        this.population = population
        this.departmentId = departmentId
    }
    
}