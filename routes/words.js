const express = require('express');

const {
    getWords,
    createWord,
    updateWord,
    deleteWord,
    updateWordsProficiency
} = require('../controllers/words');


const router = express.Router({
    mergeParams: true
});

const {
    protect
} = require('../middleware/auth');


router.use(protect);

router
    .route('/')
    .get(getWords)
    .post(createWord);

router.route('/results')
    .put(updateWordsProficiency);

router.route('/:id')
    .put(updateWord)
    .delete(deleteWord);


module.exports = router;