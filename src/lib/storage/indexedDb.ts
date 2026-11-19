import { AuditResult, SubscriptionAction } from "@/types";

const DB_NAME = "SubSenseDB";
const DB_VERSION = 1;
const STORE_AUDITS = "audits";
const STORE_PREFERENCES = "preferences";

export function openSubSenseDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not available in this environment."));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_AUDITS)) {
        db.createObjectStore(STORE_AUDITS, { keyPath: "auditId" });
      }
      if (!db.objectStoreNames.contains(STORE_PREFERENCES)) {
        db.createObjectStore(STORE_PREFERENCES, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAuditToDB(audit: AuditResult): Promise<void> {
  try {
    const db = await openSubSenseDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_AUDITS], "readwrite");
      const store = transaction.objectStore(STORE_AUDITS);
      const request = store.put(audit);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to save audit to IndexedDB, fallback to memory/localStorage", err);
  }
}

export async function getLatestAuditFromDB(): Promise<AuditResult | null> {
  try {
    const db = await openSubSenseDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_AUDITS], "readonly");
      const store = transaction.objectStore(STORE_AUDITS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as AuditResult[];
        if (!results || results.length === 0) return resolve(null);
        // Sort descending by creation date
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results[0]);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to retrieve audit from IndexedDB", err);
    return null;
  }
}

export async function updateSubscriptionActionInDB(
  auditId: string,
  subscriptionId: string,
  action: SubscriptionAction
): Promise<AuditResult | null> {
  try {
    const db = await openSubSenseDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_AUDITS], "readwrite");
      const store = transaction.objectStore(STORE_AUDITS);
      const getReq = store.get(auditId);

      getReq.onsuccess = () => {
        const audit = getReq.result as AuditResult | undefined;
        if (!audit) return resolve(null);

        const sub = audit.subscriptions.find((s) => s.id === subscriptionId);
        if (sub) {
          sub.action = action;
        }

        // Recalculate summary potential savings
        let potentialSavings = 0;
        let flaggedCount = 0;
        audit.subscriptions.forEach((s) => {
          if (s.action === "flag-to-cancel" || s.action === "cancelled") {
            potentialSavings += s.annualizedCost;
            flaggedCount++;
          }
        });
        audit.summary.potentialAnnualSavings = Number(potentialSavings.toFixed(2));
        audit.summary.flaggedSubscriptionsCount = flaggedCount;

        const putReq = store.put(audit);
        putReq.onsuccess = () => resolve(audit);
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    console.warn("Failed to update subscription in IndexedDB", err);
    return null;
  }
}

export async function clearAllLocalAudits(): Promise<void> {
  try {
    const db = await openSubSenseDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_AUDITS], "readwrite");
      const store = transaction.objectStore(STORE_AUDITS);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to clear IndexedDB", err);
  }
}
