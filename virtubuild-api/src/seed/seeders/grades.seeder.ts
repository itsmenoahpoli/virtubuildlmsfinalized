import { gradesRepository, usersRepository, labActivitiesRepository, userRolesRepository } from "@/database";

export const seedGrades = async () => {
  console.log("Seeding grades...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  const labActivities = await labActivitiesRepository.find();
  
  if (!students || students.length === 0) {
    console.log("No students found, skipping grades seeding");
    return;
  }
  
  if (!labActivities || labActivities.length === 0) {
    console.log("No lab activities found, skipping grades seeding");
    return;
  }
  
  const gradeData = [
    {
      score: 25,
      breakdown: {
        totalPoints: 30,
        earnedPoints: 25,
        percentage: 83.33,
        grade: "B+"
      }
    },
    {
      score: 20,
      breakdown: {
        totalPoints: 30,
        earnedPoints: 20,
        percentage: 66.67,
        grade: "C+"
      }
    },
    {
      score: 30,
      breakdown: {
        totalPoints: 30,
        earnedPoints: 30,
        percentage: 100,
        grade: "A+"
      }
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const labActivityIndex = i % labActivities.length;
    const labActivity = labActivities[labActivityIndex];
    const grade = gradeData[i % gradeData.length];
    
    const exists = await gradesRepository.findOneBy({
      userId: student.id,
      activityId: labActivity.id
    });
    
    if (!exists) {
      const gradeRecord = gradesRepository.create({
        userId: student.id,
        activityId: labActivity.id,
        ...grade
      });
      await gradesRepository.save(gradeRecord);
      console.log(`Created grade for student ${student.firstName} ${student.lastName} for lab activity ${labActivity.title}`);
    } else {
      console.log(`Grade already exists for student ${student.firstName} for lab activity ${labActivity.title}`);
    }
  }
};
