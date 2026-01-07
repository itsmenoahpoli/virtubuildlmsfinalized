import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import { setUserType, setUserProfile, clearUser } from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(setUserType, (state, { userType }) => ({
    ...state,
    userType,
  })),
  on(setUserProfile, (state, { id, name, email, avatar }) => ({
    ...state,
    id: id ?? state.id ?? null,
    name,
    email,
    avatar,
  })),
  on(clearUser, () => initialUserState)
);
