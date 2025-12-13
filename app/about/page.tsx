import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tentang Kami - RuangKita',
    description: 'Cerita di balik RuangKita dan misi kami menghadirkan estetika.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <section className="text-center mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-7xl font-black font-serif text-foreground mb-6 tracking-tight">
                        Cerita <span className="text-accent">Kami</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-muted max-w-3xl mx-auto font-light leading-relaxed">
                        Lebih dari sekadar toko furniture. Kami adalah kurator kenyamanan dan estetika untuk setiap sudut ruang Anda.
                    </p>
                </section>

                {/* Story Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="relative aspect-square md:aspect-[4/3] bg-muted/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {/* Placeholder for About Image - could benefit from a real image in future */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-muted/20 flex items-center justify-center text-4xl">
                            🛋️
                        </div>
                    </div>
                    <div className="space-y-6 md:pl-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">
                            Berawal dari Passion
                        </h2>
                        <div className="space-y-4 text-muted text-lg leading-relaxed">
                            <p>
                                RuangKita didirikan pada tahun 2020 dengan satu keyakinan sederhana: bahwa rumah harus menjadi tempat di mana jiwa merasa tenang.
                            </p>
                            <p>
                                Kami memulai perjalanan ini dengan mencari pengrajin lokal terbaik yang memahami seni kayu dan desain. Setiap potongan furniture yang kami tawarkan telah melalui proses kurasi ketat untuk memastikan kualitas dan keindahan yang tak lekang oleh waktu.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-foreground rounded-[3rem] p-8 md:p-16 text-center text-background relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black font-serif mb-12">Nilai Kami</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            <div className="p-6 bg-background/5 rounded-3xl border border-background/10 backdrop-blur-sm">
                                <div className="text-4xl mb-4">✨</div>
                                <h3 className="text-xl font-bold mb-3">Estetika</h3>
                                <p className="text-background/80">Keindahan dalam setiap detail, menghadirkan harmoni visual.</p>
                            </div>
                            <div className="p-6 bg-background/5 rounded-3xl border border-background/10 backdrop-blur-sm">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold mb-3">Kualitas</h3>
                                <p className="text-background/80">Material premium yang tahan lama untuk investasi jangka panjang.</p>
                            </div>
                            <div className="p-6 bg-background/5 rounded-3xl border border-background/10 backdrop-blur-sm">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-xl font-bold mb-3">Layanan</h3>
                                <p className="text-background/80">Kepuasan pelanggan adalah prioritas utama kami.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
