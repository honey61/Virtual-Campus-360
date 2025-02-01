
// charkip  lsof -i :8001,kill  kill -9 <PID> 


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// MongoDB connection
mongoose.connect(
  "link of mongoos db",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define the Admission schema
const admissionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  email: String,
});

// Create the Admission model
const Admission = mongoose.model("Admission", admissionSchema);

// Define the Visitor schema
const visitorSchema = new mongoose.Schema({
  email: String,
  timestamp: { type: Date, default: Date.now }, // Store the time of email submission
});

// Create the Visitor model
const Visitor = mongoose.model("Visitor", visitorSchema);

// POST route to save form data
app.post("/admissions", async (req, res) => {
  const { name, phone, address, email } = req.body;

  try {
    const newAdmission = new Admission({ name, phone, address, email });
    await newAdmission.save();
    res.status(201).send("Form data saved successfully.");
  } catch (error) {
    res.status(500).send("Error saving data: " + error.message);
  }
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail as the service
  auth: {
    user: "", // Your Gmail account
    pass: "", // Replace with your Gmail App Password
  },
});

// Route to handle sending emails
app.post("/send-email", async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  // Save email to Visitor collection
  try {
    const newVisitor = new Visitor({ email });
    await newVisitor.save();

    const mailOptions = {
      from: "your gmail",
      to: email,
      subject: "Thank You for Exploring VirtualCampus360!",
      text: `Dear Visitor,
      
      Thank you for taking the time to explore VirtualCampus360. We hope our platform provided you with all the information and insights you were looking for.
      
      Should you have any further questions or require assistance, please do not hesitate to reach out.
      
      Best regards,
      Harvinder Singh
      Email:
      VirtualCampus360 Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: "Email not sent.", error });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ success: true, message: "Email sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error saving visitor data:", error);
    return res.status(500).json({ success: false, message: "Error saving visitor data.", error });
  }
});

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
