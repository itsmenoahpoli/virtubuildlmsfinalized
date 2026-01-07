import { ActivitiesService } from '@/modules/activities/activities.service';
import { labActivitiesRepository } from '@/database';

jest.mock('@/database');

describe('ActivitiesService', () => {
  let activitiesService: ActivitiesService;
  let mockLabActivitiesRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    activitiesService = new ActivitiesService();
    mockLabActivitiesRepository = labActivitiesRepository as jest.Mocked<typeof labActivitiesRepository>;
  });

  describe('listByModule', () => {
    it('should return activities for a module', async () => {
      const mockActivities = [
        {
          id: 1,
          title: 'PC Assembly Basics',
          description: 'Learn basic PC assembly',
          moduleId: 1,
          isEnabled: true
        },
        {
          id: 2,
          title: 'Component Identification',
          description: 'Identify PC components',
          moduleId: 1,
          isEnabled: true
        }
      ];

      mockLabActivitiesRepository.find.mockResolvedValue(mockActivities as any);

      const result = await activitiesService.listAll();

      expect(result).toEqual(mockActivities);
      expect(mockLabActivitiesRepository.find).toHaveBeenCalledWith({
        where: { isEnabled: true }
      });
    });

    it('should return empty array for module with no activities', async () => {
      mockLabActivitiesRepository.find.mockResolvedValue([]);

      const result = await activitiesService.listAll();

      expect(result).toEqual([]);
      expect(mockLabActivitiesRepository.find).toHaveBeenCalledWith({
        where: { isEnabled: true }
      });
    });

    it('should only return enabled activities', async () => {
      const mockActivities = [
        {
          id: 1,
          title: 'Enabled Activity',
          moduleId: 1,
          isEnabled: true
        }
      ];

      mockLabActivitiesRepository.find.mockResolvedValue(mockActivities as any);

      const result = await activitiesService.listAll();

      expect(result).toEqual(mockActivities);
      expect(mockLabActivitiesRepository.find).toHaveBeenCalledWith({
        where: { isEnabled: true }
      });
    });
  });

  describe('getById', () => {
    it('should return activity by id', async () => {
      const mockActivity = {
        id: 1,
        title: 'PC Assembly Basics',
        description: 'Learn basic PC assembly',
        moduleId: 1,
        isEnabled: true
      };

      mockLabActivitiesRepository.findOneBy.mockResolvedValue(mockActivity as any);

      const result = await activitiesService.getById(1);

      expect(result).toEqual(mockActivity);
      expect(mockLabActivitiesRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null for non-existent activity', async () => {
      mockLabActivitiesRepository.findOneBy.mockResolvedValue(null);

      const result = await activitiesService.getById(999);

      expect(result).toBeNull();
      expect(mockLabActivitiesRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should return disabled activities when queried by id', async () => {
      const mockActivity = {
        id: 1,
        title: 'Disabled Activity',
        moduleId: 1,
        isEnabled: false
      };

      mockLabActivitiesRepository.findOneBy.mockResolvedValue(mockActivity as any);

      const result = await activitiesService.getById(1);

      expect(result).toEqual(mockActivity);
    });
  });
});
