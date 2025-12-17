
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        slug: string;
    }>
}

async function getArticle(slug: string) {
    const article = await prisma.article.findUnique({
        where: { slug: slug },
    });
    return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);
    if (!article) {
        return { title: 'Artikel Tidak Ditemukan - RuangKita' };
    }
    return {
        title: `${article.title} - RuangKita`,
        description: article.content.substring(0, 150),
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article || !article.published) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-20">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/blog" className="text-muted hover:text-foreground transition-colors text-sm font-medium flex items-center gap-2">
                        ← Kembali ke Jurnal
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-accent font-bold mb-4 uppercase tracking-widest">
                        <span>Artikel</span>
                        <span>•</span>
                        <span>{new Date(article.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black font-serif text-foreground leading-tight mb-8">
                        {article.title}
                    </h1>
                </header>

                {/* Cover Image */}
                {article.imageUrl && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-lg">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg prose-stone mx-auto
                               prose-headings:font-serif prose-headings:font-bold prose-a:text-accent 
                               prose-img:rounded-xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Footer / Share (Dummy) */}
                <div className="mt-16 pt-8 border-t border-muted/20 text-center">
                    <p className="text-muted italic">Terima kasih telah membaca.</p>
                </div>

            </article>
        </main>
    );
}
