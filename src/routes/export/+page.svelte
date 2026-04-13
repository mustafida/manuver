<script lang="ts">
	import type { PageData } from './$types';
	import { 
		FileSpreadsheet, 
		Database, 
		CheckCircle2, 
		Activity,
		ArrowRight,
		Download
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data }: { data: PageData } = $props();
	import { formatDisplayDate } from '$lib/utils/date';

	function formatDate(date: string | Date | null) {
		return formatDisplayDate(date, { includeTime: true, shortMonth: true });
	}
</script>

<div class="space-y-8 animate-in fade-in duration-500">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div class="flex items-center gap-4">
			<div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
				<FileSpreadsheet class="w-6 h-6" />
			</div>
			<div>
				<h1 class="text-3xl font-black text-slate-800 tracking-tight">Export Data Manuver</h1>
				<p class="text-slate-500 font-medium">Rekapitulasi seluruh riwayat manuver beserta waktu penormalan</p>
			</div>
		</div>
		<a 
			href="/api/export" 
			target="_blank"
			class="bg-[#10B981] hover:bg-[#059669] text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-[#10B981]/20 transition-all flex items-center justify-center gap-2 group"
		>
			<Download class="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
			Export ke Excel (.xlsx)
		</a>
	</div>

	<!-- Data Table -->
	<div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto custom-scrollbar">
			<table class="w-full text-left border-collapse min-w-max">
				<thead>
					<tr class="bg-[#005B8F] text-white">
						<th rowspan="2" class="py-4 px-4 font-bold text-sm uppercase tracking-wider text-center border-r border-white/10 first:rounded-tl-3xl">NO</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Existing (Asal)</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Manuver Ke (Tujuan)</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Section Manuver</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Metode Eksekusi</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Beban (Ampere)</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Waktu Manuver</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Waktu Normal</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Section Normal</th>
						<th colspan="2" class="py-2 px-4 font-bold text-sm uppercase tracking-wider text-center border-b border-r border-white/10">Metode Normal</th>
						<th rowspan="2" class="py-4 px-4 font-bold text-sm uppercase tracking-wider text-center border-r border-white/10">Durasi (Menit)</th>
						<th rowspan="2" class="py-4 px-4 font-bold text-sm uppercase tracking-wider text-center last:rounded-tr-3xl">Keterangan</th>
					</tr>
					<tr class="bg-[#0070C0] text-white">
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">ULP</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Penyulang</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">ULP</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Penyulang</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Section Asal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Section Tujuan</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Asal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Tujuan</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Beban Existing</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Beban Manuver</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Tanggal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Jam</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Tanggal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Jam</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Section Asal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Section Tujuan</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Eksekusi Asal</th>
						<th class="py-2 px-4 font-bold text-xs uppercase text-center border-r border-white/10">Eksekusi Tujuan</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 tabular-nums">
					{#if data.listManuver.length === 0}
						<tr>
							<td colspan="20" class="py-20 text-center space-y-4">
								<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
									<Database class="w-8 h-8" />
								</div>
								<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada data riwayat manuver.</p>
							</td>
						</tr>
					{:else}
						{#each data.listManuver as m, index}
							<tr class="hover:bg-slate-50 transition-colors">
								<td class="py-4 px-4 text-center font-black text-slate-400 text-xs border-r border-slate-50">
									{index + 1}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-slate-500 border-r border-slate-50">
									{m.penyulangAsalUlp}
								</td>
								<td class="py-4 px-4 font-black text-slate-800 text-sm border-r border-slate-50">
									{m.penyulangAsalNama}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-slate-500 border-r border-slate-50">
									{m.penyulangTujuanUlp}
								</td>
								<td class="py-4 px-4 font-black text-slate-800 text-sm border-r border-slate-50">
									{m.penyulangTujuanNama}
								</td>
								
								<td class="py-4 px-4 text-center text-xs font-bold text-indigo-600 bg-indigo-50/30 border-r border-slate-50 uppercase">
									{m.sectionAsal || '-'}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-amber-600 bg-amber-50/30 border-r border-slate-50 uppercase">
									{m.sectionTujuan || '-'}
								</td>

								<td class="py-4 px-4 text-center text-xs font-bold text-indigo-600 border-r border-slate-50 uppercase">
									{m.pelaksanaanAsal || '-'}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-amber-600 border-r border-slate-50 uppercase">
									{m.pelaksanaanTujuan || '-'}
								</td>

								<td class="py-4 px-4 text-right font-bold text-slate-700 text-sm border-r border-slate-50 tabular-nums">
									{m.bebanSebelum}
								</td>
								<td class="py-4 px-4 text-right font-black text-blue-600 text-sm border-r border-slate-50 tabular-nums">
									{m.bebanAmpereManuver}
								</td>

								<td class="py-4 px-4 text-center text-xs font-bold text-slate-600 border-r border-slate-50">
									{m.waktuManuverTanggal}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-slate-600 border-r border-slate-50">
									{m.waktuManuverJam}
								</td>

								<td class="py-4 px-4 text-center text-xs font-bold text-emerald-600 border-r border-slate-50">
									{m.waktuPenormalanTanggal || '-'}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-emerald-600 border-r border-slate-50">
									{m.waktuPenormalanJam || '-'}
								</td>

								<td class="py-4 px-4 text-center text-xs font-bold text-emerald-600 bg-emerald-50/30 border-r border-slate-50 uppercase">
									{m.sectionAsalPenormalan || '-'}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-teal-600 bg-teal-50/30 border-r border-slate-50 uppercase">
									{m.sectionTujuanPenormalan || '-'}
								</td>

								<td class="py-4 px-4 text-center text-xs font-bold text-emerald-600 border-r border-slate-50 uppercase">
									{m.pelaksanaanAsalPenormalan || '-'}
								</td>
								<td class="py-4 px-4 text-center text-xs font-bold text-teal-600 border-r border-slate-50 uppercase">
									{m.pelaksanaanTujuanPenormalan || '-'}
								</td>

								<td class="py-4 px-4 text-center border-r border-slate-50">
									{#if m.durasi !== null && m.durasi !== undefined}
										<span class="font-bold text-slate-800 text-sm">{m.durasi}m</span>
									{:else}
										<span class="text-orange-500 text-xs font-black italic">AKTIF</span>
									{/if}
								</td>

								<td class="py-4 px-4 text-sm text-slate-600 max-w-[200px] truncate" title={m.keterangan}>
									{m.keterangan || '-'}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<div class="bg-slate-50 px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
			Total {data.listManuver.length} Data Record
		</div>
	</div>
</div>

<style>
	:global(.animate-in) {
		animation: fadeIn 0.5s ease-out forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.custom-scrollbar::-webkit-scrollbar {
		height: 8px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f5f9;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 10px;
	}
</style>
