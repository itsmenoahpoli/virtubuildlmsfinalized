import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

const getRole = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload?.user?.roleName || payload?.user?.role || null;
  } catch {
    return null;
  }
};

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const roles = route.data?.['roles'] as string[] | undefined;
  if (!roles || roles.length === 0) return true;
  const userRole = getRole();
  if (userRole && roles.map(r => r.toLowerCase()).includes(userRole.toLowerCase())) return true;
  const router = new Router();
  router.navigateByUrl('/signin');
  return false;
};


