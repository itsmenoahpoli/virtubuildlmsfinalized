import { USER_TYPES } from '@/app/shared/utils/types.utils';

export interface UserState {
  id?: number | null;
  userType: USER_TYPES | null;
  name: string | null;
  avatar?: string | null;
  email?: string | null;
}

export const initialUserState: UserState = {
  id: null,
  userType: null,
  name: null,
  avatar: null,
  email: null,
};
