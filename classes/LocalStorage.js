class LocalStorage {
  static get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static set(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  static saveItem(item) {
    let items = LocalStorage.get("items") || [];
    items.push(item);
    LocalStorage.set("items", items);
  }

  static clearList() {
    localStorage.removeItem("items");
  }

  static clear() {
    localStorage.clear();
  }
}

export default LocalStorage;
