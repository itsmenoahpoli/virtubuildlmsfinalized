import { labActivitiesRepository } from "@/database";

export const seedActivities = async () => {
  console.log("Seeding lab activities...");
  
  const activities = [
    {
      title: "Module 1: Introduction to tools/components (e.g., screwdrivers, CPUs).",
      description: "- [ ] Identify tools on the table\n- [ ] Sort PC components (end of lab activity)",
      location: "Lab Room 101",
      capacity: "20 students",
      equipment: {
        tools: ["Screwdrivers", "Anti-static wrist straps", "Component trays"],
        components: ["CPUs", "RAM modules", "Motherboards", "Storage devices", "Power supplies"],
        workstations: 10
      },
      isEnabled: true
    },
    {
      title: "Module 2: Desktop/laptop/motherboard assembly (includes UEFI interface simulation).",
      description: "- [ ] Obtain Storage media (hard drive)\n- [ ] Connect PC to monitor\n- [ ] Boot PC into UEFI interface\n- [ ] Simulate OS loading (end of lab activity)",
      location: "Lab Room 102",
      capacity: "16 students",
      equipment: {
        tools: ["Screwdrivers", "Cable management tools", "Anti-static mats"],
        components: ["Complete desktop PCs", "Laptops", "Monitors", "Storage media", "Cables"],
        workstations: 8,
        simulation: "UEFI Interface Simulator"
      },
      isEnabled: true
    },
    {
      title: "Module 3: Advanced tasks (e.g., processor installation, power systems).",
      description: "- [ ] Obtain Motherboard\n- [ ] Obtain CPU, RAM and Storage Media\n- [ ] Assemble PC\n- [ ] Attach PC to Power Supply\n- [ ] Boot PC into UEFI Interface (end of lab activity)",
      location: "Lab Room 103",
      capacity: "12 students",
      equipment: {
        tools: ["Precision screwdrivers", "Thermal paste applicators", "Cable testers"],
        components: ["High-end motherboards", "Latest CPUs", "DDR4/DDR5 RAM", "NVMe SSDs", "Modular PSUs"],
        workstations: 6,
        simulation: "Advanced Assembly Simulator"
      },
      isEnabled: true
    }
  ];

  for (const activityData of activities) {
    const exists = await labActivitiesRepository.findOneBy({ 
      title: activityData.title
    });
    if (!exists) {
      const activity = labActivitiesRepository.create(activityData);
      await labActivitiesRepository.save(activity);
      console.log(`✅ Created lab activity: ${activityData.title}`);
    } else {
      console.log(`Lab activity ${activityData.title} already exists`);
    }
  }
};
