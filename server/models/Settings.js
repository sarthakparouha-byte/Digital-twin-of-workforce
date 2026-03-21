import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'workforce_config', unique: true },
  orgName: { type: String, default: 'TwinForge AI' },
  industry: { type: String, default: 'Technology' },
  totalEmployees: { type: Number, default: 2400 },
  avgSalary: { type: Number, default: 85000 },
  personas: {
    engineering: { headcount: Number },
    sales: { headcount: Number },
    operations: { headcount: Number }
  },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
