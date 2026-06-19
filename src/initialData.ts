import { MenuItem, Review, Order, Branch } from './types';

export const INITIAL_MENUS: MenuItem[] = [
  {
    id: 'm1',
    nama: 'Ayam Goreng Kremes',
    kategori: 'Makanan Utama',
    harga: 18000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
    deskripsi: 'Ayam kampung goreng gurih dengan bumbu rempah melimpah, disajikan dengan kremesan super renyah khas Alun-alun Mangkubumi.'
  },
  {
    id: 'm2',
    nama: 'Rendang Daging Sapi',
    kategori: 'Makanan Utama',
    harga: 25000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    deskripsi: 'Daging sapi pilihan yang dimasak perlahan dengan santan pelengkap dan perpaduan bumbu rempah nusantara autentik hingga empuk.'
  },
  {
    id: 'm3',
    nama: 'Ikan Bakar Bumbu Rujak',
    kategori: 'Makanan Utama',
    harga: 22000,
    status: 'Habis',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&q=80',
    deskripsi: 'Ikan segar yang dibakar di atas bara arang kelapa, dibaluri bumbu rujak pedas manis asam segar gurih.'
  },
  {
    id: 'm4',
    nama: 'Sayur Lodeh',
    kategori: 'Lauk Pendamping',
    harga: 8000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    deskripsi: 'Sayur lodeh tradisional berkuah santan gurih melimpah, berisikan nangka muda, labu siam, kacang panjang, dan cabai hijau.'
  },
  {
    id: 'm5',
    nama: 'Sambal Dadak',
    kategori: 'Lauk Pendamping',
    harga: 5000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    deskripsi: 'Sambal cabai rawit segar yang diulek langsung (dadakan), memberikan sensasi rasa pedas membara yang segar dan harum.'
  },
  {
    id: 'm6',
    nama: 'Nasi Putih',
    kategori: 'Lauk Pendamping',
    harga: 6000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=600&q=80',
    deskripsi: 'Nasi hangat dari beras pandan wangi aromatik yang pulen dan bersih higienis.'
  },
  {
    id: 'm7',
    nama: 'Es Teh Manis',
    kategori: 'Minuman',
    harga: 4000,
    status: 'Tersedia',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
    deskripsi: 'Minuman es teh manis segar dengan aroma melati yang khas, disajikan dingin berembun.'
  },
  {
    id: 'm8',
    nama: 'Es Jeruk Peras',
    kategori: 'Minuman',
    status: 'Tersedia',
    harga: 6000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80',
    deskripsi: 'Perasan jeruk nipis/orange lokal asli yang segar alami tanpa pemanis buatan, disajikan dingin dengan es batu.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    nama: 'Yuli Astuti',
    rating: 5,
    waktu: '2 hari yang lalu',
    isi: 'Ayam goreng kremesnya juara banget! Bumbunya meresap sampai ke tulang, dan kremesannya gurih nggak pelit. Pelayanan juga sangat ramah dan tempatnya bersih. Cocok untuk makan siang bareng keluarga.',
    status: 'Approved'
  },
  {
    id: 'r2',
    nama: 'Hendra Wijaya',
    rating: 5,
    waktu: '1 minggu yang lalu',
    isi: 'Pesan paket prasmanan untuk acara syukuran kantor di Mangkubumi, semuanya puas. Rendang sapinya empuk banget dan sayur lodehnya autentik. Harganya sangat bersaing untuk kualitas rasa yang premium. Sukses terus Mangkubumi!',
    status: 'Approved'
  },
  {
    id: 'r3',
    nama: 'Andi Wijaya',
    rating: 5,
    waktu: '2 jam yang lalu',
    isi: '"Pelayanan cepat dan rasa rendangnya sangat otentik. Tempatnya nyaman untuk makan bersama keluarga."',
    status: 'Approved'
  },
  {
    id: 'r4',
    nama: 'Rina Herawati',
    rating: 4,
    waktu: '3 hari yang lalu',
    isi: 'Lengkap sekali hidangannya. Es Jeruk Perasnya menyegarkan dan tidak terlalu manis. Recommended untuk acara arisan.',
    status: 'Pending'
  },
  {
    id: 'r5',
    nama: 'Budi Santoso',
    rating: 5,
    waktu: '4 hari yang lalu',
    isi: 'Sambal dadaknya luar biasa pedas nampol! Sangat pas dipadukan dengan ayam kremes hangat.',
    status: 'Pending'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord1',
    namaPemesan: 'Hendra Wijaya',
    namaPaket: 'Paket Regular',
    pax: 150,
    hargaPerPax: 40000,
    totalHarga: 6000000,
    tanggalEvent: '2026-06-25',
    telepon: '081234567891',
    status: 'Selesai',
    tanggalDibuat: '2026-06-11'
  },
  {
    id: 'ord2',
    namaPemesan: 'Yuli Astuti',
    namaPaket: 'Paket Premium',
    pax: 80,
    hargaPerPax: 65000,
    totalHarga: 5200000,
    tanggalEvent: '2026-06-30',
    telepon: '081298765432',
    status: 'Diproses',
    tanggalDibuat: '2026-06-16'
  },
  {
    id: 'ord3',
    namaPemesan: 'Siti Rahma',
    namaPaket: 'Paket Ekonomi',
    pax: 75,
    hargaPerPax: 25000,
    totalHarga: 1875000,
    tanggalEvent: '2026-07-05',
    telepon: '087712345678',
    status: 'Baru',
    tanggalDibuat: '2026-06-18'
  }
];

export const BRANCHES: Branch[] = [
  {
    id: 'b1',
    nama: 'Alun-alun Tasikmalaya (Cabang Pertama)',
    alamat: 'Jl. KHZ. Mustofa, Alun-alun, Tasikmalaya, Jawa Barat',
    jamBuka: '08.00 - 21.00 WIB',
    telepon: '+62 812-3456-7890',
    lat: -7.3274,
    lng: 108.2201,
    gmapLink: 'https://maps.google.com'
  },
  {
    id: 'b2',
    nama: 'Mangkubumi Tasikmalaya (Cabang Kedua)',
    alamat: 'Jl. Mangkubumi No. 120, Mangkubumi, Tasikmalaya, Jawa Barat',
    jamBuka: '08.00 - 21.00 WIB',
    telepon: '+62 812-3456-7891',
    lat: -7.3521,
    lng: 108.1965,
    gmapLink: 'https://maps.google.com'
  }
];
