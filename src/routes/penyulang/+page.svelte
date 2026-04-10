	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data }: { data: PageData } = $props();

	const daftarULP = ['Bangkalan', 'Kamal', 'Blega', 'Sampang', 'Pamekasan', 'Sumenep', 'Ketapang', 'Waru', 'Ambunten'];
</script>

<div class="flex justify-between items-center mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Master Data Penyulang Aktif</h2>
</div>

<div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
	<!-- Form Tambah -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-1 h-min">
		<h3 class="text-lg font-bold text-[#005B8F] mb-4">Tambah Penyulang</h3>
		<form method="POST" action="?/create" use:enhance class="space-y-4">
			<div>
				<label for="nama" class="block text-sm font-medium text-slate-600 mb-1">Nama Penyulang</label>
				<input type="text" id="nama" name="nama" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="Contoh: PYL 01...">
			</div>
			
			<div>
				<label for="garduIndukId" class="block text-sm font-medium text-slate-600 mb-1">Gardu Induk</label>
				<select id="garduIndukId" name="garduIndukId" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition">
					<option value="" disabled selected>Pilih Gardu Induk...</option>
					{#each data.listGarduInduk as gi}
						<option value={gi.id}>{gi.nama}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="trf" class="block text-sm font-medium text-slate-600 mb-1">TRF</label>
				<input type="text" id="trf" name="trf" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="Data Trafo...">
			</div>

			<div>
				<label for="ulp" class="block text-sm font-medium text-slate-600 mb-1">ULP</label>
				<select id="ulp" name="ulp" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition">
					<option value="" disabled selected>Pilih Area ULP...</option>
					{#each daftarULP as ulp}
						<option value={ulp}>{ulp}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="bebanSiang" class="block text-sm font-medium text-slate-600 mb-1">Beban Siang (10.00 - 19.00) *Ampere</label>
				<input type="number" step="0.01" min="0" id="bebanSiang" name="bebanSiang" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="0.00">
			</div>

			<div>
				<label for="bebanMalam" class="block text-sm font-medium text-slate-600 mb-1">Beban Malam (19.00 - 10.00) *Ampere</label>
				<input type="number" step="0.01" min="0" id="bebanMalam" name="bebanMalam" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0089C5] border-2 focus:ring focus:ring-[#0089C5]/20 transition font-bold" placeholder="0.00">
			</div>

			<button type="submit" class="w-full bg-[#00A2E9] hover:bg-[#007BB5] text-white font-medium py-2.5 rounded-xl transition hover:-translate-y-0.5 shadow-md shadow-[#00A2E9]/20 mt-4">
				Simpan Data
			</button>
		</form>
	</div>

	<!-- List Penyulang -->
	<div class="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse min-w-[700px]">
				<thead>
					<tr class="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
						<th class="py-3 px-6 font-medium">Nama Penyulang</th>
						<th class="py-3 px-6 font-medium">Gardu Induk</th>
						<th class="py-3 px-6 font-medium">TRF</th>
						<th class="py-3 px-6 font-medium text-center">Beban (Siang/Malam)</th>
						<th class="py-3 px-6 font-medium text-center">Beban Sekarang</th>
						<th class="py-3 px-6 font-medium">ULP</th>
						<th class="py-3 px-6 font-medium text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#if data.listPenyulang.length === 0}
						<tr>
							<td colspan="7" class="py-8 text-center text-slate-400">Belum ada data penyulang</td>
						</tr>
					{/if}
					{#each data.listPenyulang as row}
						{@const hour = new Date().getHours()}
						{@const currentBase = (hour >= 10 && hour < 19) ? row.bebanSiang : row.bebanMalam}
					<tr class="border-b border-slate-50 hover:bg-slate-50 transition">
						<td class="py-3 px-6 font-medium text-slate-800">{row.nama}</td>
						<td class="py-3 px-6 text-slate-600">
							<span class="inline-flex items-center gap-1.5 bg-[#00A2E9]/10 text-[#007BB5] px-2.5 py-1 rounded-md text-sm font-medium">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
								{row.garduInduk.nama}
							</span>
						</td>
						<td class="py-3 px-6 text-slate-500 text-sm">{row.trf || '-'}</td>
						<td class="py-3 px-6 text-center">
							<div class="flex flex-col text-[10px] font-bold text-slate-400">
								<span>S: {row.bebanSiang}A</span>
								<span>M: {row.bebanMalam}A</span>
							</div>
						</td>
						<td class="py-3 px-6 text-center">
							<div class={cn(
								"inline-flex flex-col items-center px-3 py-1 rounded-lg border",
								(row.bebanSekarang || 0) < currentBase ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 
								(row.bebanSekarang || 0) > currentBase ? 'bg-orange-50 text-orange-600 border-orange-100' :
								'bg-slate-50 text-slate-500 border-slate-100'
							)}>
								<span class="text-xs font-black">{row.bebanSekarang || 0}A</span>
							</div>
						</td>
						<td class="py-3 px-6">
							<span class="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-sm">{row.ulp}</span>
						</td>
						<td class="py-3 px-6 text-right">
							<form method="POST" action="?/delete" use:enhance class="inline">
								<input type="hidden" name="id" value={row.id}>
								<button type="submit" class="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition" title="Hapus">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</form>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
