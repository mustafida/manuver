<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex justify-between items-center mb-6">
	<h2 class="text-2xl font-bold text-slate-800">Master Data Gardu Induk</h2>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
	<!-- Form Tambah -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1 h-min">
		<h3 class="text-lg font-bold text-[#005B8F] mb-4">Tambah Gardu Induk</h3>
		<form method="POST" action="?/create" use:enhance class="space-y-4">
			<div>
				<label for="nama" class="block text-sm font-medium text-slate-600 mb-1">Nama Gardu Induk</label>
				<input type="text" id="nama" name="nama" required class="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#00A2E9] focus:ring focus:ring-[#00A2E9]/20 transition" placeholder="Masukkan nama...">
			</div>
			<button type="submit" class="w-full bg-[#00A2E9] hover:bg-[#007BB5] text-white font-medium py-2.5 rounded-xl transition hover:-translate-y-0.5 shadow-md shadow-[#00A2E9]/20">
				Simpan Data
			</button>
		</form>
	</div>

	<!-- List Gardu Induk -->
	<div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
					<th class="py-3 px-6 font-medium w-16 text-center">ID</th>
					<th class="py-3 px-6 font-medium">Nama Gardu Induk</th>
					<th class="py-3 px-6 font-medium text-right w-24">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#if data.records.length === 0}
					<tr>
						<td colspan="3" class="py-8 text-center text-slate-400">Belum ada data</td>
					</tr>
				{/if}
				{#each data.records as row}
				<tr class="border-b border-slate-50 hover:bg-slate-50 transition">
					<td class="py-3 px-6 text-center text-slate-400 text-sm">{row.id}</td>
					<td class="py-3 px-6 font-medium text-slate-700">{row.nama}</td>
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
