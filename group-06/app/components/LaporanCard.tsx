interface LaporanCardProps {
    kode: string;
    nama: string;
    judul: string;
    lokasi: string;
    deskripsi: string;
    gambar: string;
}

export default function LaporanCard({
    kode,
    nama,
    judul,
    lokasi,
    deskripsi,
    gambar,
}: LaporanCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">

            <div className="bg-[#1a4175] text-white p-5">
                <h2 className="text-xl font-bold">
                    Laporan Berhasil Ditemukan
                </h2>

                <p className="text-sm text-slate-300">
                    Detail laporan fasilitas
                </p>
            </div>

            <div className="p-6 flex flex-col gap-5">

                {/* Gambar */}
                {gambar && (
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                            Bukti Gambar
                        </p>

                        <img
                            src={gambar}
                            alt="Bukti"
                            className="w-full max-h-80 object-contain rounded-xl border"
                        />
                    </div>
                )}

                {/* Kode */}
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        Kode Laporan
                    </p>

                    <div className="mt-1 bg-slate-50 rounded-lg p-3 border">
                        {kode}
                    </div>
                </div>

                {/* Nama */}
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        Nama Pelapor
                    </p>

                    <div className="mt-1 bg-slate-50 rounded-lg p-3 border">
                        {nama}
                    </div>
                </div>

                {/* Judul */}
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        Judul
                    </p>

                    <div className="mt-1 bg-slate-50 rounded-lg p-3 border">
                        {judul}
                    </div>
                </div>

                {/* Lokasi */}
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        Lokasi
                    </p>

                    <div className="mt-1 bg-slate-50 rounded-lg p-3 border">
                        {lokasi}
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        Deskripsi
                    </p>

                    <div className="mt-1 bg-slate-50 rounded-lg p-3 border whitespace-pre-line">
                        {deskripsi}
                    </div>
                </div>

            </div>
        </div>
    );
}
