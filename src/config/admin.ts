// Load admin user IDs from environment variable
const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean).map(Number);

export function isAdmin(userId: number): boolean {
  return adminIds.includes(userId);
} 