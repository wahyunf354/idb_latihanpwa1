// Membuat Database
var dbPromised = idb.open("news-reader", 1, (up) => {
  var articlesObjectStore = up.createObjectStore("articles", {
    keyPath: "ID"
  })
  articlesObjectStore.createIndex("post_title", "post_title", {
    unique: false
  });
});
// Menambahkan Operasi Simpan Artikel
function saveForLater(article) {
  dbPromised
    .then((db) => {
      var tx = db.transaction("articles", "readwrite");
      var store = tx.objectStore("articles");
      console.log(article);
      store.add(article.result);
      return tx.complete;
    })
    .then(() => {
      console.log("Article Berhasil di simpan!!! YEAH")
    });
}

function getAll() {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.getAll();
      })
      .then((articles) => {
        resolve(articles);
      });
  });
}

function getById(id) {
  return new Promise((resolve, reject) => {
    dbPromised
      .then((db) => {
        var tx = db.transaction("articles", "readonly");
        var store = tx.objectStore("articles");
        return store.get(id);
      })
      .then((article) => {
        resolve(article);
      });
  });
}