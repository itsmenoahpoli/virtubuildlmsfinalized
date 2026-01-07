import { Application } from "express";
import { SystemRouter, AuthRouter, UsersRouter, UserRolesRouter, ModulesRouter, ActivitiesRouter, AssessmentsRouter, GradesRouter, AnalyticsRouter, ActivationsRouter, AdminRouter, StudentGroupsRouter, StudentProgressRouter, SimulationsRouter, AssessmentSubmissionsRouter } from "./module-routers";
import { SETTINGS } from "@/configs";
import { AppEnvironments } from "@/types";

const routesConfig = [
	{
		uri: "/system",
		router: SystemRouter,
	},
	{
		uri: "/auth",
		router: new AuthRouter().routerRoutes,
	},
	{
		uri: "/users",
		router: new UsersRouter().routerRoutes,
	},
	{
		uri: "/user-roles",
		router: new UserRolesRouter().routerRoutes,
	},
  {
    uri: "/modules",
    router: new ModulesRouter().routerRoutes,
  },
  {
    uri: "/activities",
    router: new ActivitiesRouter().routerRoutes,
  },
  {
    uri: "/assessments",
    router: new AssessmentsRouter().routerRoutes,
  },
  {
    uri: "/grades",
    router: new GradesRouter().routerRoutes,
  },
  {
    uri: "/analytics",
    router: new AnalyticsRouter().routerRoutes,
  },
  {
    uri: "/activations",
    router: new ActivationsRouter().routerRoutes,
  },
  {
    uri: "/admin",
    router: new AdminRouter().routerRoutes,
  },
  {
    uri: "/student-groups",
    router: new StudentGroupsRouter().routerRoutes,
  },
  {
    uri: "/student-progress",
    router: new StudentProgressRouter().routerRoutes,
  },
  {
    uri: "/simulations",
    router: new SimulationsRouter().routerRoutes,
  },
  {
    uri: "/assessment-submissions",
    router: new AssessmentSubmissionsRouter().routerRoutes,
  },
];

const printRouteRoutes = (route: any) => {
	const uriModule = route.uri.replace("/", "").toUpperCase();
	console.log("--------------------------------------------------------------------------------------");
	console.log(`${uriModule} ${route.uri} Routes \n---------------`);

	route.router.stack.forEach((stack: any) => {
		if (stack.route) {
			// @ts-ignore
			const methods = Object.keys(stack.route?.methods).join(", ").toUpperCase();

			console.log(`${methods} ${route.uri}${stack.route.path}`);
		}
	});
	console.log("--------------------------------------------------------------------------------------");
};

export const initializeApiRoutes = (app: Application, apiPrefix: string = "/api") => {
	routesConfig.forEach((route) => {
		const uri: string = apiPrefix.concat(route.uri);

		app.use(uri, route.router);

		if (SETTINGS.checkCurrentEnvironment(AppEnvironments.DEV)) {
			printRouteRoutes(route);
		}
	});
};
