# KongsiPay

App pengurusan subscription bersama dalam Bahasa Melayu. Design asal dikekalkan; akaun dan data menggunakan Firebase PayTrack yang sama.

## Login dan data lama

- Firebase project: `hey-9ba52`; Firestore `(default)`, Standard edition, `asia-southeast1`.
- Google Sign-In menggunakan konfigurasi web app dari `C:\Users\C5407836\paytrack\src\lib\firebase.ts`.
- Akaun baharu didaftarkan dengan Google pada login pertama. Akaun PayTrack menggunakan UID yang sama apabila memilih akaun Google yang sama.
- Profil lama, termasuk nama, QR dan nombor WhatsApp, dibaca tanpa ditimpa.
- Collection lama digunakan terus: `users`, `subscriptions`, `billingCycles`, `payments`. Tiada migrasi automatik, salinan atau perubahan kepada rekod produksi semasa pembangunan. Tindakan pengguna dalam app menggunakan collections yang sama.
- Disahkan pada 8 Oktober 2026: 7 profil, 5 subscription, 39 kitaran bil, 128 bayaran. Semua ID rekod dan kandungan cloud kekal selepas integrasi.
- Query membership hanya memuatkan subscription yang mengandungi UID pengguna, kemudian mendengar perubahan kitaran dan bayaran secara langsung. Akaun tanpa keahlian mendapat paparan kosong.
- Split, rotation/giliran dan hutang dipaparkan mengikut schema PayTrack; paid markers, partial payments dan isSedekah dikira tanpa menggandakan jumlah.

## Ciri tersedia

- Semua akaun, subscription, bil dan bayaran PayTrack sedia ada digunakan terus.
- Subscription split, giliran dan hutang; ahli awal daripada pengguna sedia ada; emoji dan nota boleh diedit.
- Jemput beberapa email sekaligus; pengguna berdaftar terus ditambah, pengguna baharu diterima selepas Google login yang disahkan; batalkan jemputan.
- Generate sehingga 120 bil dalam satu pelan dengan sela 1/2/3/6/12 bulan. Split menerima jumlah penuh atau jumlah setiap ahli. Giliran boleh disusun naik/turun sebelum jana bil.
- Hutang lump sum atau ansuran 1–120 bulan, pembahagian tepat hingga sen; halalkan penuh/sebahagian; susun semula baki kepada ansuran baharu.
- Susun semula mengekalkan bil lama sebagai superseded dan semua sejarah bayaran. Paid markers bernilai sifar menandakan bil lama dipindahkan supaya PayTrack tidak mengira baki itu dua kali.
- Rekod bayaran separa atau banyak caj sekaligus dengan kaedah dan reference; bayaran pending sehingga owner mengesahkan atau menolak. Pilihan bayaran pukal menunjukkan QR dan jumlah berasingan mengikut penerima.
- Owner boleh tanda bayaran manual atau undo seluruh caj. Undo mengekalkan audit records dengan status reversed dan mengembalikan baki; ia tidak mengembalikan wang.
- Profil: upload/tukar/buang QR PNG/JPEG/WebP maksimum 450KB, edit nombor WhatsApp, paparkan gambar Google.
- Selepas rekod bayaran, buka mesej WhatsApp siap isi mengikut penerima. App tidak menghantar mesej bagi pihak pengguna.
- Sejarah penuh: filter subscription/ahli, kumpulkan mengikut tarikh atau ahli; bil boleh dikembangkan dan ditapis mengikut tahun serta beberapa ahli.
- Padam bil bersama bayarannya atau subscription bersama rekod berkaitan melalui dialog pengesahan.
- Dashboard menunjukkan semua baki dan jumlah mengikut cutoff PayTrack: split/giliran bulan semasa masuk mulai 20 haribulan; semua ansuran hutang masuk tanpa cutoff.
- Ciri KongsiPay dikekalkan: semakan owner, method/reference, status bil provider berasingan, realtime dan export CSV.

Kitaran baharu menyimpan snapshot ahli, penerima dan pecahan integer-sen. Bayaran yang disahkan menggunakan partialPayment dan paid marker bernilai sifar supaya PayTrack masih mengenali caj sebagai settle. Request ID dan revision kitaran/subscription melindungi permintaan berulang dan operasi serentak daripada KongsiPay. PayTrack lama tidak menggunakan revision lock tersebut.

Jemputan tidak menghantar email; kongsi link secara manual. Caj yang sudah dijana tidak berubah apabila ahli baharu masuk. Operasi besar diberi had untuk kekal dalam batas transaksi Firestore; subscription dengan lebih 350 rekod perlu diurus secara berperingkat bagi operasi pelan/hutang, dan pemadaman subscription mempunyai had 450 rekod.

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

26 ujian model dan integration meliputi: pembacaan legacy, profile lama, akaun tanpa keahlian, jemputan, bayaran pending/separa, owner review, transaksi serentak, penolakan, snapshot ahli, pembundaran sen dan duplicate cycle. Paparan signed-in disemak dengan akaun Google emulator. Google login produksi memerlukan pemilik memilih akaunnya sendiri; sesi sebenar pengguna tidak diambil alih semasa ujian.

Domain Site `kongsipay-demo.umarislah86.chatgpt.site` dan `127.0.0.1` ditambah ke Firebase Authorized Domains tanpa membuang domain PayTrack lama. Tiada provider baru didaftarkan dan tiada akaun produksi dummy dicipta.

Browser WebMCP `read_payment_summary` memerlukan login dan membaca paparan subscription semasa; ia tidak mengubah data atau memindahkan wang.

## GitHub Pages

Public app: https://umarislah86-collab.github.io/kongsipay/ . Login Google masih diperlukan. Workflow pages.yml membina dengan base /kongsipay/ dan deploy setiap push main. Repo sumber public; tiada snapshot data pengguna atau credential admin disimpan dalam repo. Paparan mobile menukar jadual caj kepada kad, butang sentuhan 44px dan dialog mengikut tinggi skrin. Site lama kekal private.


## Aliran ringkas

Navigasi utama kini Subscription, Bayaran saya dan Profil. Login terus ke senarai subscription; pilih subscription untuk lihat bil terkini dan status semua ahli. Menu Bayaran saya sentiasa menapis caj, pilihan bayaran pukal, sejarah dan export kepada akaun sendiri. Pengesahan owner, jemputan, halalkan, pelan ansuran, susun semula, sejarah, pembetulan dan pemadaman kekal dalam subscription berkaitan. Butang tambahan diletakkan dalam Lagi / Sejarah & tetapan. Mobile menggunakan tiga tab di bawah.

