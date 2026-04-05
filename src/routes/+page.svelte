<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
	<!-- Summary Card -->
	<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
		<h2 class="text-slate-500 font-medium mb-1">Manuver Aktif</h2>
		<div class="text-4xl font-bold text-[#00A2E9]">{data.activeManuvers.length}</div>
		<p class="text-sm text-slate-400 mt-2">Sedang berlangsung di seluruh gardu</p>
	</div>

	<!-- System Status Card -->
	<div class="bg-gradient-to-br from-[#00A2E9] to-[#005B8F] rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
		<div class="absolute right-[-10%] top-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
		<div class="relative z-10">
			<h2 class="font-medium mb-1 text-white/80">Status Keandalan Sistem</h2>
			<div class="text-2xl font-bold">Optimal</div>
			<div class="mt-4 inline-flex items-center gap-2 bg-white/20 py-1 px-3 rounded-full text-sm">
				<span class="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse"></span>
				Memantau {data.activeManuvers.length} titik
			</div>
		</div>
	</div>
</div>

<h2 class="text-xl font-bold text-slate-800 mb-4">Monitoring Manuver Aktif</h2>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
	{#if data.activeManuvers.length === 0}
		<div class="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
			<div class="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h3 class="text-lg font-medium text-slate-800">Tidak ada manuver aktif</h3>
			<p class="text-slate-500">Kondisi kelistrikan sedang normal.</p>
		</div>
	{:else}
		{#each data.activeManuvers as m}
		<div class="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-[#FFCC00] hover:shadow-md transition">
			<div class="flex justify-between items-start mb-4">
				<div>
					<span class="text-xs font-bold text-white bg-[#FFCC00] px-2 py-1 rounded-sm uppercase tracking-wider">Aktif</span>
					<div class="text-slate-400 text-sm mt-2">{new Date(m.waktuManuver).toLocaleString('id-ID')}</div>
				</div>
				<a href="/manuver/{m.id}/penormalan" class="text-sm font-medium text-[#00A2E9] bg-[#00A2E9]/10 px-3 py-1.5 rounded-lg hover:bg-[#00A2E9]/20 transition">
					Normalkan
				</a>
			</div>
			<div class="flex items-center gap-4 py-4 border-y border-slate-100 my-4 relative">
				<div class="flex-1">
					<div class="text-xs text-slate-500">Asal</div>
					<div class="font-bold text-slate-800 text-lg">{m.penyulangAsal.nama}</div>
				</div>
				<div class="px-2 text-slate-300">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</div>
				<div class="flex-1 text-right">
					<div class="text-xs text-slate-500">Tujuan</div>
					<div class="font-bold text-slate-800 text-lg">{m.penyulangTujuan.nama}</div>
				</div>
			</div>
			<div class="flex justify-between items-end">
				<div>
					<div class="text-xs text-slate-500 mb-1">Beban Ampere Manuver</div>
					<div class="text-2xl font-bold text-[#00A2E9]">{m.bebanAmpereManuver} <span class="text-base text-slate-500 font-normal">A</span></div>
				</div>
				<div class="text-right">
					<div class="text-xs text-slate-500 mb-1">Beban Sebelum</div>
					<div class="text-lg font-bold text-slate-700">{m.bebanSebelum} <span class="text-sm font-normal">A</span></div>
				</div>
			</div>
			{#if m.keterangan}
			<div class="mt-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
				{m.keterangan}
			</div>
			{/if}
		</div>
		{/each}
	{/if}
</div>

<h2 class="text-xl font-bold text-slate-800 mb-4">Riwayat Penormalan</h2>
<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-10">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
					<th class="py-3 px-4 font-medium">Tgl Manuver</th>
					<th class="py-3 px-4 font-medium">Tgl Normal</th>
					<th class="py-3 px-4 font-medium">Penyulang (Asal ➔ Tujuan)</th>
					<th class="py-3 px-4 font-medium text-right">Beban Manuver</th>
					<th class="py-3 px-4 font-medium text-right">Beban Sesudah</th>
				</tr>
			</thead>
			<tbody>
				{#each data.historyManuvers as h}
				<tr class="border-b border-slate-50 hover:bg-slate-50/50 transition">
					<td class="py-3 px-4 text-sm whitespace-nowrap text-slate-600">{new Date(h.waktuManuver).toLocaleString('id-ID')}</td>
					<td class="py-3 px-4 text-sm whitespace-nowrap text-slate-600">{h.waktuPenormalan ? new Date(h.waktuPenormalan).toLocaleString('id-ID') : '-'}</td>
					<td class="py-3 px-4">
						<span class="font-medium text-slate-700">{h.penyulangAsal.nama}</span>
						<span class="mx-1 text-slate-300">➔</span>
						<span class="font-medium text-slate-700">{h.penyulangTujuan.nama}</span>
					</td>
					<td class="py-3 px-4 text-right font-medium text-[#00A2E9]">{h.bebanAmpereManuver} A</td>
					<td class="py-3 px-4 text-right font-medium text-emerald-600">{h.bebanSesudah} A</td>
				</tr>
				{/each}
				{#if data.historyManuvers.length === 0}
				<tr>
					<td colspan="5" class="py-6 text-center text-slate-400 text-sm">Belum ada riwayat manuver</td>
				</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
