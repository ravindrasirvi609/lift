import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useRideActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startRide = async (rideId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/ride/${rideId}/start`);
      if (response.status !== 200) {
        throw new Error("Failed to start ride");
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endRide = async (rideId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/api/ride/${rideId}/end`);
      if (response.status !== 200) {
        throw new Error("Failed to end ride");
      }
      router.push(`/ride-complete/${rideId}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { startRide, endRide, isLoading, error };
}
