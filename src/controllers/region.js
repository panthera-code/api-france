const express = require('express')
const router = express.Router()

const RegionService = require('../services/region')
const connection = require('../middlewares/connection')

router.get('/', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const regions = await regionService.getRegions()

        res.status(200).json(regions)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.get('/:id', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const region = await regionService.getRegionsById(req.params.id)

        if (!region) return res.status(404).json({ exception: 'Region not found' })
        res.status(200).json(region)

    } catch (error) {
        res.status(500).json({ error: error.message })    
    }

})

router.get('/:name', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const regions = await regionService.getRegionsByName(req.params.name)

        if (!regions.length) return res.status(404).json({ exception: 'Regions not found' })
        res.status(200).json(regions)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.post('/', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const result = await regionService.createRegion(req.body)

        res.status(201).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.put('/:id', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const result = await regionService.updateRegion(req.params.id, req.body)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

router.delete('/:id', connection, async (req, res) => {

    try {
        
        const regionService = new RegionService(req.database)
        const result = await regionService.deleteRegion(req.params.id)

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

})

module.exports = router