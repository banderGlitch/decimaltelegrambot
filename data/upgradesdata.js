const upgrades = [
    {
      name: "Earning Boost",
      description: "Increase points earned per click.",
      type: "earningBoost",
      unlockLevel: 1,
      levels: [
        { levelNumber: 1, cost: 50, effectValue: 1.2 },
        { levelNumber: 2, cost: 100, effectValue: 1.5 },
        { levelNumber: 3, cost: 200, effectValue: 2.0 },
        { levelNumber: 4, cost: 400, effectValue: 2.5 },
        { levelNumber: 5, cost: 800, effectValue: 3.0 },
      ],
    },
    {
      name: "Maintenance Reduction",
      description: "Reduce the maintenance cost of your animals.",
      type: "maintenanceReduction",
      unlockLevel: 2,
      levels: [
        { levelNumber: 1, cost: 60, effectValue: -5 },  // -5% maintenance
        { levelNumber: 2, cost: 120, effectValue: -10 },
        { levelNumber: 3, cost: 240, effectValue: -15 },
        { levelNumber: 4, cost: 480, effectValue: -20 },
        { levelNumber: 5, cost: 960, effectValue: -25 },
      ],
    },
    {
      name: "Level Up Boost",
      description: "Instantly level up to the next level.",
      type: "levelUp",
      unlockLevel: 5,
      levels: [
        { levelNumber: 1, cost: 500, effectValue: 1 },  // Effect value represents number of levels boosted
        { levelNumber: 2, cost: 1000, effectValue: 1 },
        { levelNumber: 3, cost: 2000, effectValue: 1 },
      ],
    },
    {
      name: "Happiness Booster",
      description: "Increase the happiness index of your animals.",
      type: "happinessBoost",
      unlockLevel: 3,
      levels: [
        { levelNumber: 1, cost: 75, effectValue: 5 },  // +5% happiness
        { levelNumber: 2, cost: 150, effectValue: 10 },
        { levelNumber: 3, cost: 300, effectValue: 15 },
        { levelNumber: 4, cost: 600, effectValue: 20 },
      ],
    },
    {
      name: "Auto-Clicker",
      description: "Automatically generate clicks for a duration.",
      type: "autoClicker",
      unlockLevel: 4,
      levels: [
        { levelNumber: 1, cost: 150, effectValue: 10 },  // Effect value represents duration in seconds
        { levelNumber: 2, cost: 300, effectValue: 20 },
        { levelNumber: 3, cost: 600, effectValue: 30 },
      ],
    }
  ];
  
  export default upgrades;