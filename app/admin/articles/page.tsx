
import Link from "next/link";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add revalidation to ensure fresh data
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Artikel Blog</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola postingan blog dan artikel</p>
                </div>
                <Link href="/admin/articles/create">
                    <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-orange-900/20 transition-all hover:scale-105">
                        + Buat Artikel Baru
                    </button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Judul</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Slug</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tanggal</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {articles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada artikel.
                                    </td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">{article.title}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">{article.slug}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                                            {new Date(article.createdAt).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.published
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                                    }`}
                                            >
                                                {article.published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
