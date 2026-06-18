const mockMangas = [
    {
        _id: "60c72b2f9b1d8b2c88888801",
        title: "Solo Leveling",
        titleAr: "سولو ليفيلينغ",
        slug: "solo-leveling",
        description: "في عالم حيث يُفتح بوابات تربط بين عالمنا وعالم الوحوش، يصبح سونغ جين-وو أضعف صياد من الرتبة E. لكن بعد حادثة غامضة في زنزانة مزدوجة، يحصل على قوة خفية تمكنه من الارتقاء بلا حدود...",
        coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "completed",
        genres: ["أكشن", "فانتازيا", "مغامرات", "نظام"],
        author: "Chugong",
        artist: "Dubu (Redice Studio)",
        rating: 9.8,
        views: 2500000,
        bookmarks: 154000,
        isHot: true,
        isFeatured: true,
        createdAt: "2026-06-01T00:00:00.000Z"
    },
    {
        _id: "60c72b2f9b1d8b2c88888802",
        title: "One Piece",
        titleAr: "ون بيس",
        slug: "one-piece",
        description: "القوة، الثروة، الشهرة. هذا ما امتلكه ملك القراصنة غول دي. روجر قبل إعدامه. كلمات روجر الأخيرة أرسلت الآلاف إلى البحار بحثاً عن كنزه الأسطوري ون بيس. مونكي دي. لوفي، شاب يطمح لأن يكون ملك القراصنة الجديد، يبدأ مغامرته لجمع طاقم والإبحار في الجراند لاين.",
        coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
        type: "manga",
        status: "ongoing",
        genres: ["أكشن", "مغامرات", "كوميديا", "خيال"],
        author: "Eiichiro Oda",
        artist: "Eiichiro Oda",
        rating: 9.7,
        views: 3100000,
        bookmarks: 245000,
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-02T00:00:00.000Z"
    },
    {
        _id: "60c72b2f9b1d8b2c88888803",
        title: "Tower of God",
        titleAr: "برج الإله",
        slug: "tower-of-god",
        description: "ماذا تبحث؟ الشهرة؟ المجد؟ القوة؟ الانتقام؟ أم شيء يتجاوز كل هذا؟ كل ما تبحث عنه موجود في قمة البرج. بام الثالث والعشرون، فتى عاش حياته وحيداً في ظلام تحت البرج، يدخل البرج بحثاً عن صديقته الوحيدة راشيل التي صعدت لتشاهد النجوم.",
        coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["أكشن", "غموض", "فانتازيا", "دراما"],
        author: "SIU",
        artist: "SIU",
        rating: 9.5,
        views: 1800000,
        bookmarks: 98000,
        isHot: false,
        isFeatured: false,
        createdAt: "2026-06-03T00:00:00.000Z"
    },
    {
        _id: "60c72b2f9b1d8b2c88888804",
        title: "Jujutsu Kaisen",
        titleAr: "جوجوتسو كايسن",
        slug: "jujutsu-kaisen",
        description: "إيتادوري يوجي، طالب ثانوية يمتلك بنية جسدية خارقة، يبتلع عن غير قصد إصبعاً ملعوناً يخص سوكونا، ملك اللعنات الأسطوري. لحماية أصدقائه والناس، ينضم إلى ثانوية جوجوتسو لطرد اللعنات والبحث عن باقي الأصابع الملعونة للتخلص منها.",
        coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
        type: "manga",
        status: "completed",
        genres: ["أكشن", "فوق الطبيعة", "مدرسي", "شياطين"],
        author: "Gege Akutami",
        artist: "Gege Akutami",
        rating: 9.4,
        views: 1600000,
        bookmarks: 112000,
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-04T00:00:00.000Z"
    },
    {
        _id: "60c72b2f9b1d8b2c88888805",
        title: "The Beginning After The End",
        titleAr: "البداية بعد النهاية",
        slug: "the-beginning-after-the-end",
        description: "الملك غري، القائد الذي لا منازع له في عالم تحكمه القوة القتالية، يولد مجدداً في عالم مليء بالسحر والوحوش كـ آرثر ليوين. مع معرفته السابقة وقدراته الجديدة، يبدأ مغامرته لحماية عائلته ومملكته الجديدة من تهديد غامض.",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["فانتازيا", "أكشن", "إعادة تجسد", "مغامرات"],
        author: "TurtleMe",
        artist: "Fuyuki 23",
        rating: 9.3,
        views: 1200000,
        bookmarks: 87000,
        isHot: false,
        isFeatured: false,
        createdAt: "2026-06-05T00:00:00.000Z"
    },
    {
        _id: "60c72b2f9b1d8b2c88888806",
        title: "Omniscient Reader",
        titleAr: "وجهة نظر القارئ العليم",
        slug: "omniscient-reader",
        description: "كيم دوكجا هو قارئ عادي يقرأ رواية إنترنت فاشلة تدعى 'ثلاث طرق للبقاء في عالم مدمر' لسنوات عديدة. عندما يُنشر الفصل الأخير، يتحول عالم الرواية فجأة إلى حقيقة واقعية، ويصبح دوكجا الشخص الوحيد الذي يعرف نهاية العالم وكيفية النجاة.",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["أكشن", "خيال علمي", "نظام", "دراما"],
        author: "sing N song",
        artist: "Sleepy-C",
        rating: 9.6,
        views: 1900000,
        bookmarks: 130000,
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-06T00:00:00.000Z"
    }
];

const fs = require("fs");
const path = require("path");

const mockChapters = {};
mockMangas.forEach(manga => {
    mockChapters[manga._id] = [
        {
            _id: `60c72b2f9b1d8b2c8888891${manga.slug.substring(0, 2)}`,
            manga: manga._id,
            chapterNumber: 1,
            title: `الفصل 1: ${manga.titleAr}`,
            views: 120,
            pages: [
                { pageNumber: 1, imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 2, imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 3, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 4, imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80" }
            ],
            createdAt: "2026-06-07T00:00:00.000Z"
        },
        {
            _id: `60c72b2f9b1d8b2c8888892${manga.slug.substring(0, 2)}`,
            manga: manga._id,
            chapterNumber: 2,
            title: `الفصل 2: ${manga.titleAr}`,
            views: 95,
            pages: [
                { pageNumber: 1, imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 2, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 3, imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80" },
                { pageNumber: 4, imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80" }
            ],
            createdAt: "2026-06-08T00:00:00.000Z"
        }
    ];
});

// Dynamically load A Man's Man if metadata exists
try {
    const aMansManMetadataPath = path.join(__dirname, "../public/uploads/a-mans-man-metadata.json");
    if (fs.existsSync(aMansManMetadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(aMansManMetadataPath, "utf8"));
        
        // Add A Man's Man manga if not already in mockMangas
        const aMansManId = "60c72b2f9b1d8b2c88888899";
        const exists = mockMangas.some(m => m._id === aMansManId);
        if (!exists) {
            mockMangas.push({
                _id: aMansManId,
                title: "A Man's Man",
                titleAr: "رجل الرجل",
                slug: "a-mans-man",
                description: "هان يو-هيون هو أصغر رئيس تنفيذي لشركة إلكترونيات كبرى، لكن نجاحه بُني على حساب علاقاته الإنسانية وصداقاته. عندما يجد نفسه وحيداً في القمة، يحصل على فرصة ثانية للعودة بالزمن وإصلاح أخطائه وتحقيق النجاح بطريقة مختلفة مع حماية الأشخاص الذين يحبهم.",
                coverImage: "/uploads/a-mans-man/ch_1_page_1.jpg",
                type: "manhwa",
                status: "ongoing",
                genres: ["دراما", "خيال", "عمل", "حياة يومية"],
                author: "Dogado",
                artist: "Dogado",
                rating: 9.6,
                views: 12000,
                bookmarks: 450,
                isHot: true,
                isFeatured: true,
                createdAt: "2026-06-18T12:00:00.000Z"
            });
        }
        
        // Format chapters and add to mockChapters
        mockChapters[aMansManId] = metadata.map((ch) => ({
            _id: `60c72b2f9b1d8b2c8888899${ch.chapterNumber}`,
            manga: aMansManId,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            views: ch.views || 0,
            pages: ch.pages,
            createdAt: ch.createdAt
        }));
    }
} catch (err) {
    console.error("Error loading a-mans-man metadata:", err);
}

module.exports = {
    mockMangas,
    mockChapters
};

