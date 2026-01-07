import { Routes } from '@angular/router';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { SigninComponent } from './features/auth/signin/signin.component';
import { InstructorHomeComponent } from './features/dashboard/instructor/instructor-home/instructor-home.component';
import { StudentDashboardComponent } from './features/dashboard/student/student-dashboard.component';
import { ActivitiesListComponent } from './features/student/activities/activities-list.component';
import { ActivityDetailComponent } from './features/student/activities/activity-detail.component';
import { GradesPageComponent } from './features/student/grades/grades-page.component';
import { AnalyticsPageComponent } from './features/student/analytics/analytics-page.component';
import { ManageModulesComponent } from './features/instructor/manage-modules/manage-modules.component';
import { InstructorGradesComponent } from './features/instructor/grades/instructor-grades.component';
import { AssessmentEditorComponent } from './features/instructor/assessments/assessment-editor.component';
import { ManageAssessmentsComponent as InstructorManageAssessmentsComponent } from './features/instructor/assessments/manage-assessments.component';
import { ManageActivitiesComponent } from './features/instructor/activities/manage-activities.component';
import { MyAccountComponent } from './features/instructor/account/my-account.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

// NEW COMPONENTS
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './features/admin/users/user-management.component';
import { StudentGroupsManagementComponent } from './features/admin/student-groups/student-groups-management.component';
import { PcAssemblySimulationComponent } from './features/student/simulation/pc-assembly-simulation.component';
import { ProgressTrackingComponent } from './features/student/progress/progress-tracking.component';
import { AssessmentSubmissionsComponent } from './features/student/assessments/assessment-submissions.component';
import { UserRolesManagementComponent } from './features/admin/user-roles/user-roles-management.component';
import { AdminModulesComponent } from './features/admin/modules/admin-modules.component';
import { AdminLabActivitiesComponent } from './features/admin/lab-activities/admin-lab-activities.component';
import { AdminAssessmentsComponent } from './features/admin/assessments/admin-assessments.component';
import { AdminGradesComponent } from './features/admin/grades/admin-grades.component';
import { ManageInstructorsComponent } from './features/admin/instructors/manage-instructors.component';
import { ManageStudentsComponent } from './features/admin/students/manage-students.component';
import { ManageContentsComponent } from './features/admin/contents/manage-contents.component';
import { ManageLaboratoriesComponent } from './features/admin/contents/laboratories/manage-laboratories.component';
import { ManageAssessmentsComponent } from './features/admin/contents/assessments/manage-assessments.component';
import { CreateAssessmentComponent } from './features/admin/contents/assessments/create-assessment.component';
import { AboutUsComponent } from './features/public/about-us/about-us.component';
import { ContactComponent } from './features/public/contact/contact.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['student'] },
    children: [
      { path: '', component: StudentDashboardComponent },
      { path: 'activities', component: ActivitiesListComponent },
      { path: 'activities/:id', component: ActivityDetailComponent },
      { path: 'simulation/:activityId', component: PcAssemblySimulationComponent },
      { path: 'grades', component: GradesPageComponent },
      { path: 'analytics', component: AnalyticsPageComponent },
      { path: 'progress', component: ProgressTrackingComponent },
      { path: 'assessments', component: AssessmentSubmissionsComponent },
    ],
  },
  {
    path: 'instructor',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['instructor'] },
    children: [
      { path: '', component: InstructorHomeComponent },
      { path: 'laboratories', component: ManageActivitiesComponent },
      { path: 'manage-activities', component: ManageActivitiesComponent },
      { path: 'manage-modules', component: ManageModulesComponent },
      { path: 'grades', component: InstructorGradesComponent },
      { path: 'assessments', component: InstructorManageAssessmentsComponent },
      { path: 'assessments/:moduleId', component: AssessmentEditorComponent },
      { path: 'student-groups', component: StudentGroupsManagementComponent },
      { path: 'my-account', component: MyAccountComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'student-groups', component: StudentGroupsManagementComponent },
      { path: 'modules', component: AdminModulesComponent },
      { path: 'lab-activities', component: AdminLabActivitiesComponent },
      { path: 'assessments', component: AdminAssessmentsComponent },
      { path: 'grades', component: AdminGradesComponent },
      { path: 'user-roles', component: UserRolesManagementComponent },
      { path: 'instructors', component: ManageInstructorsComponent },
      { path: 'students', component: ManageStudentsComponent },
            {
              path: 'contents',
              component: ManageContentsComponent,
              children: [
                { path: '', redirectTo: 'laboratories', pathMatch: 'full' },
                { path: 'laboratories', component: ManageLaboratoriesComponent },
                { path: 'assessments', component: ManageAssessmentsComponent },
                { path: 'assessments/create', component: CreateAssessmentComponent },
                { path: 'assessments/edit/:id', component: CreateAssessmentComponent },
              ]
            },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
