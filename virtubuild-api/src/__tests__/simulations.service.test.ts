import { SimulationsService } from '@/modules/simulations/simulations.service';
import { simulationsRepository, labActivitiesRepository } from '@/database';

jest.mock('@/database');

describe('SimulationsService', () => {
  let simulationsService: SimulationsService;
  let mockSimulationsRepository: any;
  let mockLabActivitiesRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    simulationsService = new SimulationsService();
    mockSimulationsRepository = simulationsRepository as jest.Mocked<typeof simulationsRepository>;
    mockLabActivitiesRepository = labActivitiesRepository as jest.Mocked<typeof labActivitiesRepository>;
  });

  describe('startSimulation', () => {
    it('should start a new simulation', async () => {
      const mockActivity = {
        id: 1,
        title: 'PC Assembly Basics',
        description: 'Learn basic PC assembly',
        moduleId: 1,
        isActive: true
      };

      const mockSimulation = {
        id: 1,
        studentId: 1,
        activityId: 1,
        status: 'in_progress',
        score: null,
        timeSpentSeconds: 0,
        errors: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockLabActivitiesRepository.findOne.mockResolvedValue(mockActivity as any);
      mockSimulationsRepository.create.mockReturnValue(mockSimulation as any);
      mockSimulationsRepository.save.mockResolvedValue(mockSimulation as any);

      const result = await simulationsService.startSimulation(1, 1);

      expect(result).toEqual(mockSimulation);
      expect(mockLabActivitiesRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockSimulationsRepository.create).toHaveBeenCalledWith({
        studentId: 1,
        activityId: 1,
        status: 'in_progress',
        score: null,
        timeSpentSeconds: 0,
        errors: 0,
        placedComponents: [],
        finalState: null,
        completedAt: null
      });
      expect(mockSimulationsRepository.save).toHaveBeenCalledWith(mockSimulation);
    });

    it('should throw error for non-existent activity', async () => {
      mockLabActivitiesRepository.findOne.mockResolvedValue(null);

      await expect(simulationsService.startSimulation(1, 999))
        .rejects.toThrow('Activity not found');
    });

    it('should throw error for inactive activity', async () => {
      const mockActivity = {
        id: 1,
        title: 'PC Assembly Basics',
        description: 'Learn basic PC assembly',
        moduleId: 1,
        isActive: false
      };

      mockLabActivitiesRepository.findOne.mockResolvedValue(mockActivity as any);

      await expect(simulationsService.startSimulation(1, 1))
        .rejects.toThrow('Activity is not active');
    });
  });

  describe('getSimulation', () => {
    it('should get simulation by id', async () => {
      const mockSimulation = {
        id: 1,
        studentId: 1,
        activityId: 1,
        status: 'in_progress',
        score: null,
        timeSpentSeconds: 0,
        errors: 0,
        placedComponents: [],
        finalState: null,
        completedAt: null
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const result = await simulationsService.getSimulation(1);

      expect(result).toEqual(mockSimulation);
      expect(mockSimulationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['student', 'activity']
      });
    });

    it('should return null for non-existent simulation', async () => {
      mockSimulationsRepository.findOne.mockResolvedValue(null);

      const result = await simulationsService.getSimulation(999);

      expect(result).toBeNull();
    });
  });

  describe('getStudentSimulations', () => {
    it('should get all simulations for a student', async () => {
      const mockSimulations = [
        {
          id: 1,
          studentId: 1,
          activityId: 1,
          status: 'completed',
          score: 85,
          timeSpentSeconds: 300,
          errors: 2
        },
        {
          id: 2,
          studentId: 1,
          activityId: 2,
          status: 'in_progress',
          score: null,
          timeSpentSeconds: 150,
          errors: 0
        }
      ];

      mockSimulationsRepository.find.mockResolvedValue(mockSimulations as any);

      const result = await simulationsService.getStudentSimulations(1);

      expect(result).toEqual(mockSimulations);
      expect(mockSimulationsRepository.find).toHaveBeenCalledWith({
        where: { studentId: 1 },
        relations: ['activity'],
        order: { createdAt: 'DESC' }
      });
    });
  });

  describe('placeComponent', () => {
    it('should place component in simulation', async () => {
      const mockSimulation = {
        id: 1,
        studentId: 1,
        activityId: 1,
        status: 'in_progress',
        placedComponents: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const componentData = {
        componentId: 'cpu-001',
        x: 0,
        y: 0,
        z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        metadata: { type: 'CPU' }
      };

      const result = await simulationsService.placeComponent(1, componentData);

      expect((result as any).placedComponents).toContainEqual({
        ...componentData,
        placedAt: expect.any(Date)
      });
      expect(mockSimulation.save).toHaveBeenCalled();
    });

    it('should throw error for non-existent simulation', async () => {
      mockSimulationsRepository.findOne.mockResolvedValue(null);

      const componentData = {
        componentId: 'cpu-001',
        x: 0,
        y: 0,
        z: 0
      };

      await expect(simulationsService.placeComponent(999, componentData))
        .rejects.toThrow('Simulation not found');
    });

    it('should throw error for completed simulation', async () => {
      const mockSimulation = {
        id: 1,
        status: 'completed',
        placedComponents: []
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const componentData = {
        componentId: 'cpu-001',
        x: 0,
        y: 0,
        z: 0
      };

      await expect(simulationsService.placeComponent(1, componentData))
        .rejects.toThrow('Cannot place components in completed simulation');
    });
  });

  describe('completeSimulation', () => {
    it('should complete simulation', async () => {
      const mockSimulation = {
        id: 1,
        studentId: 1,
        activityId: 1,
        status: 'in_progress',
        placedComponents: [],
        save: jest.fn().mockResolvedValue(undefined)
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const completionData = {
        score: 85,
        timeSpentSeconds: 300,
        errors: 2,
        finalState: { completed: true }
      };

      const result = await simulationsService.completeSimulation(1, completionData);

      expect((result as any).status).toBe('completed');
      expect((result as any).score).toBe(completionData.score);
      expect((result as any).timeSpentSeconds).toBe(completionData.timeSpentSeconds);
      expect((result as any).errors).toBe(completionData.errors);
      expect((result as any).finalState).toEqual(completionData.finalState);
      expect((result as any).completedAt).toBeInstanceOf(Date);
      expect(mockSimulation.save).toHaveBeenCalled();
    });

    it('should throw error for non-existent simulation', async () => {
      mockSimulationsRepository.findOne.mockResolvedValue(null);

      const completionData = {
        score: 85,
        timeSpentSeconds: 300
      };

      await expect(simulationsService.completeSimulation(999, completionData))
        .rejects.toThrow('Simulation not found');
    });

    it('should throw error for already completed simulation', async () => {
      const mockSimulation = {
        id: 1,
        status: 'completed'
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const completionData = {
        score: 85,
        timeSpentSeconds: 300
      };

      await expect(simulationsService.completeSimulation(1, completionData))
        .rejects.toThrow('Simulation is already completed');
    });
  });

  describe('getSimulationScore', () => {
    it('should get simulation score', async () => {
      const mockSimulation = {
        id: 1,
        score: 85,
        timeSpentSeconds: 300,
        errors: 2,
        status: 'completed',
        completedAt: new Date()
      };

      mockSimulationsRepository.findOne.mockResolvedValue(mockSimulation as any);

      const result = await simulationsService.getSimulationScore(1);

      expect(result).toEqual({
        score: 85,
        timeSpent: 300,
        errors: 2,
        status: 'completed',
        completedAt: mockSimulation.completedAt
      });
    });

    it('should return null for non-existent simulation', async () => {
      mockSimulationsRepository.findOne.mockResolvedValue(null);

      const result = await simulationsService.getSimulationScore(999);

      expect(result).toBeNull();
    });
  });

  describe('getSimulationLeaderboard', () => {
    it('should get leaderboard for all activities', async () => {
      const mockLeaderboard = [
        {
          studentId: 1,
          studentName: 'John Doe',
          activityId: 1,
          activityTitle: 'PC Assembly Basics',
          score: 95,
          timeSpent: 250,
          errors: 1,
          completedAt: new Date()
        }
      ];

      mockSimulationsRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockLeaderboard as any)
      } as any);

      const result = await simulationsService.getSimulationLeaderboard();

      expect(result).toEqual(mockLeaderboard);
    });

    it('should get leaderboard filtered by activityId', async () => {
      const mockLeaderboard = [
        {
          studentId: 1,
          studentName: 'John Doe',
          activityId: 1,
          activityTitle: 'PC Assembly Basics',
          score: 95,
          timeSpent: 250,
          errors: 1,
          completedAt: new Date()
        }
      ];

      mockSimulationsRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockLeaderboard as any)
      } as any);

      const result = await simulationsService.getSimulationLeaderboard(1);

      expect(result).toEqual(mockLeaderboard);
    });
  });

  describe('getSimulationComponents', () => {
    it('should get simulation components for activity', async () => {
      const mockActivity = {
        id: 1,
        title: 'PC Assembly Basics',
        description: 'Learn basic PC assembly',
        components: [
          { id: 'cpu-001', name: 'CPU', type: 'CPU' },
          { id: 'ram-001', name: 'RAM', type: 'Memory' }
        ],
        instructions: 'Place components in the correct order',
        objectives: ['Learn component placement', 'Understand PC architecture']
      };

      mockLabActivitiesRepository.findOne.mockResolvedValue(mockActivity as any);

      const result = await simulationsService.getSimulationComponents(1);

      expect(result).toEqual({
        components: mockActivity.components,
        instructions: mockActivity.instructions,
        objectives: mockActivity.objectives
      });
    });

    it('should throw error for non-existent activity', async () => {
      mockLabActivitiesRepository.findOne.mockResolvedValue(null);

      await expect(simulationsService.getSimulationComponents(999))
        .rejects.toThrow('Activity not found');
    });
  });
});
