const express = require("express");
const path = require("path");

const connectDB = require("./db");
const Donation = require("./Donation");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Home Page - GET API
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST API - Save Donation
app.post("/donate", async function (req, res) {
  try {
    const donation = new Donation({
      donorName: req.body.donorName,
      foodName: req.body.foodName,
      quantity: req.body.quantity,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
      expiry: req.body.expiry,
      description: req.body.description,
    });

    await donation.save();

    res.status(201).send("Donation Saved Successfully!");
  } catch (error) {
    console.log("Donation Error:", error);
    res.status(400).send("Error Saving Donation: " + error.message);
  }
});

// GET API - Display All Donations
app.get("/donations", async function (req, res) {
  try {
    const donations = await Donation.find();

    res.status(200).json(donations);
  } catch (error) {
    console.log("Fetch Error:", error);
    res.status(500).send("Error Fetching Donations");
  }
});

// PUT API - Update Donation
app.put("/donations/:id", async function (req, res) {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDonation) {
      return res.status(404).send("Donation Not Found");
    }

    res.status(200).json({
      message: "Donation Updated Successfully!",
      donation: updatedDonation,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(400).send("Error Updating Donation");
  }
});

// Start Server After Database Connection
async function startServer() {
  await connectDB();

  console.log("MongoDB Connected Successfully");

  app.listen(5000, function () {
    console.log("FoodSave Server running on port 5000");
  });
}

// DELETE API - Delete Single Donation

app.delete("/donations/:id", async function (req, res) {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);

    if (!deletedDonation) {
      return res.status(404).send("Donation Not Found");
    }

    res.status(200).json({
      message: "Donation Deleted Successfully!",
      donation: deletedDonation,
    });
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(400).send("Error Deleting Donation");
  }
});

startServer().catch(function (error) {
  console.log("Server Startup Error:", error);
});
