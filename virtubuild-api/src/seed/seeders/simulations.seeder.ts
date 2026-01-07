import { simulationsRepository, usersRepository, labActivitiesRepository, userRolesRepository } from "@/database";

export const seedSimulations = async () => {
  console.log("Seeding simulations...");
  
  const studentRole = await userRolesRepository.findOneBy({ name: "student" });
  const students = await usersRepository.findBy({ userRoleId: studentRole?.id });
  const activities = await labActivitiesRepository.find();
  
  const simulationData = [
    {
      status: "completed",
      simulationState: {
        currentStep: "final_assembly",
        completedSteps: ["cpu_installation", "ram_installation", "psu_connection"],
        currentTool: "screwdriver"
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true, placed: true },
        ram: { x: 200, y: 100, correct: true, placed: true },
        psu: { x: 300, y: 200, correct: true, placed: true },
        motherboard: { x: 150, y: 175, correct: true, placed: true }
      },
      score: 95,
      timeSpentSeconds: 1200,
      errors: 2,
      steps: [
        { step: "cpu_installation", completed: true, timeSpent: 300, errors: 0 },
        { step: "ram_installation", completed: true, timeSpent: 200, errors: 1 },
        { step: "psu_connection", completed: true, timeSpent: 400, errors: 1 },
        { step: "final_assembly", completed: true, timeSpent: 300, errors: 0 }
      ]
    },
    {
      status: "in_progress",
      simulationState: {
        currentStep: "ram_installation",
        completedSteps: ["cpu_installation"],
        currentTool: "ram_module"
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true, placed: true },
        ram: { x: 200, y: 100, correct: false, placed: false },
        psu: { x: 300, y: 200, correct: false, placed: false }
      },
      score: 65,
      timeSpentSeconds: 900,
      errors: 5,
      steps: [
        { step: "cpu_installation", completed: true, timeSpent: 400, errors: 2 },
        { step: "ram_installation", completed: false, timeSpent: 500, errors: 3 }
      ]
    },
    {
      status: "completed",
      simulationState: {
        currentStep: "testing",
        completedSteps: ["cpu_installation", "ram_installation", "psu_connection", "final_assembly"],
        currentTool: "power_button"
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true, placed: true },
        ram: { x: 200, y: 100, correct: true, placed: true },
        psu: { x: 300, y: 200, correct: true, placed: true },
        motherboard: { x: 150, y: 175, correct: true, placed: true }
      },
      score: 88,
      timeSpentSeconds: 1800,
      errors: 3,
      steps: [
        { step: "cpu_installation", completed: true, timeSpent: 350, errors: 1 },
        { step: "ram_installation", completed: true, timeSpent: 250, errors: 0 },
        { step: "psu_connection", completed: true, timeSpent: 500, errors: 1 },
        { step: "final_assembly", completed: true, timeSpent: 400, errors: 1 },
        { step: "testing", completed: true, timeSpent: 300, errors: 0 }
      ]
    },
    {
      status: "not_started",
      simulationState: {
        currentStep: "preparation",
        completedSteps: [],
        currentTool: null
      },
      componentPlacements: {},
      score: 0,
      timeSpentSeconds: 0,
      errors: 0,
      steps: []
    },
    {
      status: "completed",
      simulationState: {
        currentStep: "testing",
        completedSteps: ["cpu_installation", "ram_installation", "psu_connection", "final_assembly"],
        currentTool: "power_button"
      },
      componentPlacements: {
        cpu: { x: 100, y: 150, correct: true, placed: true },
        ram: { x: 200, y: 100, correct: true, placed: true },
        psu: { x: 300, y: 200, correct: true, placed: true },
        motherboard: { x: 150, y: 175, correct: true, placed: true }
      },
      score: 92,
      timeSpentSeconds: 2100,
      errors: 1,
      steps: [
        { step: "cpu_installation", completed: true, timeSpent: 300, errors: 0 },
        { step: "ram_installation", completed: true, timeSpent: 200, errors: 0 },
        { step: "psu_connection", completed: true, timeSpent: 600, errors: 1 },
        { step: "final_assembly", completed: true, timeSpent: 500, errors: 0 },
        { step: "testing", completed: true, timeSpent: 500, errors: 0 }
      ]
    }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const activityIndex = i % activities.length;
    const activity = activities[activityIndex];
    const simulation = simulationData[i % simulationData.length];
    
    const exists = await simulationsRepository.findOneBy({
      studentId: student.id,
      activityId: activity.id
    });
    
    if (!exists) {
      const simulationRecord = simulationsRepository.create({
        studentId: student.id,
        activityId: activity.id,
        ...simulation
      });
      await simulationsRepository.save(simulationRecord);
      console.log(`Created simulation for student ${student.firstName} ${student.lastName} in activity ${activity.title}`);
    } else {
      console.log(`Simulation already exists for student ${student.firstName} in activity ${activity.title}`);
    }
  }
};
