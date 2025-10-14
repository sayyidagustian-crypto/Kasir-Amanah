import { useEffect, useRef, useCallback } from "react";

export function useSecretSequence(triggerSequence: string, onMatched: () => void) {
  const bufferRef = useRef<string>("");

  const handler = useCallback((ev: KeyboardEvent) => {
    const key = ev.key;
    // Ignore control keys, navigation keys, etc.
    if (!key || key.length > 1) {
      return;
    }

    const normalized = key.toUpperCase();
    
    bufferRef.current += normalized;
    // Keep the buffer at the same length as the trigger sequence
    if (bufferRef.current.length > triggerSequence.length) {
      bufferRef.current = bufferRef.current.slice(-triggerSequence.length);
    }

    if (bufferRef.current === triggerSequence) {
      bufferRef.current = ""; // Reset after a successful match
      onMatched();
    }
  }, [triggerSequence, onMatched]);

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
