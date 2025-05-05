const express = require('express');
const dataController = require('../controller/dataController.js');

// Initialize the express router
const router = express.Router();

// Middleware to check if the ID parameter is valid
const validateId = (req, res, next) => {
  const id = req.params.id;
  
  if (!id || id.includes('/') || id.includes('\\')) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  
  next();
};

// POST to save data
router.post('/:id', validateId, dataController.saveData);

// GET specific data
router.get('/:id', validateId, dataController.getData);

// GET all data
router.get('/', dataController.listAllData);


// the bonus /.... 
// DELETE to remove data
router.delete('/:id', validateId, dataController.deleteData);

// PUT to edit data
router.put('/:id', validateId, dataController.updateData);

module.exports = router;