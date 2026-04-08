import { useContext } from 'react';
import { AuthStateContext, AuthDispatchContext } from '../contexts/AuthContext';

// Custom hooks hide the useContext call and add validation.
// Components import useAuth() instead of the context directly — cleaner and safer.

export function useAuth() {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const dispatch = useContext(AuthDispatchContext);
  if (!dispatch) {
    throw new Error('useAuthDispatch must be used inside AuthProvider');
  }
  return dispatch;
}
