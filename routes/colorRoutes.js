const express = require("express");
const router = express.Router();
const colorController = require("../controllers/colorController");

router.get("/color", colorController.generateColor);
router.get("/saved", colorController.getSavedColors);
router.post("/save", colorController.saveColor);
router.delete("/saved/:id", colorController.deleteColor);

module.exports = router;
