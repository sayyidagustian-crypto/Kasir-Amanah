import { db } from './db.service';
import { Setting } from '../../types';

export const backupData = async (): Promise<void> => {
  const backupObject = await db.exportData();
  
  const backupPayload = {
    ...backupObject,
    backupDate: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(backupPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `kasir_amanah_backup_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const restoreData = async (data: any): Promise<void> => {
    if (!data.products || !data.transactions || !data.settings) {
        throw new Error('File backup tidak valid atau rusak.');
    }
    const { backupDate, ...storesData } = data;
    await db.importData(storesData);
};

export const resetAllData = async (): Promise<void> => {
    await db.resetDatabase();
};

export const getSetting = async (key: string): Promise<any> => {
    const setting = await db.getById<Setting>('settings', key);
    return setting?.value;
};

export const setSetting = async (key: string, value: any): Promise<void> => {
    const setting: Setting = { key, value };
    await db.update('settings', setting); // Using update/put is safer as it works for both add and update
};
