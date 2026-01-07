import { moduleActivationsRepository, usersRepository, modulesRepository, userRolesRepository } from "@/database";

export const seedModuleActivations = async () => {
  console.log("Seeding module activations...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  const modules = await modulesRepository.find();
  
  const activationData = [
    {
      groupName: "Group A",
      isActive: true,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      progress: 75
    },
    {
      groupName: "Group B",
      isActive: true,
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-02-20"),
      progress: 60
    },
    {
      groupName: "Group C",
      isActive: true,
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-02-10"),
      progress: 90
    },
    {
      groupName: "Group D",
      isActive: false,
      startDate: new Date("2024-01-05"),
      endDate: new Date("2024-02-05"),
      progress: 100
    },
    {
      groupName: "Group E",
      isActive: true,
      startDate: new Date("2024-01-25"),
      endDate: new Date("2024-02-25"),
      progress: 40
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const moduleIndex = i % modules.length;
    const module = modules[moduleIndex];
    const activation = activationData[i % activationData.length];
    
    const exists = await moduleActivationsRepository.findOneBy({
      moduleId: module.id,
      groupName: activation.groupName
    });
    
    if (!exists) {
      const activationRecord = moduleActivationsRepository.create({
        moduleId: module.id,
        ...activation
      });
      await moduleActivationsRepository.save(activationRecord);
      console.log(`Created module activation for student ${student.firstName} ${student.lastName} for module ${module.title}`);
    } else {
      console.log(`Module activation already exists for student ${student.firstName} for module ${module.title}`);
    }
  }
};
