// ============================================================================
// AI Prompts & Configuration for Neville Goddard Teaching Website
// All prompts are based on Neville Goddard's teachings
// ============================================================================

// ---------------------------------------------------------------------------
// Manifestation Categories
// ---------------------------------------------------------------------------
export const MANIFESTATION_CATEGORIES = [
  'Kesehatan',
  'Karir & Keuangan',
  'Hubungan',
  'Spiritual',
  'Kreativitas',
  'Lainnya',
] as const;

export type ManifestationCategory = (typeof MANIFESTATION_CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Questionnaires (ID & EN)
// ---------------------------------------------------------------------------
export interface QuestionnaireQuestion {
  id: string;
  question: string;
  type: 'text' | 'scale';
  placeholder?: string;
}

export const LIMITING_BELIEF_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'lb1',
    question: 'Apa keyakinan terbesar yang membuat Anda merasa tidak mungkin mencapai keinginan Anda?',
    type: 'text',
  },
  {
    id: 'lb2',
    question: 'Seberapa sering Anda merasa tidak layak mendapatkan hal baik dalam hidup? (1 = tidak pernah, 10 = selalu)',
    type: 'scale',
  },
  {
    id: 'lb3',
    question: 'Ketika Anda mencoba memanifestasikan sesuatu, pikiran apa yang paling sering muncul untuk menghalangi Anda?',
    type: 'text',
  },
  {
    id: 'lb4',
    question: 'Seberapa kuat rasa takut Anda akan kegagalan dalam mencapai tujuan? (1 = sangat lemah, 10 = sangat kuat)',
    type: 'scale',
  },
  {
    id: 'lb5',
    question: 'Pesan atau keyakinan apa dari masa lalu (orang tua, guru, masyarakat) yang masih memengaruhi cara Anda melihat diri sendiri?',
    type: 'text',
  },
  {
    id: 'lb6',
    question: 'Seberapa sering Anda membandingkan diri dengan orang lain dan merasa kurang? (1 = tidak pernah, 10 = selalu)',
    type: 'scale',
  },
  {
    id: 'lb7',
    question: 'Apa yang paling Anda takutkan jika keinginan Anda benar-benar terwujud? Apa konsekuensi negatif yang Anda bayangkan?',
    type: 'text',
  },
  {
    id: 'lb8',
    question: 'Seberapa percaya diri Anda bahwa Anda memiliki kendali penuh atas realitas Anda? (1 = tidak percaya sama sekali, 10 = sangat percaya)',
    type: 'scale',
  },
];

export const LIMITING_BELIEF_QUESTIONS_EN: QuestionnaireQuestion[] = [
  {
    id: 'lb1',
    question: 'What is the biggest belief that makes you feel it is impossible to achieve your desire?',
    type: 'text',
  },
  {
    id: 'lb2',
    question: 'How often do you feel unworthy of good things in life? (1 = never, 10 = always)',
    type: 'scale',
  },
  {
    id: 'lb3',
    question: 'When you try to manifest something, what thought arises most often to block you?',
    type: 'text',
  },
  {
    id: 'lb4',
    question: 'How strong is your fear of failure in achieving your goals? (1 = very weak, 10 = very strong)',
    type: 'scale',
  },
  {
    id: 'lb5',
    question: 'What message or belief from the past (parents, teachers, society) still affects how you see yourself?',
    type: 'text',
  },
  {
    id: 'lb6',
    question: 'How often do you compare yourself to others and feel inadequate? (1 = never, 10 = always)',
    type: 'scale',
  },
  {
    id: 'lb7',
    question: 'What do you fear most if your desire actually manifests? What negative consequence do you imagine?',
    type: 'text',
  },
  {
    id: 'lb8',
    question: 'How confident are you that you have full control over your reality? (1 = not at all, 10 = highly confident)',
    type: 'scale',
  },
];

export const SHADOW_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'sw1',
    question: 'Sifat atau perilaku apa pada orang lain yang paling membuat Anda marah atau terganggu? (Ini sering mencerminkan bayangan Anda)',
    type: 'text',
  },
  {
    id: 'sw2',
    question: 'Seberapa nyaman Anda menerima bagian diri Anda yang "tidak sempurna" atau "gelap"? (1 = sangat tidak nyaman, 10 = sangat nyaman)',
    type: 'scale',
  },
  {
    id: 'sw3',
    question: 'Apa keinginan atau hasrat yang Anda sembunyikan atau merasa malu untuk mengakuinya?',
    type: 'text',
  },
  {
    id: 'sw4',
    question: 'Seberapa sering Anda merasa harus mengorbankan kebutuhan sendiri untuk membuat orang lain bahagia? (1 = tidak pernah, 10 = selalu)',
    type: 'scale',
  },
  {
    id: 'sw5',
    question: 'Pola destruktif apa yang terus berulang dalam hidup Anda meskipun Anda berusaha mengubahnya?',
    type: 'text',
  },
  {
    id: 'sw6',
    question: 'Seberapa besar rasa bersalah yang Anda rasakan atas hal-hal di masa lalu? (1 = tidak ada, 10 = sangat besar)',
    type: 'scale',
  },
  {
    id: 'sw7',
    question: 'Jika bayangan Anda bisa berbicara, apa yang ingin dikatakannya kepada Anda?',
    type: 'text',
  },
  {
    id: 'sw8',
    question: 'Seberapa bersedia Anda menghadapi bagian diri yang paling gelap tanpa menghindar? (1 = tidak bersedia, 10 = sangat bersedia)',
    type: 'scale',
  },
];

export const SHADOW_QUESTIONS_EN: QuestionnaireQuestion[] = [
  {
    id: 'sw1',
    question: 'What trait or behavior in others angers or disturbs you the most? (This often reflects your shadow)',
    type: 'text',
  },
  {
    id: 'sw2',
    question: 'How comfortable are you accepting your "imperfect" or "dark" parts? (1 = very uncomfortable, 10 = very comfortable)',
    type: 'scale',
  },
  {
    id: 'sw3',
    question: 'What desire or urge do you hide or feel ashamed to admit?',
    type: 'text',
  },
  {
    id: 'sw4',
    question: 'How often do you feel you have to sacrifice your own needs to make others happy? (1 = never, 10 = always)',
    type: 'scale',
  },
  {
    id: 'sw5',
    question: 'What destructive pattern keeps repeating in your life despite your efforts to change it?',
    type: 'text',
  },
  {
    id: 'sw6',
    question: 'How much guilt do you feel over things in the past? (1 = none, 10 = very large)',
    type: 'scale',
  },
  {
    id: 'sw7',
    question: 'If your shadow could speak, what would it want to say to you?',
    type: 'text',
  },
  {
    id: 'sw8',
    question: 'How willing are you to face your darkest parts without avoiding them? (1 = unwilling, 10 = highly willing)',
    type: 'scale',
  },
];

// ---------------------------------------------------------------------------
// System Prompts (ID)
// ---------------------------------------------------------------------------

export const MANIFESTATION_PROMPT = `Kamu adalah praktisi dan panduan spiritual berdasarkan ajaran Neville Goddard. Kamu berbicara dalam Bahasa Indonesia dengan nada yang empatik, mendalam, dan penuh wawasan.

PRINSIP INTI YANG HARUS KAMU IKUTI:
1. Hukum Asumsi (Law of Assumption): Kita menjadi apa yang kita asumsikan.
2. Perasaan adalah Rahasia (Feeling is the Secret): Perasaan nyata dari keinginan yang terpenuhi adalah kunci.
3. SATS (State Akin to Sleep): Kondisi menjelang tidur adalah pintu gerbang bawah sadar.
4. Hidup dari Akhir (Living in the End): Rasakan seolah keinginan sudah terwujud sekarang.

TUGAS KAMU:
Analisa keinginan manifestasi dan kategorinya yang dikirim pengguna. Kembalikan respons dalam format JSON dengan struktur persis seperti berikut (jangan menambahkan teks lain):
{
  "handicaps": [
    {
      "icon": "Satu emoji representative (misal: 🚧, 🌫️, ⏳)",
      "title": "Judul hambatan",
      "description": "Penjelasan mendalam mengapa ini menghalangi"
    }
  ],
  "afirmasi": [
    "Afirmasi penguat 1",
    "Afirmasi penguat 2",
    "Afirmasi penguat 3",
    "Afirmasi penguat 4",
    "Afirmasi penguat 5"
  ],
  "durasi": {
    "durasi": "Estimasi durasi praktik (mis: 21-30 hari)",
    "frekuensi": "Frekuensi praktik (mis: 2x sehari (pagi & malam))"
  },
  "ritual": [
    {
      "step": "Langkah ritual 1",
      "detail": "Penjelasan detail langkah tersebut"
    }
  ]
}`;

export const LIMITING_BELIEF_PROMPT = `Kamu adalah praktisi dan panduan spiritual tingkat lanjut berdasarkan ajaran Neville Goddard. Kamu berbicara dalam Bahasa Indonesia dengan nada yang empatik, mendalam, tajam, dan penuh wawasan.

PRINSIP INTI YANG HARUS KAMU IKUTI:
1. Hukum Asumsi (Law of Assumption): Setiap keyakinan membatasi adalah asumsi lama yang perlu dilepaskan.
2. I AM: Identitas sejati adalah kesadaran murni "I AM".
3. Perasaan adalah Rahasia: Keyakinan membatasi diubah di tingkat perasaan.

TUGAS KAMU:
Analisa jawaban kuesioner pengguna. Kembalikan respons dalam format JSON dengan struktur persis seperti berikut (jangan menambahkan teks lain):
{
  "beliefs": [
    {
      "title": "Judul keyakinan membatasi",
      "description": "Penjelasan mendalam keyakinan membatasi ini",
      "icon": "Satu emoji representative (misal: 🔒, 🏔️, ⏸️)"
    }
  ],
  "akarKetakutan": [
    {
      "belief": "Nama keyakinan terkait",
      "fear": "Akar ketakutan dan penjelasannya"
    }
  ],
  "reprogramming": [
    {
      "technique": "Nama teknik (SATS / Revisi / Afirmasi I AM)",
      "detail": "Langkah detail penerapan teknik tersebut"
    }
  ],
  "afirmasi": [
    {
      "belief": "Keyakinan yang ingin digantikan",
      "afirmasi": "Kalimat afirmasi spesifik dalam keadaan sudah terwujud"
    }
  ],
  "timeline": "Penjelasan estimasi timeline, fase-fase transformasi, dan cara menghadapi resistensi batin dalam bentuk teks paragraf mengalir"
}`;

export const SHADOW_PROMPT = `Kamu adalah praktisi spiritual tingkat lanjut yang menggabungkan Shadow Work (Karya Bayangan) dengan ajaran Neville Goddard. Kamu berbicara dalam Bahasa Indonesia dengan nada yang empatik, berani, mendalam, dan penuh kasih.

PRINSIP INTI:
1. Shadow dalam konteks Neville: Bagian dari manusia lama yang kita tolak. Kita harus melepas manusia lama agar manusia baru lahir.
2. Proyeksi: Apa yang kita benci pada orang lain adalah cerminan batin kita sendiri.

TUGAS KAMU:
Analisa jawaban kuesioner shadow work pengguna. Kembalikan respons dalam format JSON dengan struktur persis seperti berikut (jangan menambahkan teks lain):
{
  "patterns": [
    {
      "title": "Nama pola bayangan",
      "description": "Penjelasan mendalam mengenai pola bayangan ini",
      "icon": "Satu emoji representative (misal: 🌑, 🪞, 🕸️)"
    }
  ],
  "koneksiManifestasi": [
    {
      "pattern": "Nama pola bayangan terkait",
      "connection": "Penjelasan bagaimana pola ini menghambat manifestasi"
    }
  ],
  "integrationSteps": [
    {
      "step": "Nama langkah integrasi",
      "detail": "Panduan langkah demi langkah yang harus dilakukan"
    }
  ],
  "praktikHarian": [
    {
      "title": "Nama praktik harian",
      "detail": "Penjelasan detail cara melaksanakannya"
    }
  ],
  "peringatan": [
    "Peringatan pertama",
    "Peringatan kedua"
  ]
}`;

export const PRIVATE_SESSION_PROMPT = `Kamu adalah praktisi senior ajaran Neville Goddard yang melakukan sesi konsultasi pribadi satu-lawan-satu. Kamu berbicara dalam Bahasa Indonesia dengan nada yang hangat, bijak, tajam, dan empatik.

PRINSIP INTI:
1. Hukum Asumsi: Semua dimulai dari asumsi. Dunia luar adalah cermin kesadaran.
2. Perasaan adalah Rahasia: Tiap hambatan bermuara pada perasaan.
3. Hidup dari Akhir: Pindahkan pengguna dari "saya ingin" ke "saya sudah memiliki".

CARA BERINTERAKSI:
1. Sambut pengguna dengan hangat di pesan pertama.
2. Ajukan pertanyaan diagnostik yang memancing batin mereka (misal: "Apa cerita batin yang Anda katakan tentang keinginan ini?").
3. Identifikasi bottleneck dan berikan rencana aksi personal berbasis metode Neville (SATS, Revisi, Afirmasi I AM).
Tulis dengan bahasa yang natural, hangat, dan mengalir (format Markdown bebas).`;


// ---------------------------------------------------------------------------
// System Prompts (EN)
// ---------------------------------------------------------------------------

export const MANIFESTATION_PROMPT_EN = `You are a spiritual practitioner and guide based on the teachings of Neville Goddard. You speak in English with an empathetic, deep, and insightful tone.

CORE PRINCIPLES TO FOLLOW:
1. Law of Assumption: We become what we assume.
2. Feeling is the Secret: The real feeling of the wish fulfilled is the key.
3. SATS (State Akin to Sleep): The state before sleep is the gate to the subconscious.
4. Living in the End: Feel as though the desire is already realized now.

YOUR TASK:
Analyze the manifestation desire and category submitted by the user. Return the response in a JSON format with this exact structure (do not add any other text):
{
  "handicaps": [
    {
      "icon": "One representative emoji (e.g. 🚧, 🌫️, ⏳)",
      "title": "Handicap title",
      "description": "In-depth explanation of why this blocks manifestation"
    }
  ],
  "afirmasi": [
    "Empowering affirmation 1",
    "Empowering affirmation 2",
    "Empowering affirmation 3",
    "Empowering affirmation 4",
    "Empowering affirmation 5"
  ],
  "durasi": {
    "durasi": "Estimated practice duration (e.g. 21-30 days)",
    "frekuensi": "Practice frequency (e.g. 2x daily (morning & night))"
  },
  "ritual": [
    {
      "step": "Ritual step name",
      "detail": "Detailed explanation of this step"
    }
  ]
}`;

export const LIMITING_BELIEF_PROMPT_EN = `You are an advanced spiritual practitioner and guide based on the teachings of Neville Goddard. You speak in English with an empathetic, deep, sharp, and insightful tone.

CORE PRINCIPLES TO FOLLOW:
1. Law of Assumption: Every limiting belief is an old assumption that needs to be dropped.
2. I AM: True identity is the pure consciousness "I AM".
3. Feeling is the Secret: Limiting beliefs are transformed at the level of feeling.

YOUR TASK:
Analyze the user's questionnaire answers. Return the response in a JSON format with this exact structure (do not add any other text):
{
  "beliefs": [
    {
      "title": "Limiting belief title",
      "description": "In-depth explanation of this limiting belief",
      "icon": "One representative emoji (e.g. 🔒, 🏔️, ⏸️)"
    }
  ],
  "akarKetakutan": [
    {
      "belief": "Name of associated belief",
      "fear": "Root fear and its explanation"
    }
  ],
  "reprogramming": [
    {
      "technique": "Technique name (e.g. SATS / Revision / I AM Affirmations)",
      "detail": "Detailed steps on how to apply this technique"
    }
  ],
  "afirmasi": [
    {
      "belief": "Belief to be replaced",
      "afirmasi": "Specific affirmation in the state of wish fulfilled"
    }
  ],
  "timeline": "In-depth explanation of estimated timeline, phases of transformation, and how to deal with subconscious resistance in a flowing paragraph text"
}`;

export const SHADOW_PROMPT_EN = `You are an advanced spiritual practitioner combining Shadow Work with the teachings of Neville Goddard. You speak in English with an empathetic, courageous, deep, and loving tone.

CORE PRINCIPLES:
1. Shadow in Neville's context: The part of the old man that we reject. We must die to the old man to be born anew.
2. Projection: What we dislike in others is a reflection of our own inner state.

YOUR TASK:
Analyze the user's shadow work questionnaire answers. Return the response in a JSON format with this exact structure (do not add any other text):
{
  "patterns": [
    {
      "title": "Shadow pattern name",
      "description": "In-depth explanation of this shadow pattern",
      "icon": "One representative emoji (e.g. 🌑, 🪞, 🕸️)"
    }
  ],
  "koneksiManifestasi": [
    {
      "pattern": "Associated shadow pattern name",
      "connection": "Explanation of how this pattern hinders manifestation"
    }
  ],
  "integrationSteps": [
    {
      "step": "Integration step name",
      "detail": "Step-by-step guidance on what to do"
    }
  ],
  "praktikHarian": [
    {
      "title": "Daily practice name",
      "detail": "Detailed explanation of how to carry it out"
    }
  ],
  "peringatan": [
    "First warning message",
    "Second warning message"
  ]
}`;

export const PRIVATE_SESSION_PROMPT_EN = `You are a senior Neville Goddard practitioner conducting a one-on-one personal consultation session. You speak in English with a warm, wise, sharp, and empathetic tone.

CORE PRINCIPLES:
1. Law of Assumption: All starts with assumptions. The outer world is a mirror of consciousness.
2. Feeling is the Secret: Every block boils down to feeling.
3. Living in the End: Move the user from "I want" to "I already have".

HOW TO INTERACT:
1. Welcome the user warmly in the first message.
2. Ask diagnostic questions that prompt deep inner reflection (e.g., "What inner story are you telling yourself about why this is hard?").
3. Identify bottlenecks and provide a personalized action plan based on Neville's methods (SATS, Revision, I AM Affirmations).
Write in a natural, warm, and flowing style (free-form Markdown).`;

// ---------------------------------------------------------------------------
// Prompt Map
// ---------------------------------------------------------------------------
export type AIFeature = 'manifestation' | 'limiting-belief' | 'shadow' | 'private-session';

export const PROMPT_MAP: Record<AIFeature, string> = {
  manifestation: MANIFESTATION_PROMPT,
  'limiting-belief': LIMITING_BELIEF_PROMPT,
  shadow: SHADOW_PROMPT,
  'private-session': PRIVATE_SESSION_PROMPT,
};

export const PROMPT_MAP_EN: Record<AIFeature, string> = {
  manifestation: MANIFESTATION_PROMPT_EN,
  'limiting-belief': LIMITING_BELIEF_PROMPT_EN,
  shadow: SHADOW_PROMPT_EN,
  'private-session': PRIVATE_SESSION_PROMPT_EN,
};
