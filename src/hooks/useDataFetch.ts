// src/hooks/useDataFetch.ts
import { useState, useEffect } from 'react';
import { cachedFetch } from '@/src/utils/cacheUtils';

/**
 * Interface for the useDataFetch hook parameters
 */
interface UseDataFetchParams<T> {
    url: string;
    options?: RequestInit;
    initialData?: T;
    cacheTtl?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

/**
 * Interface for the useDataFetch hook return value
 */
interface UseDataFetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    setData: (data: T) => void;
}

/**
 * Custom hook for data fetching with caching and error handling
 * @param params Hook parameters
 * @returns Data fetching result
 */
export function useDataFetch<T = any>({
    url,
    options,
    initialData = null as unknown as T,
    cacheTtl = 300, // 5 minutes default cache
    enabled = true,
    onSuccess,
    onError,
}: UseDataFetchParams<T>): UseDataFetchResult<T> {
    const [data, setData] = useState<T | null>(initialData);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Function to fetch data
    const fetchData = async (): Promise<void> => {
        if (!url || !enabled) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await cachedFetch<T>(url, options, cacheTtl);
            setData(result);
            onSuccess?.(result);
        } catch (err) {
            const fetchError = err instanceof Error ? err : new Error(String(err));
            setError(fetchError);
            onError?.(fetchError);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on mount and when dependencies change
    useEffect(() => {
        fetchData();
    }, [url, enabled]);

    // Return the hook result
    return {
        data,
        isLoading,
        error,
        refetch: fetchData,
        setData,
    };
}

/**
 * Interface for useResourceFetch hook parameters
 */
interface UseResourceFetchParams {
    id?: string;
    resourceUrl: string;
    enabled?: boolean;
    cacheTtl?: number;
}

/**
 * Specialized hook for fetching a single resource
 * @param params Hook parameters
 * @returns Resource fetch result
 */
export function useResourceFetch<T>({
    id,
    resourceUrl,
    enabled = true,
    cacheTtl = 300,
}: UseResourceFetchParams): UseDataFetchResult<T> {
    // Only fetch if we have an ID
    const isEnabled = enabled && !!id;
    const url = id ? `${resourceUrl}/${id}` : '';

    return useDataFetch<T>({
        url,
        enabled: isEnabled,
        cacheTtl,
    });
}

/**
 * Specialized hook for fetching a list of resources
 * @param resourceUrl Resource URL
 * @param cacheTtl Cache TTL in seconds
 * @returns Resources fetch result
 */
export function useResourceList<T>(
    resourceUrl: string,
    cacheTtl: number = 300
): UseDataFetchResult<T[]> {
    return useDataFetch<T[]>({
        url: resourceUrl,
        cacheTtl,
    });
}

/**
 * Specialized hook for fetching room data
 * @param roomId Room ID
 * @returns Room data fetch result
 */
export function useRoomData(roomId?: string) {
    return useResourceFetch({
        id: roomId,
        resourceUrl: '/api/rooms',
        cacheTtl: 600, // Cache room data for 10 minutes
    });
}

/**
 * Specialized hook for fetching booking data
 * @param bookingId Booking ID
 * @returns Booking data fetch result
 */
export function useBookingData(bookingId?: string) {
    return useResourceFetch({
        id: bookingId,
        resourceUrl: '/api/bookings',
        cacheTtl: 300, // Cache booking data for 5 minutes
    });
}

/**
 * Specialized hook for fetching user's bookings
 * @returns User bookings fetch result
 */
export function useUserBookings() {
    return useResourceList('/api/bookings');
}