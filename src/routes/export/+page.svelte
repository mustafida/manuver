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

	function formatDate(date: string | Date | null) {
		if (!date) return '-';
		return new Date(date).toLocaleString('id-ID', { 
			day: '2-digit', 
			month: 'short', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
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
			<table class="w-full text-left whitespace-nowrap min-w-max">
				<thead>
					<tr class="bg-[#005B8F] text-white">
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest first:rounded-tl-3xl">Penyulang Asal</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Tujuan</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Status</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-right">Beban Manuver</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Section</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Waktu Manuver</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Waktu Penormalan</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest text-center">Pelaksanaan</th>
						<th class="py-4 px-6 font-bold text-xs uppercase tracking-widest last:rounded-tr-3xl text-center">Keterangan</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-50">
					{#if data.listManuver.length === 0}
						<tr>
							<td colspan="9" class="py-20 text-center space-y-4">
								<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
									<Database class="w-8 h-8" />
								</div>
								<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada data riwayat manuver.</p>
							</td>
						</tr>
					{:else}
						{#each data.listManuver as m}
							<tr class="hover:bg-slate-50 transition-colors">
								<td class="py-4 px-6 font-black text-slate-700">{m.penyulangAsal.nama}</td>
								<td class="py-4 px-6 font-bold text-slate-600 text-center flex justify-center items-center gap-2">
									<ArrowRight class="w-3 h-3 text-slate-300" />
									{m.penyulangTujuan.nama}
								</td>
								<td class="py-4 px-6 text-center">
									<span class={cn(
										"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
										m.status === 'AKTIF' 
											? "bg-red-50 text-red-600 ring-1 ring-red-100" 
											: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
									)}>
										{#if m.status === 'AKTIF'}
											<Activity class="w-3 h-3" /> Aktif
										{:else}
											<CheckCircle2 class="w-3 h-3" /> Normal
										{/if}
									</span>
								</td>
								<td class="py-4 px-6 text-right font-black text-slate-800">{m.bebanAmpereManuver} A</td>
								<td class="py-4 px-6 text-center text-xs font-bold text-slate-500">
									{m.section || '-'}
								</td>
								<td class="py-4 px-6 text-center text-sm font-bold text-slate-700">{formatDate(m.waktuManuver)}</td>
								<td class="py-4 px-6 text-center text-sm font-bold text-emerald-600">{formatDate(m.waktuPenormalan)}</td>
								<td class="py-4 px-6 text-center text-xs font-medium text-slate-600">{m.pelaksanaan || '-'}</td>
								<td class="py-4 px-6 text-center text-xs text-slate-500 max-w-[200px] truncate" title={m.keterangan || ''}>{m.keterangan || '-'}</td>
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
