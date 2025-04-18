export class StorageManager {
  async get(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error("Storage get error:", error);
      return {};
    }
  }

  async set(data) {
    try {
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  }
}
