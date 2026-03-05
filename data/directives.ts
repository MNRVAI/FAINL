
export interface Directive {
  id: string;
  title: string;
  category: string;
  subject: string;
  query: string;
  difficulty: 'Alpha' | 'Beta' | 'Gamma';
  length: 'Short' | 'Medium' | 'Long';
  nodesNeeded: number;
  popularity: number; // 1-100
  rating: number; // Reset to 0
}

export const DIRECTIVES: Directive[] = [
  // --- PREVIOUS CATEGORIES (RESET RATINGS) ---
  {
    id: 'd1',
    title: "Grand Strategy",
    category: "Geopolitics",
    subject: "Resource Scarcity",
    query: "Analyze the long-term viability of a space-based manufacturing hub and its impact on terrestrial resource scarcity.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 95,
    rating: 0
  },
  {
    id: 'd2',
    title: "Logic Auditor",
    category: "Philosophy",
    subject: "UBI Discourse",
    query: "Identify logical fallacies in this argument for universal basic income being the only solution to automation-driven unemployment.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 78,
    rating: 0
  },
  {
    id: 'd3',
    title: "Code Architect",
    category: "Software",
    subject: "Distributed Systems",
    query: "Propose a secure, scalable architecture for a peer-to-peer voting system that prevents double-voting without a centralized authority.",
    difficulty: "Beta",
    length: "Long",
    nodesNeeded: 4,
    popularity: 88,
    rating: 0
  },
  {
    id: 'd4',
    title: "Eco-Consensus",
    category: "Ecology",
    subject: "Reforestation",
    query: "Synthesize a plan for global reforestation that balances carbon capture efficiency with local biodiversity preservation.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 92,
    rating: 0
  },
  {
    id: 'd5',
    title: "Market Oracle",
    category: "Finance",
    subject: "Predictive Analysis",
    query: "Predict the impact of quantum computing on traditional blockchain encryption protocols and subsequent market volatility.",
    difficulty: "Gamma",
    length: "Medium",
    nodesNeeded: 5,
    popularity: 85,
    rating: 0
  },

  // --- FUNNY ---
  {
    id: 'f1',
    title: "Sarcasm Synthesizer",
    category: "Funny",
    subject: "Existential Humour",
    query: "Write a 5-star restaurant review for a place that only serves digital breadcrumbs and existential dread.",
    difficulty: "Alpha",
    length: "Short",
    nodesNeeded: 2,
    popularity: 91,
    rating: 0
  },
  {
    id: 'f2',
    title: "Absurdist Dialogue",
    category: "Funny",
    subject: "AI Confusion",
    query: "Simulate a debate between a toaster and a smart fridge about the philosophical necessity of bread.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 2,
    popularity: 84,
    rating: 0
  },

  // --- LIFE CHOICES ---
  {
    id: 'lc1',
    title: "Digital Nomad Sync",
    category: "Life Choices",
    subject: "Lifestyle Optimization",
    query: "Analyze the long-term mental health impact and productivity trade-offs of living out of a suitcase for 36 months.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 77,
    rating: 0
  },
  {
    id: 'lc2',
    title: "Career Pivot Logic",
    category: "Life Choices",
    subject: "Strategic Transition",
    query: "Draft a 12-month transition plan from a high-stress corporate role to a sustainable self-sufficient farming collective.",
    difficulty: "Beta",
    length: "Long",
    nodesNeeded: 4,
    popularity: 82,
    rating: 0
  },

  // --- RELATIONSHIPS ---
  {
    id: 'r1',
    title: "Empathy Protocol",
    category: "Relationships",
    subject: "Conflict Resolution",
    query: "Identify the three most likely miscommunications in a long-distance relationship between an extreme extrovert and a deep introvert.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 89,
    rating: 0
  },
  {
    id: 'r2',
    title: "Social Dynamics",
    category: "Relationships",
    subject: "Group Harmony",
    query: "Propose a seating arrangement and conversation primer for a wedding where three ex-partners are inadvertently invited.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 73,
    rating: 0
  },

  // --- SCIENCE ---
  {
    id: 's1',
    title: "Entanglement Audit",
    category: "Science",
    subject: "Quantum Physics",
    query: "Explain the implications of loophole-free Bell inequality violations for the possibility of a determined universe.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 86,
    rating: 0
  },
  {
    id: 's2',
    title: "Dark Matter Trace",
    category: "Science",
    subject: "Cosmology",
    query: "Synthesize the current leading theories on WIMPs vs Axions in explaining the observed rotation curves of distant galaxies.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 79,
    rating: 0
  },

  // --- MATH ---
  {
    id: 'm1',
    title: "Primal Consensus",
    category: "Math",
    subject: "Number Theory",
    query: "Outline the relationship between the distribution of prime numbers and the non-trivial zeros of the Riemann Zeta function.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 81,
    rating: 0
  },
  {
    id: 'm2',
    title: "Fractal Complexity",
    category: "Math",
    subject: "Chaos Theory",
    query: "Analyze the sensitivity to initial conditions in a three-body attraction system and map the resulting basin of attraction.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 4,
    popularity: 72,
    rating: 0
  },

  // --- ASTROLOGY ---
  {
    id: 'as1',
    title: "Mercury Retro-Sync",
    category: "Astrology",
    subject: "Pattern Recognition",
    query: "Correlate historical stock market volatility periods with Mercury retrograde cycles over the last 50 years to find outliers.",
    difficulty: "Alpha",
    length: "Medium",
    nodesNeeded: 2,
    popularity: 68,
    rating: 0
  },
  {
    id: 'as2',
    title: "Archetypal Overlay",
    category: "Astrology",
    subject: "Psychological Astrology",
    query: "Analyze the intersection of Jungian archetypes and the Saturn return cycle as a catalyst for mid-life psychological integration.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 62,
    rating: 0
  },

  // --- TECHNOLOGY ---
  {
    id: 't1',
    title: "Neural Mesh Design",
    category: "Technology",
    subject: "Post-Internet Infra",
    query: "Design a decentralized mesh network protocol that functions without satellite or fiber dependencies using existing LoRa hardware.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 93,
    rating: 0
  },
  {
    id: 't2',
    title: "Silicon Ethics",
    category: "Technology",
    subject: "Hardware Governance",
    query: "Evaluate the environmental impact of shifting from GPU-dominant to ASIC-specialized AI training architectures globally.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 4,
    popularity: 85,
    rating: 0
  },

  // --- FUTURE ---
  {
    id: 'fut1',
    title: "Post-Scarcity Flow",
    category: "Future",
    subject: "Economic Evolution",
    query: "Model a global economy where the marginal cost of energy, compute, and physical assembly is zero.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 97,
    rating: 0
  },
  {
    id: 'fut2',
    title: "Transhuman Pulse",
    category: "Future",
    subject: "Neurolink Ethics",
    query: "Analyze the societal stratification risks of high-bandwidth neural-to-digital interfaces becoming a prerequisite for employment.",
    difficulty: "Gamma",
    length: "Long",
    nodesNeeded: 5,
    popularity: 88,
    rating: 0
  },

  // --- FOOD ---
  {
    id: 'fo1',
    title: "Molecular Gastronomy",
    category: "Food",
    subject: "Culinary Physics",
    query: "Calculate the exact temperature and pressure required to create a stable balsamic vinegar foam that lasts for 20 minutes.",
    difficulty: "Alpha",
    length: "Short",
    nodesNeeded: 2,
    popularity: 76,
    rating: 0
  },
  {
    id: 'fo2',
    title: "Agro-Consensus",
    category: "Food",
    subject: "Sustainable Protein",
    query: "Compare the life-cycle carbon footprint of lab-grown beef vs. vertical-farmed insect protein for urban populations.",
    difficulty: "Beta",
    length: "Medium",
    nodesNeeded: 3,
    popularity: 82,
    rating: 0
  }
];
