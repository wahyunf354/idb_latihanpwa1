const cache_name = "pwa-v4.7.8"; //deklarasi cache 
let urlCache = [
    "/index.html",
    "/nav.html",
    "/article.html",
    "/pages/home.html",
    "/pages/contact.html",
    "/pages/saved.html",
    "/css/materialize.min.css",
    "/js/api.js",
    "/js/nav.js",
    "/js/materialize.min.js",
    "/js/db.js",
    "/js/idb.js",
    "/img/ilkom192.png",
    "/img/ilkom512.png",
    "/",
    "/manifest.json"
];
// menambahkan cache -> Menyimpan data di Cache
self.addEventListener('install', (event) => {
    console.log('Service Worker : Menginstall');

    event.waitUntil(
        caches.open(cache_name) //Mengembalikan sebuah Promise
        .then((cache) => {
            console.log("Service Worker : memuat cache");
            return cache.addAll(urlCache);
        })
    );
});

//-> Agar App Bisa dijalankan secara offline
// Mengunakan event fetch untuk memngambil data dari cache jika cocok dengan request, jika tidak ada di cache maka di teruskan ke server
self.addEventListener('fetch', function (event) {
    var base_url = "https://readerapi.codepolitan.com/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(cache_name).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        )

    }
    // event.respondWith(
    //     caches.match(event.request) /*untuk memeriksa apakah request yang  dikirim oleh browser cocok dengan salah satu berkas yang telah disimpan di dalam cache.*/
    //     .then((response) => {
    //         console.log("Service Worker : Menarik data : ", event.request.url);

    //         if (response) {
    //             console.log("Service Worker : gunakan aset dari cache : ", response.url);
    //             //Apabila URL yang diminta oleh user ternyata tersedia di dalam cache, maka akan kita berikan berkas tersebut dengan kode ->
    //             return response;
    //         }

    //         console.log(
    //             "Service Worker : Memuat aset dari server",
    //             event.request.url
    //         );

    //         let fetchRequest = event.request.clone();

    //         return fetch(fetchRequest)
    //             .then((response) => {
    //                 if (!response || response.status == 200) {
    //                     return response;
    //                 }
    //                 let responseToCache = response.clone();
    //                 caches.open(cache_name)
    //                     .then((cache) => {
    //                         cache.put(event.request, responseToCache);
    //                     })
    //                     .catch(() => {
    //                         console.log("error pada cache.open : ");
    //                     })
    //                 return response;
    //             })
    //     })
    // );
});


// Melakukan penghapusan CACHE KADARLUARSA
self.addEventListener('activate', (event) => {
    console.log('Aktivasi Sevice Worker new');

    event.waitUntil(
        caches.keys() //menangkap semua cache dalam bentuk array
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.forEach((cacheName) => { //memetakan isi array dan melakukan sebuah fanction pada setiap isi array  
                    if (cacheName !== cache_name && cacheName.startsWith("pwa-v")) {
                        console.log("Menghapus Cache");
                        return caches.delete(cacheName); //menghapus cache kadarluarsa
                    } else {
                        console.log("gagal menghapus");
                    }
                })
            );
        })
        .catch(
            (error) => {
                console.log("Terjadi error Pada 'keys' : ", error);
            }
        )
    );
});