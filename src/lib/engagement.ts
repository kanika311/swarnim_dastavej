import crypto from 'crypto';
import { IContestScoringRules } from '@/models/WeeklyContest';

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + '-swarnim-salt').digest('hex').substring(0, 32);
}

export const DEFAULT_SCORING_RULES: IContestScoringRules = {
  pointsPer100Views: 1,
  pointsPerLike: 2,
  pointsPerComment: 3,
  pointsPerShare: 4,
  pointsPerPublishedReport: 10,
};

export function calculateContestScore(
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    publishedReports: number;
  },
  rules: IContestScoringRules = DEFAULT_SCORING_RULES
): number {
  const viewPoints = Math.floor((stats.views || 0) / 100) * (rules.pointsPer100Views ?? 1);
  const likePoints = (stats.likes || 0) * (rules.pointsPerLike ?? 2);
  const commentPoints = (stats.comments || 0) * (rules.pointsPerComment ?? 3);
  const sharePoints = (stats.shares || 0) * (rules.pointsPerShare ?? 4);
  const reportPoints = (stats.publishedReports || 0) * (rules.pointsPerPublishedReport ?? 10);

  return Math.max(0, viewPoints + likePoints + commentPoints + sharePoints + reportPoints);
}
