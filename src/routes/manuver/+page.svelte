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
		ArrowRight,
		Trash2,
		FileEdit
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	import { formatDisplayDate } from '$lib/utils/date';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let filterStatus = $state('All');

	let filteredManuvers = $derived(
		data.listManuver.filter((m) => {
			const matchesSearch =
				(m.penyulangAsalNama?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
				(m.penyulangTujuanNama?.toLowerCase() || '').includes(searchQuery.toLowerCase());
			const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
			return matchesSearch && matchesStatus;
		})
	);
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
		<div class="group bg-gradient-to-br from-white to-slate-50 p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
			<div class="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#00A2E9] shadow-inner">
				<Database class="w-8 h-8" />
			</div>
			<div>
				<p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2">Total Record</p>
				<h3 class="text-4xl font-black text-slate-800 tracking-tighter">{data.stats.total}</h3>
			</div>
		</div>

		<div class="group bg-gradient-to-br from-white to-red-50/30 p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 border-l-8 border-l-red-500 transition-all hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1">
			<div class="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
				<Activity class="w-8 h-8 animate-pulse" />
			</div>
			<div>
				<p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2">Sedang Manuver</p>
				<h3 class="text-4xl font-black text-red-600 tracking-tighter">{data.stats.active}</h3>
			</div>
		</div>

		<div class="group bg-gradient-to-br from-white to-emerald-50/30 p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 border-l-8 border-l-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
			<div class="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
				<CheckCircle2 class="w-8 h-8" />
			</div>
			<div>
				<p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-2">Sudah Normal</p>
				<h3 class="text-4xl font-black text-emerald-600 tracking-tighter">{data.stats.normal}</h3>
			</div>
		</div>
	</div>

	<!-- Filter & Search Bar -->
	<div class="bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white flex flex-col md:flex-row gap-3">
		<div class="flex-1 relative group">
			<div class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#00A2E9]">
				<Search class="w-5 h-5" />
			</div>
			<input 
				type="text" 
				placeholder="Cari Penyulang atau ULP..." 
				bind:value={searchQuery}
				class="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-[#00A2E9]/30 focus:ring-8 focus:ring-[#00A2E9]/5 transition-all font-bold text-slate-700 placeholder:text-slate-400"
			/>
		</div>

		<div class="flex gap-2">
			<div class="relative min-w-[200px]">
				<div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
					<Filter class="w-4 h-4" />
				</div>
				<select 
					bind:value={filterStatus}
					class="w-full pl-11 pr-10 py-4 bg-slate-100/50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-[#00A2E9]/30 transition-all font-black text-slate-600 text-xs uppercase tracking-widest appearance-none cursor-pointer"
				>
					<option value="All">Semua Status</option>
					<option value="AKTIF">Sedang Manuver</option>
					<option value="NORMAL">Normal</option>
				</select>
				<div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
					<MoreVertical class="w-4 h-4" />
				</div>
			</div>
		</div>
	</div>

	<!-- Premium Dashboard Body -->
	<div class="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
		<!-- Category Header Bar (PLN Blue) -->
		<div class="bg-[#005B8F] text-white py-4 px-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] sticky top-0 z-30">
			<div class="w-[32%]">Penyulang (Asal &rarr; Tujuan)</div>
			<div class="w-[7%] text-center">Status</div>
			<div class="w-[16%] text-center bg-white/10 py-1 rounded-lg">Detail Manuver</div>
			<div class="w-[14%] text-center bg-white/10 py-1 rounded-lg">Detail Normal</div>
			<div class="w-[7%] text-center">Beban</div>
			<div class="w-[9%] text-center">Waktu Log</div>
			<div class="w-[5%] text-center">Durasi</div>
			<div class="w-[10%] text-center">Aksi</div>
		</div>

		<div class="divide-y divide-slate-100 italic-last-row">
			{#if filteredManuvers.length === 0}
				<div class="py-24 text-center space-y-4">
					<div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
						<Database class="w-10 h-10" />
					</div>
					<p class="text-slate-400 font-black uppercase tracking-[0.25em] text-[10px]">Data tidak ditemukan</p>
				</div>
			{:else}
				{#each filteredManuvers as m, index}
					<div class="hover:bg-slate-50/50 transition-all group flex items-center px-10 py-6 gap-4 relative">
						<!-- Progress Line (Left) -->
						<div class={cn(
							"absolute left-0 top-0 bottom-0 w-1.5 transition-all",
							m.status === 'AKTIF' ? "bg-red-500 animate-pulse" : "bg-emerald-500"
						)}></div>

						<!-- 1. Feeder Block -->
						<div class="w-[32%] flex flex-col gap-1 pr-2">
							<div class="flex items-center gap-2">
								<div class="flex flex-col min-w-[40%] flex-1 overflow-hidden">
									<span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate" title={m.penyulangAsalUlp}>{m.penyulangAsalUlp}</span>
									<span class="text-sm font-black text-slate-800 leading-tight truncate" title={m.penyulangAsalNama}>{m.penyulangAsalNama}</span>
								</div>
								<div class="px-2 flex-shrink-0">
									<ArrowRight class="w-4 h-4 text-[#00A2E9]" />
								</div>
								<div class="flex flex-col min-w-[40%] flex-1 items-end text-right overflow-hidden">
									<span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate" title={m.penyulangTujuanUlp}>{m.penyulangTujuanUlp}</span>
									<span class="text-sm font-black text-slate-800 leading-tight truncate" title={m.penyulangTujuanNama}>{m.penyulangTujuanNama}</span>
								</div>
							</div>
							<div class="text-[9px] font-bold text-slate-400 italic truncate" title={m.keterangan}>
								{m.keterangan || '-'}
							</div>
						</div>

						<!-- 2. Status Badge -->
						<div class="w-[7%] flex justify-center">
							{#if m.status === 'AKTIF'}
								<div class="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-full border border-red-100 flex items-center gap-1.5 shadow-sm">
									<div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
									<span class="text-[8px] font-black uppercase tracking-widest">Aktif</span>
								</div>
							{:else}
								<div class="px-2.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-1.5 shadow-sm">
									<CheckCircle2 class="w-3 h-3" />
									<span class="text-[8px] font-black uppercase tracking-widest">Normal</span>
								</div>
							{/if}
						</div>

						<!-- 3. Maneuver Cluster -->
						<div class="w-[16%] bg-indigo-50/20 rounded-2xl p-3 border border-indigo-100/50 flex flex-col gap-2">
							<div class="flex items-center justify-between gap-2 overflow-hidden">
								<div class="flex items-center gap-1.5 overflow-hidden">
									<span class="text-[7px] font-black text-indigo-400 bg-white px-1 rounded border border-indigo-100 flex-shrink-0">ASAL</span>
									<span class="text-[10px] font-black text-indigo-900 truncate">{m.sectionAsal || '-'}</span>
								</div>
								<div class="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-bold uppercase whitespace-nowrap">
									{m.pelaksanaanAsal || '-'}
								</div>
							</div>
							<div class="h-[1px] bg-indigo-100/50"></div>
							<div class="flex items-center justify-between gap-2 overflow-hidden">
								<div class="flex items-center gap-1.5 overflow-hidden">
									<span class="text-[7px] font-black text-amber-500 bg-white px-1 rounded border border-amber-100 flex-shrink-0">TUJU</span>
									<span class="text-[10px] font-black text-amber-900 truncate">{m.sectionTujuan || '-'}</span>
								</div>
								<div class="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[8px] font-bold uppercase whitespace-nowrap">
									{m.pelaksanaanTujuan || '-'}
								</div>
							</div>
						</div>

						<!-- 4. Normal Cluster -->
						<div class="w-[14%] px-2">
							{#if m.status === 'NORMAL'}
								<div class="bg-emerald-50/20 rounded-2xl p-3 border border-emerald-100/50 flex flex-col gap-2">
									<div class="flex items-center justify-between gap-2 overflow-hidden">
										<div class="flex items-center gap-1.5 overflow-hidden">
											<span class="text-[7px] font-black text-emerald-500 bg-white px-1 rounded border border-emerald-100 flex-shrink-0">SEC-A</span>
											<span class="text-[10px] font-black text-emerald-900 truncate">{m.sectionAsalPenormalan || '-'}</span>
										</div>
										<div class="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[8px] font-bold uppercase whitespace-nowrap">
											{m.pelaksanaanAsalPenormalan || '-'}
										</div>
									</div>
									<div class="h-[1px] bg-emerald-100/50"></div>
									<div class="flex items-center justify-between gap-2 overflow-hidden">
										<div class="flex items-center gap-1.5 overflow-hidden">
											<span class="text-[7px] font-black text-teal-500 bg-white px-1 rounded border border-teal-100 flex-shrink-0">SEC-T</span>
											<span class="text-[10px] font-black text-teal-900 truncate">{m.sectionTujuanPenormalan || '-'}</span>
										</div>
										<div class="px-1.5 py-0.5 bg-teal-600 text-white rounded text-[8px] font-bold uppercase whitespace-nowrap">
											{m.pelaksanaanTujuanPenormalan || '-'}
										</div>
									</div>
								</div>
							{:else}
								<div class="h-full flex items-center justify-center">
									<span class="text-[9px] font-black text-slate-200 tracking-[0.2em] uppercase italic">Menunggu</span>
								</div>
							{/if}
						</div>

						<!-- 5. Beban -->
						<div class="w-[7%] flex flex-col items-center justify-center">
							<div class="flex items-baseline gap-1">
								<span class="text-xl font-black text-slate-700 tabular-nums leading-none">{m.bebanAmpereManuver}</span>
								<span class="text-[9px] font-black text-slate-300">A</span>
							</div>
							<span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Ampere</span>
						</div>

						<!-- 6. Waktu Log -->
						<div class="w-[9%] flex flex-col items-center justify-center text-center gap-1.5 border-l border-slate-50 px-2">
							<!-- Start Phase (Manuver) -->
							<div class="flex flex-col items-center leading-none">
								<span class="text-[11px] font-black text-slate-700">{m.waktuManuverJam}</span>
								<span class="text-[7.5px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{m.waktuManuverTanggal}</span>
							</div>

							{#if m.status === 'NORMAL'}
								<div class="flex flex-col items-center leading-none pt-1.5 border-t border-slate-100 w-full mt-0.5">
									<span class="text-[11px] font-black text-emerald-600">{m.waktuPenormalanJam}</span>
									<span class="text-[7.5px] font-black text-emerald-500 uppercase tracking-tighter mt-0.5">{m.waktuPenormalanTanggal}</span>
								</div>
							{:else}
								<div class="flex flex-col items-center opacity-20">
									<ArrowRight class="w-2 h-2 rotate-90" />
									<span class="text-[7.5px] font-black uppercase tracking-widest text-slate-300 italic">Antri</span>
								</div>
							{/if}
						</div>

						<!-- 7. Durasi -->
						<div class="w-[5%] flex flex-col items-center justify-center border-l border-slate-50">
							{#if m.status === 'NORMAL'}
								<span class="text-lg font-black text-slate-800 leading-none">{m.durasi}</span>
								<span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Mnt</span>
							{:else}
								<span class="text-[8.5px] font-black text-red-300 italic uppercase">Log</span>
							{/if}
						</div>

						<!-- 8. Aksi -->
						<div class="w-[10%] flex items-center justify-center gap-1.5 px-2">
							{#if m.status === 'AKTIF'}
								<a 
									href="/manuver/{m.id}/penormalan"
									class="bg-[#00A2E9] hover:bg-[#0070C0] text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all group/btn"
									title="Normalkan"
								>
									<CheckCircle2 class="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
								</a>
							{/if}
							<a 
								href="/manuver/{m.id}/edit"
								class="p-1.5 text-slate-300 hover:text-amber-500 transition-all rounded-lg"
								title="Edit Manuver"
							>
								<FileEdit class="w-3.5 h-3.5" />
							</a>
							<form action="?/delete" method="POST" use:enhance>
								<input type="hidden" name="id" value={m.id}>
								<button 
									type="submit" 
									class="p-1.5 text-slate-200 hover:text-red-500 transition-all rounded-lg"
									onclick={(e) => { if(!confirm('Yakin ingin menghapus data manuver ini?')) e.preventDefault(); }}
								>
									<Trash2 class="w-3.5 h-3.5" />
								</button>
							</form>
						</div>
					</div>
				{/each}
			{/if}
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
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f8fafc;
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
		transition: all 0.3s;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #00A2E9;
	}
	
	:global(.animate-in) {
		animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	
	.slide-in {
		animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateX(-20px); }
		to { opacity: 1; transform: translateX(0); }
	}
</style>
