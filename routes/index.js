const router = require('express').Router();

// Import API routes
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req,res) => res.send('Wrong Route!'));

module.exports - router;