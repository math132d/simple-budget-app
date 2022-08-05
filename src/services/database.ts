let database: IDBDatabase | undefined = undefined;

function getDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (database) return resolve(database);

    let opening = indexedDB.open("store", 1);

    opening.onupgradeneeded = initDatabase;
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      database = opening.result;
      resolve(database);
    };
  });
}

function writeTransaction(
  db: IDBDatabase,
  store: string,
  operation: (store: IDBObjectStore) => IDBRequest<any> | void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readwrite");
    const s = transaction.objectStore(store);

    const res = operation(s);

    transaction.oncomplete = () => resolve(res?.result || undefined);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function readTransaction(
  db: IDBDatabase,
  store: string,
  operation: (store: IDBObjectStore) => IDBRequest<any>
): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, "readonly");
    const s = transaction.objectStore(store);

    const res = operation(s);

    transaction.oncomplete = () => resolve(res.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function initDatabase(this: IDBOpenDBRequest, event: IDBVersionChangeEvent) {
  let db = this.result;

  if (!db.objectStoreNames.contains("budgets")) {
    db.createObjectStore("budgets", { keyPath: "id", autoIncrement: true });
  }

  if (!db.objectStoreNames.contains("expenses")) {
    let expenses = db.createObjectStore("expenses", {
      keyPath: "id",
      autoIncrement: true,
    });

    expenses.createIndex("budget_idx", "budget_id");
  }
}

export { getDatabase, writeTransaction, readTransaction };
