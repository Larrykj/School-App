// Offline storage using IndexedDB
const DB_NAME = 'SchoolAppDB';
const DB_VERSION = 1;
const STORES = {
  ATTENDANCE: 'attendance',
  STUDENTS: 'students',
  FEES: 'fees',
};

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.ATTENDANCE)) {
        const attendanceStore = database.createObjectStore(STORES.ATTENDANCE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        attendanceStore.createIndex('studentId', 'studentId', { unique: false });
        attendanceStore.createIndex('date', 'date', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.STUDENTS)) {
        database.createObjectStore(STORES.STUDENTS, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.FEES)) {
        database.createObjectStore(STORES.FEES, { keyPath: 'id' });
      }
    };
  });
};

export const saveAttendance = async (data: any): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.ATTENDANCE], 'readwrite');
    const store = transaction.objectStore(STORES.ATTENDANCE);
    const request = store.put({ ...data, synced: false, timestamp: Date.now() });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getPendingAttendance = async (): Promise<any[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.ATTENDANCE], 'readonly');
    const store = transaction.objectStore(STORES.ATTENDANCE);
    const index = store.index('date');
    const request = index.getAll();

    request.onsuccess = () => {
      const all = request.result;
      resolve(all.filter((item: any) => !item.synced));
    };
    request.onerror = () => reject(request.error);
  });
};

export const markAttendanceSynced = async (id: any): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORES.ATTENDANCE], 'readwrite');
    const store = transaction.objectStore(STORES.ATTENDANCE);
    const request = store.get(id);

    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item.synced = true;
        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
};

/**
 * Sync all pending attendance records to the server
 */
export const syncPendingAttendance = async (apiUrl: string, token: string): Promise<{ synced: number; failed: number }> => {
  const pendingRecords = await getPendingAttendance();
  
  if (pendingRecords.length === 0) {
    return { synced: 0, failed: 0 };
  }

  try {
    const response = await fetch(`${apiUrl}/api/attendance/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ records: pendingRecords }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync attendance');
    }

    const result = await response.json();

    // Mark synced records as synced in IndexedDB
    for (const record of pendingRecords) {
      if (record.id) {
        await markAttendanceSynced(record.id);
      }
    }

    return {
      synced: result.results?.synced || 0,
      failed: result.results?.failed || 0,
    };
  } catch (error) {
    console.error('Sync error:', error);
    return { synced: 0, failed: pendingRecords.length };
  }
};

/**
 * Auto-sync when online
 */
export const setupAutoSync = (apiUrl: string, token: string, intervalMs: number = 60000): number => {
  const syncInterval = window.setInterval(async () => {
    if (navigator.onLine) {
      try {
        await syncPendingAttendance(apiUrl, token);
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }
  }, intervalMs);

  // Also sync when coming back online
  window.addEventListener('online', () => {
    syncPendingAttendance(apiUrl, token).catch(console.error);
  });

  return syncInterval;
};

