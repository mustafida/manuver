<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Function to get current datetime for input default
	const getNowStr = () => {
		const tzoffset = (new Date()).getTimezoneOffset() * 60000;
		return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
	};
</script>

<div class="max-w-2xl mx-auto mt-10">
	<div class="flex items-center gap-3 mb-6">
		<a href="/" class="text-slate-400 hover:text-[#00A2E9] transition">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
		</a>
		<h2 class="text-2xl font-bold text-slate-800">Penormalan Manuver</h2>
	</div>

	<div class="bg-white rounded-2xl p-8 shadow-md border border-slate-100">
		<div class="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 text-center text-indigo-900 shadow-inner">
			<span class="text-xs font-bold text-indigo-400 bg-white px-2 py-1 rounded shadow-sm inline-block mb-3 uppercase">Rangkuman Manuver Aktif</span>
			<div class="flex items-center justify-center gap-6 mt-2">
				<div class="text-right flex-1">
					<div class="font-bold text-lg">{data.manuverData.penyulangAsal.nama}</div>
				</div>
				<div class="text-indigo-300">➔</div>
				<div class="text-left flex-1">
					<div class="font-bold text-lg">{data.manuverData.penyulangTujuan.nama}</div>
				</div>
			</div>
			<div class="mt-4 pt-4 border-t border-indigo-200/50 flex justify-center gap-10">
				<div>
					<div class="text-xs opacity-70">Beban Manuver</div>
					<div class="font-bold text-xl">{data.manuverData.bebanAmpereManuver} A</div>
				</div>
				<div>
					<div class="text-xs opacity-70">Beban Sebelum</div>
					<div class="font-bold text-xl">{data.manuverData.bebanSebelum} A</div>
				</div>
			</div>
		</div>

		<form method="POST" use:enhance class="space-y-6">
			<div>
				<label for="waktuPenormalan" class="block text-sm font-medium text-slate-600 mb-1">Dinyatakan Normal Pada <span class="text-rose-500">*</span></label>
				<input type="datetime-local" id="waktuPenormalan" name="waktuPenormalan" required value={getNowStr()} class="w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition">
			</div>

			<div>
				<label for="bebanSesudah" class="block text-sm font-medium text-slate-600 mb-1">Beban Setelah Penormalan (Ampere) <span class="text-rose-500">*</span></label>
				<input type="number" step="0.01" id="bebanSesudah" name="bebanSesudah" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition text-emerald-700 font-bold text-lg" placeholder="100.00">
				<p class="text-xs text-slate-400 mt-2">Masukkan nilai akhir beban ampere setelah sistem kembali dikonfigurasi ke keadaan semula.</p>
			</div>

			<div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
				<a href="/" class="px-6 py-2.5 rounded-xl font-medium text-slate-500 hover:text-slate-800 transition">Batal</a>
				<button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-2.5 rounded-xl transition hover:-translate-y-0.5 shadow-md shadow-emerald-500/20">
					Selesaikan Penormalan
				</button>
			</div>
		</form>
	</div>
</div>
