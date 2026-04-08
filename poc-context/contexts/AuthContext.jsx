import React, { createContext, useReducer } from 'react';

// useReducer centralises all state transitions in one place.
// Instead of calling individual setters, consumers dispatch an action object,
// and the reducer decides how state changes — easier to trace and test.

const initialState = { user: null, isLoading: false, error: null };

// Pure function: (currentState, action) => nextState
// All possible state transitions are explicit and in one place
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: { name: action.payload }, error: null };
    case 'LOGOUT':
      return { ...initialState };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

// Split into two contexts so components that only READ do not re-render
// when a DISPATCH call happens (and vice versa)
export const AuthStateContext = createContext(null);
export const AuthDispatchContext = createContext(null);

// Keep the old AuthContext export for backwards compatibility with existing consumers
export const AuthContext = AuthStateContext;

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (username) => dispatch({ type: 'LOGIN', payload: username });
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthStateContext.Provider value={{ ...state, login, logout }}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
