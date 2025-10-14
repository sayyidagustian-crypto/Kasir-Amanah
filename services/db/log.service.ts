import { db } from "./db.service";
import { LogEntry } from "../../types";

type LogData = Omit<LogEntry, 'id' | 'timestamp'>;

export const LogService = {
  /**
   * Adds a new log entry to the database.
   * @param logData The data for the log entry.
   */
  async add(logData: LogData): Promise<void> {
    try {
      const newLog: LogEntry = {
        ...logData,
        id: `L-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
      };
      await db.add("logs", newLog);
    } catch (error) {
      console.error("Failed to write to log:", error);
    }
  },

  /**
   * Retrieves all log entries, sorted from newest to oldest.
   * @returns A promise that resolves to an array of log entries.
   */
  async getAll(): Promise<LogEntry[]> {
    const logs = await db.getAll<LogEntry>('logs');
    // Sort descending by timestamp
    return logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
