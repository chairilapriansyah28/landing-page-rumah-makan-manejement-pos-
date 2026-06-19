export interface MenuItem {
  id: string;
  nama: string;
  kategori: string; // e.g. "Makanan Utama" | "Lauk Pendamping" | "Minuman" | "Paket"
  harga: number;
  status: 'Tersedia' | 'Habis';
  image: string;
  deskripsi: string;
}

export interface Review {
  id: string;
  nama: string;
  rating: number;
  waktu: string;
  isi: string;
  status: 'Approved' | 'Pending';
}

export interface Order {
  id: string;
  namaPemesan: string;
  namaPaket: string;
  pax: number;
  hargaPerPax: number;
  totalHarga: number;
  tanggalEvent: string;
  telepon: string;
  status: 'Baru' | 'Diproses' | 'Selesai' | 'Dibatalkan';
  tanggalDibuat: string;
}

export interface Branch {
  id: string;
  nama: string;
  alamat: string;
  jamBuka: string;
  telepon: string;
  lat: number;
  lng: number;
  gmapLink: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
}
