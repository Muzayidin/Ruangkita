import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Blog Interior - RuangKita',
    description: 'Tips, inspirasi, dan tren desain interior terbaru.',
};

const BLOG_POSTS = [
    {
        id: 1,
        title: "Tren Desain Interior 2025: Kembali ke Alam",
        excerpt: "Mengapa material alami dan warna bumi semakin diminati di tahun mendatang.",
        date: "12 Des 2024",
        category: "Tren",
        color: "bg-green-100 text-green-800"
    },
    {
        id: 2,
        title: "Tips Memilih Sofa untuk Ruang Tamu Kecil",
        excerpt: "Maksimalkan ruang terbatas tanpa mengorbankan kenyamanan dan gaya.",
        date: "10 Des 2024",
        category: "Tips",
        color: "bg-blue-100 text-blue-800"
    },
    {
        id: 3,
        title: "Merawat Furniture Kayu Jati Agar Awet",
        excerpt: "Panduan lengkap perawatan furniture kayu solid warisan leluhur.",
        date: "05 Des 2024",
        category: "Panduan",
        color: "bg-orange-100 text-orange-800"
    },
    {
        id: 4,
        title: "Inspirasi Color Palette: Japandi Style",
        excerpt: "Kombinasi warna yang menenangkan untuk rumah bergaya Jepang-Skandinavia.",
        date: "01 Des 2024",
        category: "Inspirasi",
        color: "bg-purple-100 text-purple-800"
    },
    {
        id: 5,
        title: "Lighting 101: Pencahayaan yang Mengubah Suasana",
        excerpt: "Bagaimana memilih lampu yang tepat untuk setiap aktivitas di rumah.",
        date: "28 Nov 2024",
        category: "Tips",
        color: "bg-yellow-100 text-yellow-800"
    },
    {
        id: 6,
        title: "Dekorasi Dinding: Lebih dari Sekadar Lukisan",
        excerpt: "Eksplorasi tekstur dan dimensi untuk dinding yang membosankan.",
        date: "20 Nov 2024",
        category: "Dekorasi",
        color: "bg-red-100 text-red-800"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-7xl font-black font-serif text-foreground mb-6 tracking-tight">
                        Jurnal <span className="text-accent">Estetika</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed">
                        Temukan inspirasi, tips, dan wawasan terbaru seputar dunia interior dan furniture.
                    </p>
                </section>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.id} className="group flex flex-col bg-card rounded-[2rem] p-6 shadow-sm border border-muted/20 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="mb-6 aspect-video bg-muted/20 rounded-2xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-muted/20 to-muted/10 flex items-center justify-center text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">
                                    📰
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider">
                                <span className={`px-3 py-1 rounded-full ${post.color}`}>{post.category}</span>
                                <span className="text-muted">{post.date}</span>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 font-serif group-hover:text-accent transition-colors">
                                <Link href="#" className="hover:underline decoration-2 decoration-accent/30 underline-offset-4">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">
                                {post.excerpt}
                            </p>
                            <Link href="#" className="inline-flex items-center text-sm font-bold text-foreground hover:text-accent transition-colors gap-2 mt-auto">
                                Baca Selengkapnya <span>→</span>
                            </Link>
                        </article>
                    ))}
                </div>

            </div>
        </main>
    );
}
