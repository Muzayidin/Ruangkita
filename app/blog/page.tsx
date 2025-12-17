import { Metadata } from 'next';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Blog Interior - RuangKita',
    description: 'Tips, inspirasi, dan tren desain interior terbaru.',
};

// Helper to strip HTML tags for excerpt
function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, '');
}

export default async function BlogPage() {
    const articles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

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
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((post) => (
                            <article key={post.id} className="group flex flex-col bg-card rounded-[2rem] p-6 shadow-sm border border-muted/20 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <Link href={`/blog/${post.slug}`} className="block mb-6 aspect-video bg-muted/20 rounded-2xl overflow-hidden relative">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-tr from-muted/20 to-muted/10 flex items-center justify-center text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">
                                            📰
                                        </div>
                                    )}
                                </Link>
                                <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider">
                                    <span className={`px-3 py-1 rounded-full bg-green-100 text-green-800`}>Artikel</span>
                                    <span className="text-muted">{new Date(post.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}</span>
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 font-serif group-hover:text-accent transition-colors">
                                    <Link href={`/blog/${post.slug}`} className="hover:underline decoration-2 decoration-accent/30 underline-offset-4">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                    {stripHtml(post.content).substring(0, 150)}...
                                </p>
                                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-bold text-foreground hover:text-accent transition-colors gap-2 mt-auto">
                                    Baca Selengkapnya <span>→</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted">Belum ada artikel yang dipublikasikan.</p>
                    </div>
                )}

            </div>
        </main>
    );
}
