/** Semua materi & soal Petualangan O₂ (IPAS Kelas 6 SD / Fase C). */

export type Quiz = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  hint?: string;
};

export type OrganId =
  | "hidung"
  | "faring"
  | "laring"
  | "trakea"
  | "bronkus"
  | "bronkiolus"
  | "alveolus"
  | "paru"
  | "diafragma";

export type Organ = {
  id: OrganId;
  no: number;
  nama: string;
  emoji: string;
  fungsi: string;
  seru: string;
  x: number;
  y: number;
};

/** Posisi (x,y) mengikuti viewBox 0 0 400 600 pada komponen RespiratoryDiagram. */
export const ORGANS: Organ[] = [
  {
    id: "hidung",
    no: 1,
    nama: "Hidung",
    emoji: "👃",
    fungsi: "Pintu masuk udara. Rambut hidung dan lendir menyaring debu dan kuman, lalu udara dihangatkan dan dilembapkan.",
    seru: "Rambut halus di hidungmu bekerja seperti saringan mini setiap detik!",
    x: 128,
    y: 116,
  },
  {
    id: "faring",
    no: 2,
    nama: "Faring (Tekak)",
    emoji: "🔀",
    fungsi: "Persimpangan saluran udara dan saluran makanan. Udara dari hidung diteruskan menuju laring.",
    seru: "Karena jadi persimpangan, kita bisa tersedak kalau makan sambil bicara.",
    x: 205,
    y: 152,
  },
  {
    id: "laring",
    no: 3,
    nama: "Laring (Pangkal Tenggorok)",
    emoji: "🗣️",
    fungsi: "Tempat pita suara. Menghasilkan suara dan memiliki katup epiglotis yang menutup saat menelan.",
    seru: "Suara nyanyianmu lahir di sini, dari getaran pita suara!",
    x: 205,
    y: 192,
  },
  {
    id: "trakea",
    no: 4,
    nama: "Trakea (Batang Tenggorok)",
    emoji: "🚇",
    fungsi: "Pipa udara berbentuk cincin tulang rawan. Dindingnya berlendir dan bersilia untuk menyapu kotoran keluar.",
    seru: "Silia di trakea bergoyang seperti rumput laut untuk mengusir debu.",
    x: 205,
    y: 258,
  },
  {
    id: "bronkus",
    no: 5,
    nama: "Bronkus",
    emoji: "🌿",
    fungsi: "Percabangan trakea menjadi dua, masuk ke paru-paru kanan dan paru-paru kiri.",
    seru: "Bronkus kanan sedikit lebih besar dan lebih tegak daripada yang kiri.",
    x: 168,
    y: 302,
  },
  {
    id: "bronkiolus",
    no: 6,
    nama: "Bronkiolus",
    emoji: "🌱",
    fungsi: "Cabang-cabang kecil bronkus di dalam paru-paru yang mengantar udara sampai ke alveolus.",
    seru: "Cabangnya sangat banyak, mirip ranting pohon di dalam dadamu.",
    x: 146,
    y: 344,
  },
  {
    id: "alveolus",
    no: 7,
    nama: "Alveolus",
    emoji: "🫧",
    fungsi: "Gelembung udara kecil tempat terjadinya pertukaran oksigen dan karbon dioksida dengan darah.",
    seru: "Jumlah alveolus di paru-paru manusia sekitar 300 juta gelembung!",
    x: 140,
    y: 402,
  },
  {
    id: "paru",
    no: 8,
    nama: "Paru-paru",
    emoji: "🫁",
    fungsi: "Organ utama pernapasan di rongga dada. Paru-paru kanan 3 gelambir, kiri 2 gelambir.",
    seru: "Paru-paru kiri sedikit lebih kecil supaya jantung punya tempat.",
    x: 268,
    y: 352,
  },
  {
    id: "diafragma",
    no: 9,
    nama: "Diafragma",
    emoji: "⛰️",
    fungsi: "Otot berbentuk kubah di bawah paru-paru. Bergerak turun saat menarik napas dan naik saat menghembuskan napas.",
    seru: "Cegukan terjadi saat diafragma tiba-tiba kejang!",
    x: 200,
    y: 482,
  },
];

export const AIR_PATH: OrganId[] = ["hidung", "faring", "laring", "trakea", "bronkus", "bronkiolus", "alveolus"];

/* ---------------- LEVEL 1 ---------------- */
export const LEVEL1_WRONG_FEEDBACK: Record<OrganId, string> = {
  hidung: "Belum tepat. Nomor itu ada di wajah — pintu pertama masuknya udara.",
  faring: "Belum tepat. Ingat, faring adalah persimpangan saluran udara dan makanan di belakang mulut.",
  laring: "Belum tepat. Laring berada tepat di bawah faring dan menjadi rumah pita suara.",
  trakea: "Belum tepat. Trakea adalah pipa panjang bercincin di leher menuju dada.",
  bronkus: "Belum tepat. Bronkus adalah dua cabang besar setelah trakea.",
  bronkiolus: "Belum tepat. Bronkiolus adalah cabang halus di dalam paru-paru.",
  alveolus: "Belum tepat. Alveolus berbentuk gelembung kecil di ujung bronkiolus.",
  paru: "Belum tepat. Perhatikan organ besar berwarna merah muda di rongga dada.",
  diafragma: "Belum tepat. Perhatikan otot berbentuk kubah di bawah paru-paru.",
};

/* ---------------- LEVEL 3 ---------------- */
export const LEVEL3_QUIZ: Quiz[] = [
  {
    q: "Saat menarik napas (inspirasi), apa yang terjadi pada diafragma?",
    options: ["Naik", "Turun", "Tidak bergerak", "Menghilang"],
    answer: 1,
    explain: "Saat inspirasi, diafragma berkontraksi dan bergerak TURUN sehingga rongga dada membesar dan udara masuk.",
  },
  {
    q: "Ketika kita menghembuskan napas (ekspirasi), rongga dada akan…",
    options: ["Membesar", "Mengecil", "Tetap sama", "Berputar"],
    answer: 1,
    explain: "Saat ekspirasi, otot melemas, rongga dada MENGECIL, paru-paru mengempis, dan udara terdorong keluar.",
  },
  {
    q: "Udara yang kita hembuskan banyak mengandung…",
    options: ["Oksigen saja", "Karbon dioksida dan uap air", "Nitrogen cair", "Debu halus"],
    answer: 1,
    explain: "Udara ekspirasi banyak mengandung karbon dioksida dan uap air, sisa dari pernapasan sel tubuh.",
  },
  {
    q: "Pernapasan yang menggunakan gerakan diafragma disebut pernapasan…",
    options: ["Pernapasan dada", "Pernapasan perut", "Pernapasan kulit", "Pernapasan insang"],
    answer: 1,
    explain: "Pernapasan perut menggunakan otot diafragma, sedangkan pernapasan dada menggunakan otot antartulang rusuk.",
  },
];

/* ---------------- LEVEL 4 ---------------- */
export type DiafragmaChip = { id: string; text: string; group: "inspirasi" | "ekspirasi"; icon: string };
export const LEVEL4_CHIPS: DiafragmaChip[] = [
  { id: "d-turun", text: "Diafragma turun", group: "inspirasi", icon: "⬇️" },
  { id: "dada-besar", text: "Rongga dada membesar", group: "inspirasi", icon: "🔵" },
  { id: "paru-kembang", text: "Paru-paru mengembang", group: "inspirasi", icon: "🎈" },
  { id: "udara-masuk", text: "Udara masuk", group: "inspirasi", icon: "🌬️" },
  { id: "d-naik", text: "Diafragma naik", group: "ekspirasi", icon: "⬆️" },
  { id: "dada-kecil", text: "Rongga dada mengecil", group: "ekspirasi", icon: "🟠" },
  { id: "paru-kempis", text: "Paru-paru mengempis", group: "ekspirasi", icon: "🎐" },
  { id: "udara-keluar", text: "Udara keluar", group: "ekspirasi", icon: "💨" },
];

/* ---------------- LEVEL 5 ---------------- */
export const LEVEL5_QUIZ: Quiz[] = [
  {
    q: "Di manakah pertukaran oksigen dan karbon dioksida terjadi?",
    options: ["Hidung", "Trakea", "Alveolus", "Laring"],
    answer: 2,
    explain: "Pertukaran gas terjadi di ALVEOLUS, karena dindingnya sangat tipis dan diselimuti pembuluh kapiler darah.",
  },
  {
    q: "Oksigen dari alveolus akan diikat oleh… di dalam darah.",
    options: ["Keping darah", "Hemoglobin sel darah merah", "Plasma bening", "Sel darah putih"],
    answer: 1,
    explain: "Hemoglobin pada sel darah merah mengikat oksigen lalu mengedarkannya ke seluruh sel tubuh.",
  },
  {
    q: "Karbon dioksida dari darah akan…",
    options: [
      "Masuk ke alveolus lalu dihembuskan keluar",
      "Disimpan di paru-paru selamanya",
      "Diubah menjadi oksigen",
      "Dibuang lewat keringat saja",
    ],
    answer: 0,
    explain: "CO₂ berpindah dari darah ke alveolus, lalu keluar melalui bronkiolus → bronkus → trakea → hidung.",
  },
];

/* ---------------- LEVEL 6 ---------------- */
export const LEVEL6_QUIZ: Quiz[] = [
  {
    q: "Manakah kebiasaan yang membantu menjaga kesehatan sistem pernapasan?",
    options: ["Merokok", "Berolahraga secara teratur", "Menghirup asap kendaraan", "Membakar sampah sembarangan"],
    answer: 1,
    explain: "Olahraga teratur membuat paru-paru kuat dan pertukaran gas menjadi lebih efisien.",
  },
  {
    q: "Saat berada di jalan yang berdebu, sebaiknya kita…",
    options: ["Menarik napas dalam-dalam", "Memakai masker", "Melepas masker", "Berlari lebih lama di sana"],
    answer: 1,
    explain: "Masker menyaring debu dan polusi sehingga tidak masuk ke saluran pernapasan.",
  },
  {
    q: "Menanam pohon di sekitar rumah bermanfaat karena…",
    options: [
      "Menambah asap",
      "Menghasilkan oksigen dan menyerap karbon dioksida",
      "Membuat udara berdebu",
      "Menghangatkan mesin kendaraan",
    ],
    answer: 1,
    explain: "Tumbuhan menghasilkan oksigen saat fotosintesis sehingga udara di sekitar kita lebih segar.",
  },
];

/* ---------------- LEVEL 7 : KASUS DETEKTIF ---------------- */
export type Kasus = {
  judul: string;
  cerita: string;
  emoji: string;
  soal: { label: string; quiz: Quiz }[];
};

export const KASUS: Kasus[] = [
  {
    judul: "Kasus 1 — Bersin di Gudang Berdebu",
    emoji: "🤧",
    cerita: "Rafi sering bersin dan hidungnya gatal setiap kali membantu ayah membersihkan gudang yang sangat berdebu.",
    soal: [
      {
        label: "🔍 Penyebab",
        quiz: {
          q: "Apa penyebab utama Rafi bersin-bersin?",
          options: ["Terlalu banyak minum air", "Debu yang terhirup masuk hidung", "Cuaca yang cerah", "Membaca buku terlalu lama"],
          answer: 1,
          explain: "Debu adalah pemicu alergi. Hidung bersin untuk mengeluarkan benda asing dari saluran pernapasan.",
        },
      },
      {
        label: "🔍 Gejala",
        quiz: {
          q: "Gejala yang dialami Rafi adalah…",
          options: ["Bersin dan hidung gatal", "Kaki keseleo", "Sakit gigi", "Mata rabun jauh"],
          answer: 0,
          explain: "Gejala alergi debu (rinitis alergi) berupa bersin berulang, hidung gatal, dan berair.",
        },
      },
      {
        label: "🔍 Pencegahan",
        quiz: {
          q: "Cara pencegahan yang paling tepat untuk Rafi?",
          options: ["Menahan napas selama menyapu", "Memakai masker saat membersihkan gudang", "Menyapu lebih cepat", "Menyalakan kipas besar"],
          answer: 1,
          explain: "Masker menyaring debu. Membersihkan dengan lap basah juga membuat debu tidak beterbangan.",
        },
      },
    ],
  },
  {
    judul: "Kasus 2 — Batuk karena Asap Rokok",
    emoji: "🚭",
    cerita: "Seorang anak sering batuk-batuk karena ada orang yang merokok di ruang tunggu yang tertutup.",
    soal: [
      {
        label: "🔍 Penyebab",
        quiz: {
          q: "Apa penyebab anak itu batuk?",
          options: ["Menghirup asap rokok orang lain", "Terlalu banyak tertawa", "Kurang tidur siang", "Minum air putih"],
          answer: 0,
          explain: "Perokok pasif menghirup asap rokok orang lain. Asap ini merusak silia dan mengiritasi saluran napas.",
        },
      },
      {
        label: "🔍 Tindakan",
        quiz: {
          q: "Apa tindakan yang tepat?",
          options: ["Mendekati asap", "Menjauh dari asap rokok", "Menghirup lebih banyak asap", "Membakar lebih banyak sampah"],
          answer: 1,
          explain: "Menjauh dari sumber asap dan mencari udara segar adalah tindakan paling tepat dan aman.",
        },
      },
      {
        label: "🔍 Pencegahan",
        quiz: {
          q: "Agar kejadian ini tidak terulang, sebaiknya…",
          options: [
            "Membuat aturan kawasan bebas asap rokok",
            "Menutup semua jendela",
            "Menambah jumlah asbak",
            "Menyalakan lilin beraroma",
          ],
          answer: 0,
          explain: "Kawasan tanpa rokok dan ruangan berventilasi baik melindungi paru-paru semua orang.",
        },
      },
    ],
  },
  {
    judul: "Kasus 3 — Napas Berbunyi 'Ngik'",
    emoji: "😮‍💨",
    cerita: "Sinta tiba-tiba sesak napas dan napasnya berbunyi 'ngik' saat udara dingin dan setelah bermain dengan kucing berbulu tebal.",
    soal: [
      {
        label: "🔍 Gangguan",
        quiz: {
          q: "Gangguan pernapasan yang paling mungkin dialami Sinta adalah…",
          options: ["Asma", "Sakit gigi", "Panu", "Sariawan"],
          answer: 0,
          explain: "Asma membuat saluran bronkiolus menyempit sehingga napas terasa sesak dan berbunyi mengi.",
        },
      },
      {
        label: "🔍 Penyebab",
        quiz: {
          q: "Pemicu asma pada cerita di atas adalah…",
          options: ["Udara dingin dan bulu hewan", "Cahaya matahari", "Suara musik", "Air minum hangat"],
          answer: 0,
          explain: "Udara dingin, debu, asap, dan bulu hewan adalah pemicu yang sering membuat asma kambuh.",
        },
      },
      {
        label: "🔍 Tindakan",
        quiz: {
          q: "Tindakan pertama yang sebaiknya dilakukan?",
          options: [
            "Menjauhi pemicu, duduk tenang, dan minta bantuan orang dewasa",
            "Berlari sekencang-kencangnya",
            "Menahan napas lama",
            "Bermain lebih lama dengan kucing",
          ],
          answer: 0,
          explain: "Menjauhi pemicu, mengatur napas dengan tenang, dan meminta bantuan orang dewasa adalah langkah aman.",
        },
      },
    ],
  },
  {
    judul: "Kasus 4 — Batuk Lama dan Berat Badan Turun",
    emoji: "🩺",
    cerita: "Paman batuk lebih dari tiga minggu, sering berkeringat di malam hari, dan berat badannya turun.",
    soal: [
      {
        label: "🔍 Gangguan",
        quiz: {
          q: "Kemungkinan gangguan yang dialami paman adalah…",
          options: ["Tuberkulosis (TBC)", "Cegukan", "Kram kaki", "Mimisan biasa"],
          answer: 0,
          explain: "TBC disebabkan bakteri Mycobacterium tuberculosis yang menyerang paru-paru. Perlu pemeriksaan dokter.",
        },
      },
      {
        label: "🔍 Tindakan",
        quiz: {
          q: "Apa yang sebaiknya dilakukan keluarga?",
          options: ["Mengajak paman periksa ke dokter/puskesmas", "Membiarkan saja", "Memberi paman rokok", "Menyuruh paman berlari jauh"],
          answer: 0,
          explain: "Batuk lebih dari 2–3 minggu harus diperiksakan ke dokter agar mendapat pengobatan yang benar.",
        },
      },
      {
        label: "🔍 Pencegahan",
        quiz: {
          q: "Cara mencegah penularan penyakit pernapasan adalah…",
          options: [
            "Menutup mulut saat batuk dan menjaga ventilasi rumah",
            "Batuk ke arah teman",
            "Menutup semua jendela rapat-rapat",
            "Berbagi masker bekas",
          ],
          answer: 0,
          explain: "Etika batuk, memakai masker, ventilasi baik, dan sinar matahari masuk rumah mencegah penularan.",
        },
      },
    ],
  },
  {
    judul: "Kasus 5 — Kabut Asap di Kota",
    emoji: "🌫️",
    cerita: "Kota tempat tinggal Dea diselimuti kabut asap dari kebakaran lahan. Banyak siswa mengeluh sesak dan mata perih.",
    soal: [
      {
        label: "🔍 Penyebab",
        quiz: {
          q: "Apa penyebab udara kota menjadi buruk?",
          options: ["Asap dari pembakaran lahan", "Terlalu banyak pohon", "Hujan deras", "Angin sepoi-sepoi"],
          answer: 0,
          explain: "Pembakaran lahan menghasilkan partikel halus yang mengganggu saluran pernapasan.",
        },
      },
      {
        label: "🔍 Tindakan",
        quiz: {
          q: "Apa yang sebaiknya dilakukan siswa saat kabut asap tebal?",
          options: ["Memakai masker dan mengurangi aktivitas di luar", "Bermain bola di lapangan", "Membakar sampah juga", "Membuka semua jendela"],
          answer: 0,
          explain: "Kurangi aktivitas luar ruangan, pakai masker, minum air yang cukup, dan gunakan penyaring udara bila ada.",
        },
      },
      {
        label: "🔍 Pencegahan",
        quiz: {
          q: "Tindakan jangka panjang yang tepat adalah…",
          options: ["Menanam pohon dan tidak membakar sampah", "Menambah kendaraan berasap", "Membakar lahan saat malam", "Menebang semua pohon"],
          answer: 0,
          explain: "Menanam pohon, mengurangi pembakaran, dan naik transportasi ramah lingkungan menjaga udara tetap bersih.",
        },
      },
    ],
  },
];

/* ---------------- LEVEL 8 : BANK SOAL BOSS ---------------- */
export const BOSS_QUIZ: Quiz[] = [
  {
    q: "Urutan jalur masuknya udara yang benar adalah…",
    options: [
      "Hidung → Faring → Laring → Trakea → Bronkus → Bronkiolus → Alveolus",
      "Hidung → Trakea → Faring → Laring → Alveolus",
      "Mulut → Alveolus → Bronkus → Trakea",
      "Hidung → Bronkiolus → Bronkus → Trakea → Alveolus",
    ],
    answer: 0,
    explain: "Udara masuk lewat hidung, turun melalui faring, laring, trakea, bronkus, bronkiolus, hingga alveolus.",
  },
  {
    q: "Organ yang menjadi tempat pita suara adalah…",
    options: ["Trakea", "Laring", "Faring", "Bronkus"],
    answer: 1,
    explain: "Laring atau pangkal tenggorok berisi pita suara yang bergetar menghasilkan suara.",
  },
  {
    q: "Fungsi rambut dan lendir pada hidung adalah…",
    options: ["Menyaring debu dan kuman", "Membuat suara", "Memompa darah", "Mencerna makanan"],
    answer: 0,
    explain: "Rambut hidung dan lendir menyaring kotoran serta melembapkan udara sebelum masuk paru-paru.",
  },
  {
    q: "Saat inspirasi, otot diafragma…",
    options: ["Berkontraksi dan turun", "Melemas dan naik", "Diam saja", "Berputar"],
    answer: 0,
    explain: "Diafragma berkontraksi lalu turun, rongga dada membesar, tekanan mengecil, udara masuk.",
  },
  {
    q: "Pertukaran O₂ dan CO₂ terjadi di…",
    options: ["Bronkus", "Alveolus", "Faring", "Diafragma"],
    answer: 1,
    explain: "Alveolus berdinding sangat tipis dan dikelilingi kapiler darah, sempurna untuk pertukaran gas.",
  },
  {
    q: "Gas yang dibuang tubuh saat menghembuskan napas adalah…",
    options: ["Oksigen", "Karbon dioksida", "Nitrogen", "Helium"],
    answer: 1,
    explain: "Karbon dioksida adalah sisa pernapasan sel yang dibuang lewat paru-paru.",
  },
  {
    q: "Penyakit yang membuat saluran bronkiolus menyempit sehingga napas berbunyi mengi adalah…",
    options: ["Asma", "Sariawan", "Diare", "Anemia"],
    answer: 0,
    explain: "Asma menyempitkan saluran napas. Hindari pemicu seperti debu, asap, dan udara sangat dingin.",
  },
  {
    q: "Penyakit paru-paru yang disebabkan bakteri dan menular lewat percikan batuk adalah…",
    options: ["TBC", "Cacar air", "Rabun jauh", "Panu"],
    answer: 0,
    explain: "TBC disebabkan bakteri Mycobacterium tuberculosis. Etika batuk dan ventilasi baik mencegah penularan.",
  },
  {
    q: "Kebiasaan yang MERUSAK paru-paru adalah…",
    options: ["Berolahraga pagi", "Merokok", "Menanam pohon", "Memakai masker di jalan berdebu"],
    answer: 1,
    explain: "Asap rokok merusak silia dan alveolus sehingga paru-paru sulit bekerja dengan baik.",
  },
  {
    q: "Paru-paru manusia terletak di dalam…",
    options: ["Rongga dada", "Rongga perut", "Rongga kepala", "Rongga mulut"],
    answer: 0,
    explain: "Paru-paru berada di rongga dada, dilindungi tulang rusuk, dan dialasi diafragma.",
  },
  {
    q: "Cabang trakea yang menuju paru-paru kanan dan kiri disebut…",
    options: ["Bronkus", "Alveolus", "Faring", "Epiglotis"],
    answer: 0,
    explain: "Trakea bercabang dua menjadi bronkus kanan dan bronkus kiri.",
  },
  {
    q: "Saat ekspirasi, tekanan udara di dalam paru-paru menjadi…",
    options: ["Lebih besar dari udara luar", "Lebih kecil dari udara luar", "Sama dengan nol", "Tidak ada tekanan"],
    answer: 0,
    explain: "Rongga dada mengecil sehingga tekanan di paru-paru naik dan udara terdorong keluar.",
  },
  {
    q: "Alat pernapasan tambahan yang membantu menyaring udara saat di jalan raya adalah…",
    options: ["Masker", "Kacamata renang", "Topi", "Sarung tangan"],
    answer: 0,
    explain: "Masker menahan partikel debu dan asap agar tidak masuk ke saluran pernapasan.",
  },
  {
    q: "Katup yang menutup saluran napas saat kita menelan makanan disebut…",
    options: ["Epiglotis", "Diafragma", "Alveolus", "Silia"],
    answer: 0,
    explain: "Epiglotis menutup laring saat menelan supaya makanan tidak masuk ke saluran pernapasan.",
  },
  {
    q: "Agar udara di rumah tetap sehat, sebaiknya kita…",
    options: ["Membuka jendela setiap pagi", "Merokok di dalam kamar", "Menutup semua ventilasi", "Membakar sampah di teras"],
    answer: 0,
    explain: "Ventilasi dan sinar matahari membuat udara di rumah bersih dan kuman berkurang.",
  },
  {
    q: "Jumlah gelambir paru-paru kanan manusia adalah…",
    options: ["3 gelambir", "1 gelambir", "5 gelambir", "8 gelambir"],
    answer: 0,
    explain: "Paru-paru kanan punya 3 gelambir, paru-paru kiri 2 gelambir agar ada ruang untuk jantung.",
  },
];

/* ---------------- MODE BELAJAR ---------------- */
export type Materi = {
  id: string;
  judul: string;
  emoji: string;
  warna: string;
  ringkas: string;
  poin: string[];
  visual: "sistem" | "jalur" | "napas" | "diafragma" | "alveolus" | "gangguan" | "sehat" | "intro";
};

export const MATERI: Materi[] = [
  {
    id: "apa",
    judul: "Apa itu Sistem Pernapasan?",
    emoji: "🌬️",
    warna: "from-sky-400 to-cyan-500",
    ringkas: "Sistem pernapasan adalah kumpulan organ yang bekerja sama untuk mengambil oksigen dan membuang karbon dioksida.",
    poin: [
      "Bernapas = memasukkan oksigen (O₂) dan mengeluarkan karbon dioksida (CO₂).",
      "Oksigen dipakai sel tubuh untuk menghasilkan energi.",
      "Manusia bernapas sekitar 12–20 kali setiap menit saat santai.",
      "Tanpa oksigen, sel tubuh tidak dapat bekerja.",
    ],
    visual: "intro",
  },
  {
    id: "organ",
    judul: "Organ Pernapasan",
    emoji: "🫁",
    warna: "from-rose-400 to-pink-500",
    ringkas: "Ada 9 bagian penting: hidung, faring, laring, trakea, bronkus, bronkiolus, alveolus, paru-paru, dan diafragma.",
    poin: ORGANS.map((o) => `${o.emoji} ${o.nama}: ${o.fungsi}`),
    visual: "sistem",
  },
  {
    id: "jalur",
    judul: "Jalur Udara",
    emoji: "🛤️",
    warna: "from-emerald-400 to-teal-500",
    ringkas: "Hidung → Faring → Laring → Trakea → Bronkus → Bronkiolus → Alveolus.",
    poin: [
      "Udara masuk dari hidung, disaring rambut hidung dan lendir.",
      "Melewati faring (persimpangan) lalu laring (pita suara).",
      "Turun melalui trakea yang bercincin tulang rawan.",
      "Bercabang ke bronkus kanan dan kiri, lalu bronkiolus.",
      "Berakhir di alveolus tempat oksigen masuk ke darah.",
    ],
    visual: "jalur",
  },
  {
    id: "inspirasi",
    judul: "Inspirasi & Ekspirasi",
    emoji: "💨",
    warna: "from-indigo-400 to-violet-500",
    ringkas: "Inspirasi = menarik napas. Ekspirasi = menghembuskan napas.",
    poin: [
      "Inspirasi: diafragma turun, rongga dada membesar, udara masuk.",
      "Ekspirasi: diafragma naik, rongga dada mengecil, udara keluar.",
      "Pernapasan dada memakai otot antartulang rusuk.",
      "Pernapasan perut memakai otot diafragma.",
    ],
    visual: "napas",
  },
  {
    id: "diafragma",
    judul: "Peran Diafragma",
    emoji: "⛰️",
    warna: "from-amber-400 to-orange-500",
    ringkas: "Diafragma adalah otot berbentuk kubah yang memisahkan rongga dada dan rongga perut.",
    poin: [
      "Diafragma berkontraksi → turun → paru-paru mengembang.",
      "Diafragma melemas → naik → paru-paru mengempis.",
      "Diafragma membantu kita bernapas dalam-dalam saat berolahraga.",
      "Cegukan terjadi karena diafragma kejang mendadak.",
    ],
    visual: "diafragma",
  },
  {
    id: "pertukaran",
    judul: "Pertukaran Gas di Alveolus",
    emoji: "🫧",
    warna: "from-cyan-400 to-blue-500",
    ringkas: "Di alveolus, O₂ masuk ke darah dan CO₂ keluar dari darah.",
    poin: [
      "Dinding alveolus sangat tipis dan diselimuti pembuluh kapiler.",
      "O₂ berpindah dari alveolus ke darah, diikat hemoglobin.",
      "CO₂ berpindah dari darah ke alveolus untuk dihembuskan.",
      "Darah kaya oksigen diedarkan jantung ke seluruh sel tubuh.",
    ],
    visual: "alveolus",
  },
  {
    id: "gangguan",
    judul: "Gangguan Pernapasan",
    emoji: "🤒",
    warna: "from-red-400 to-rose-500",
    ringkas: "Beberapa gangguan yang sering terjadi pada sistem pernapasan.",
    poin: [
      "Asma: saluran napas menyempit, napas berbunyi mengi.",
      "Influenza: infeksi virus, hidung tersumbat dan bersin.",
      "Bronkitis: peradangan bronkus, batuk berdahak lama.",
      "Pneumonia: peradangan alveolus, alveolus terisi cairan.",
      "TBC: infeksi bakteri pada paru-paru, batuk lebih dari 3 minggu.",
      "Emfisema: alveolus rusak, sering karena asap rokok.",
    ],
    visual: "gangguan",
  },
  {
    id: "sehat",
    judul: "Menjaga Kesehatan Pernapasan",
    emoji: "💚",
    warna: "from-lime-400 to-green-500",
    ringkas: "Paru-paru sehat membuat tubuh kuat dan pikiran segar.",
    poin: [
      "Hindari asap rokok, jangan menjadi perokok aktif maupun pasif.",
      "Pakai masker saat di tempat berdebu atau berpolusi.",
      "Berolahraga teratur agar paru-paru kuat.",
      "Makan makanan bergizi dan cukup minum air putih.",
      "Menanam pohon dan menjaga kebersihan lingkungan.",
      "Buka jendela agar rumah punya ventilasi dan sinar matahari.",
    ],
    visual: "sehat",
  },
];

/* ---------------- BADGE ---------------- */
export type BadgeDef = { id: string; nama: string; emoji: string; syarat: string; level: number; warna: string };
export const BADGES: BadgeDef[] = [
  { id: "paru", nama: "Penjelajah Paru-paru", emoji: "🫁", syarat: "Selesaikan Level 1", level: 1, warna: "from-sky-400 to-blue-600" },
  { id: "jalur", nama: "Master Jalur Udara", emoji: "🌬️", syarat: "Selesaikan Level 2", level: 2, warna: "from-emerald-400 to-teal-600" },
  { id: "napas", nama: "Ahli Pernapasan", emoji: "💨", syarat: "Selesaikan Level 4", level: 4, warna: "from-amber-400 to-orange-600" },
  { id: "alveolus", nama: "Ilmuwan Alveolus", emoji: "🔬", syarat: "Selesaikan Level 5", level: 5, warna: "from-cyan-400 to-indigo-600" },
  { id: "pelindung", nama: "Pelindung Paru-paru", emoji: "🛡️", syarat: "Selesaikan Level 6", level: 6, warna: "from-violet-400 to-purple-600" },
  { id: "detektif", nama: "Detektif Pernapasan", emoji: "🔍", syarat: "Selesaikan Level 7", level: 7, warna: "from-yellow-400 to-amber-600" },
  { id: "pahlawan", nama: "Pahlawan O₂", emoji: "🏆", syarat: "Selesaikan semua level", level: 8, warna: "from-fuchsia-400 to-rose-600" },
];

/* ---------------- LEVEL META ---------------- */
export type LevelMeta = {
  id: number;
  nama: string;
  sub: string;
  emoji: string;
  warna: string;
  ring: string;
  deskripsi: string;
  tips: string;
};

export const LEVELS: LevelMeta[] = [
  {
    id: 1,
    nama: "Kota Organ Pernapasan",
    sub: "Kenali Para Penjaga Pernapasan!",
    emoji: "🫁",
    warna: "from-sky-400 to-blue-600",
    ring: "#38bdf8",
    deskripsi: "Tunjuk organ pernapasan yang benar pada peta tubuh manusia.",
    tips: "Perhatikan bentuk dan letak organ pada gambar.",
  },
  {
    id: 2,
    nama: "Jalur Udara",
    sub: "Bantu OXI menemukan jalan!",
    emoji: "🛤️",
    warna: "from-emerald-400 to-teal-600",
    ring: "#34d399",
    deskripsi: "Susun kartu organ sesuai urutan masuknya udara.",
    tips: "Mulai dari pintu masuk udara, akhiri di gelembung alveolus.",
  },
  {
    id: 3,
    nama: "Misteri Tarik Napas",
    sub: "Simulator inspirasi & ekspirasi",
    emoji: "🌬️",
    warna: "from-yellow-400 to-amber-600",
    ring: "#fbbf24",
    deskripsi: "Coba simulator pernapasan lalu jawab pertanyaannya.",
    tips: "Perhatikan gerakan diafragma dan rongga dada.",
  },
  {
    id: 4,
    nama: "Rahasia Diafragma",
    sub: "Puzzle inspirasi vs ekspirasi",
    emoji: "⛰️",
    warna: "from-orange-400 to-red-500",
    ring: "#fb923c",
    deskripsi: "Seret setiap kartu ke kelompok yang tepat.",
    tips: "Saat menarik napas semuanya membesar, saat menghembuskan semuanya mengecil.",
  },
  {
    id: 5,
    nama: "Lab Alveolus",
    sub: "Pertukaran O₂ dan CO₂",
    emoji: "🔬",
    warna: "from-rose-400 to-pink-600",
    ring: "#fb7185",
    deskripsi: "Antar O₂ ke darah dan bawa CO₂ keluar.",
    tips: "O₂ menuju darah, CO₂ menuju alveolus.",
  },
  {
    id: 6,
    nama: "Serangan Polusi",
    sub: "Arcade lindungi paru-paru",
    emoji: "🛡️",
    warna: "from-violet-400 to-purple-600",
    ring: "#a78bfa",
    deskripsi: "Tangkap udara bersih, hindari asap dan debu!",
    tips: "Gunakan panah kiri/kanan, geser jari, atau gerakkan mouse.",
  },
  {
    id: 7,
    nama: "Detektif Pernapasan",
    sub: "Pecahkan 5 kasus",
    emoji: "🔍",
    warna: "from-amber-500 to-yellow-700",
    ring: "#f59e0b",
    deskripsi: "Cari penyebab, gejala, dan cara pencegahan.",
    tips: "Baca cerita kasus dengan teliti sebelum menjawab.",
  },
  {
    id: 8,
    nama: "Boss Battle O₂",
    sub: "Kalahkan Monster Polusi!",
    emoji: "👾",
    warna: "from-fuchsia-500 to-rose-600",
    ring: "#e879f9",
    deskripsi: "Jawab benar untuk menyerang monster (-20 HP).",
    tips: "Jawaban benar melukai monster, jawaban salah mengurangi nyawamu.",
  },
];

export const OXI_LINES = [
  "Hai! Aku OXI, molekul oksigen!",
  "Ayo cari jalan menuju alveolus!",
  "Hebat! Kamu menemukan jalurnya!",
  "Wah, hampir benar. Coba lagi!",
  "Pertukaran gas terjadi di alveolus!",
  "Tarik napas… hembuskan… santai saja!",
  "Kamu penjelajah yang keren!",
];

export function scoreCategory(score: number) {
  if (score >= 90) return { label: "Sangat Baik", emoji: "🌟", color: "text-emerald-600", desc: "Luar biasa! Pemahamanmu sangat kuat." };
  if (score >= 80) return { label: "Baik", emoji: "👍", color: "text-sky-600", desc: "Bagus sekali! Terus pertahankan ya." };
  if (score >= 70) return { label: "Cukup", emoji: "🙂", color: "text-amber-600", desc: "Sudah cukup baik. Sedikit lagi jadi hebat!" };
  return { label: "Perlu Berlatih", emoji: "💪", color: "text-rose-600", desc: "Tidak apa-apa! Ulangi materinya, kamu pasti bisa." };
}
