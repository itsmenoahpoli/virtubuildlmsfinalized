import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AssessmentsService, ActivitiesService } from '@/app/core/services';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface Assessment {
  id?: number;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  timeLimit?: number;
  passingScore: number;
  isEnabled: boolean;
}

@Component({
  selector: 'app-assessment-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './assessment-editor.component.html',
  styleUrls: ['./assessment-editor.component.scss'],
})
export class AssessmentEditorComponent implements OnInit {
  appTitle = 'VirtuBuild';
  labActivityId: number = 0;
  activity: any = null;
  assessments: any[] = [];
  loading = false;
  error: string | null = null;
  
  newAssessment: Assessment = {
    title: '',
    description: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    isEnabled: true
  };

  editingAssessment: Assessment | null = null;
  showForm = false;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.labActivityId = Number(this.route.snapshot.paramMap.get('moduleId'));
    await this.loadActivity();
    await this.loadAssessments();
  }

  async loadActivity() {
    try {
      const response = await ActivitiesService.getById(this.labActivityId);
      this.activity = response?.data;
    } catch (error) {
      console.error('Error loading activity:', error);
      this.error = 'Failed to load activity details';
    }
  }

  async loadAssessments() {
    this.loading = true;
    this.error = null;
    try {
      const response = await AssessmentsService.getByLabActivity(this.labActivityId);
      this.assessments = response?.data || [];
    } catch (error) {
      console.error('Error loading assessments:', error);
      this.error = 'Failed to load assessments';
    } finally {
      this.loading = false;
    }
  }

  startCreating() {
    this.newAssessment = {
      title: '',
      description: '',
      questions: [],
      timeLimit: 30,
      passingScore: 70,
      isEnabled: true
    };
    this.editingAssessment = null;
    this.showForm = true;
  }

  startEditing(assessment: any) {
    this.editingAssessment = { ...assessment };
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingAssessment = null;
  }

  addQuestion() {
    const question: AssessmentQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    };

    if (this.editingAssessment) {
      this.editingAssessment.questions.push(question);
    } else {
      this.newAssessment.questions.push(question);
    }
  }

  removeQuestion(index: number) {
    if (this.editingAssessment) {
      this.editingAssessment.questions.splice(index, 1);
    } else {
      this.newAssessment.questions.splice(index, 1);
    }
  }

  async saveAssessment() {
    try {
      const assessmentData = this.editingAssessment || this.newAssessment;
      
      if (this.editingAssessment && this.editingAssessment.id) {
        await AssessmentsService.update(this.editingAssessment.id, assessmentData);
      } else {
        await AssessmentsService.create({
          labActivityId: this.labActivityId,
          ...assessmentData
        });
      }

      await this.loadAssessments();
      this.cancelForm();
    } catch (error) {
      console.error('Error saving assessment:', error);
      this.error = 'Failed to save assessment';
    }
  }

  async deleteAssessment(assessmentId: number) {
    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        await AssessmentsService.delete(assessmentId);
        await this.loadAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
        this.error = 'Failed to delete assessment';
      }
    }
  }

  getQuestionTypeDisplay(type: string): string {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'true-false': return 'True/False';
      case 'short-answer': return 'Short Answer';
      default: return type;
    }
  }
}


