import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SimulationsService } from '@/app/core/services';

@Component({
  selector: 'app-pc-assembly-simulation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pc-assembly-simulation.component.html',
  styleUrls: ['./pc-assembly-simulation.component.scss']
})
export class PcAssemblySimulationComponent implements OnInit {
  simulation: any = null;
  components: any[] = [];
  activityId: number = 0;
  loading = true;
  simulationStarted = false;
  currentStep = 0;
  totalSteps = 0;
  score = 0;
  timeSpent = 0;
  errors = 0;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.activityId = Number(this.route.snapshot.paramMap.get('activityId'));
    try {
      this.components = await SimulationsService.getActivityComponents(this.activityId);
      this.totalSteps = this.components.length;
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      this.loading = false;
    }
  }

  async startSimulation() {
    try {
      this.simulation = await SimulationsService.start(this.activityId);
      this.simulationStarted = true;
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  }

  async placeComponent(component: any, position: any) {
    try {
      const componentData = {
        componentId: component.id,
        position: position,
        timestamp: new Date().toISOString()
      };
      
      await SimulationsService.placeComponent(this.simulation.id, componentData);
      this.currentStep++;
      
      if (this.currentStep >= this.totalSteps) {
        await this.completeSimulation();
      }
    } catch (error) {
      console.error('Error placing component:', error);
      this.errors++;
    }
  }

  async completeSimulation() {
    try {
      const result = await SimulationsService.complete(this.simulation.id);
      this.score = result.score;
      this.timeSpent = result.timeSpentSeconds;
      this.simulation.status = 'completed';
    } catch (error) {
      console.error('Error completing simulation:', error);
    }
  }

  async getScore() {
    try {
      const scoreData = await SimulationsService.getScore(this.simulation.id);
      this.score = scoreData.score;
      this.timeSpent = scoreData.timeSpentSeconds;
      this.errors = scoreData.errors;
    } catch (error) {
      console.error('Error getting score:', error);
    }
  }

  resetSimulation() {
    this.simulation = null;
    this.simulationStarted = false;
    this.currentStep = 0;
    this.score = 0;
    this.timeSpent = 0;
    this.errors = 0;
  }

  getProgressPercentage() {
    return this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0;
  }
}
