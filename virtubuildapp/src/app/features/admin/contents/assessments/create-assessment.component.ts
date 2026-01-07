import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-create-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  loading = false;
  labActivities: any[] = [];
  isEditMode = false;
  assessmentId: number | null = null;
  pageTitle = 'Create New Assessment';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.assessmentForm = this.fb.group({
      labActivityId: [null, [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      timeLimitMinutes: [45, [Validators.required, Validators.min(1), Validators.max(180)]],
      isEnabled: [true],
      questions: this.fb.array([])
    });
  }

  async ngOnInit() {
    // Check if we're in edit mode
    this.assessmentId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    this.isEditMode = !!this.assessmentId;
    this.pageTitle = this.isEditMode ? 'Edit Assessment' : 'Create New Assessment';

    // Load lab activities
    await this.loadLabActivities();
    
    if (this.isEditMode && this.assessmentId) {
      await this.loadAssessmentData();
    } else {
      // Add initial question for create mode
      this.addQuestion();
    }
  }

  async loadLabActivities() {
    try {
      this.labActivities = await AdminService.getAllLabActivities();
    } catch (error) {
      console.error('Error loading lab activities:', error);
      this.labActivities = [];
    }
  }

  async loadAssessmentData() {
    if (!this.assessmentId) return;
    
    try {
      this.loading = true;
      console.log('Loading assessment data for ID:', this.assessmentId);
      const assessment = await AdminService.getAssessmentById(this.assessmentId);
      console.log('Loaded assessment:', assessment);
      
      if (assessment) {
        // Populate form with existing assessment data
        this.assessmentForm.patchValue({
          labActivityId: assessment.labActivityId,
          title: assessment.title,
          description: assessment.description || '',
          timeLimitMinutes: assessment.timeLimitMinutes || 45,
          isEnabled: assessment.isEnabled
        });

        console.log('Form patched with basic data');

        // Clear existing questions
        this.questionsArray.clear();

        // Load questions if they exist
        if (assessment.questions && Array.isArray(assessment.questions)) {
          console.log('Loading questions:', assessment.questions);
          assessment.questions.forEach((question: any) => {
            this.addQuestionFromData(question);
          });
        } else {
          console.log('No questions found, adding default question');
          // If no questions, add a default one
          this.addQuestion();
        }
      } else {
        console.log('No assessment found with ID:', this.assessmentId);
      }
    } catch (error) {
      console.error('Error loading assessment data:', error);
    } finally {
      this.loading = false;
    }
  }

  get questionsArray(): FormArray {
    return this.assessmentForm.get('questions') as FormArray;
  }

  getOptionsArray(question: any): any[] {
    return (question.get('options') as FormArray).controls;
  }

  createQuestionForm(): FormGroup {
    return this.fb.group({
      questionText: ['', [Validators.required]],
      questionType: ['multiple_choice', [Validators.required]],
      options: this.fb.array([]),
      correctAnswer: [0, [Validators.required]],
      points: [15, [Validators.required, Validators.min(1), Validators.max(100)]],
      explanation: ['']
    });
  }

  createOptionForm(value: string = '', isCorrect: boolean = false): FormGroup {
    return this.fb.group({
      value: [value, [Validators.required]],
      isCorrect: [isCorrect]
    });
  }

  addQuestion() {
    const questionForm = this.createQuestionForm();
    this.questionsArray.push(questionForm);
    
    // Add initial options for multiple choice
    const optionsArray = questionForm.get('options') as FormArray;
    optionsArray.push(this.createOptionForm('Option 1', true));
    optionsArray.push(this.createOptionForm('Option 2', false));
    optionsArray.push(this.createOptionForm('Option 3', false));
    optionsArray.push(this.createOptionForm('Option 4', false));
  }

  addQuestionFromData(questionData: any) {
    console.log('Adding question from data:', questionData);
    const questionForm = this.createQuestionForm();
    questionForm.patchValue({
      questionText: questionData.question || questionData.questionText || '',
      questionType: questionData.type || questionData.questionType || 'multiple_choice',
      correctAnswer: questionData.correctAnswer || questionData.correctAnswerIndex || 0,
      points: questionData.points || 15,
      explanation: questionData.explanation || ''
    });

    console.log('Question form patched with:', questionForm.value);
    this.questionsArray.push(questionForm);

    // Add options from data
    const optionsArray = questionForm.get('options') as FormArray;
    optionsArray.clear();

    if (questionData.options && Array.isArray(questionData.options)) {
      console.log('Adding options from data:', questionData.options);
      questionData.options.forEach((option: any, index: number) => {
        const isCorrect = questionData.correctAnswer === index || 
                         questionData.correctAnswerIndex === index ||
                         option.isCorrect === true;
        optionsArray.push(this.createOptionForm(option.value || option.text || `Option ${index + 1}`, isCorrect));
      });
    } else {
      console.log('No options found, using defaults');
      // Default options if none provided
      optionsArray.push(this.createOptionForm('Option 1', true));
      optionsArray.push(this.createOptionForm('Option 2', false));
      optionsArray.push(this.createOptionForm('Option 3', false));
      optionsArray.push(this.createOptionForm('Option 4', false));
    }
  }

  removeQuestion(index: number) {
    if (this.questionsArray.length > 1) {
      this.questionsArray.removeAt(index);
    }
  }

  addOption(questionIndex: number) {
    const questionForm = this.questionsArray.at(questionIndex) as FormGroup;
    const optionsArray = questionForm.get('options') as FormArray;
    optionsArray.push(this.createOptionForm('', false));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const questionForm = this.questionsArray.at(questionIndex) as FormGroup;
    const optionsArray = questionForm.get('options') as FormArray;
    if (optionsArray.length > 2) {
      optionsArray.removeAt(optionIndex);
    }
  }

  onQuestionTextChange(questionIndex: number, event: any) {
    const questionForm = this.questionsArray.at(questionIndex) as FormGroup;
    questionForm.get('questionText')?.setValue(event.target.innerHTML);
  }

  onQuestionTextBlur(questionIndex: number, event: any) {
    const questionForm = this.questionsArray.at(questionIndex) as FormGroup;
    questionForm.get('questionText')?.setValue(event.target.innerHTML);
    questionForm.get('questionText')?.markAsTouched();
  }

  onQuestionTypeChange(questionIndex: number, event: any) {
    const type = event.target.value;
    const questionForm = this.questionsArray.at(questionIndex) as FormGroup;
    const optionsArray = questionForm.get('options') as FormArray;
    
    // Clear existing options
    optionsArray.clear();
    
    if (type === 'multiple_choice') {
      // Add 4 default options for multiple choice
      optionsArray.push(this.createOptionForm('Option 1', true));
      optionsArray.push(this.createOptionForm('Option 2', false));
      optionsArray.push(this.createOptionForm('Option 3', false));
      optionsArray.push(this.createOptionForm('Option 4', false));
    } else if (type === 'enumeration') {
      // Add 3 default enumeration items
      optionsArray.push(this.createOptionForm('Item 1', true));
      optionsArray.push(this.createOptionForm('Item 2', true));
      optionsArray.push(this.createOptionForm('Item 3', true));
    }
  }

  async onSubmit() {
    if (this.assessmentForm.valid) {
      this.loading = true;
      
      try {
        // Process the form data
        const assessmentData = {
          ...this.assessmentForm.value,
          questions: this.assessmentForm.value.questions.map((q: any) => ({
            ...q,
            options: q.options.map((opt: any, index: number) => ({
              ...opt,
              order: index + 1
            }))
          }))
        };

        if (this.isEditMode && this.assessmentId) {
          // Update existing assessment
          await AdminService.updateAssessment(this.assessmentId, assessmentData);
          console.log('Assessment updated successfully');
        } else {
          // Create new assessment
          await AdminService.createAssessment(assessmentData);
          console.log('Assessment created successfully');
        }

        this.router.navigate(['/admin/contents/assessments']);
      } catch (error) {
        console.error('Error saving assessment:', error);
        // You could add a toast notification or error message here
      } finally {
        this.loading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.assessmentForm.controls).forEach(key => {
      const control = this.assessmentForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel() {
    this.router.navigate(['/admin/contents/assessments']);
  }
}
