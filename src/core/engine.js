export const baselineState = {
  hardwarePerformance: 52,
  networkReliability: 61,
  softwareIntegration: 44,
  itSupportMTTR: 38,
  shadowItRisk: 67,
  digitalDexterity: 49,
  collaborationEffectiveness: 55,
  automationCoverage: 31,
}

export const personas = {
  engineering: {
    label: "Engineering",
    color: "#00d4ff",
    headcount: 480,
    weights: {
      hardwarePerformance: 1.4,
      networkReliability: 1.2,
      softwareIntegration: 1.3,
      itSupportMTTR: 0.8,
      shadowItRisk: 0.9,
      digitalDexterity: 1.1,
      collaborationEffectiveness: 0.9,
      automationCoverage: 1.5,
    }
  },
  sales: {
    label: "Sales",
    color: "#7c3aed",
    headcount: 620,
    weights: {
      hardwarePerformance: 0.9,
      networkReliability: 1.3,
      softwareIntegration: 1.1,
      itSupportMTTR: 1.4,
      shadowItRisk: 1.2,
      digitalDexterity: 1.0,
      collaborationEffectiveness: 1.5,
      automationCoverage: 0.8,
    }
  },
  operations: {
    label: "Operations",
    color: "#10b981",
    headcount: 1300,
    weights: {
      hardwarePerformance: 1.0,
      networkReliability: 1.0,
      softwareIntegration: 1.2,
      itSupportMTTR: 1.3,
      shadowItRisk: 1.1,
      digitalDexterity: 0.9,
      collaborationEffectiveness: 1.1,
      automationCoverage: 1.3,
    }
  }
}

export function computeMetrics(state) {
  const raw = {
    productivity: (state.hardwarePerformance * 0.25 + state.networkReliability * 0.2 + state.softwareIntegration * 0.2 + state.automationCoverage * 0.2 + state.digitalDexterity * 0.15) / 100,
    collaboration: (state.collaborationEffectiveness * 0.4 + state.networkReliability * 0.3 + state.softwareIntegration * 0.3) / 100,
    experience: (state.hardwarePerformance * 0.2 + state.itSupportMTTR * 0.25 + state.digitalDexterity * 0.2 + state.collaborationEffectiveness * 0.2 + (100 - state.shadowItRisk) * 0.15) / 100,
    security: ((100 - state.shadowItRisk) * 0.5 + state.softwareIntegration * 0.3 + state.digitalDexterity * 0.2) / 100,
    adoption: (state.digitalDexterity * 0.35 + state.itSupportMTTR * 0.3 + state.collaborationEffectiveness * 0.35) / 100,
    efficiency: (state.automationCoverage * 0.4 + state.itSupportMTTR * 0.3 + state.softwareIntegration * 0.3) / 100,
  }
  const exScore = Math.round((raw.productivity + raw.experience + raw.adoption) / 3 * 100)
  const baselineROI = 38
  const roi = Math.round(baselineROI + (exScore - 52) * 1.8 + Math.sin((exScore - 52) * 0.05) * 2)
  return { ...raw, exScore, roi, scores: Object.fromEntries(Object.entries(raw).map(([k,v]) => [k, Math.round(v * 100)])) }
}

export function computePersonaMetrics(state, customPersonas = null) {
  const activePersonas = customPersonas || personas;
  return Object.fromEntries(
    Object.entries(activePersonas).map(([key, persona]) => {
      // Use weights from the default personas if not provided in custom
      const weights = persona.weights || personas[key].weights;
      const weighted = {}
      Object.keys(state).forEach(dim => {
        weighted[dim] = Math.min(100, Math.round(state[dim] * (weights[dim] || 1)))
      })
      return [key, { 
        ...computeMetrics(weighted), 
        persona: persona.label || personas[key].label, 
        color: persona.color || personas[key].color,
        headcount: persona.headcount
      }]
    })
  )
}

export const marketplaceTools = [
  {
    id: "copilot_ai",
    name: "Microsoft 365 Copilot",
    vendor: "Microsoft",
    category: "AI Productivity",
    price: 360,
    priceLabel: "$360/user/yr",
    description: "Embedded AI across Word, Excel, Teams, and Outlook. Automates repetitive tasks and drafts content.",
    icon: "Sparkles",
    effects: { digitalDexterity: +18, collaborationEffectiveness: +14, automationCoverage: +22, softwareIntegration: +8 },
    tag: "Most Popular"
  },
  {
    id: "mac_fleet",
    name: "Apple M3 Mac Fleet Refresh",
    vendor: "Apple",
    category: "Hardware",
    price: 1800,
    priceLabel: "$1,800/device avg",
    description: "Replace aging Windows devices with M3 MacBook Pros. Faster boot, better battery, less IT tickets.",
    icon: "Monitor",
    effects: { hardwarePerformance: +28, itSupportMTTR: +18, digitalDexterity: +10, shadowItRisk: -8 },
    tag: "High Impact"
  },
  {
    id: "ztna",
    name: "Zero Trust Network Access",
    vendor: "Zscaler",
    category: "Network & Security",
    price: 120,
    priceLabel: "$120/user/yr",
    description: "Replace legacy VPN with ZTNA. Faster, more secure, no more dropped connections for remote workers.",
    icon: "Shield",
    effects: { networkReliability: +24, shadowItRisk: -30, softwareIntegration: +10 },
    tag: "Security"
  },
  {
    id: "servicedesk_ai",
    name: "AI-Powered Service Desk",
    vendor: "ServiceNow",
    category: "IT Support",
    price: 180,
    priceLabel: "$180/user/yr",
    description: "Automated ticket triage, self-service portal, and AI chatbot resolve 60% of issues without human agents.",
    icon: "HeadphonesIcon",
    effects: { itSupportMTTR: +35, digitalDexterity: +8, collaborationEffectiveness: +6, shadowItRisk: -10 },
    tag: "ROI Leader"
  },
  {
    id: "teams_rooms",
    name: "Microsoft Teams Rooms",
    vendor: "Microsoft",
    category: "Collaboration",
    price: 2200,
    priceLabel: "$2,200/room avg",
    description: "Equip every meeting room with Teams-integrated AV hardware. Ends the 10-minute meeting setup problem.",
    icon: "Video",
    effects: { collaborationEffectiveness: +22, networkReliability: +8, digitalDexterity: +6 },
    tag: null
  },
  {
    id: "mdm_platform",
    name: "Unified Endpoint Management",
    vendor: "Jamf / Intune",
    category: "Device Management",
    price: 96,
    priceLabel: "$96/device/yr",
    description: "Single pane of glass for all devices. Automated patching, compliance, and app deployment.",
    icon: "Cpu",
    effects: { hardwarePerformance: +12, itSupportMTTR: +20, shadowItRisk: -18, softwareIntegration: +14 },
    tag: null
  },
  {
    id: "digital_adoption",
    name: "Digital Adoption Platform",
    vendor: "WalkMe",
    category: "Training & Adoption",
    price: 85,
    priceLabel: "$85/user/yr",
    description: "In-app guided workflows and real-time help overlays that train employees inside the tools they use daily.",
    icon: "GraduationCap",
    effects: { digitalDexterity: +25, collaborationEffectiveness: +10, shadowItRisk: -12, automationCoverage: +8 },
    tag: "Adoption+"
  },
  {
    id: "ipaas",
    name: "Integration Platform (iPaaS)",
    vendor: "MuleSoft",
    category: "Integration",
    price: 240,
    priceLabel: "$240/user/yr",
    description: "Connect all enterprise apps via APIs. Eliminates data silos and manual re-entry between systems.",
    icon: "GitMerge",
    effects: { softwareIntegration: +30, automationCoverage: +18, shadowItRisk: -15, collaborationEffectiveness: +8 },
    tag: "Integration"
  }
]

export const optimalState = {
  hardwarePerformance: 88,
  networkReliability: 91,
  softwareIntegration: 85,
  itSupportMTTR: 87,
  shadowItRisk: 18,
  digitalDexterity: 84,
  collaborationEffectiveness: 89,
  automationCoverage: 79,
}

export function detectFrictionPoints(state) {
  const issues = []
  if (state.itSupportMTTR < 50) issues.push({ dim: "itSupportMTTR", label: "IT Support MTTR", severity: "critical", recommendation: "AI-Powered Service Desk", toolId: "servicedesk_ai" })
  if (state.shadowItRisk > 55) issues.push({ dim: "shadowItRisk", label: "Shadow IT Risk", severity: "critical", recommendation: "Zero Trust Network Access + UEM", toolId: "ztna" })
  if (state.hardwarePerformance < 60) issues.push({ dim: "hardwarePerformance", label: "Hardware Performance", severity: "high", recommendation: "M3 Mac Fleet Refresh", toolId: "mac_fleet" })
  if (state.digitalDexterity < 55) issues.push({ dim: "digitalDexterity", label: "Digital Dexterity", severity: "high", recommendation: "Digital Adoption Platform", toolId: "digital_adoption" })
  if (state.softwareIntegration < 55) issues.push({ dim: "softwareIntegration", label: "Software Integration", severity: "medium", recommendation: "iPaaS Integration Platform", toolId: "ipaas" })
  if (state.automationCoverage < 45) issues.push({ dim: "automationCoverage", label: "Automation Coverage", severity: "medium", recommendation: "Microsoft 365 Copilot AI", toolId: "copilot_ai" })
  return issues
}
