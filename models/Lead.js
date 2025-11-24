const mongoose = require('mongoose');

const PostalAddressSchema = new mongoose.Schema({
  AddressFirstLine: String,
  AddressSecondLine: String,
  City: String,
  State: String,
  PostalCode: String
});

const LeadSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  PostalAddress: PostalAddressSchema,
  Email: { type: String, required: true },
  Source: String,
  Description: String,
  Category: String,
  Urgency: String,
  CorrelationId: String,
  ALAccountId: String,
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
