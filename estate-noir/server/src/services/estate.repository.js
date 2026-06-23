const Estate = require('../models/Estate');

const findAll = (filter) =>
  Estate.find(filter).populate('agent', 'username avatar').sort({ createdAt: -1 });

const findById = (id) =>
  Estate.findById(id).populate('agent', 'username avatar email');

const findByAgent = (agentId) =>
  Estate.find({ agent: agentId }).sort({ createdAt: -1 });

const create = (data) => Estate.create(data);

const updateById = (id, update) =>
  Estate.findByIdAndUpdate(id, update, { new: true, runValidators: true });

const deleteById = (id) => Estate.findByIdAndDelete(id);

module.exports = { findAll, findById, findByAgent, create, updateById, deleteById };
