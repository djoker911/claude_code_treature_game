import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

const IDB_DB_NAME = 'TreasureGameDB';
const IDB_STORE = 'db';
const IDB_KEY = 'game';

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadBytes(): Promise<Uint8Array | null> {
  const idb = await openIdb();
  return new Promise((resolve) => {
    const tx = idb.transaction(IDB_STORE, 'readonly');
    const get = tx.objectStore(IDB_STORE).get(IDB_KEY);
    get.onsuccess = () => resolve(get.result ?? null);
    get.onerror = () => resolve(null);
  });
}

async function saveBytes(data: Uint8Array): Promise<void> {
  const idb = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(IDB_STORE, 'readwrite');
    const put = tx.objectStore(IDB_STORE).put(data, IDB_KEY);
    put.onsuccess = () => resolve();
    put.onerror = () => reject(put.error);
  });
}

let _db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (_db) return _db;

  const SQL = await initSqlJs({
    locateFile: (file) => `${import.meta.env.BASE_URL}${file}`,
  });

  const saved = await loadBytes();
  _db = saved ? new SQL.Database(saved) : new SQL.Database();

  _db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now'))
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      result TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await persist();
  return _db;
}

export async function persist(): Promise<void> {
  if (!_db) return;
  await saveBytes(_db.export());
}
