const express = require("express")
const verifyToken = require("../middleware/verify-token.js")
const GameStat = require("../models/gameStat.js")
const router = express.Router()

router.get("/", verifyToken, async (req, res) => {
    try {   
        const games = await GameStat.find({}).populate("player")
        res.status(200).json(games)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.get("/:gameId", verifyToken, async (req, res) => {
    try {
        const game = await GameStat.findById(req.params.gameId).populate("player")
        res.status(200).json(game)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.player = req.user._id
        const game = await GameStat.create(req.body)
        game._doc.player = req.user
        res.status(201).json(game)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.put("/:gameId", verifyToken, async (req, res) => {
    try {
        const game = await GameStat.findById(req.params.gameId)
        if (!game.player.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to edit a game that is not yours")
        } 
        const updatedGame = await GameStat.findByIdAndUpdate(
            req.params.gameId, req.body, { new: true })

        updatedGame._doc.player = req.user
        res.status(200).json(updatedGame)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.delete("/:gameId", verifyToken, async (req, res) => {
    try {
        const game = await GameStat.findById(req.params.gameId)
        if (!game.player.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to delete a game that is not yours")
        }
        const deletedGame = await GameStat.findByIdAndDelete(req.params.gameId)
        res.status(200).json(deletedGame)
    } catch (err) {
        res.status(500).json({err: err.message })
    }
})




module.exports = router
