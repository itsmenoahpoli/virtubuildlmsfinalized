import { Repository } from 'typeorm';
import { DBDataSource } from '@/database';
import { AuditLog } from '@/database/entities';

interface AuditLogData {
  action: string;
  resource?: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId: number;
}

export class AuditService {
  private auditLogRepository: Repository<AuditLog>;

  constructor() {
    this.auditLogRepository = DBDataSource.getRepository(AuditLog);
  }

  async log(data: AuditLogData): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      userId: data.userId
    });

    return await this.auditLogRepository.save(auditLog);
  }

  async getLogs(filters: {
    userId?: number;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const query = this.auditLogRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .orderBy('auditLog.createdAt', 'DESC');

    if (filters.userId) {
      query.andWhere('auditLog.userId = :userId', { userId: filters.userId });
    }

    if (filters.action) {
      query.andWhere('auditLog.action = :action', { action: filters.action });
    }

    if (filters.resource) {
      query.andWhere('auditLog.resource = :resource', { resource: filters.resource });
    }

    if (filters.startDate) {
      query.andWhere('auditLog.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('auditLog.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;

    const [logs, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { logs, total };
  }

  async exportLogs(filters: {
    userId?: number;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> {
    const query = this.auditLogRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .orderBy('auditLog.createdAt', 'DESC');

    if (filters.userId) {
      query.andWhere('auditLog.userId = :userId', { userId: filters.userId });
    }

    if (filters.action) {
      query.andWhere('auditLog.action = :action', { action: filters.action });
    }

    if (filters.resource) {
      query.andWhere('auditLog.resource = :resource', { resource: filters.resource });
    }

    if (filters.startDate) {
      query.andWhere('auditLog.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('auditLog.createdAt <= :endDate', { endDate: filters.endDate });
    }

    return await query.getMany();
  }

  async getLogStats(period: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalLogs: number;
    uniqueUsers: number;
    topActions: Array<{ action: string; count: number }>;
    topResources: Array<{ resource: string; count: number }>;
  }> {
    const dateFilter = this.getDateFilter(period);
    
    const totalLogs = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .where('auditLog.createdAt >= :dateFilter', { dateFilter })
      .getCount();

    const uniqueUsers = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('COUNT(DISTINCT auditLog.userId)', 'count')
      .where('auditLog.createdAt >= :dateFilter', { dateFilter })
      .getRawOne();

    const topActions = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :dateFilter', { dateFilter })
      .groupBy('auditLog.action')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const topResources = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .select('auditLog.resource', 'resource')
      .addSelect('COUNT(*)', 'count')
      .where('auditLog.createdAt >= :dateFilter', { dateFilter })
      .andWhere('auditLog.resource IS NOT NULL')
      .groupBy('auditLog.resource')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalLogs,
      uniqueUsers: parseInt(uniqueUsers.count) || 0,
      topActions: topActions.map(item => ({
        action: item.action,
        count: parseInt(item.count)
      })),
      topResources: topResources.map(item => ({
        resource: item.resource,
        count: parseInt(item.count)
      }))
    };
  }

  private getDateFilter(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}

export const auditService = new AuditService();
