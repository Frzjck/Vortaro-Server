const express = require('express');
const {
    get
} = require('express/lib/response');

const {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
} = require('../controllers/groups');

const {
    protect
} = require('../middleware/auth');

// Include other resource routers
const wordRouter = require('./words');

const router = express.Router();


router.use(protect);

// Re-route into other resource routers
router.use('/:groupId/words', wordRouter);

router.route("/")
    .get(getGroups)
    .post(createGroup);
router.route("/:id")
    .get(getGroup)
    .put(updateGroup)
    .delete(deleteGroup);

module.exports = router;