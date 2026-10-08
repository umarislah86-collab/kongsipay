# KongsiPay

App pengurusan subscription bersama dalam Bahasa Melayu. Design asal dikekalkan; akaun dan data menggunakan Firebase PayTrack yang sama.

## Login dan data lama

- Firebase project: `hey-9ba52`; Firestore `(default)`, Standard edition, `asia-southeast1`.
- Google Sign-In menggunakan konfigurasi web app dari `C:\Users\C5407836\paytrack\src\lib\firebase.ts`.
- Akaun baharu didaftarkan dengan Google pada login pertama. Akaun PayTrack menggunakan UID yang sama apabila memilih akaun Google yang sama.
- Profil lama, termasuk nama, QR dan nombor WhatsApp, dibaca tanpa ditimpa.
- Collection lama digunakan terus: `users`, `subscriptions`, `billingCycles`, `payments`. Tiada salinan atau pemadaman rekod lama.
- Disahkan pada 8 Oktober 2026: 7 profil, 5 subscription, 39 kitaran bil, 128 bayaran. Semua ID rekod dan kandungan cloud kekal selepas integrasi.
- Query membership hanya memuatkan subscription yang mengandungi UID pengguna, kemudian mendengar perubahan kitaran dan bayaran secara langsung. Akaun tanpa keahlian mendapat paparan kosong.
- Split, rotation/giliran dan hutang dipaparkan mengikut schema PayTrack; paid markers, partial payments dan isSedekah dikira tanpa menggandakan jumlah.

## Ciri tersedia

Ringkasan baki sendiri dan kumpulan; pilihan semua atau satu subscription; senarai ahli; Google login/logout; pendaftaran automatik; jemputan email yang diterima selepas login email disahkan; semakan jemputan manual; subscription baharu; caj kitaran baharu; rekod bayaran separa; semakan owner dengan sebab penolakan; rekod bil provider berasingan; QR penerima sedia ada; export CSV.

Kitaran baharu menyimpan snapshot UID ahli, penerima dan pecahan integer-sen. Bayaran baharu bermula dengan `status: pending` dan `paid: false`. Apabila owner mengesahkan, ia menggunakan `partialPayment` PayTrack; paid marker bernilai sifar ditambah apabila caj sudah selesai, supaya PayTrack masih mengenali caj itu sebagai settle. Transaksi mengubah revision kitaran untuk mengelakkan dua permintaan serentak melebihi baki. Request ID menghalang penghantaran bayaran yang sama dua kali.

Jemputan ialah rekod `pendingEmails`; app tidak menghantar email. Kongsi link sendiri kepada ahli. Ahli yang baru join tidak ditambah kepada snapshot caj yang sudah dijana. Subscription hutang dicipta tanpa bil awal: jemput penghutang dahulu, kemudian jana kitaran. Satu kitaran setiap bulan boleh dijana melalui KongsiPay; julat kitaran PayTrack lama tetap dipaparkan.

## Akses dan had

Site kekal private untuk owner atas arahan pengguna. Firebase Google login dan data bersama sudah disambungkan, tetapi member lain masih perlu diberi akses kepada Site sebelum mereka boleh membuka link ini.

Peraturan Firestore produksi sedia ada tidak diubah dalam integrasi ini. Ia mengehadkan bacaan subscription mengikut membership, tetapi `users` boleh dibaca oleh pengguna berdaftar dan `billingCycles` / `payments` boleh dibaca serta ditulis oleh mana-mana pengguna Firebase yang login. Tindakan owner dalam KongsiPay diperiksa dalam UI dan repository; peraturan cloud lama belum menguatkuasakan sekatan owner itu. Ini batas keselamatan yang perlu ditangani sebelum app dibuka kepada pengguna ramai. Fixture `tests/emulators/paytrack.rules` ialah salinan peraturan lama untuk ujian keserasian, bukan rules baru yang dilancarkan.

Tiada transaksi wang, gateway, recurring job, reminder automatik, upload resit, deposit, kredit atau multi-currency. Jumlah dipaparkan dalam RM, sepadan dengan semua rekod PayTrack yang diperiksa.

## Jalankan

`npm ci`

`npm run dev` — http://127.0.0.1:4173

`npm run build` — hasil static dalam `dist/`, dihoskan melalui Site yang sama.

`npm test` — ujian model; ujian integration dilangkau jika emulator tidak diminta.

Ujian integration (data tempatan sahaja):

1. `firebase emulators:start --project demo-kongsipay --config tests/emulators/firebase.json --only auth,firestore`
2. Dalam PowerShell terminal lain, set `$env:RUN_FIREBASE_INTEGRATION = '1'` dan jalankan `npm test`.

`VITE_USE_EMULATORS=true` hanya digunakan pada localhost / 127.0.0.1. Dalam mode ini app menggunakan project ujian `demo-kongsipay`, Auth port 9099 dan Firestore port 8080. Mode production menggunakan project sebenar.

13 ujian model dan integration lulus: pembacaan legacy, profile lama, akaun tanpa keahlian, jemputan, bayaran pending/separa, owner review, transaksi serentak, penolakan, snapshot ahli, pembundaran sen dan duplicate cycle. Paparan signed-in disemak dengan akaun Google emulator. Google login produksi memerlukan pemilik memilih akaunnya sendiri; sesi sebenar pengguna tidak diambil alih semasa ujian.

Domain Site `kongsipay-demo.umarislah86.chatgpt.site` dan `127.0.0.1` ditambah ke Firebase Authorized Domains tanpa membuang domain PayTrack lama. Tiada provider baru didaftarkan dan tiada akaun produksi dummy dicipta.

Browser WebMCP `read_payment_summary` memerlukan login dan membaca paparan subscription semasa; ia tidak mengubah data atau memindahkan wang.
