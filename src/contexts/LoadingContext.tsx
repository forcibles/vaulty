import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

// Define types
type LoadingState = {
  [key: string]: boolean;
};

type LoadingAction = 
  | { type: 'START_LOADING'; key: string }
  | { type: 'STOP_LOADING'; key: string }
  | { type: 'SET_LOADING'; key: string; isLoading: boolean };

// Create context
interface LoadingContextType {
  loadingStates: LoadingState;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Reducer function
const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case 'START_LOADING':
      if (state[action.key] === true) return state;
      return { ...state, [action.key]: true };
    case 'STOP_LOADING':
      if (state[action.key] === false) return state;
      return { ...state, [action.key]: false };
    case 'SET_LOADING':
      if (state[action.key] === action.isLoading) return state;
      return { ...state, [action.key]: action.isLoading };
    default:
      return state;
  }
};

// Provider component
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, dispatch] = useReducer(loadingReducer, {});

  const startLoading = useCallback((key: string) => {
    dispatch({ type: 'START_LOADING', key });
  }, []);

  const stopLoading = useCallback((key: string) => {
    dispatch({ type: 'STOP_LOADING', key });
  }, []);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', key, isLoading });
  }, []);

  const isLoading = useCallback((key: string) => {
    return !!loadingStates[key];
  }, [loadingStates]);

  const value = useMemo(
    () => ({
      loadingStates,
      startLoading,
      stopLoading,
      setLoading,
      isLoading,
    }),
    [loadingStates, startLoading, stopLoading, setLoading, isLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Loading indicator component
export const LoadingIndicator: React.FC<{
  id: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ id, size = 'md', className = '' }) => {
  const { isLoading } = useLoading();
  
  if (!isLoading(id)) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Higher-order component for wrapping async operations
export const withAsyncLoading = <T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<T>,
  loadingKey: string
) => {
  return (props: T) => {
    const { startLoading, stopLoading } = useLoading();
    
    const asyncOperationWrapper = async (asyncFn: () => Promise<any>) => {
      startLoading(loadingKey);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading(loadingKey);
      }
    };

    return <WrappedComponent {...props} asyncOperationWrapper={asyncOperationWrapper} />;
  };
};
