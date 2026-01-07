import { seedUserRoles } from "./seeders/user-roles.seeder";
import { seedUsers } from "./seeders/users.seeder";
import { seedModules } from "./seeders/modules.seeder";
import { seedActivities } from "./seeders/activities.seeder";
import { seedAssessments } from "./seeders/assessments.seeder";
import { seedStudentGroups } from "./seeders/student-groups.seeder";
import { seedStudentProgress } from "./seeders/progress.seeder";
import { seedSimulations } from "./seeders/simulations.seeder";
import { seedAssessmentSubmissions } from "./seeders/assessment-submissions.seeder";
import { seedGrades } from "./seeders/grades.seeder";
import { seedModulePrerequisites } from "./seeders/module-prerequisites.seeder";
import { seedModuleActivations } from "./seeders/module-activations.seeder";
import { seedPerformanceAnalytics } from "./seeders/performance-analytics.seeder";

export const runSeed = async () => {
	console.log("Starting database seeding process...");
	
	try {
		await seedUserRoles();
		await seedUsers();
		await seedModules();
		await seedActivities();
		await seedAssessments();
		await seedStudentGroups();
		await seedStudentProgress();
		await seedSimulations();
		await seedAssessmentSubmissions();
		await seedGrades();
		await seedModulePrerequisites();
		await seedModuleActivations();
		await seedPerformanceAnalytics();
		
		console.log("Database seeding completed successfully!");
	} catch (error) {
		console.error("Error during database seeding:", error);
		throw error;
	}
};


