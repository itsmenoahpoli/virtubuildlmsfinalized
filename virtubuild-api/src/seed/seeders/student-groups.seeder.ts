import { studentGroupsRepository, studentGroupAssignmentsRepository, usersRepository, userRolesRepository } from "@/database";

export const seedStudentGroups = async () => {
  console.log("Seeding student groups...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  
  const groups = [
    {
      name: "Hardware Fundamentals Group A",
      description: "Beginner level students learning computer hardware basics",
      isActive: true
    },
    {
      name: "Advanced Assembly Group B",
      description: "Intermediate students working on desktop assembly",
      isActive: true
    },
    {
      name: "Laptop Repair Specialists",
      description: "Advanced students focusing on laptop repair techniques",
      isActive: true
    },
    {
      name: "Network Configuration Team",
      description: "Students learning network hardware and configuration",
      isActive: true
    }
  ];

  const createdGroups = [];
  for (const groupData of groups) {
    const exists = await studentGroupsRepository.findOneBy({ name: groupData.name });
    if (!exists) {
      const group = studentGroupsRepository.create(groupData);
      const savedGroup = await studentGroupsRepository.save(group);
      createdGroups.push(savedGroup);
      console.log(`Created group: ${groupData.name}`);
    } else {
      console.log(`Group ${groupData.name} already exists`);
      createdGroups.push(exists);
    }
  }

  console.log("Assigning students to groups...");
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const groupIndex = i % createdGroups.length;
    const group = createdGroups[groupIndex];
    
    const assignmentExists = await studentGroupAssignmentsRepository.findOneBy({
      studentId: student.id,
      studentGroupId: group.id
    });
    
    if (!assignmentExists) {
      const assignment = studentGroupAssignmentsRepository.create({
        studentId: student.id,
        studentGroupId: group.id
      });
      await studentGroupAssignmentsRepository.save(assignment);
      console.log(`Assigned student ${student.firstName} ${student.lastName} to group ${group.name}`);
    }
  }
};
