<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { 
		FileSpreadsheet, 
		Database, 
		CheckCircle2, 
		Activity,
		ArrowRight,
		Download,
		Filter,
		CalendarDays
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

	let selectedMonth = $state($page.url.searchParams.get('month') || 'all');
	let selectedYear = $state($page.url.searchParams.get('year') || new Date().getFullYear().toString());

	function applyFilter() {
		let query = new URLSearchParams();
		if (selectedMonth && selectedMonth !== 'all') query.set('month', selectedMonth);
		if (selectedYear && selectedYear !== 'all') query.set('year', selectedYear);
		goto(`?${query.toString()}`, { keepFocus: true, noScroll: true });
	}

	const months = [
		{ value: 'all', label: 'Semua Bulan' },
		{ value: '1', label: 'Januari' },
		{ value: '2', label: 'Februari' },
		{ value: '3', label: 'Maret' },
		{ value: '4', label: 'April' },
		{ value: '5', label: 'Mei' },
		{ value: '6', label: 'Juni' },
		{ value: '7', label: 'Juli' },
		{ value: '8', label: 'Agustus' },
		{ value: '9', label: 'September' },
		{ value: '10', label: 'Oktober' },
		{ value: '11', label: 'November' },
		{ value: '12', label: 'Desember' }
	];

	// Generate years from 2024 to current + 1
	const currentYear = new Date().getFullYear();
	const years = [{ value: 'all', label: 'Semua Tahun' }];
	for (let i = 2024; i <= currentYear + 1; i++) {
		years.push({ value: i.toString(), label: i.toString() });
	}

	let exportUrl = $derived(`/api/export?month=${selectedMonth}&year=${selectedYear}`);
</script>

<div class="space-y-8 animate-in fade-in duration-500">
	<!-- Header & Filters -->
	<div class="flex flex-col gap-6">
		<div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
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
				href={exportUrl}
				target="_blank"
				class="bg-[#10B981] hover:bg-[#059669] text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-[#10B981]/20 transition-all flex items-center justify-center gap-2 group self-start whitespace-nowrap"
			>
				<Download class="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
				Export ke Excel (.xlsx)
			</a>
		</div>

		<!-- Filters Panel -->
		<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
			<div class="flex items-center gap-2 text-slate-500 font-bold text-sm">
				<Filter class="w-4 h-4" />
				<span>Filter Laporan:</span>
			</div>
			
			<div class="flex flex-1 gap-3 w-full sm:w-auto">
				<div class="relative flex-1 sm:max-w-xs group">
					<div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00A2E9] transition-colors pointer-events-none">
						<CalendarDays class="w-4 h-4" />
					</div>
					<select 
						bind:value={selectedMonth}
						onchange={applyFilter}
						class="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00A2E9] focus:ring-2 focus:ring-[#00A2E9]/20 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
					>
						{#each months as month}
							<option value={month.value}>{month.label}</option>
						{/each}
					</select>
				</div>

				<div class="relative flex-1 sm:max-w-[150px] group">
					<select 
						bind:value={selectedYear}
						onchange={applyFilter}
						class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#00A2E9] focus:ring-2 focus:ring-[#00A2E9]/20 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
					>
						{#each years as year}
							<option value={year.value}>{year.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>
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
