
export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Pengaturan</h1>
                <p className="text-slate-500 dark:text-slate-400">Kelola preferensi aplikasi dan akun</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 space-y-8">
                    {/* General Settings Section */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                            Umum
                        </h2>
                        <div className="grid gap-4 max-w-xl">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Situs</label>
                                <input
                                    type="text"
                                    defaultValue="RuangKita"
                                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Admin</label>
                                <input
                                    type="email"
                                    defaultValue="admin@ruangkita.com"
                                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Notification Settings */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                            Notifikasi
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="notif-orders" className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500" defaultChecked />
                                <label htmlFor="notif-orders" className="text-sm text-slate-700 dark:text-slate-300">
                                    Terima notifikasi untuk pesanan baru
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="notif-stock" className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500" />
                                <label htmlFor="notif-stock" className="text-sm text-slate-700 dark:text-slate-300">
                                    Periagtan stok menipis
                                </label>
                            </div>
                        </div>
                    </section>

                    <div className="pt-4">
                        <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-orange-900/20 transition-all">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
