const fs = require('fs').promises;
const path = require('path');

// Path to data directory
const dataDir = path.join(__dirname, '..', 'data');

const cache = new Map(); // Basic in-memory cache implementation

// POST request to save the data
exports.saveData = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const filePath = path.join(dataDir, `${id}.json`);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Invalidate cache after saving data
    cache.delete(id);

    res.status(200).json({
      success: true,
      message: `Data saved successfully with ID: ${id}`
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET request for specific data
exports.getData = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the data is in the cache
    if (cache.has(id)) {
      console.log(`Cache hit for ID: ${id}`);
      return res.status(200).json(cache.get(id));
    }

    const filePath = path.join(dataDir, `${id}.json`);

    // Read the data from the file
    const fileData = await fs.readFile(filePath, 'utf8');

    try {
      const jsonData = JSON.parse(fileData);

      // Store the data in the cache
      cache.set(id, jsonData);

      // Return the data
      res.status(200).json(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({
        success: false,
        error: 'The stored file contains invalid JSON'
      });
    }
  } catch (error) {
    // Handle file not found
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        error: `Data with ID ${req.params.id} not found`
      });
    }

    console.error('Error retrieving data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET all data in the directory
exports.listAllData = async (req, res) => {
  try {
    // Read all files in the data directory
    const files = await fs.readdir(dataDir);

    const ids = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.slice(0, -5)); // Remove .json extension
    res.status(200).json({
      success: true,
      count: ids.length,
      ids
    });
  } catch (error) {
    console.error('Error listing data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// the bonus staff  
// DELETE request to remove data
exports.deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const filePath = path.join(dataDir, `${id}.json`);

    // Check if file exists
    await fs.access(filePath);
    await fs.unlink(filePath);

    // Invalidate cache
    cache.delete(id);

    res.status(200).json({
      success: true,
      message: `Data with ID ${id} deleted successfully`
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        error: `Data with ID ${req.params.id} not found`
      });
    }
    console.error('Error deleting data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT request to edit data
exports.updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const filePath = path.join(dataDir, `${id}.json`);

    // Check if file exists
    await fs.access(filePath);
    const fileData = await fs.readFile(filePath, 'utf8');
    const currentData = JSON.parse(fileData);

    // Merge new data with existing data
    const updatedData = { ...currentData, ...newData };

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    // Invalidate and update cache
    cache.delete(id);
    cache.set(id, updatedData);

    res.status(200).json({
      success: true,
      message: `Data with ID ${id} updated successfully`,
      data: updatedData
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        error: `Data with ID ${req.params.id} not found`
      });
    }
    console.error('Error updating data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};