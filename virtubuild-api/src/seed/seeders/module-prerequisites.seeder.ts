import { modulePrerequisitesRepository, modulesRepository } from "@/database";

export const seedModulePrerequisites = async () => {
  console.log("Seeding module prerequisites...");
  
  const modules = await modulesRepository.find();
  
  const prerequisites = [
    {
      moduleTitle: "Desktop Assembly Fundamentals",
      prerequisiteTitle: "Introduction to Computer Hardware"
    },
    {
      moduleTitle: "Laptop Disassembly and Repair",
      prerequisiteTitle: "Desktop Assembly Fundamentals"
    },
    {
      moduleTitle: "Network Hardware Configuration",
      prerequisiteTitle: "Introduction to Computer Hardware"
    },
    {
      moduleTitle: "Troubleshooting and Diagnostics",
      prerequisiteTitle: "Desktop Assembly Fundamentals"
    }
  ];

  for (const prereqData of prerequisites) {
    const module = modules.find(m => m.title === prereqData.moduleTitle);
    const prerequisite = modules.find(m => m.title === prereqData.prerequisiteTitle);
    
    if (module && prerequisite) {
      const exists = await modulePrerequisitesRepository.findOneBy({
        moduleId: module.id,
        prerequisiteModuleId: prerequisite.id
      });
      
      if (!exists) {
        const prereq = modulePrerequisitesRepository.create({
          moduleId: module.id,
          prerequisiteModuleId: prerequisite.id
        });
        await modulePrerequisitesRepository.save(prereq);
        console.log(`Created prerequisite: ${prerequisite.title} for module ${module.title}`);
      } else {
        console.log(`Prerequisite ${prerequisite.title} already exists for module ${module.title}`);
      }
    }
  }
};
