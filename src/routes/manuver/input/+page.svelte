<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { 
		ArrowLeft, 
		Zap, 
		Save, 
		Search, 
		CheckCircle2, 
		AlertTriangle,
		Info,
		Calendar,
		User,
		MapPin,
		Activity,
		ArrowRight,
		Layers,
		Download,
		FileEdit,
		History
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data, form }: { data: PageData, form: ActionData } = $props();

	// Tabs logic
	let activeTab = $state<'input' | 'riwayat'>('input');

	// Dropdown states
	const ulps = [...new Set(data.listPenyulang.map(p => p.ulp))];
	
	let selectedUlpAsal = $state('');
	let selectedUlpTujuan = $state('');
	let selectedAsalId = $state<number | null>(null);
	let selectedTujuanId = $state<number | null>(null);

	const penyulangsAsal = $derived(
		data.listPenyulang.filter(p => selectedUlpAsal ? p.ulp === selectedUlpAsal : true)
	);

	const penyulangsTujuan = $derived(
		data.listPenyulang.filter(p => selectedUlpTujuan ? p.ulp === selectedUlpTujuan : true)
	);

	const getNowStr = () => {
		const tzoffset = (new Date()).getTimezoneOffset() * 60000;
		const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
		return localISOTime;
	};

	function exportToCSV() {
		if (!data.listManuver?.length) return;
		
		const headers = [
			'No', 'Waktu Manuver', 'Penyulang Asal', 'ULP Asal', 'Penyulang Tujuan', 'ULP Tujuan',
			'Section', 'Beban Existing', 'Beban Manuver', 'Status', 'Waktu Penormalan', 'Pelaksana', 'Keterangan'
		];
		
		const csvRows = [headers.join(',')];
		
		data.listManuver.forEach((m: any, idx: number) => {
			const row = [
				idx + 1,
				`"${new Date(m.waktuManuver).toLocaleString('id-ID')}"`,
				`"${m.penyulangAsalNama}"`,
				`"${m.penyulangAsalUlp}"`,
				`"${m.penyulangTujuanNama}"`,
				`"${m.penyulangTujuanUlp}"`,
				`"${m.section || '-'}"`,
				m.bebanSebelum,
				m.bebanAmpereManuver,
				m.status,
				m.waktuPenormalan ? `"${new Date(m.waktuPenormalan).toLocaleString('id-ID')}"` : '"-"',
				`"${m.pelaksanaan || '-'}"`,
				`"${(m.keterangan || '-').replace(/"/g, '""')}"`
			];
			csvRows.push(row.join(','));
		});

		const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `Data_Manuver_${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
	<!-- Header -->
	<header class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/manuver" class="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 hover:text-[#00A2E9] transition-all">
				<ArrowLeft class="w-6 h-6" />
			</a>
			<div>
				<h1 class="text-3xl font-black text-slate-900 tracking-tight">Data Manuver</h1>
				<p class="text-slate-500 font-medium">Manajemen input dan riwayat manuver jaringan</p>
			</div>
		</div>
		
		<!-- Tab Navigation -->
		<div class="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
			<button 
				type="button" 
				onclick={() => activeTab = 'input'}
				class={cn(
					"flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
					activeTab === 'input' ? "bg-[#00A2E9] text-white shadow-md shadow-[#00A2E9]/30" : "text-slate-500 hover:bg-slate-50"
				)}
			>
				<FileEdit class="w-4 h-4" />
				Input Manuver
			</button>
			<button 
				type="button" 
				onclick={() => activeTab = 'riwayat'}
				class={cn(
					"flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
					activeTab === 'riwayat' ? "bg-[#00A2E9] text-white shadow-md shadow-[#00A2E9]/30" : "text-slate-500 hover:bg-slate-50"
				)}
			>
				<History class="w-4 h-4" />
				Riwayat Manuver
			</button>
		</div>
	</header>

	{#if form?.message && activeTab === 'input'}
		<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-4 shadow-sm">
			<AlertTriangle class="w-5 h-5 flex-shrink-0" />
			<p class="font-bold">{form.message}</p>
		</div>
	{/if}

	<!-- TAB 1: INPUT FORM -->
	{#if activeTab === 'input'}
		<form method="POST" action="?/create" use:enhance class="w-full slide-in">
			<div class="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
				<div class="absolute -right-20 -top-20 w-80 h-80 bg-slate-50 rounded-full pointer-events-none"></div>
				
				<div class="flex items-center justify-between relative z-10">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 bg-[#005B8F] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#005B8F]/20">
							<Zap class="w-6 h-6 fill-current" />
						</div>
						<div>
							<h3 class="text-2xl font-black text-slate-800 tracking-tight">Formulir Manuver</h3>
							<p class="text-slate-400 text-xs font-bold uppercase tracking-widest tracking-tighter">Record Baru</p>
						</div>
					</div>
					<div class="bg-slate-100 px-4 py-2 rounded-2xl font-black text-slate-400 text-xs uppercase tracking-widest">
						NO. AUTO
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
					<!-- Data Lokasi -->
					<div class="md:col-span-2 bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 space-y-6">
						<div class="flex items-center gap-2 mb-2">
							<Layers class="w-5 h-5 text-indigo-500" />
							<h4 class="font-black text-indigo-600 uppercase tracking-widest">1. Data Lokasi</h4>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Asal -->
							<div class="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
								<div class="flex items-center gap-2 border-b pb-3 mb-2">
									<MapPin class="w-4 h-4 text-[#00A2E9]" />
									<h5 class="font-bold text-slate-700">Existing (Asal)</h5>
								</div>
								<div class="space-y-2">
									<label for="ulpAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama ULP</label>
									<select id="ulpAsal" bind:value={selectedUlpAsal} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
										<option value="">-- Pilih ULP --</option>
										{#each ulps as u}
											<option value={u}>{u}</option>
										{/each}
									</select>
								</div>
								<div class="space-y-2">
									<label for="penyulangAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Penyulang</label>
									<select id="penyulangAsal" name="penyulangAsalId" disabled={!selectedUlpAsal} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
										<option value="">-- Pilih Penyulang --</option>
										{#each penyulangsAsal as p}
											<option value={p.id}>{p.nama}</option>
										{/each}
									</select>
								</div>
							</div>

							<!-- Tujuan -->
							<div class="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
								<div class="flex items-center gap-2 border-b pb-3 mb-2">
									<ArrowRight class="w-4 h-4 text-amber-500" />
									<h5 class="font-bold text-slate-700">Manuver Ke (Tujuan)</h5>
								</div>
								<div class="space-y-2">
									<label for="ulpTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama ULP</label>
									<select id="ulpTujuan" bind:value={selectedUlpTujuan} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
										<option value="">-- Pilih ULP --</option>
										{#each ulps as u}
											<option value={u}>{u}</option>
										{/each}
									</select>
								</div>
								<div class="space-y-2">
									<label for="penyulangTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Penyulang</label>
									<select id="penyulangTujuan" name="penyulangTujuanId" disabled={!selectedUlpTujuan} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
										<option value="">-- Pilih Penyulang --</option>
										{#each penyulangsTujuan as p}
											<option value={p.id}>{p.nama}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						<div class="space-y-2">
							<label for="section" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Section Jaringan</label>
							<input type="text" id="section" name="section" placeholder="Misal: Section A-B-C..." class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700" />
						</div>
					</div>

					<!-- Beban Side by Side -->
					<div class="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
						<div class="flex items-center gap-2 mb-2">
							<Activity class="w-5 h-5 text-slate-500" />
							<h4 class="font-black text-slate-600 uppercase tracking-widest">2. Data Beban</h4>
						</div>
						
						<div class="space-y-2">
							<label for="bebanSebelum" class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Beban Existing</label>
							<div class="relative">
								<input type="number" step="0.01" id="bebanSebelum" name="bebanSebelum" placeholder="0.00" class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700 tabular-nums" />
								<span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">AMPERE</span>
							</div>
						</div>

						<div class="space-y-2">
							<label for="bebanAmpereManuver" class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Beban Manuver</label>
							<div class="relative">
								<input type="number" step="0.01" id="bebanAmpereManuver" name="bebanAmpereManuver" placeholder="0.00" class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700 tabular-nums" />
								<span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">AMPERE</span>
							</div>
						</div>
					</div>

					<!-- Timing Side by Side -->
					<div class="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
						<div class="flex items-center gap-2 mb-2">
							<Calendar class="w-5 h-5 text-slate-500" />
							<h4 class="font-black text-slate-600 uppercase tracking-widest">3. Log Waktu</h4>
						</div>

						<div class="space-y-2">
							<label for="waktuManuver" class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Waktu Mulai Manuver</label>
							<input type="datetime-local" id="waktuManuver" name="waktuManuver" value={getNowStr()} required class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700" />
						</div>
						<!-- Removed Waktu Penormalan -->
					</div>

					<!-- Execution -->
					<div class="space-y-4 md:col-span-2 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
						<div class="flex items-center gap-2 mb-2">
							<User class="w-5 h-5 text-slate-500" />
							<h4 class="font-black text-slate-600 uppercase tracking-widest">4. Eksekusi & Catatan</h4>
						</div>
						<div class="space-y-2">
							<label for="pelaksanaan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pelaksana / Petugas Lapangan</label>
							<input type="text" id="pelaksanaan" name="pelaksanaan" placeholder="Nama petugas pelaksana..." class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700" />
						</div>

						<!-- Keterangan -->
						<div class="space-y-2">
							<label for="keterangan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Keterangan / Catatan Tambahan</label>
							<textarea id="keterangan" name="keterangan" rows="3" placeholder="Masukan keterangan detail jika diperlukan..." class="w-full bg-white border-transparent rounded-3xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 min-h-[100px]"></textarea>
						</div>
					</div>
				</div>

				<div class="pt-8 flex gap-6 relative z-10 border-t border-slate-100">
					<button type="reset" class="flex-1 px-8 py-5 bg-slate-100 rounded-3xl text-slate-500 font-black text-center hover:bg-slate-200 transition-all active:scale-95">
						BATAL
					</button>
					<button type="submit" class="flex-[2] px-8 py-5 bg-[#00A2E9] hover:bg-[#005B8F] text-white font-black rounded-3xl shadow-2xl shadow-[#005B8F]/40 transition-all flex items-center justify-center gap-3 active:scale-95 group">
						<Save class="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
						SIMPAN DATA MANUVER
					</button>
				</div>
			</div>
		</form>
	{/if}

	<!-- TAB 2: TABLE HISTORY -->
	{#if activeTab === 'riwayat'}
		<section class="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 overflow-hidden slide-in">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h2 class="text-2xl font-black text-slate-800 tracking-tight">Riwayat Input Manuver</h2>
					<p class="text-slate-500 font-medium text-sm">Data tabel manuver yang telah direkam</p>
				</div>
				<button type="button" onclick={exportToCSV} class="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
					<Download class="w-5 h-5" />
					Export ke Excel
				</button>
			</div>

			<div class="overflow-x-auto custom-scrollbar pb-4">
				<table class="w-full text-left border-collapse min-w-[1000px]">
					<thead>
						<tr class="bg-slate-50 text-slate-500 border-y border-slate-100">
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Status</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Waktu</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Existing (Asal)</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Manuver Ke</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Beban</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Pelaksana</th>
							<th class="py-4 px-4 font-black uppercase text-[10px] tracking-widest">Keterangan</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#if !data.listManuver || data.listManuver.length === 0}
							<tr>
								<td colspan="7" class="py-8 text-center text-slate-400 font-medium">Belum ada data manuver.</td>
							</tr>
						{:else}
							{#each data.listManuver as row}
								<tr class="hover:bg-slate-50/50 transition-colors group">
									<td class="py-4 px-4">
										<div class={cn(
											"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
											row.status === 'NORMAL' 
												? "bg-emerald-50 text-emerald-600 border-emerald-200" 
												: "bg-red-50 text-red-600 border-red-200 animate-pulse"
										)}>
											{#if row.status === 'NORMAL'}
												<CheckCircle2 class="w-3 h-3" />
												Normal
											{:else}
												<Activity class="w-3 h-3" />
												Aktif
											{/if}
										</div>
									</td>
									<td class="py-4 px-4 whitespace-nowrap">
										<p class="text-xs font-bold text-slate-700">{new Date(row.waktuManuver).toLocaleString('id-ID')}</p>
										{#if row.waktuPenormalan}
											<p class="text-[10px] font-bold text-emerald-600 mt-1 capitalize"><CheckCircle2 class="w-3 h-3 inline mr-0.5"/> Normal: {new Date(row.waktuPenormalan).toLocaleString('id-ID')}</p>
										{/if}
									</td>
									<td class="py-4 px-4">
										<p class="font-bold text-slate-800 text-sm">{row.penyulangAsalNama}</p>
										<p class="text-[10px] text-slate-400 font-bold uppercase">{row.penyulangAsalUlp}</p>
									</td>
									<td class="py-4 px-4">
										<p class="font-bold text-slate-800 text-sm">{row.penyulangTujuanNama}</p>
										<p class="text-[10px] text-slate-400 font-bold uppercase">{row.penyulangTujuanUlp}</p>
										{#if row.section}
											<p class="text-[10px] font-bold text-indigo-500 mt-1">Section: {row.section}</p>
										{/if}
									</td>
									<td class="py-4 px-4 whitespace-nowrap">
										<p class="text-[11px] font-bold text-slate-500">Ex: {row.bebanSebelum} A</p>
										<p class="text-sm font-black text-blue-600 border-t border-slate-100 pt-1 mt-1">Man: {row.bebanAmpereManuver} A</p>
									</td>
									<td class="py-4 px-4">
										<p class="font-bold text-slate-700 text-xs">{row.pelaksanaan || '-'}</p>
									</td>
									<td class="py-4 px-4">
										<p class="text-xs text-slate-500 max-w-[200px] truncate" title={row.keterangan}>{row.keterangan || '-'}</p>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.2);
	}
	
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
