import { userRolesRepository } from "@/database";

export const seedUserRoles = async () => {
  console.log("Seeding user roles...");
  
  const roles = [
    { name: "student", isEnabled: true },
    { name: "instructor", isEnabled: true },
    { name: "admin", isEnabled: true }
  ];

  for (const roleData of roles) {
    const exists = await userRolesRepository.findOneBy({ name: roleData.name });
    if (!exists) {
      const role = userRolesRepository.create(roleData);
      await userRolesRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    } else {
      console.log(`Role ${roleData.name} already exists`);
    }
  }
};
