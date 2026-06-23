const User = require('../models/User');

const findById = (id) => User.findById(id);

const findByEmail = (email) => User.findOne({ email });

const findByEmailOrUsername = (email, username) =>
  User.findOne({ $or: [{ email }, { username }] });

const create = (data) => User.create(data);

const updateById = (id, update) =>
  User.findByIdAndUpdate(id, update, { new: true, runValidators: true });

module.exports = { findById, findByEmail, findByEmailOrUsername, create, updateById };
