const express = require("express");
const router = express.Router();
const {
    getDevices,
    getDevice,
    createDevice,
    updateDevice,
    deleteDevice
} = require("../controllers/deviceController");

router.route("/")
    .get(getDevices)
    .post(createDevice);

router.route("/:id")
    .get(getDevice)
    .put(updateDevice)
    .delete(deleteDevice);

module.exports = router;
