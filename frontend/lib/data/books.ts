/**
 * Books Data
 * Static data for the 12 Omani books in the Library Collection
 */

export interface BookData {
  id: string
  isbn: string
  title: string
  titleAr: string
  author: string
  authorAr: string
  coverImage: string
  category: string
  status: "available" | "borrowed" | "reserved" | "damaged" | "underRepair"
  language: "en" | "ar"
  publicationYear: number
  publisher: string
  pages: number
  rating: number
  reviewCount: number
  shelfLocation: string
  copies: {
    total: number
    available: number
  }
  dueDate?: string
  isNewArrival: boolean
  isFeatured: boolean
  description: string
  tags: string[]
}

export const OMANI_BOOKS: BookData[] = [
  {
    id: "1",
    isbn: "978-9948-01-234-5",
    title: "The Development of Oman",
    titleAr: "تطور عمان",
    author: "International Relations Institute",
    authorAr: "معهد العلاقات الدولية",
    coverImage: "/books/omani-history-development-book-cover.jpg",
    category: "History",
    status: "available",
    language: "en",
    publicationYear: 2020,
    publisher: "Oman Publishing House",
    pages: 452,
    rating: 4.7,
    reviewCount: 156,
    shelfLocation: "H-01-1",
    copies: { total: 5, available: 3 },
    isNewArrival: true,
    isFeatured: true,
    description: "A comprehensive study of Oman's economic and political development in the modern era.",
    tags: ["Oman", "History", "Development"],
  },
  {
    id: "2",
    isbn: "978-9948-02-567-8",
    title: "ألف ليلة وليلة",
    titleAr: "ألف ليلة وليلة",
    author: "الكاتب المجهول",
    authorAr: "الكاتب المجهول",
    coverImage: "/books/arabian-nights-one-thousand-and-one-nights-classic.jpg",
    category: "Literature",
    status: "available",
    language: "ar",
    publicationYear: 2018,
    publisher: "دار الشروق",
    pages: 628,
    rating: 4.9,
    reviewCount: 487,
    shelfLocation: "L-02-3",
    copies: { total: 8, available: 5 },
    isNewArrival: false,
    isFeatured: true,
    description: "الحكاية الخالدة للألف ليلة وليلة، من أعظم التراث العربي والإسلامي.",
    tags: ["Arabic", "Classics", "Literature"],
  },
  {
    id: "3",
    isbn: "978-9948-03-890-1",
    title: "Oman: Land of Heritage",
    titleAr: "عمان: أرض التراث",
    author: "Dr. Mohammed Al-Rashdi",
    authorAr: "د. محمد الرشيدي",
    coverImage: "/books/oman-heritage-culture-traditional-architecture.jpg",
    category: "Culture",
    status: "available",
    language: "en",
    publicationYear: 2019,
    publisher: "Ministry of Information",
    pages: 384,
    rating: 4.6,
    reviewCount: 203,
    shelfLocation: "C-03-2",
    copies: { total: 6, available: 4 },
    isNewArrival: false,
    isFeatured: false,
    description: "An exploration of Oman's rich cultural heritage, traditions, and historical significance.",
    tags: ["Oman", "Culture", "Heritage"],
  },
  {
    id: "4",
    isbn: "978-9948-04-123-2",
    title: "الشاعر نزار قباني",
    titleAr: "أعمال نزار قباني الشاملة",
    author: "نزار قباني",
    authorAr: "نزار قباني",
    coverImage: "/books/nizar-qabbani-arabic-poet-poetry-book.jpg",
    category: "Poetry",
    status: "available",
    language: "ar",
    publicationYear: 2017,
    publisher: "دار منارات",
    pages: 512,
    rating: 4.8,
    reviewCount: 534,
    shelfLocation: "P-04-1",
    copies: { total: 4, available: 2 },
    isNewArrival: false,
    isFeatured: false,
    description: "مجموعة شاملة من قصائد الشاعر العربي الشهير نزار قباني.",
    tags: ["Arabic", "Poetry", "Literature"],
  },
  {
    id: "5",
    isbn: "978-9948-05-456-3",
    title: "The Oman Medical Encyclopedia",
    titleAr: "الموسوعة الطبية العمانية",
    author: "Ministry of Health",
    authorAr: "وزارة الصحة",
    coverImage: "/books/medical-encyclopedia-healthcare-reference-book.jpg",
    category: "Reference",
    status: "borrowed",
    language: "en",
    publicationYear: 2021,
    publisher: "Oman Health Publishing",
    pages: 724,
    rating: 4.5,
    reviewCount: 89,
    shelfLocation: "R-05-2",
    copies: { total: 3, available: 0 },
    dueDate: "2025-01-20",
    isNewArrival: false,
    isFeatured: false,
    description: "A comprehensive medical reference guide relevant to healthcare in the Oman region.",
    tags: ["Medical", "Reference", "Healthcare"],
  },
  {
    id: "6",
    isbn: "978-9948-06-789-4",
    title: "محمود درويش: الأعمال الكاملة",
    titleAr: "محمود درويش: الأعمال الكاملة",
    author: "محمود درويش",
    authorAr: "محمود درويش",
    coverImage: "/books/mahmoud-darwish-arabic-poet-complete-works.jpg",
    category: "Poetry",
    status: "available",
    language: "ar",
    publicationYear: 2019,
    publisher: "دار الآداب",
    pages: 856,
    rating: 4.9,
    reviewCount: 612,
    shelfLocation: "P-06-3",
    copies: { total: 5, available: 3 },
    isNewArrival: true,
    isFeatured: true,
    description: "مجموعة الأعمال الكاملة للشاعر الفلسطيني محمود درويش.",
    tags: ["Arabic", "Poetry", "Literature"],
  },
  {
    id: "7",
    isbn: "978-9948-07-012-5",
    title: "Oman Trade and Commerce Guide",
    titleAr: "دليل التجارة والتجارة العمانية",
    author: "Chamber of Commerce Oman",
    authorAr: "غرفة تجارة وصناعة عمان",
    coverImage: "/books/trade-commerce-business-guide-oman-economy.jpg",
    category: "Business",
    status: "available",
    language: "en",
    publicationYear: 2022,
    publisher: "Oman Publishing",
    pages: 392,
    rating: 4.4,
    reviewCount: 124,
    shelfLocation: "B-07-1",
    copies: { total: 4, available: 2 },
    isNewArrival: false,
    isFeatured: false,
    description: "A practical guide to business and commerce opportunities in Oman.",
    tags: ["Business", "Oman", "Commerce"],
  },
  {
    id: "8",
    isbn: "978-9948-08-345-6",
    title: "سلطنة عمان: جغرافيا وديموغرافيا",
    titleAr: "سلطنة عمان: جغرافيا وديموغرافيا",
    author: "د. فاطمة العبرية",
    authorAr: "د. فاطمة العبرية",
    coverImage: "/books/oman-geography-demographics-maps-statistics.jpg",
    category: "Geography",
    status: "available",
    language: "ar",
    publicationYear: 2020,
    publisher: "دار المعرفة",
    pages: 468,
    rating: 4.6,
    reviewCount: 178,
    shelfLocation: "G-08-2",
    copies: { total: 5, available: 4 },
    isNewArrival: false,
    isFeatured: false,
    description: "دراسة شاملة عن جغرافيا سلطنة عمان والمعلومات الديموغرافية الحديثة.",
    tags: ["Oman", "Geography", "Demographics"],
  },
  {
    id: "9",
    isbn: "978-9948-09-678-7",
    title: "The Arabian Peninsula: History and Culture",
    titleAr: "شبه الجزيرة العربية: التاريخ والثقافة",
    author: "Prof. Abdullah Al-Abed",
    authorAr: "أ.د. عبدالله العابد",
    coverImage: "/books/arabian-peninsula-history-culture-tradition.jpg",
    category: "History",
    status: "available",
    language: "en",
    publicationYear: 2018,
    publisher: "Arabia Publishing",
    pages: 556,
    rating: 4.7,
    reviewCount: 289,
    shelfLocation: "H-09-3",
    copies: { total: 6, available: 3 },
    isNewArrival: false,
    isFeatured: false,
    description: "A comprehensive historical and cultural study of the Arabian Peninsula.",
    tags: ["Arabian", "History", "Culture"],
  },
  {
    id: "10",
    isbn: "978-9948-10-901-8",
    title: "جبران خليل جبران: النبي والأعمال الأخرى",
    titleAr: "جبران خليل جبران: النبي والأعمال الأخرى",
    author: "جبران خليل جبران",
    authorAr: "جبران خليل جبران",
    coverImage: "/books/kahlil-gibran-the-prophet-arabic-literature.jpg",
    category: "Philosophy",
    status: "available",
    language: "ar",
    publicationYear: 2019,
    publisher: "دار النشر العربي",
    pages: 384,
    rating: 4.8,
    reviewCount: 712,
    shelfLocation: "PH-10-1",
    copies: { total: 7, available: 5 },
    isNewArrival: false,
    isFeatured: true,
    description: "أعمال جبران خليل جبران الفلسفية والشعرية، بما فيها النبي.",
    tags: ["Arabic", "Philosophy", "Wisdom"],
  },
  {
    id: "11",
    isbn: "978-9948-11-234-9",
    title: "Environmental Conservation in Oman",
    titleAr: "الحفاظ على البيئة في عمان",
    author: "Ministry of Environment",
    authorAr: "وزارة البيئة",
    coverImage: "/books/environmental-conservation-nature-wildlife-oman-de.jpg",
    category: "Environment",
    status: "available",
    language: "en",
    publicationYear: 2021,
    publisher: "Oman Environmental Press",
    pages: 424,
    rating: 4.5,
    reviewCount: 156,
    shelfLocation: "E-11-2",
    copies: { total: 4, available: 2 },
    isNewArrival: true,
    isFeatured: false,
    description: "An important resource on environmental protection and sustainability initiatives in Oman.",
    tags: ["Environment", "Oman", "Conservation"],
  },
  {
    id: "12",
    isbn: "978-9948-12-567-0",
    title: "الأدب الحديث العربي: دراسة نقدية",
    titleAr: "الأدب الحديث العربي: دراسة نقدية",
    author: "د. سعيد الحوراني",
    authorAr: "د. سعيد الحوراني",
    coverImage: "/books/modern-arabic-literature-critical-analysis-study.jpg",
    category: "Literature",
    status: "available",
    language: "ar",
    publicationYear: 2020,
    publisher: "دار الفكر",
    pages: 512,
    rating: 4.6,
    reviewCount: 267,
    shelfLocation: "L-12-3",
    copies: { total: 3, available: 1 },
    isNewArrival: false,
    isFeatured: false,
    description: "دراسة نقدية شاملة للأدب العربي الحديث وتطوره.",
    tags: ["Arabic", "Literature", "Criticism"],
  },
]

/**
 * Get all unique categories from the books
 */
export function getCategories(): string[] {
  const categories = new Set(OMANI_BOOKS.map((book) => book.category))
  return Array.from(categories).sort()
}

/**
 * Get books statistics
 */
export function getBooksStats() {
  const totalBooks = OMANI_BOOKS.reduce((sum, book) => sum + book.copies.total, 0)
  const availableBooks = OMANI_BOOKS.reduce((sum, book) => sum + book.copies.available, 0)
  const borrowedBooks = totalBooks - availableBooks
  const overdueBooks = OMANI_BOOKS.filter((book) => book.dueDate && new Date(book.dueDate) < new Date()).length

  return {
    totalBooks,
    available: availableBooks,
    borrowed: borrowedBooks,
    overdue: overdueBooks,
  }
}

/**
 * Filter books by various criteria
 */
export function filterBooks(
  books: BookData[],
  searchTerm: string,
  category: string | null,
  status: string | null
): BookData[] {
  return books.filter((book) => {
    const matchesSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.titleAr.includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authorAr.includes(searchTerm) ||
      book.isbn.includes(searchTerm)

    const matchesCategory = !category || book.category === category

    const matchesStatus = !status || book.status === status

    return matchesSearch && matchesCategory && matchesStatus
  })
}
