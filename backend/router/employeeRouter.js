const express = require('express')
const router = express.Router();
const employeeController = require('../controller/employeeController')

router.get('/', employeeController);
router.post('/', employeeController);
router.put('/', employeeController);
router.delete('/', employeeController);

module.exports= router;