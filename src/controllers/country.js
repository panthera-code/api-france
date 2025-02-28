const express = require('express')
const router = express.Router()

const CountryService = require('../services/country')
const connection = require('../middlewares/connection')

router.get('/', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const countries = await countryService.getCountries()

        res.status(200).json(countries)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:id', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const country = await countryService.getCountryById(req.params.id)

        if (!country) return res.status(404).json({ exception: 'Country not found' })
        res.status(200).json(country)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:name', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const countries = await countryService.getCountriesByName(req.params.name)

        if (!countries.length) return res.status(404).json({ exception: 'Countries not found' })
        res.status(200).json(countries)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.post('/', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const result = await countryService.createCountry(req.body)

        res.status(201).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.put('/:id', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const result = await countryService.updateCountry(req.params.id, req.body)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete('/:id', connection, async (req, res) => {

    try {
        
        const countryService = new CountryService(req.database)
        const result = await countryService.deleteCountry(req.params.id)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router