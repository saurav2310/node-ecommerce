const express = require('express');
const { fetchCatrgories, createCategory } = require('../controller/Category');
const router = express.Router();


router.get('/',fetchCatrgories).post('/',createCategory);

exports.router = router;