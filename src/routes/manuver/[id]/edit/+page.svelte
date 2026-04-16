<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { 
		ArrowLeft, 
		Save, 
		AlertTriangle,
		Calendar,
		MapPin,
		Activity,
		ArrowRight,
		Layers,
		FileEdit
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { data, form }: { data: PageData, form: ActionData } = $props();

	const listULP = [
		'BANGKALAN', 'KAMAL', 'KETAPANG', 'BLEGA', 'SAMPANG', 
		'PAMEKASAN', 'WARU', 'SUMENEP', 'AMBUNTEN'
	];

	// Extract initial format from DB
	const m = data.manuver;

	// Dropdown states, populated from initial DB value
	let selectedULPAsal = $state<string | null>(m.ulpAsal || null);
	let selectedULPTujuan = $state<string | null>(m.ulpTujuan || null);
	
	let selectedAsalId = $state<number | null>(m.penyulangAsalId);
	let selectedTujuanId = $state<number | null>(m.penyulangTujuanId);

	const penyulangsAsal = $derived(
		selectedULPAsal 
			? data.listPenyulang.filter(p => p.ulp.toUpperCase().includes(selectedULPAsal!.toUpperCase()))
			: []
	);

	const penyulangsTujuan = $derived(
		selectedULPTujuan 
			? data.listPenyulang.filter(p => p.ulp.toUpperCase().includes(selectedULPTujuan!.toUpperCase()))
			: []
	);

	const selectedPenyulangAsal = $derived(data.listPenyulang.find(p => p.id === selectedAsalId));
	const selectedPenyulangTujuan = $derived(data.listPenyulang.find(p => p.id === selectedTujuanId));

	const eksekusiOpsi = ['Remote SCADA', 'Manual Panel', 'Manual Stick'];

	const getLocalIsoFromDb = (dateStr: string | Date | null) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		const offset = d.getTimezoneOffset() * 60000;
		return new Date(d.getTime() - offset).toISOString().slice(0, 16);
	};

	let waktuManuver = $state(getLocalIsoFromDb(m.waktuManuver));
	let bebanSebelum = $state<number | string>(m.bebanSebelum);
	let bebanAmpereManuver = $state<number>(m.bebanAmpereManuver);
	let sectionAsal = $state(m.sectionAsal || '');
	let sectionTujuan = $state(m.sectionTujuan || '');
	let pelaksanaanAsal = $state(m.pelaksanaanAsal || '');
	let pelaksanaanTujuan = $state(m.pelaksanaanTujuan || '');
	let keterangan = $state(m.keterangan || '');

	let submitting = $state(false);

	const loadType = $derived.by(() => {
		if (!waktuManuver) return 'MALAM';
		const parts = waktuManuver.split('T');
		if (parts.length < 2) return 'MALAM';
		const hour = parseInt(parts[1].split(':')[0], 10);
		return (hour >= 7 && hour < 16) ? 'SIANG' : 'MALAM';
	});

</script>

<div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
	<!-- Header -->
	<header class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/manuver" class="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 hover:text-[#00A2E9] transition-all">
				<ArrowLeft class="w-6 h-6" />
			</a>
			<div>
				<h1 class="text-3xl font-black text-slate-900 tracking-tight">Edit Manuver</h1>
				<p class="text-slate-500 font-medium">Perbarui data manuver jaringan</p>
			</div>
		</div>
	</header>

	{#if form?.message}
		<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-4 shadow-sm">
			<AlertTriangle class="w-5 h-5 flex-shrink-0" />
			<p class="font-bold">{form.message}</p>
		</div>
	{/if}

	<!-- INPUT FORM -->
	<form 
		method="POST" 
		action="?/update" 
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}} 
		class="w-full slide-in"
	>
		<div class="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
			<div class="absolute -right-20 -top-20 w-80 h-80 bg-slate-50 rounded-full pointer-events-none"></div>
			
			<div class="flex items-center justify-between relative z-10">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
						<img src="/logo-pln.png" alt="PLN Logo" class="w-full h-full object-cover" />
					</div>
					<div>
						<h3 class="text-2xl font-black text-slate-800 tracking-tight">Edit Formulir Manuver</h3>
						<p class="text-slate-400 text-xs font-bold uppercase tracking-widest tracking-tighter">ID #{m.id}</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
				<!-- Data Lokasi -->
				<div class="md:col-span-2 bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 space-y-6">
					<div class="flex items-center gap-2 mb-2">
						<Layers class="w-5 h-5 text-indigo-500" />
						<h4 class="font-black text-indigo-600 uppercase tracking-widest">1. Data Lokasi</h4>
						
						<input type="hidden" name="ulpAsal" value={selectedULPAsal} />
						<input type="hidden" name="ulpTujuan" value={selectedULPTujuan} />
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Asal -->
						<div class="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
							<div class="flex items-center gap-2 border-b pb-3 mb-2">
								<MapPin class="w-4 h-4 text-[#00A2E9]" />
								<h5 class="font-bold text-slate-700">Existing (Asal)</h5>
							</div>
							<div class="space-y-2">
								<label for="ulpAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit Layanan Pelanggan (ULP)</label>
								<select id="ulpAsal" bind:value={selectedULPAsal} required class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
									<option value={null}>-- Pilih ULP --</option>
									{#each listULP as ulp}
										<option value={ulp}>{ulp}</option>
									{/each}
								</select>
							</div>
							<div class="space-y-2">
								<label for="penyulangAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Penyulang</label>
								<select id="penyulangAsal" name="penyulangAsalId" bind:value={selectedAsalId} required disabled={!selectedULPAsal} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
									<option value={null}>-- Pilih Penyulang ({penyulangsAsal.length}) --</option>
									{#each penyulangsAsal as p}
										<option value={p.id}>{p.nama} - TRAFO-{p.trf || '-'}</option>
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
								<label for="ulpTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit Layanan Pelanggan (ULP)</label>
								<select id="ulpTujuan" bind:value={selectedULPTujuan} required class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
									<option value={null}>-- Pilih ULP --</option>
									{#each listULP as ulp}
										<option value={ulp}>{ulp}</option>
									{/each}
								</select>
							</div>
							<div class="space-y-2">
								<label for="penyulangTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Penyulang</label>
								<select id="penyulangTujuan" name="penyulangTujuanId" bind:value={selectedTujuanId} required disabled={!selectedULPTujuan} class="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
									<option value={null}>-- Pilih Penyulang ({penyulangsTujuan.length}) --</option>
									{#each penyulangsTujuan as p}
										<option value={p.id}>{p.nama} - TRAFO-{p.trf || '-'}</option>
									{/each}
								</select>
							</div>

						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="sectionAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Section Asal</label>
							<input type="text" id="sectionAsal" name="sectionAsal" bind:value={sectionAsal} required placeholder="Titik Section Asal..." class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700" />
						</div>
						<div class="space-y-2">
							<label for="sectionTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Section Tujuan</label>
							<input type="text" id="sectionTujuan" name="sectionTujuan" bind:value={sectionTujuan} required placeholder="Titik Section Tujuan..." class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700" />
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="pelaksanaanAsal" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Eksekusi Asal</label>
							<select id="pelaksanaanAsal" name="pelaksanaanAsal" bind:value={pelaksanaanAsal} required class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
								<option value="">-- Metode Eksekusi Asal --</option>
								{#each eksekusiOpsi as opsi}
									<option value={opsi}>{opsi}</option>
								{/each}
							</select>
						</div>
						<div class="space-y-2">
							<label for="pelaksanaanTujuan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Eksekusi Tujuan</label>
							<select id="pelaksanaanTujuan" name="pelaksanaanTujuan" bind:value={pelaksanaanTujuan} required class="w-full bg-white border-transparent rounded-2xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 cursor-pointer">
								<option value="">-- Metode Eksekusi Tujuan --</option>
								{#each eksekusiOpsi as opsi}
									<option value={opsi}>{opsi}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<!-- Timing Side by Side (Left) -->
				<div class="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
					<div class="flex items-center gap-2 mb-2">
						<Calendar class="w-5 h-5 text-slate-500" />
						<h4 class="font-black text-slate-600 uppercase tracking-widest">2. Log Waktu</h4>
					</div>

					<div class="space-y-2">
						<label for="waktuManuver" class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Waktu Mulai Manuver</label>
						<input type="datetime-local" id="waktuManuver" name="waktuManuver" bind:value={waktuManuver} required class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700" />
					</div>
				</div>

				<!-- Beban Side by Side (Right) -->
				<div class="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
					<div class="flex items-center gap-2 mb-2">
						<Activity class="w-5 h-5 text-slate-500" />
						<h4 class="font-black text-slate-600 uppercase tracking-widest">3. Data Beban</h4>
					</div>
					
					<div class="space-y-2">
						<div class="flex items-center justify-between pl-1">
							<label for="bebanSebelum" class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beban Existing</label>
						</div>
						<div class="relative">
							<input type="number" step="0.01" min="0" required id="bebanSebelum" name="bebanSebelum" bind:value={bebanSebelum} placeholder="0.00" class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700 tabular-nums" />
							<span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">AMPERE</span>
						</div>
					</div>

					<div class="space-y-2">
						<label for="bebanAmpereManuver" class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Beban Manuver</label>
						<div class="relative">
							<input type="number" step="0.01" min="0.01" required id="bebanAmpereManuver" name="bebanAmpereManuver" bind:value={bebanAmpereManuver} placeholder="0.00" class="w-full bg-white border-transparent rounded-xl px-4 py-3 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-black text-slate-700 tabular-nums" />
							<span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">AMPERE</span>
						</div>
					</div>
				</div>

				<!-- Execution -->
				<div class="space-y-4 md:col-span-2 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
					<div class="flex items-center gap-2 mb-2">
						<FileEdit class="w-5 h-5 text-slate-500" />
						<h4 class="font-black text-slate-600 uppercase tracking-widest">4. Catatan</h4>
					</div>
					<!-- Keterangan -->
					<div class="space-y-2">
						<label for="keterangan" class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Keterangan / Catatan Tambahan</label>
						<textarea id="keterangan" name="keterangan" bind:value={keterangan} required rows="3" placeholder="Masukan keterangan detail jika diperlukan..." class="w-full bg-white border-transparent rounded-3xl px-6 py-4 shadow-sm focus:border-[#00A2E9] focus:ring-4 focus:ring-[#00A2E9]/10 transition-all font-bold text-slate-700 min-h-[100px]"></textarea>
					</div>
				</div>
			</div>

			<div class="pt-8 flex gap-6 relative z-10 border-t border-slate-100">
				<a 
					href="/manuver"
					class="flex-1 px-8 py-5 bg-slate-100 rounded-3xl text-slate-500 font-black text-center hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 inline-block"
				>
					BATAL
				</a>
				<button 
					type="submit" 
					class="flex-[2] px-8 py-5 bg-[#00A2E9] hover:bg-[#005B8F] text-white font-black rounded-3xl shadow-2xl shadow-[#005B8F]/40 transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50 disabled:cursor-wait"
					disabled={submitting}
				>
					{#if submitting}
						<Activity class="w-6 h-6 animate-spin" />
						MENGUPDATE...
					{:else}
						<Save class="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
						UPDATE DATA MANUVER
					{/if}
				</button>
			</div>
		</div>
	</form>
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
