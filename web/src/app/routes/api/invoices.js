const express = require("express");
const router = express.Router();
const InvoiceController = require("../../controllers/api/invoice");
const { apiVerify } = require("../../../utilities/middlewares/verify");


router.get("/", apiVerify, InvoiceController.get);
router.post("/", apiVerify, InvoiceController.post);


module.exports = router;
