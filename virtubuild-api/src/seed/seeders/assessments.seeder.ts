import { assessmentsRepository, labActivitiesRepository } from "@/database";

export const seedAssessments = async () => {
  console.log("Seeding assessments...");
  
  const labActivities = await labActivitiesRepository.find();
  
  const assessments = [
    {
      labActivityName: "Module 1: Introduction to tools/components (e.g., screwdrivers, CPUs).",
      title: "Module 1 Assessment",
      description: "Assessment for Module 1: Introduction to tools/components - Identify tools and sort PC components.",
      timeLimitMinutes: 30,
      questions: [
        {
          id: 1,
          question: "Which tool is essential for removing screws from a computer case?",
          type: "multiple_choice",
          options: ["Hammer", "Screwdriver", "Wrench", "Pliers"],
          correctAnswer: 1,
          points: 10
        },
        {
          id: 2,
          question: "What is the primary purpose of an anti-static wrist strap?",
          type: "multiple_choice",
          options: [
            "To hold components in place",
            "To prevent electrostatic discharge",
            "To tighten screws",
            "To cut cables"
          ],
          correctAnswer: 1,
          points: 10
        },
        {
          id: 3,
          question: "Which component is responsible for processing data in a computer?",
          type: "multiple_choice",
          options: ["RAM", "CPU", "Storage", "Power Supply"],
          correctAnswer: 1,
          points: 10
        }
      ],
      isEnabled: true
    },
    {
      labActivityName: "Module 2: Desktop/laptop/motherboard assembly (includes UEFI interface simulation).",
      title: "Module 2 Assessment",
      description: "Assessment for Module 2: Desktop/laptop/motherboard assembly - Storage media, monitor connection, and UEFI interface.",
      timeLimitMinutes: 35,
      questions: [
        {
          id: 1,
          question: "What is the correct procedure for installing an SSD in a desktop PC?",
          type: "multiple_choice",
          options: [
            "Connect power and data cables, then secure in bay",
            "Secure in bay first, then connect cables",
            "Only connect power cable",
            "Install without securing"
          ],
          correctAnswer: 0,
          points: 15
        },
        {
          id: 2,
          question: "Which cable type provides the best video quality for modern monitors?",
          type: "multiple_choice",
          options: ["VGA", "HDMI", "DVI", "Composite"],
          correctAnswer: 1,
          points: 15
        },
        {
          id: 3,
          question: "What does UEFI stand for?",
          type: "multiple_choice",
          options: [
            "Unified Extensible Firmware Interface",
            "Universal Electronic Firmware Interface",
            "Unified Electronic Firmware Interface",
            "Universal Extensible Firmware Interface"
          ],
          correctAnswer: 0,
          points: 15
        }
      ],
      isEnabled: true
    },
    {
      labActivityName: "Module 3: Advanced tasks (e.g., processor installation, power systems).",
      title: "Module 3 Assessment",
      description: "Assessment for Module 3: Advanced tasks - Motherboard assembly, CPU installation, and power systems.",
      timeLimitMinutes: 45,
      questions: [
        {
          id: 1,
          question: "What is the correct order for installing a CPU?",
          type: "multiple_choice",
          options: [
            "Lift socket lever, align CPU, lower lever",
            "Force CPU into socket",
            "Apply thermal paste first",
            "Install cooler first"
          ],
          correctAnswer: 0,
          points: 20
        },
        {
          id: 2,
          question: "What is the purpose of thermal paste?",
          type: "multiple_choice",
          options: [
            "To hold the CPU in place",
            "To improve heat transfer between CPU and cooler",
            "To prevent static electricity",
            "To make the CPU faster"
          ],
          correctAnswer: 1,
          points: 20
        },
        {
          id: 3,
          question: "What is the most important consideration when selecting a power supply?",
          type: "multiple_choice",
          options: [
            "Color",
            "Wattage rating",
            "Brand name",
            "Size"
          ],
          correctAnswer: 1,
          points: 20
        }
      ],
      isEnabled: true
    }
  ];

  for (const assessmentData of assessments) {
    const labActivity = labActivities.find(la => la.title === assessmentData.labActivityName);
    if (labActivity) {
      const assessment = assessmentsRepository.create({
        labActivityId: labActivity.id,
        title: assessmentData.title,
        description: assessmentData.description,
        timeLimitMinutes: assessmentData.timeLimitMinutes,
        questions: assessmentData.questions,
        isEnabled: assessmentData.isEnabled
      });
      await assessmentsRepository.save(assessment);
      console.log(`✅ Created assessment: ${assessmentData.title} for lab activity: ${labActivity.title}`);
    }
  }
};
