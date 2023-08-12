const router = require('express').Router();
const thoughtsRoute = require('./thoughts-routes');
const userRoute = require('./user-routes');

router.use('/thoughts', thoughtsRoute);
router.use('/user', userRoute);

module.exports = router;