const mongoose = require("mongoose");

// Replace 'YOUR_MONGODB_URL' with your actual MongoDB URL
const mongodbUrl = 'mongodb+srv://weebjs:Summer8455@cluster0.ikzk44n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongodbUrl);

const Warning = mongoose.model(
  "Warning",
  new mongoose.Schema({
    userId: { type: String, required: true },
    reason: { type: String, default: "None" },
    warnedBy: { type: String, required: true },
    warningId: { type: String, required: true },
  })
);

module.exports = Warning;