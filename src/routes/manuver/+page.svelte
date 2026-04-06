<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { 
		Plus, 
		Search, 
		Filter, 
		MoreVertical, 
		Activity, 
		CheckCircle2, 
		AlertCircle,
		Database,
		ChevronLeft,
		ChevronRight,
		ArrowRight
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let filterStatus = $state('ALL'); // ALL, AKTIF, NORMAL

	const filteredManuvers = $derived(
		data.listManuver.filter(m => {
			const matchesSearch = 
				m.penyulangAsal.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.penyulangTujuan.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.penyulangAsal.ulp.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesFilter = filterStatus === 'ALL' || m.status === filterStatus;
			
			return matchesSearch && matchesFilter;
		})
	);

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
		<div>
			<h1 class="text-3xl font-black text-slate-800 tracking-tight">Data Manuver Beban</h1>
			<p class="text-slate-500 font-medium">Kelola dan pantau seluruh riwayat manuver jaringan</p>
		</div>
		<a 
			href="/manuver/input" 
			class="bg-[#FFCC00] hover:bg-[#E6B800] text-[#005B8F] font-black px-6 py-3 rounded-2xl shadow-lg shadow-[#FFCC00]/20 transition-all flex items-center justify-center gap-2 group"
		>
			<Plus class="w-5 h-5 group-hover:rotate-90 transition-transform" />
			Tambah Data Manuver
		</a>
	</div>

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
			<div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#00A2E9]">
				<Database class="w-7 h-7" />
			</div>
			<div>
				<p class="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">Total Record</p>
				<h3 class="text-3xl font-black text-slate-800">{data.stats.total}</h3>
			</div>
		</div>

		<div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 border-l-4 border-l-red-500">
			<div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
				<Activity class="w-7 h-7 animate-pulse" />
			</div>
			<div>
				<p class="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">Sedang Manuver</p>
				<h3 class="text-3xl font-black text-red-600">{data.stats.active}</h3>
			</div>
		</div>

		<div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 border-l-4 border-l-emerald-500">
			<div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
				<CheckCircle2 class="w-7 h-7" />
			</div>
			<div>
				<p class="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none mb-1">Sudah Normal</p>
				<h3 class="text-3xl font-black text-emerald-600">{data.stats.normal}</h3>
			</div>
		</div>
	</div>

	<!-- Filter & Search Bar -->
	<div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
		<div class="flex-1 relative">
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
				<Search class="w-5 h-5" />
			</div>
			<input 
				type="text" 
				placeholder="Cari Penyulang atau ULP..." 
				bind:value={searchQuery}
				class="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-medium text-slate-700"
			/>
		</div>

		<div class="flex gap-2">
			<select 
				bind:value={filterStatus}
				class="bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-600 text-sm appearance-none min-w-[140px]"
			>
				<option value="ALL">Semua Status</option>
				<option value="AKTIF">Sedang Manuver</option>
				<option value="NORMAL">Normal</option>
			</select>
		</div>
	</div>

	<!-- Data Table -->
	<div class="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left">
				<thead>
					<tr class="bg-[#005B8F] text-white">
						<th class="py-5 px-6 font-bold text-xs uppercase tracking-widest first:rounded-tl-3xl">Penyulang (Asal ➔ Tujuan)</th>
						<th class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-center">ULP</th>
						<th class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-center">Status</th>
						<th class="py-5 px-6 font-bold text-xs uppercase tracking-widest text-right">Beban (Ampere)</th>
						<th class="py-5 px-6 font-bold text-xs uppercase tracking-widest last:rounded-tr-3xl text-right">Waktu Manuver</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-50">
					{#if filteredManuvers.length === 0}
						<tr>
							<td colspan="5" class="py-20 text-center space-y-4">
								<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
									<Database class="w-8 h-8" />
								</div>
								<p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Tidak ada data penyulang</p>
							</td>
						</tr>
					{:else}
						{#each filteredManuvers as m}
							<tr class="hover:bg-slate-50/80 transition-colors group cursor-pointer border-l-4 border-l-transparent hover:border-l-[#00A2E9]">
								<td class="py-5 px-6">
									<div class="flex items-center gap-3">
										<div class={cn(
											"w-2 h-2 rounded-full",
											m.status === 'AKTIF' ? "bg-red-500 animate-pulse" : "bg-emerald-500"
										)}></div>
										<div class="flex items-center gap-2">
											<span class="font-black text-slate-800">{m.penyulangAsal.nama}</span>
											<ArrowRight class="w-3 h-3 text-slate-300" />
											<span class="font-bold text-slate-600">{m.penyulangTujuan.nama}</span>
										</div>
									</div>
								</td>
								<td class="py-5 px-6 text-center">
									<span class="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
										{m.penyulangAsal.ulp}
									</span>
								</td>
								<td class="py-5 px-6 text-center">
									<span class={cn(
										"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
										m.status === 'AKTIF' 
											? "bg-red-50 text-red-600 ring-1 ring-red-100" 
											: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
									)}>
										{#if m.status === 'AKTIF'}
											<Activity class="w-3 h-3" />
											SEDANG MANUVER
										{:else}
											<CheckCircle2 class="w-3 h-3" />
											NORMAL
										{/if}
									</span>
								</td>
								<td class="py-5 px-6 text-right">
									<span class="font-black text-slate-800 tabular-nums">{m.bebanAmpereManuver}</span>
									<span class="text-[10px] font-bold text-slate-400 ml-1">A</span>
								</td>
								<td class="py-5 px-6 text-right">
									<div class="flex flex-col items-end">
										<span class="text-sm font-black text-slate-700 leading-none mb-1">{formatDate(m.waktuManuver)}</span>
										{#if m.status === 'NORMAL'}
											<span class="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
												<CheckCircle2 class="w-2.5 h-2.5" />
												Selesai: {formatDate(m.waktuPenormalan)}
											</span>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Footer / Pagination -->
		<div class="bg-white border-t border-slate-50 px-8 py-5 flex items-center justify-between">
			<p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
				Showing {filteredManuvers.length} to {filteredManuvers.length} of {filteredManuvers.length} entries
			</p>
			
			<div class="flex gap-2">
				<button class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30" disabled>
					<ChevronLeft class="w-5 h-5" />
				</button>
				<button class="w-10 h-10 rounded-xl bg-[#00A2E9] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#00A2E9]/20">
					1
				</button>
				<button class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
					<ChevronRight class="w-5 h-5" />
				</button>
			</div>
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
</style>
