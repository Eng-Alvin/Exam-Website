const router = require('express').Router();
const {
  getAllEstates,
  getMyEstates,
  getEstateById,
  createEstate,
  updateEstate,
  deleteEstate,
} = require('../controllers/estates.controller');
const { verifyToken, agentOnly } = require('../middleware/auth');

router.get('/', getAllEstates);
router.get('/mine', verifyToken, getMyEstates);
router.get('/:id', getEstateById);
router.post('/', verifyToken, createEstate);
router.put('/:id', verifyToken, agentOnly, updateEstate);
router.delete('/:id', verifyToken, agentOnly, deleteEstate);

module.exports = router;
