import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tentang Kami - Ruang Kita',
    description: 'Produsen furnitur berkualitas dari Pasuruan sejak 2001.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header - Expanded */}
                <section className="text-center mb-16 md:mb-24 animate-slide-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4 tracking-wider uppercase">
                        Karya Otentik Sejak 2001
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black font-serif text-foreground mb-6 tracking-tight">
                        Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Kami</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-muted max-w-4xl mx-auto font-light leading-relaxed">
                        Kami percaya bahwa furnitur bukan sekadar benda pengisi ruangan, melainkan jiwa yang menghidupkan suasana. Berpusat di Kecamatan Rejoso, Pasuruan, Ruang Kita hadir untuk mewujudkan kenyamanan abadi di hunian Anda.
                    </p>
                </section>

                {/* History & Identity - Expanded */}
                <section className="max-w-4xl mx-auto mb-24 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent blur-3xl -z-10" />
                    <div className="space-y-8 p-8 md:p-12 rounded-[2.5rem] bg-card/30 border border-white/5 backdrop-blur-sm shadow-xl">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground">
                            Lebih dari Sebuah Nama
                        </h2>
                        <div className="space-y-6 text-muted text-lg leading-relaxed font-light">
                            <p>
                                Perjalanan kami dimulai pada tahun 2001, jauh sebelum nama &quot;Ruang Kita&quot; lahir. Berawal dari sebuah workshop sederhana yang beroperasi tanpa label formal, kami meniti langkah demi langkah dengan satu fokus utama: kualitas tanpa kompromi.
                            </p>
                            <p>
                                Selama lebih dari dua dekade, tangan-tangan terampil kami telah mendedikasikan waktu dan tenaga untuk menciptakan furnitur yang tidak hanya indah dipandang, tetapi juga tangguh melawan waktu. Kami memahami bahwa setiap sambungan kayu dan setiap lapisan finishing adalah janji ketahanan yang kami berikan kepada Anda.
                            </p>
                            <div className="w-16 h-1 bg-accent/50 mx-auto rounded-full"></div>
                            <p className="text-xl md:text-2xl text-foreground font-serif italic">
                                &quot;Bagi kami, kepercayaan pelanggan yang terjaga selama puluhan tahun adalah identitas yang jauh lebih kuat daripada sekadar logo atau nama brand.&quot;
                            </p>
                            <p>
                                Kini, akumulasi pengalaman panjang tersebut kami wujudkan dalam identitas baru yang lebih segar dan profesional: <strong>Ruang Kita</strong>. Sebuah wajah baru untuk semangat lama yang tetap sama—melayani kebutuhan ruang Anda dengan sepenuh hati.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Philosophy (Values) - Optimized for 3-col mobile */}
                <section className="bg-foreground rounded-[2.5rem] md:rounded-[3rem] p-4 md:p-16 text-center text-background relative overflow-hidden mb-24 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-5xl font-black font-serif mb-6 md:mb-12">Filosofi Kualitas</h2>
                        <p className="max-w-3xl mx-auto text-background/80 text-sm md:text-lg mb-8 md:mb-12 font-light">
                            Kami memegang teguh prinsip bahwa estetika dan fungsi harus berjalan beriringan.
                        </p>
                        <div className="grid grid-cols-3 gap-2 md:gap-8 text-center items-start">
                            <div className="group p-2 md:p-8 bg-background/5 hover:bg-background/10 rounded-xl md:rounded-3xl border border-background/10 backdrop-blur-sm flex flex-col items-center transition-all duration-300 h-full">
                                <div className="text-2xl md:text-5xl mb-2 md:mb-6 p-1.5 md:p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform">🪵</div>
                                <h3 className="text-[0.65rem] md:text-2xl font-bold mb-1 md:mb-4 uppercase tracking-wide md:tracking-normal">Seleksi Material</h3>
                                <p className="text-background/70 text-[0.55rem] md:text-base leading-tight md:leading-relaxed font-medium">
                                    Kayu solid & material premium pilihan demi keawetan maksimal.
                                </p>
                            </div>
                            <div className="group p-2 md:p-8 bg-background/5 hover:bg-background/10 rounded-xl md:rounded-3xl border border-background/10 backdrop-blur-sm flex flex-col items-center transition-all duration-300 h-full">
                                <div className="text-2xl md:text-5xl mb-2 md:mb-6 p-1.5 md:p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform">✏️</div>
                                <h3 className="text-[0.65rem] md:text-2xl font-bold mb-1 md:mb-4 uppercase tracking-wide md:tracking-normal">Bebas Custom</h3>
                                <p className="text-background/70 text-[0.55rem] md:text-base leading-tight md:leading-relaxed font-medium">
                                    Tentukan dimensi, bahan, & finishing sesuai visi Anda.
                                </p>
                            </div>
                            <div className="group p-2 md:p-8 bg-background/5 hover:bg-background/10 rounded-xl md:rounded-3xl border border-background/10 backdrop-blur-sm flex flex-col items-center transition-all duration-300 h-full">
                                <div className="text-2xl md:text-5xl mb-2 md:mb-6 p-1.5 md:p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform">🎨</div>
                                <h3 className="text-[0.65rem] md:text-2xl font-bold mb-1 md:mb-4 uppercase tracking-wide md:tracking-normal">Ragam Gaya</h3>
                                <p className="text-background/70 text-[0.55rem] md:text-base leading-tight md:leading-relaxed font-medium">
                                    Dari Minimalis modern hingga detail Ukiran Klasik.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience B2B B2C - Expanded */}
                <section className="mb-24">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif text-foreground">
                            Jejak Langkah B2B & B2C
                        </h2>
                        <div className="p-1 rounded-2xl bg-gradient-to-r from-transparent via-muted/20 to-transparent"></div>
                        <div className="text-lg md:text-xl text-muted space-y-6 md:px-12 leading-relaxed">
                            <p>
                                Rekam jejak kami bukan sekadar klaim. Sejak 2001, Ruang Kita telah menjadi mitra di balik layar bagi banyak proyek besar. Kami berpengalaman menangani produksi furnitur skala industri untuk kebutuhan perkantoran, jaringan hotel, hingga proyek residensial dari pengembang properti ternama. Ketepatan waktu dan standarisasi kualitas ketat adalah makanan sehari-hari kami.
                            </p>
                            <p>
                                Berbekal pengalaman solid di sektor B2B tersebut, kini kami membuka pintu seluas-luasnya untuk pelanggan ritel (B2C). Kami ingin membawa standar kualitas &quot;proyek&quot; yang presisi dan tangguh itu langsung ke dalam ruang tamu, kamar tidur, dan ruang makan pribadi Anda.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Ethics - Expanded */}
                {/* Ethics - Expanded (Restored without Icon) */}
                <section className="max-w-5xl mx-auto mb-24 bg-gradient-to-br from-green-900/10 to-emerald-900/5 p-8 md:p-16 rounded-[2.5rem] text-center border border-green-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    <div className="relative z-10 space-y-8">
                        {/* Icon removed by user request */}
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
                            Etika Material & Dukungan Komunitas
                        </h2>
                        <div className="text-muted text-lg leading-relaxed max-w-3xl mx-auto space-y-4">
                            <p>
                                Sebagai produsen yang lahir dan tumbuh di Pasuruan, kami memiliki komitmen mendalam terhadap tanah yang kami pijak. Kami menyadari tanggung jawab kami terhadap kelestarian alam. Oleh karena itu, Ruang Kita hanya menggunakan bahan baku kayu dari Sistem Tebang Pilih yang legal dan berkelanjutan.
                            </p>
                            <p>
                                Lebih dari itu, kami bangga dapat bekerja sama erat dengan para petani kayu dan pengrajin lokal. Setiap pembelian Anda turut berkontribusi dalam menjaga roda ekonomi komunitas dan melestarikan warisan keterampilan pertukangan di wilayah kami.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision & Info - Expanded */}
                <section className="text-center space-y-16 mb-8">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-6">Visi Kami</h2>
                        <p className="text-xl md:text-2xl text-muted font-light italic leading-normal">
                            &quot;Menjadi mitra terpercaya dalam menghidupkan ruang impian Anda, melalui perpaduan keahlian tangan yang teruji, kejujuran material, dan dedikasi pada kepuasan pelanggan.&quot;
                        </p>
                    </div>

                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-10 border border-muted/20 rounded-[2rem] bg-card hover:bg-card/80 transition-colors shadow-lg max-w-md mx-auto">
                            <h3 className="text-xl font-bold font-serif text-foreground mb-3">📍 Kunjungi Workshop Kami</h3>
                            <p className="text-muted text-lg mb-4">
                                Kami mengundang Anda untuk melihat langsung proses dedikasi kami.
                            </p>
                            <p className="text-foreground font-semibold">
                                Kecamatan Rejoso, Kabupaten Pasuruan,<br />Jawa Timur.
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
