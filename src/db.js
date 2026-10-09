// Minimal IndexedDB wrapper — single-store key/value persistence.
// Fully offline; no network calls anywhere in this file.

const DB_NAME = 'questhabit-db';
const STORE = 'kv';
const VERSION = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const out = fn(store);
    t.oncomplete = () => resolve(out?.result !== undefined ? out.result : out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export async function dbGet(key) {
  const db = await openDb();
  return tx(db, 'readonly', (store) => store.get(key));
}

export async function dbSet(key, value) {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.put(value, key));
}

export async function dbDelete(key) {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.delete(key));
}

export async function dbClear() {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.clear());
}

export const STATE_KEY = 'questhabit-state-v1';
