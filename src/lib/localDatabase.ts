import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface VisDroneDB extends DBSchema {
  news: {
    key: string;
    value: any;
    indexes: { 'by-date': string };
  };
  datasets: {
    key: string;
    value: any;
    indexes: { 'by-name': string };
  };
  models: {
    key: string;
    value: any;
    indexes: { 'by-stars': number };
  };
  papers: {
    key: string;
    value: any;
    indexes: { 'by-year': number };
  };
  patents: {
    key: string;
    value: any;
    indexes: { 'by-date': string };
  };
  awards: {
    key: string;
    value: any;
    indexes: { 'by-date': string };
  };
  team: {
    key: string;
    value: any;
    indexes: { 'by-role': string };
  };
  sync_meta: {
    key: string;
    value: { lastSync: string; tableName: string };
  };
}

class LocalDatabase {
  private db: IDBPDatabase<VisDroneDB> | null = null;
  private dbName = 'visdrone-local-db';
  private dbVersion = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<VisDroneDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('news')) {
          const newsStore = db.createObjectStore('news', { keyPath: 'id' });
          newsStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('datasets')) {
          const datasetsStore = db.createObjectStore('datasets', { keyPath: 'id' });
          datasetsStore.createIndex('by-name', 'name');
        }
        if (!db.objectStoreNames.contains('models')) {
          const modelsStore = db.createObjectStore('models', { keyPath: 'id' });
          modelsStore.createIndex('by-stars', 'stars');
        }
        if (!db.objectStoreNames.contains('papers')) {
          const papersStore = db.createObjectStore('papers', { keyPath: 'id' });
          papersStore.createIndex('by-year', 'year');
        }
        if (!db.objectStoreNames.contains('patents')) {
          const patentsStore = db.createObjectStore('patents', { keyPath: 'id' });
          patentsStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('awards')) {
          const awardsStore = db.createObjectStore('awards', { keyPath: 'id' });
          awardsStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('team')) {
          const teamStore = db.createObjectStore('team', { keyPath: 'id' });
          teamStore.createIndex('by-role', 'role');
        }
        if (!db.objectStoreNames.contains('sync_meta')) {
          db.createObjectStore('sync_meta', { keyPath: 'tableName' });
        }
      },
    });
  }

  async getAll<T>(storeName: keyof VisDroneDB): Promise<T[]> {
    await this.init();
    return this.db!.getAll(storeName) as Promise<T[]>;
  }

  async get<T>(storeName: keyof VisDroneDB, key: string): Promise<T | undefined> {
    await this.init();
    return this.db!.get(storeName, key) as Promise<T | undefined>;
  }

  async put<T>(storeName: keyof VisDroneDB, items: T[]): Promise<void> {
    await this.init();
    const tx = this.db!.transaction(storeName, 'readwrite');
    for (const item of items) {
      await tx.store.put(item as any);
    }
    await tx.done;
  }

  async clear(storeName: keyof VisDroneDB): Promise<void> {
    await this.init();
    await this.db!.clear(storeName);
  }

  async getLastSync(tableName: string): Promise<string | null> {
    await this.init();
    const meta = await this.db!.get('sync_meta', tableName);
    return meta?.lastSync || null;
  }

  async setLastSync(tableName: string, lastSync: string): Promise<void> {
    await this.init();
    await this.db!.put('sync_meta', { tableName, lastSync } as any);
  }

  async clearAll(): Promise<void> {
    await this.init();
    await this.db!.clear('news');
    await this.db!.clear('datasets');
    await this.db!.clear('models');
    await this.db!.clear('papers');
    await this.db!.clear('patents');
    await this.db!.clear('awards');
    await this.db!.clear('team');
  }
}

export const localDatabase = new LocalDatabase();
export default localDatabase;
