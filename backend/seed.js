const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Manga = require("./models/Manga");
const Chapter = require("./models/Chapter");

// Load env variables
dotenv.config();

const mangasData = [
    {
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
        isFeatured: true
    },
    {
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
        isFeatured: false
    },
    {
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
        isFeatured: false
    },
    {
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
        isFeatured: false
    },
    {
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
        isFeatured: false
    },
    {
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
        isFeatured: false
    }
];

const seedDB = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected.");

        // Clear existing data
        console.log("🗑️ Clearing existing Manga and Chapters...");
        await Manga.deleteMany({});
        await Chapter.deleteMany({});

        // Insert Mangas
        console.log("🌱 Seeding Mangas...");
        const createdMangas = await Manga.insertMany(mangasData);
        console.log(`✅ Successfully seeded ${createdMangas.length} mangas.`);

        // Seed Chapters for some Mangas
        console.log("🌱 Seeding Chapters...");
        for (const manga of createdMangas) {
            // Seed 2 chapters for each manga
            for (let chNum = 1; chNum <= 2; chNum++) {
                const chapter = new Chapter({
                    manga: manga._id,
                    chapterNumber: chNum,
                    title: `الفصل ${chNum}: ${manga.titleAr}`,
                    views: Math.floor(Math.random() * 1000) + 100,
                    pages: [
                        { pageNumber: 1, imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80" },
                        { pageNumber: 2, imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80" },
                        { pageNumber: 3, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
                        { pageNumber: 4, imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80" }
                    ]
                });
                await chapter.save();
            }
        }
        console.log("✅ Chapters seeded successfully.");

        console.log("🎉 Seeding Database Complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
