import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssessmentSubmissionsService } from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-assessment-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent],
  templateUrl: './assessment-submissions.component.html',
  styleUrls: ['./assessment-submissions.component.scss']
})
export class AssessmentSubmissionsComponent implements OnInit {
  appTitle = 'VirtuBuild';
  mySubmissions: any[] = [];
  myHistory: any[] = [];
  loading = true;
  showSubmitForm = false;
  selectedAssessment: any = null;
  submissionData: any = {
    assessmentId: null,
    answers: {},
    timeSpent: 0
  };

  async ngOnInit() {
    try {
      await this.loadSubmissionData();
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadSubmissionData() {
    this.mySubmissions = await AssessmentSubmissionsService.getMySubmissions();
    this.myHistory = await AssessmentSubmissionsService.getMyHistory();
  }

  async submitAssessment() {
    try {
      await AssessmentSubmissionsService.submit(this.submissionData);
      this.submissionData = {
        assessmentId: null,
        answers: {},
        timeSpent: 0
      };
      this.showSubmitForm = false;
      this.selectedAssessment = null;
      await this.loadSubmissionData();
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  }

  startAssessment(assessment: any) {
    this.selectedAssessment = assessment;
    this.submissionData.assessmentId = assessment.id;
    this.submissionData.answers = {};
    this.showSubmitForm = true;
  }

  cancelSubmission() {
    this.showSubmitForm = false;
    this.selectedAssessment = null;
    this.submissionData = {
      assessmentId: null,
      answers: {},
      timeSpent: 0
    };
  }

  getScoreColor(score: number) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'not-started': return 'danger';
      default: return 'secondary';
    }
  }

  viewResults(assessment: any) {
    // Navigate to results view or show results modal
    console.log('Viewing results for assessment:', assessment);
    // TODO: Implement results viewing functionality
  }
}
