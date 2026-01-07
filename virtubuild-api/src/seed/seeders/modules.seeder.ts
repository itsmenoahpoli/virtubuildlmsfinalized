import { modulesRepository } from "@/database";

export const seedModules = async () => {
  console.log("Seeding modules...");
  
  const modules = [
    {
      title: "Introduction to Computer Hardware",
      description: "Learn the fundamentals of computer hardware components and their functions",
      steps: [
        { name: "Identify CPU components", description: "Learn about processors and their specifications" },
        { name: "Memory types", description: "Understand RAM, ROM, and storage devices" },
        { name: "Motherboard basics", description: "Explore motherboard components and connections" }
      ],
      isEnabled: true
    },
    {
      title: "Desktop Assembly Fundamentals",
      description: "Step-by-step guide to assembling a desktop computer",
      steps: [
        { name: "Prepare workspace", description: "Set up tools and anti-static environment" },
        { name: "Install CPU and cooler", description: "Properly install processor and cooling system" },
        { name: "Install RAM", description: "Insert memory modules correctly" },
        { name: "Install motherboard", description: "Mount motherboard in case" },
        { name: "Connect power supply", description: "Wire up PSU connections" }
      ],
      isEnabled: true
    },
    {
      title: "Laptop Disassembly and Repair",
      description: "Advanced techniques for laptop maintenance and repair",
      steps: [
        { name: "Safety procedures", description: "Learn proper safety for laptop repair" },
        { name: "Remove battery", description: "Safely disconnect and remove battery" },
        { name: "Access internal components", description: "Remove panels and access internals" },
        { name: "Replace components", description: "Install new parts safely" }
      ],
      isEnabled: true
    },
    {
      title: "Network Hardware Configuration",
      description: "Understanding and configuring network equipment",
      steps: [
        { name: "Router setup", description: "Configure wireless and wired routers" },
        { name: "Switch configuration", description: "Set up network switches" },
        { name: "Cable management", description: "Organize network cables properly" }
      ],
      isEnabled: true
    },
    {
      title: "Troubleshooting and Diagnostics",
      description: "Advanced troubleshooting techniques for hardware issues",
      steps: [
        { name: "Diagnostic tools", description: "Use software and hardware diagnostic tools" },
        { name: "Common issues", description: "Identify and fix common problems" },
        { name: "Performance optimization", description: "Optimize system performance" }
      ],
      isEnabled: true
    }
  ];

  for (const moduleData of modules) {
    const exists = await modulesRepository.findOneBy({ title: moduleData.title });
    if (!exists) {
      const module = modulesRepository.create(moduleData);
      await modulesRepository.save(module);
      console.log(`Created module: ${moduleData.title}`);
    } else {
      console.log(`Module ${moduleData.title} already exists`);
    }
  }
};
