import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Scenario from './models/Scenario.js';
import Settings from './models/Settings.js';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files for production
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyFakeKeyForLocalTesting");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twinforge')
  .then(() => console.log('✅ Connected to MongoDB twinforge database'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// -- API Routes --

// Get all saved scenarios
app.get('/api/scenarios', async (req, res) => {
  try {
    const scenarios = await Scenario.find().sort({ timestamp: -1 });
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new scenario
app.post('/api/scenarios', async (req, res) => {
  try {
    const newScenario = new Scenario(req.body);
    const saved = await newScenario.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Settings Routes ---
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'workforce_config' });
    if (!settings) {
      // Create default settings if not exists
      settings = new Settings({
        personas: {
          engineering: { headcount: 480 },
          sales: { headcount: 620 },
          operations: { headcount: 1300 }
        }
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { key: 'workforce_config' },
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Live AI Analysis via Gemini API
app.post('/api/analyze', async (req, res) => {
  try {
    const currentState = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
       console.log("No Gemini API key found. Simulating fallback AI response for prototype...");
       // Fallback logic if no API key is provided
       setTimeout(() => {
         res.json({
           analysisText: "High friction detected in MTTR and Shadow IT. Recommending AI Service Desk and MDM protocols.",
           recommendedToolIds: ["servicedesk_ai", "mdm_platform"]
         });
       }, 2000);
       return;
    }

    const prompt = `
      You are the "TwinForge AI Copilot", an expert Enterprise IT Consultant analyzing a digital twin simulation of a workforce of 2,400 employees.
      
      The current mathematical scores (out of 100) for the 8 IT dimensions are:
      - Hardware Performance: ${currentState.hardwarePerformance}/100
      - Network Reliability: ${currentState.networkReliability}/100
      - Software Integration: ${currentState.softwareIntegration}/100
      - IT Support MTTR (Time to Resolve): ${currentState.itSupportMTTR}/100 (Lower is worse, means slow resolution)
      - Shadow IT Risk: ${currentState.shadowItRisk}/100 (Higher is worse, means high risk)
      - Digital Dexterity: ${currentState.digitalDexterity}/100
      - Collaboration Effectiveness: ${currentState.collaborationEffectiveness}/100
      - Automation Coverage: ${currentState.automationCoverage}/100

      Available tools to recommend (Use the EXACT IDs if recommending):
      - copilot_ai (Microsoft 365 Copilot) - Boosts Automation & Dex
      - mac_fleet (Apple M3 Mac Fleet) - Boosts Hardware & MTTR
      - ztna (Zero Trust Network Access) - Drops Shadow IT, Boosts Network
      - servicedesk_ai (AI Service Desk) - Huge boost to MTTR
      - teams_rooms (Microsoft Teams Rooms) - Boosts Collaboration
      - mdm_platform (Unified Endpoint Management) - Drops Shadow IT, Boosts MTTR
      - digital_adoption (Digital Adoption Platform) - Huge boost to Dexterity
      - ipaas (Integration Platform iPaaS) - Huge boost to Integration & Automation

      Analyze the current scores. Identify the top 2-3 weakest friction points (scores under 60, or Shadow IT over 55).
      Recommend exactly the best matching tools from the list above to fix them.
      
      Respond STRICTLY in the following JSON format without Markdown formatting:
      {
         "analysisText": "A 2-3 sentence executive summary of the critical issues found.",
         "recommendedToolIds": ["tool_id_1", "tool_id_2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text(); // Await added here just in case
    
    const jsonString = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsedResponse = JSON.parse(jsonString);
    res.json(parsedResponse);
    
  } catch (error) {
    console.error("AI Analysis Error:", error);

    // If quota is exceeded (429) or any API error, return a smart rule-based fallback
    const status = error?.status || error?.httpStatusCode;
    if (status === 429 || error?.message?.toLowerCase().includes('quota') || error?.message?.toLowerCase().includes('too many')) {
      console.log("Rate limit hit — using smart rule-based fallback analysis...");
      const s = req.body;
      const weaknesses = [
        { score: s.itSupportMTTR, tool: 'servicedesk_ai', label: 'IT Support MTTR' },
        { score: s.shadowItRisk > 55 ? 0 : 100, tool: 'mdm_platform', label: 'Shadow IT Risk' },
        { score: s.digitalDexterity, tool: 'digital_adoption', label: 'Digital Dexterity' },
        { score: s.softwareIntegration, tool: 'ipaas', label: 'Software Integration' },
        { score: s.collaborationEffectiveness, tool: 'teams_rooms', label: 'Collaboration' },
        { score: s.automationCoverage, tool: 'copilot_ai', label: 'Automation Coverage' },
        { score: s.hardwarePerformance, tool: 'mac_fleet', label: 'Hardware Performance' },
        { score: s.networkReliability, tool: 'ztna', label: 'Network Reliability' },
      ].sort((a, b) => a.score - b.score).slice(0, 2);

      const toolIds = weaknesses.map(w => w.tool);
      const labels = weaknesses.map(w => w.label).join(' and ');
      return res.json({
        analysisText: `[Simulated] Critical friction detected in ${labels}. Immediate intervention is recommended to reduce employee experience degradation and restore operational efficiency across affected dimensions.`,
        recommendedToolIds: toolIds,
      });
    }

    res.status(500).json({ error: "Failed to run AI analysis", details: error.message });
  }
});

// SPA Fallback: Serve index.html for any unknown non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TwinForge API Server running on port ${PORT}`);
});
