# KongsiPay

Prototaip interaktif Bahasa Melayu untuk tracking subscription bersama.

## Jalankan

Dalam folder project, jalankan `python -m http.server 4173 --bind 127.0.0.1 --directory dist` dan buka http://127.0.0.1:4173.

Semakan kiraan: `node --test tests/ledger.test.cjs`.

## Ciri tersedia

- Ringkasan kutipan ahli, bayaran disahkan, bayaran menunggu dan hutang overdue.
- Multiple subscription, bulanan/tahunan, pembayar berbeza dan pembahagian sama rata dalam sen.
- Tambah ahli demo, ubah nama group dan jana caj kitaran seterusnya secara manual.
- Bayaran separa, reference transaksi, pengesahan, penolakan dengan sebab dan aktiviti.
- Bil provider direkod berasingan daripada bayaran ahli.
- Penyata CSV dan data demo yang disimpan pada browser/peranti ini sahaja.

## Had prototaip

Ini belum aplikasi produksi. Semua pengguna demo dikendalikan dari satu paparan owner; tiada authentication atau authorization sebenar. Data dan harga permulaan ialah rekaan Oktober 2026. Data localStorage tidak dikongsi antara peranti atau pengguna dan boleh hilang apabila storan browser dibersihkan. Jangan masukkan maklumat bank, resit atau data peribadi sebenar.

Belum ada invite sebenar, database bersama, multiple group, upload resit, reminder automatik, recurring job, payment gateway, deposit, kredit, prorata, split custom atau multi-currency. Label prepaid / owner advance merekod pilihan kutipan, tanpa penguatkuasaan pembayaran. Tiada pemindahan wang.

WebMCP read_payment_summary tersedia jika browser menyokong document.modelContext. Pengesahan dalam runtime WebMCP sebenar belum tersedia dalam sesi pembinaan ini.

## Sambungan produksi

1. Authentication dan membership group dengan penguatkuasaan akses pada server.
2. Database bersama dengan ledger integer-sen dan transaksi atomik; idempotency key untuk caj berulang dan pengesahan bayaran.
3. Snapshot harga, penerima, ahli dan due date bagi setiap kitaran; ledger pelarasan untuk pembetulan, credit dan refund.
4. Penyimpanan resit private, had upload, semakan jenis fail dan pautan akses sementara.
5. Jemputan bertempoh, reminder opt-in dan audit log server.
6. Gateway melalui webhook bertandatangan jika auto-verification diperlukan.
