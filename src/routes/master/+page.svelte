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
				<button class="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
					<Plus class="w-4 h-4" />
					Tambah GI
				</button>
			</div>

			<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-slate-400 border-b border-slate-100">
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest w-24">ID</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Nama Gardu Induk</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Penyulang</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest text-right">Aksi</th>
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
									<td class="py-5 px-6">
										<span class="bg-slate-100 text-slate-500 font-black text-[10px] px-3 py-1 rounded-full">{gi.penyulangCount} UNIT</span>
									</td>
									<td class="py-5 px-6 text-right">
										<form action="?/deleteGI" method="POST" use:enhance class="inline">
											<input type="hidden" name="id" value={gi.id}>
											<button 
												type="submit" 
												class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
												onclick={(e) => { if(!confirm('Yakin menghapus Gardu Induk ini?')) e.preventDefault(); }}
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</form>
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
				<button class="flex items-center gap-2 bg-[#00A2E9] hover:bg-[#0089C5] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
					<Plus class="w-4 h-4" />
					Tambah Penyulang
				</button>
			</div>

			<div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-slate-400 border-b border-slate-100">
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest w-24">ID</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Penyulang</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">Gardu Induk</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest">ULP</th>
							<th class="py-4 px-6 font-black uppercase text-[10px] tracking-widest text-right">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#if data.listPenyulang.length === 0}
							<tr>
								<td colspan="5" class="py-8 text-center text-slate-400 font-medium">Belum ada data Penyulang.</td>
							</tr>
						{:else}
							{#each data.listPenyulang as p}
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
									<td class="py-4 px-6">
										<p class="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded inline-block">{p.ulp}</p>
									</td>
									<td class="py-4 px-6 text-right">
										<form action="?/deletePenyulang" method="POST" use:enhance class="inline">
											<input type="hidden" name="id" value={p.id}>
											<button 
												type="submit" 
												class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
												onclick={(e) => { if(!confirm('Yakin menghapus Penyulang ini?')) e.preventDefault(); }}
											>
												<Trash2 class="w-4 h-4" />
											</button>
										</form>
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
