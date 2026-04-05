<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Function to get current datetime for input default
	const getNowStr = () => {
		const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
		return localISOTime;
	};
</script>

<div class="max-w-3xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold text-slate-800">Catat Manuver Beban</h2>
	</div>

	<div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
		<!-- Decorative bg element -->
		<div class="absolute right-0 top-0 w-64 h-64 bg-[#00A2E9]/5 rounded-bl-full pointer-events-none"></div>

		<form method="POST" action="?/create" use:enhance class="space-y-6 relative z-10">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Penyulang Asal -->
				<div>
					<label for="penyulangAsalId" class="block text-sm font-medium text-slate-600 mb-1">Penyulang Asal <span class="text-rose-500">*</span></label>
					<select id="penyulangAsalId" name="penyulangAsalId" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition">
						<option value="" disabled selected>Pilih penyulang...</option>
						{#each data.listPenyulang as p}
							<option value={p.id}>{p.nama} ({p.garduInduk.nama})</option>
						{/each}
					</select>
				</div>

				<!-- Penyulang Tujuan -->
				<div>
					<label for="penyulangTujuanId" class="block text-sm font-medium text-slate-600 mb-1">Penyulang Tujuan <span class="text-rose-500">*</span></label>
					<select id="penyulangTujuanId" name="penyulangTujuanId" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition">
						<option value="" disabled selected>Pilih penyulang...</option>
						{#each data.listPenyulang as p}
							<option value={p.id}>{p.nama} ({p.garduInduk.nama})</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
				<!-- Beban Ampere Manuver -->
				<div>
					<label for="bebanAmpereManuver" class="block text-sm font-medium text-slate-600 mb-1">Beban Manuver (Ampere) <span class="text-rose-500">*</span></label>
					<input type="number" step="0.01" id="bebanAmpereManuver" name="bebanAmpereManuver" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="0">
				</div>

				<!-- Beban Sebelum -->
				<div>
					<label for="bebanSebelum" class="block text-sm font-medium text-slate-600 mb-1">Beban Sebelum (Ampere) <span class="text-rose-500">*</span></label>
					<input type="number" step="0.01" id="bebanSebelum" name="bebanSebelum" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="0">
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
				<!-- Waktu Manuver -->
				<div>
					<label for="waktuManuver" class="block text-sm font-medium text-slate-600 mb-1">Waktu Mulai Manuver <span class="text-rose-500">*</span></label>
					<input type="datetime-local" id="waktuManuver" name="waktuManuver" required value={getNowStr()} class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition">
				</div>

				<!-- Keterangan -->
				<div class="md:col-span-2">
					<label for="keterangan" class="block text-sm font-medium text-slate-600 mb-1">Keterangan / Alasan Manuver</label>
					<textarea id="keterangan" name="keterangan" rows="3" class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="Tuliskan keterangan (opsional)..."></textarea>
				</div>
			</div>

			<div class="pt-4 text-right">
				<a href="/" class="inline-block px-6 py-2.5 rounded-xl font-medium text-slate-500 hover:text-slate-800 transition mr-4">Batal</a>
				<button type="submit" class="bg-[#00A2E9] hover:bg-[#007BB5] text-white font-medium px-8 py-2.5 rounded-xl transition hover:-translate-y-0.5 shadow-md shadow-[#00A2E9]/20 inline-flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
					Mulai Manuver
				</button>
			</div>
		</form>
	</div>
</div>
