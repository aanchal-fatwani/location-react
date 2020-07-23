export const initializeDB = () => {
  let request = window.indexedDB.open("LocationDB", 1);

  request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("locations", "readwrite");
    transaction.onerror = function(event) {
      alert("Error occurred while connecting to database");
    };
    let locationStore = transaction.objectStore("locations");
    locationStore.clear();
    };

  request.onerror = function(event) {
    alert("Error occurred while connecting to database");
  };
  request.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("locations", { keyPath: "id" });
  };
};
