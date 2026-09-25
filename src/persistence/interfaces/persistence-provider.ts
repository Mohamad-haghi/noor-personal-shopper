export interface PersistenceProvider {
  readonly name: string;
  isAvailable(): boolean;
}

export interface KeyValueStorage extends PersistenceProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface DocumentStorage extends PersistenceProvider {
  getCollection<T>(name: string): Promise<T[]>;
  getDocument<T>(collection: string, id: string): Promise<T | null>;
  setDocument<T>(collection: string, id: string, document: T): Promise<void>;
  deleteDocument(collection: string, id: string): Promise<void>;
}
