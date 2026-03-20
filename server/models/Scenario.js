import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  state: {
    hardwarePerformance: Number,
    networkReliability: Number,
    softwareIntegration: Number,
    itSupportMTTR: Number,
    shadowItRisk: Number,
    digitalDexterity: Number,
    collaborationEffectiveness: Number,
    automationCoverage: Number,
  },
  tools: [String],
  metrics: {
    exScore: Number,
    roi: Number,
    scores: {
      productivity: Number,
      collaboration: Number,
      experience: Number,
      security: Number,
      adoption: Number,
      efficiency: Number
    }
  }
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

export default Scenario;
