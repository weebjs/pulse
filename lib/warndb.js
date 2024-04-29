const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

// Define the warning schema if it's not already defined
if (!mongoose.models.Warning) {
  const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    reason: { type: String, default: "None" },
    warnedBy: { type: String, required: true },
    warningId: { type: String, required: true },
  });

  // Create a model based on the warning schema
  mongoose.model("Warning", warningSchema);
}

// Replace 'YOUR_MONGODB_URL' with your actual MongoDB URL
const mongodbUrl =
  "mongodb+srv://weebjs:Summer8455@cluster0.ikzk44n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongodbUrl);

const Warning = mongoose.model("Warning");

async function saveWarning(targetId, reason, warnedBy) {
  const warning = new Warning({
    userId: targetId,
    reason,
    warnedBy,
    warningId: uuidv4().substr(0, 8), // Generate a short warning ID using UUID
  });
  await warning.save();
}

async function getWarningCount(targetId) {
  return await Warning.countDocuments({ userId: targetId });
}

module.exports = {
  saveWarning,
  getWarningCount,
};