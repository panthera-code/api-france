const express = require('express')
const router = express.Router()

const MunicipalityService = require('../services/municipality')
const connection = require('../middlewares/connection')

router.get('/', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const municipalities = await municipalityService.getMunicipalities()

        res.status(200).json(municipalities)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:id', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const municipality = await municipalityService.getMunicipalityById(req.params.id)

        if (!municipality) return res.status(404).json({ exception: 'Municipality not found' })
        res.status(200).json(municipality)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:name', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const municipalities = await municipalityService.getMunicipalityByName(req.params.name)

        if (!municipalities.length) return res.status(404).json({ exception: 'Municipality not found' })
        res.status(200).json(municipalities)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.post('/', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const result = await municipalityService.createMunicipality(req.body)

        res.status(201).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.put('/:id', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const result = await municipalityService.updateMunicipality(req.params.id, req.body)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete('/:id', connection, async (req, res) => {

    try {
        
        const municipalityService = new MunicipalityService(req.database)
        const result = await municipalityService.deleteMunicipality(req.params.id)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router