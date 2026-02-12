import { useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { fetchTestProduct as apiFetchTestProduct, fetchTestProductStock as apiFetchTestProductStock } from '../lib/antistock-api';

// Custom hook for managing Antistock API operations with loading states
export const useAntistockApi = () => {
  const { startLoading, stopLoading } = useLoading();
  
  // Fetch test product with loading state
  const fetchTestProduct = useCallback(async (signal?: AbortSignal) => {
    const loadingKey = 'fetchTestProduct';
    startLoading(loadingKey);
    
    try {
      const result = await apiFetchTestProduct(signal);
      return result;
    } finally {
      stopLoading(loadingKey);
    }
  }, [startLoading, stopLoading]);
  
  // Fetch test product stock with loading state
  const fetchTestProductStock = useCallback(async (signal?: AbortSignal) => {
    const loadingKey = 'fetchTestProductStock';
    startLoading(loadingKey);
    
    try {
      const result = await apiFetchTestProductStock(signal);
      return result;
    } finally {
      stopLoading(loadingKey);
    }
  }, [startLoading, stopLoading]);
  
  return {
    fetchTestProduct,
    fetchTestProductStock,
  };
};

// Custom hook for generic async operations with loading state
export const useAsyncOperation = <T,>(
  operation: (...args: any[]) => Promise<T>,
  loadingKey: string
) => {
  const { startLoading, stopLoading } = useLoading();
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async (...args: any[]) => {
    startLoading(loadingKey);
    setError(null);
    
    try {
      const res = await operation(...args);
      setResult(res);
      return res;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(errorObj);
      throw errorObj;
    } finally {
      stopLoading(loadingKey);
    }
  }, [operation, loadingKey, startLoading, stopLoading]);
  
  return {
    execute,
    result,
    error,
    isLoading: useLoading().isLoading(loadingKey),
  };
};