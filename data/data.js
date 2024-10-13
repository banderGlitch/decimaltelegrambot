const Upgrades = [
    {
      "_id": "6526fa5f0d1b89a8f47d1dfb",
      "name": "Reduce Maintenance",
      "description": "Reduce maintenance cost by 5% per level.",
      "effect": "reduce_maintenance",
      "duration": 0,
      "upgradeLevel": 1,
      "maxLevel": 5,
      "costs": [
        { "level": 1, "cost": 200 },
        { "level": 2, "cost": 300 },
        { "level": 3, "cost": 400 },
        { "level": 4, "cost": 600 },
        { "level": 5, "cost": 1000 }
      ],
      "active": true
    },
    {
        "_id": "6526fa5f0d1b89a8f47d1dfc",
        "name": "Click Efficiency",
        "description": "Increase points per click by 2% per level.",
        "effect": "click_efficiency",
        "duration": 0,
        "upgradeLevel": 1,
        "maxLevel": 10,
        "costs": [
          { "level": 1, "cost": 150 },
          { "level": 2, "cost": 250 },
          { "level": 3, "cost": 350 },
          { "level": 4, "cost": 500 },
          { "level": 5, "cost": 700 },
          { "level": 6, "cost": 900 },
          { "level": 7, "cost": 1200 },
          { "level": 8, "cost": 1500 },
          { "level": 9, "cost": 2000 },
          { "level": 10, "cost": 3000 }
        ],
        "active": true
      }
  ]
  export default Upgrades;
  