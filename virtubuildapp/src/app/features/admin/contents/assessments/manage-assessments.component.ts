import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminService } from '@/app/core/services';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'app-manage-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-assessments.component.html',
  styleUrls: ['./manage-assessments.component.scss']
})
export class ManageAssessmentsComponent implements OnInit {
  assessments: any[] = [];
  loading = true;
  showViewModal = false;
  selectedAssessment: any = null;
  assessmentSubmissions: any[] = [];
  showSubmissionDetailsModal = false;
  selectedSubmission: any = null;

  constructor(
    private router: Router,
    private modalService: ModalService
  ) {}

  async ngOnInit() {
    try {
      await this.loadAssessments();
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadAssessments() {
    try {
      const assessments = await AdminService.getAllAssessments();
      
      // The API now returns assessments with submission data included
      if (assessments && assessments.length > 0) {
        this.assessments = assessments;
        console.log('Loaded assessments with submission data:', this.assessments);
      } else {
        // Fallback sample data if no assessments exist
        this.assessments = [
          {
            id: 1,
            title: "Computer Hardware Basics Quiz",
            description: "Test basic computer hardware knowledge",
            isEnabled: true,
            createdAt: new Date(),
            moduleId: 1,
            submissionCount: 0,
            hasSubmissions: false,
            recentSubmissions: [],
            quiz: {
              questions: [
                {
                  id: 1,
                  question: "What is the primary function of a CPU?",
                  type: "multiple_choice",
                  options: ["Store data", "Process instructions", "Display graphics"],
                  correctAnswer: 1,
                  points: 10
                }
              ]
            }
          },
          {
            id: 2,
            title: "Assembly Fundamentals Assessment",
            description: "Test desktop assembly knowledge",
            isEnabled: true,
            createdAt: new Date(),
            moduleId: 2,
            submissionCount: 0,
            hasSubmissions: false,
            recentSubmissions: [],
            quiz: {
              questions: [
                {
                  id: 1,
                  question: "What is the first step when installing a CPU?",
                  type: "multiple_choice",
                  options: ["Apply thermal paste", "Lift socket lever", "Install cooler"],
                  correctAnswer: 1,
                  points: 15
                }
              ]
            }
          }
        ];
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      // Provide sample data on error
      this.assessments = [
        {
          id: 1,
          title: "Computer Hardware Basics Quiz",
          description: "Test basic computer hardware knowledge",
          isEnabled: true,
          createdAt: new Date(),
          moduleId: 1,
          submissionCount: 0,
          hasSubmissions: false,
          recentSubmissions: []
        }
      ];
    }
  }

  viewAssessment(assessment: any) {
    this.selectedAssessment = assessment;
    this.showViewModal = true;
    this.loadAssessmentSubmissions(assessment.id);
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedAssessment = null;
    this.assessmentSubmissions = [];
  }

  closeSubmissionDetailsModal() {
    this.showSubmissionDetailsModal = false;
    this.selectedSubmission = null;
  }

  async loadAssessmentSubmissions(assessmentId: number) {
    try {
      const submissions = await AdminService.getAssessmentSubmissions(assessmentId);
      this.assessmentSubmissions = submissions || [];
      console.log('Loaded assessment submissions:', this.assessmentSubmissions);
    } catch (error) {
      console.error('Error loading assessment submissions:', error);
      this.assessmentSubmissions = [];
    }
  }

  async refreshSubmissions() {
    if (this.selectedAssessment) {
      await this.loadAssessmentSubmissions(this.selectedAssessment.id);
    }
  }

  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  }

  formatTimeSpent(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  viewSubmissionDetails(submission: any) {
    this.selectedSubmission = submission;
    this.showSubmissionDetailsModal = true;
  }

  provideFeedback(submission: any) {
    console.log('Provide feedback for:', submission);
    // Implement feedback functionality
  }

  getAnswersArray(submission: any): any[] {
    if (!submission || !submission.answers) {
      return [];
    }
    
    const answers = submission.answers;
    const questions = submission.assessment?.questions;
    
    if (!questions) {
      // Fallback: return answers as-is if no questions available
      if (Array.isArray(answers)) {
        return answers;
      }
      if (typeof answers === 'object') {
        return Object.values(answers);
      }
      return [];
    }
    
    // Merge questions with student answers
    const questionsArray = Array.isArray(questions) ? questions : Object.values(questions);
    
    return questionsArray.map((question: any, index: number) => {
      const studentAnswer = answers[question.id] || answers[index] || null;
      
      return {
        ...question,
        selectedAnswer: studentAnswer,
        studentAnswer: studentAnswer
      };
    });
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  editAssessment(assessment: any) {
    this.router.navigate(['/admin/contents/assessments/edit', assessment.id]);
  }


  deleteAssessment(assessment: any) {
    // Check if assessment has submissions
    if (assessment.hasSubmissions) {
      const submissionCount = assessment.submissionCount || 0;
      this.modalService.confirmDelete(
        'Cannot Delete Assessment',
        `Cannot delete this assessment. It has ${submissionCount} student submission(s). Please remove all submissions first.`,
        assessment.title,
        () => {
          // Do nothing - just show the message
        }
      );
      return;
    }

    this.modalService.confirmDelete(
      'Delete Assessment',
      'Are you sure you want to delete this assessment? This action cannot be undone.',
      assessment.title,
      () => this.performDeleteAssessment(assessment.id)
    );
  }

  private async performDeleteAssessment(id: number) {
    try {
      await AdminService.deleteAssessment(id);
      await this.loadAssessments();
      this.modalService.showDeleteSuccess('Assessment');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      this.modalService.showSuccess({
        title: 'Delete Failed',
        message: 'Failed to delete assessment. Please try again.',
        icon: 'error'
      });
    }
  }

}
