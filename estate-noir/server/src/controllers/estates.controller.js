const estateRepo = require('../services/estate.repository');

const getAllEstates = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, category, listingType } = req.query;
    const filter = {};
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (category) filter.category = category;
    if (listingType) filter.listingType = listingType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const estates = await estateRepo.findAll(filter);
    res.json({ estates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyEstates = async (req, res) => {
  try {
    const estates = await estateRepo.findByAgent(req.agent.id);
    res.json({ estates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEstateById = async (req, res) => {
  try {
    const estate = await estateRepo.findById(req.params.id);
    if (!estate) return res.status(404).json({ message: 'Estate not found' });
    res.json({ estate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEstate = async (req, res) => {
  try {
    const { title, description, price, city, country, category, listingType, images } = req.body;
    if (!title || !description || !price || !city || !country || !category || !listingType || !images?.length) {
      return res.status(400).json({ message: 'All fields including at least one image are required' });
    }
    const estate = await estateRepo.create({
      title,
      description,
      price: Number(price),
      city,
      country,
      category,
      listingType,
      images,
      agent: req.agent.id,
    });
    res.status(201).json({ estate });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateEstate = async (req, res) => {
  try {
    const { title, description, price, city, country, category, listingType, images } = req.body;
    const update = {};
    if (title) update.title = title;
    if (description) update.description = description;
    if (price) update.price = Number(price);
    if (city) update.city = city;
    if (country) update.country = country;
    if (category) update.category = category;
    if (listingType) update.listingType = listingType;
    if (images?.length) update.images = images;

    const estate = await estateRepo.updateById(req.params.id, update);
    res.json({ estate });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteEstate = async (req, res) => {
  try {
    await estateRepo.deleteById(req.params.id);
    res.json({ message: 'Estate removed from the market' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEstates, getMyEstates, getEstateById, createEstate, updateEstate, deleteEstate };
