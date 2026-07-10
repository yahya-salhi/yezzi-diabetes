import { useState, useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";

type UseNotificationPermissionsResult = {
  granted: boolean;
  loading: boolean;
  request: () => Promise<boolean>;
};

export function useNotificationPermissions(): UseNotificationPermissionsResult {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Notifications.getPermissionsAsync()
      .then((status) => setGranted(status.granted))
      .finally(() => setLoading(false));
  }, []);

  const request = useCallback(async () => {
    setLoading(true);
    try {
      const result = await Notifications.requestPermissionsAsync();
      setGranted(result.granted);
      return result.granted;
    } catch {
      setGranted(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { granted, loading, request };
}
