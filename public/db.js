let db;
const request = indexedDB.open('budget', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true })
};
request.onsuccess = function (event) {
    db = event.target.result;
    //checking if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
}
request.onerror = function (event) {
    console.log("Erorr", event.target.errorCode)
};
function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readWrite');
    const store = transaction.objectStore('pending')
    store.add(record)
};
function checkDatabase() {
    const transaction = db.transaction(['pending', 'readWrite']);
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers:
                {
                    Accept: "application/json, text/plain, */*",
                    "content-Type": "application/json"

                }
            })
                .then(response => response.json())
                .then(() => {
                    // delete record if successful
                    const transaction = db.transaction(["pending"], 'readWrite')
                    const store = transaction.objectStore('pending')
                    store.clear();

                })
        }
    }
}
function deleteP() {
    const transaction = db.transaction(["pending"], 'readWrite')
    const store = transaction.objectStore('pending');
    store.clear();


}
//listen to app when it come back online
window.addEventListener("online", checkDatabase);