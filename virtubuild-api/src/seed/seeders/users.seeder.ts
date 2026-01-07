import { usersRepository, userRolesRepository } from "@/database";
import { encryptPassword } from "@/utils";

export const seedUsers = async () => {
  console.log("Seeding users...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const instructorRole = await userRolesRepository.findOneBy({ name: "instructor" });
  const adminRole = await userRolesRepository.findOneBy({ name: "admin" });

  const users = [
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@student.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: studentRole?.id
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@student.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: studentRole?.id
    },
    {
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@student.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: studentRole?.id
    },
    {
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@student.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: studentRole?.id
    },
    {
      firstName: "Alex",
      lastName: "Brown",
      email: "alex.brown@student.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: studentRole?.id
    },
    {
      firstName: "Dr. Emily",
      lastName: "Davis",
      email: "emily.davis@instructor.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: instructorRole?.id
    },
    {
      firstName: "Prof. Robert",
      lastName: "Miller",
      email: "robert.miller@instructor.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: instructorRole?.id
    },
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@virtubuild.com",
      password: "Password123!",
      isEnabled: true,
      userRoleId: adminRole?.id
    }
  ];

  for (const userData of users) {
    const exists = await usersRepository.findOneBy({ email: userData.email });
    if (!exists) {
      const password = await encryptPassword(userData.password);
      const user = usersRepository.create({
        ...userData,
        password
      });
      await usersRepository.save(user);
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User ${userData.email} already exists`);
    }
  }
};
