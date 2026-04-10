<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { 
		Database, 
		Plus, 
		Trash2, 
		Activity, 
		AlertTriangle
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data, form }: { data: PageData, form: ActionData } = $props();

	let activeTab = $state<'gi' | 'penyulang'>('gi');

	// Current load type based on time: Siang (10-19), Malam (19-10)
	function getCurrentLoadType() {
		const hour = new Date().getHours();
		if (hour >= 10 && hour < 19) return 'siang';
		return 'malam';
	}

	let loadType = $derived(getCurrentLoadType());
</script>

<div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
	<!-- Title and Tab Controls -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
		<div class="space-y-1">
			<h1 class="text-3xl font-black text-slate-800 tracking-tight">Data Master</h1>
			<p class="text-slate-500 font-medium">Kelola data Gardu Induk dan Penyulang Aktif</p>
		</div>

		<div class="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-1">
			<button 
				type="button" 
				onclick={() => activeTab = 'gi'}
				class={cn(
					"px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
					activeTab === 'gi' ? "bg-white text-[#005B8F] border border-blue-100 shadow-sm" : "text-slate-400 hover:text-slate-600 border border-transparent"
				)}
			>
				Gardu Induk
			</button>
			<button 
				type="button" 
				onclick={() => activeTab = 'penyulang'}
				class={cn(
					"px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
					activeTab === 'penyulang' ? "bg-white text-[#005B8F] border border-blue-100 shadow-sm" : "text-slate-400 hover:text-slate-600 border border-transparent"
				)}
			>
				Penyulang
			</button>
		</div>
	</div>

	{#if form?.message}
		<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-4 shadow-sm">
			<AlertTriangle class="w-5 h-5 flex-shrink-0" />
			<p class="font-bold">{form.message}</p>
		</div>
	{/if}

	<!-- Tab 1: Gardu Induk -->
	{#if activeTab === 'gi'}
		<div class="space-y-4 slide-in">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-[#005B8F]">
					<Database class="w-5 h-5" />
					<h2 class="text-lg font-bold">Daftar Gardu Induk</h2>
				</div>

			</div>

			<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-slate-400 border-b border-slate-100">
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest w-24">ID</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Nama Gardu Induk</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest text-right">Penyulang</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#if data.listGarduInduk.length === 0}
							<tr>
								<td colspan="4" class="py-8 text-center text-slate-400 font-medium">Belum ada data Gardu Induk.</td>
							</tr>
						{:else}
							{#each data.listGarduInduk as gi}
								<tr class="hover:bg-slate-50 transition-colors group">
									<td class="py-5 px-6">
										<span class="text-slate-300 font-bold text-xs">#{gi.id}</span>
									</td>
									<td class="py-5 px-6">
										<p class="font-black text-slate-700">{gi.nama}</p>
									</td>
									<td class="py-5 px-6 text-right">
										<span class="bg-slate-100 text-slate-500 font-black text-[10px] px-3 py-1 rounded-full">{gi.penyulangCount} UNIT</span>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Tab 2: Penyulang -->
	{#if activeTab === 'penyulang'}
		<div class="space-y-4 slide-in">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-[#00A2E9]">
					<Activity class="w-5 h-5" />
					<h2 class="text-lg font-bold">Daftar Penyulang</h2>
				</div>

			</div>

			<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-slate-400 border-b border-slate-100">
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest w-24">ID</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Penyulang</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Gardu Induk</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest text-center">Beban (Asli/Sisa)</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#if data.listPenyulang.length === 0}
							<tr>
								<td colspan="5" class="py-8 text-center text-slate-400 font-medium">Belum ada data Penyulang.</td>
							</tr>
						{:else}
							{#each data.listPenyulang as p}
								{@const baseLoad = loadType === 'siang' ? p.bebanSiang : p.bebanMalam}
								<tr class="hover:bg-slate-50 transition-colors group">
									<td class="py-4 px-6">
										<span class="text-slate-300 font-bold text-xs">#{p.id}</span>
									</td>
									<td class="py-4 px-6">
										<p class="font-black text-slate-700">{p.nama}</p>
									</td>
									<td class="py-4 px-6">
										<p class="text-xs font-bold text-slate-500">{p.garduIndukNama || '-'}</p>
									</td>
									<td class="py-4 px-6 text-center group-hover:bg-slate-50/50">
										<div class={cn(
											"inline-flex flex-col items-center px-4 py-2 rounded-2xl transition-all border shadow-sm",
											p.bebanSekarang < baseLoad ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : 
											p.bebanSekarang > baseLoad ? "bg-orange-50 text-orange-600 border-orange-100" :
											"bg-slate-50 text-slate-500 border-slate-100"
										)}>
											<div class="flex items-center gap-1.5 mb-1">
												<span class="text-[9px] font-black uppercase tracking-widest opacity-60">Status:</span>
												<span class="text-[9px] font-black uppercase tracking-widest">
													{p.bebanSekarang < baseLoad ? 'MA-NUVER' : p.bebanSekarang > baseLoad ? 'MEMIKUL' : 'NORMAL'}
												</span>
											</div>
											<div class="flex items-baseline gap-1">
												<span class="text-lg font-black tabular-nums">{p.bebanSekarang}</span>
												<span class="text-[10px] font-bold opacity-60">AMPERE</span>
											</div>
											<div class="mt-1.5 pt-1.5 border-t border-current/10 w-full flex justify-between gap-4 text-[9px] font-bold uppercase tracking-tighter opacity-70">
												<span class={cn(loadType === 'siang' && "text-blue-600")}>Siang: {p.bebanSiang}A</span>
												<span class={cn(loadType === 'malam' && "text-blue-600")}>Malam: {p.bebanMalam}A</span>
											</div>
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.animate-in) {
		animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	
	.slide-in {
		animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
