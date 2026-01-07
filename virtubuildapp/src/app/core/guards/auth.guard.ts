import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    const router = new Router();
    router.navigateByUrl('/signin');
    return false;
  }
  return true;
};


