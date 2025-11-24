require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Lead = require('./models/Lead');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Health check
app.get('/', (req, res) => {
  res.send("Angi Lead Integration is running!");
});

// API endpoint for Angi leads
app.post('/angi-leads', async (req, res) => {
  try {
    const leadData = req.body;

    // Save lead to database
    const lead = new Lead(leadData);
    await lead.save();

    // Send email to lead
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lead.Email,
      subject: `Hello ${lead.FirstName}, let's book your appointment!`,
      text: `Hi ${lead.FirstName},\n\nThanks for your interest! We will contact you shortly to schedule your appointment.\n\n- Your Service Team`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond success to Angi
    res.status(200).send(`<success>job number ${lead._id}</success>`);

  } catch (err) {
    console.error(err);
    res.status(500).send(`<error>${err.message}</error>`);
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
