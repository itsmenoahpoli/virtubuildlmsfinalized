import { performanceAnalyticsRepository, usersRepository, userRolesRepository } from "@/database";

export const seedPerformanceAnalytics = async () => {
  console.log("Seeding performance analytics...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  
  const analyticsData = [
    {
      activityId: 1,
      timeSpentSeconds: 2400,
      errorCount: 3,
      trends: {
        scoreImprovement: 0.15,
        timeReduction: 0.20,
        errorReduction: 0.30
      }
    },
    {
      activityId: 2,
      timeSpentSeconds: 3200,
      errorCount: 5,
      trends: {
        scoreImprovement: 0.05,
        timeReduction: 0.10,
        errorReduction: 0.15
      }
    },
    {
      activityId: 3,
      timeSpentSeconds: 1800,
      errorCount: 1,
      trends: {
        scoreImprovement: 0.25,
        timeReduction: 0.35,
        errorReduction: 0.40
      }
    },
    {
      activityId: 4,
      timeSpentSeconds: 4000,
      errorCount: 8,
      trends: {
        scoreImprovement: 0.02,
        timeReduction: 0.05,
        errorReduction: 0.08
      }
    },
    {
      activityId: 5,
      timeSpentSeconds: 2800,
      errorCount: 4,
      trends: {
        scoreImprovement: 0.18,
        timeReduction: 0.25,
        errorReduction: 0.22
      }
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const analytics = analyticsData[i % analyticsData.length];
    
    const exists = await performanceAnalyticsRepository.findOneBy({ userId: student.id });
    if (!exists) {
      const analyticsRecord = performanceAnalyticsRepository.create({
        userId: student.id,
        ...analytics
      });
      await performanceAnalyticsRepository.save(analyticsRecord);
      console.log(`Created performance analytics for student ${student.firstName} ${student.lastName}`);
    } else {
      console.log(`Performance analytics already exists for student ${student.firstName} ${student.lastName}`);
    }
  }
};
