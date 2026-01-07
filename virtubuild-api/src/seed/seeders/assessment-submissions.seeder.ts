import { assessmentSubmissionsRepository, usersRepository, assessmentsRepository, userRolesRepository } from "@/database";

export const seedAssessmentSubmissions = async () => {
  console.log("Seeding assessment submissions...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  const assessments = await assessmentsRepository.find();
  
  if (!students || students.length === 0) {
    console.log("No students found, skipping assessment submissions seeding");
    return;
  }
  
  if (!assessments || assessments.length === 0) {
    console.log("No assessments found, skipping assessment submissions seeding");
    return;
  }
  
  const submissionData = [
    {
      answers: {
        "1": 1,
        "2": 1,
        "3": "Random Access Memory"
      },
      score: 25,
      timeSpentSeconds: 600,
      isSubmitted: true,
      feedback: {
        overall: "Excellent work! You demonstrated strong understanding of hardware fundamentals.",
        questions: {
          "1": "Correct! The CPU is indeed the processing unit.",
          "2": "Correct! RAM is volatile memory.",
          "3": "Perfect! You know what RAM stands for."
        }
      }
    },
    {
      answers: {
        "1": 2,
        "2": 0
      },
      score: 20,
      timeSpentSeconds: 450,
      isSubmitted: true,
      feedback: {
        overall: "Good attempt! Review the assembly steps for better understanding.",
        questions: {
          "1": "Incorrect. The CPU socket lever should be lifted first.",
          "2": "Incorrect. RAM should be installed in pairs for dual-channel performance."
        }
      }
    },
    {
      answers: {
        "1": 1,
        "2": 1
      },
      score: 30,
      timeSpentSeconds: 720,
      isSubmitted: true,
      feedback: {
        overall: "Outstanding! You showed excellent knowledge of laptop repair procedures.",
        questions: {
          "1": "Correct! Safety is paramount when working on laptops.",
          "2": "Correct! A proper screwdriver set is essential for laptop repair."
        }
      }
    },
    {
      answers: {
        "1": 3
      },
      score: 10,
      timeSpentSeconds: 300,
      isSubmitted: true,
      feedback: {
        overall: "Good! You understand that multiple default IP addresses are used.",
        questions: {
          "1": "Correct! All of the above are common default router IPs."
        }
      }
    },
    {
      answers: {
        "1": 1
      },
      score: 15,
      timeSpentSeconds: 180,
      isSubmitted: true,
      feedback: {
        overall: "Perfect! You understand the systematic approach to troubleshooting.",
        questions: {
          "1": "Correct! Identifying the problem is the first step in troubleshooting."
        }
      }
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const assessmentIndex = i % assessments.length;
    const assessment = assessments[assessmentIndex];
    const submission = submissionData[i % submissionData.length];
    
    const exists = await assessmentSubmissionsRepository.findOneBy({
      studentId: student.id,
      assessmentId: assessment.id
    });
    
    if (!exists) {
      const submissionRecord = assessmentSubmissionsRepository.create({
        studentId: student.id,
        assessmentId: assessment.id,
        ...submission
      });
      await assessmentSubmissionsRepository.save(submissionRecord);
      console.log(`Created assessment submission for student ${student.firstName} ${student.lastName} for assessment ${assessment.id}`);
    } else {
      console.log(`Assessment submission already exists for student ${student.firstName} for assessment ${assessment.id}`);
    }
  }
};
