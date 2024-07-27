import { useState } from "react";

export function useRideActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRide = async (rideId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ride/${rideId}/start`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to start ride");
      }
      return await response.json();
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
      const response = await fetch(`/api/ride/${rideId}/end`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to end ride");
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { startRide, endRide, isLoading, error };
}
