import { studentProgressRepository, usersRepository, labActivitiesRepository, userRolesRepository } from "@/database";

export const seedStudentProgress = async () => {
  console.log("Seeding student progress...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  const activities = await labActivitiesRepository.find();
  
  const progressData = [
    {
      isCompleted: true,
      score: 95,
      timeSpentSeconds: 1200,
      attempts: 1,
      progressData: {
        stepsCompleted: 5,
        lastStepCompleted: "final_assembly",
        hintsUsed: 2
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true },
        ram: { x: 200, y: 100, correct: true },
        psu: { x: 300, y: 200, correct: true }
      }
    },
    {
      isCompleted: true,
      score: 88,
      timeSpentSeconds: 1800,
      attempts: 2,
      progressData: {
        stepsCompleted: 4,
        lastStepCompleted: "power_connection",
        hintsUsed: 5
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true },
        ram: { x: 200, y: 100, correct: false },
        psu: { x: 300, y: 200, correct: true }
      }
    },
    {
      isCompleted: false,
      score: 65,
      timeSpentSeconds: 900,
      attempts: 1,
      progressData: {
        stepsCompleted: 2,
        lastStepCompleted: "cpu_installation",
        hintsUsed: 3
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true },
        ram: { x: 200, y: 100, correct: false },
        psu: { x: 300, y: 200, correct: false }
      }
    },
    {
      isCompleted: true,
      score: 92,
      timeSpentSeconds: 2100,
      attempts: 1,
      progressData: {
        stepsCompleted: 6,
        lastStepCompleted: "testing",
        hintsUsed: 1
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true },
        ram: { x: 200, y: 100, correct: true },
        psu: { x: 300, y: 200, correct: true }
      }
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const activityIndex = i % activities.length;
    const activity = activities[activityIndex];
    const progress = progressData[i % progressData.length];
    
    const exists = await studentProgressRepository.findOneBy({
      studentId: student.id,
      activityId: activity.id
    });
    
    if (!exists) {
      const studentProgress = studentProgressRepository.create({
        studentId: student.id,
        activityId: activity.id,
        ...progress
      });
      await studentProgressRepository.save(studentProgress);
      console.log(`Created progress for student ${student.firstName} ${student.lastName} in activity ${activity.title}`);
    } else {
      console.log(`Progress already exists for student ${student.firstName} in activity ${activity.title}`);
    }
  }
};
