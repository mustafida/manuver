<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { 
		Activity, 
		Zap, 
		Database, 
		TrendingUp, 
		Clock, 
		Calendar, 
		CheckCircle2, 
		AlertCircle,
		ArrowRight,
		BarChart3,
		History,
		MapPin,
		Timer,
		ChevronRight
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	import { parseSqlDate } from '$lib/utils/date';

	let { data }: { data: PageData } = $props();

	const stats = $derived(data.stats);
	const topFeeders = $derived(data.topFeeders);
	const activeManuvers = $derived(data.activeManuvers);
	const normalHistory = $derived(data.normalHistory);

	function formatNumber(num: number, decimals = 1) {
		return Number(num).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
	}

	function formatDate(date: string | Date) {
		const d = parseSqlDate(date);
		if (!d) return '-';
		return d.toLocaleString('id-ID', { 
			day: '2-digit', 
			month: 'short', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="space-y-10 pb-20">
	<!-- Dashboard Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Sistem Manuver Beban</h1>
		<p class="text-slate-500 font-medium flex items-center gap-2">
			<Activity class="w-4 h-4 text-[#00A2E9]" />
			Monitoring dan manajemen jaringan listrik
		</p>
	</div>

	<!-- Top Statistics Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Gardu Induk -->
		<div class="bg-gradient-to-br from-[#005B8F] to-[#00A2E9] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
			<div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
			<div class="relative z-10 flex justify-between items-start">
				<div class="space-y-4">
					<p class="text-white/70 font-bold uppercase tracking-widest text-xs">Gardu Induk</p>
					<h3 class="text-5xl font-black">{stats.totalGarduInduk}</h3>
					<div class="flex items-center gap-2 text-xs bg-white/20 py-1 px-3 rounded-full w-fit">
						<MapPin class="w-3 h-3" />
						Tersebar di Wilayah
					</div>
				</div>
				<div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
					<Database class="w-8 h-8" />
				</div>
			</div>
		</div>

		<!-- Manuver Aktif -->
		<div class="bg-[#EF4444] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group border-b-8 border-red-700">
			<div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
			<div class="relative z-10 flex justify-between items-start">
				<div class="space-y-4">
					<p class="text-white/70 font-bold uppercase tracking-widest text-xs">Manuver Aktif</p>
					<h3 class="text-5xl font-black">{stats.activeManuverCount}</h3>
					<div class="flex items-center gap-2 text-xs bg-white/20 py-1 px-3 rounded-full w-fit">
						<Activity class="w-3 h-3 animate-pulse" />
						Real-time Monitoring
					</div>
				</div>
				<div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
					<AlertCircle class="w-8 h-8" />
				</div>
			</div>
		</div>

		<!-- Total Penyulang -->
		<div class="bg-[#10B981] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group border-b-8 border-[#059669]">
			<div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all duration-500"></div>
			<div class="relative z-10 flex justify-between items-start">
				<div class="space-y-4">
					<p class="text-white/70 font-bold uppercase tracking-widest text-xs">Total Penyulang</p>
					<h3 class="text-5xl font-black">{stats.totalPenyulang}</h3>
					<div class="flex items-center gap-2 text-xs bg-white/20 py-1 px-3 rounded-full w-fit">
						<Database class="w-3 h-3" />
						Aktif di Sistem
					</div>
				</div>
				<div class="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
					<Zap class="w-8 h-8" />
				</div>
			</div>
		</div>
	</div>

	<!-- Statistik Manuver Section -->
	<div class="space-y-6">
		<div class="flex items-center gap-3">
			<div class="h-8 w-1.5 bg-[#00A2E9] rounded-full"></div>
			<h2 class="text-2xl font-bold text-slate-800">Statistik Manuver</h2>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Total Beban Aktif -->
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
				<div class="flex items-center justify-between mb-4">
					<div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
						<TrendingUp class="w-5 h-5" />
					</div>
					<span class="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">Total Beban</span>
				</div>
				<p class="text-slate-400 text-xs font-semibold mb-1">Total Beban Aktif</p>
				<h4 class="text-2xl font-black text-slate-800">{formatNumber(stats.loadStats.totalActiveLoad)} <span class="text-sm font-medium text-slate-400">A</span></h4>
			</div>

			<!-- Rata-rata Beban -->
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
				<div class="flex items-center justify-between mb-4">
					<div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
						<Activity class="w-5 h-5" />
					</div>
					<div class="flex flex-col items-end">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min: {formatNumber(stats.loadStats.minLoad)}A</span>
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max: {formatNumber(stats.loadStats.maxLoad)}A</span>
					</div>
				</div>
				<p class="text-slate-400 text-xs font-semibold mb-1">Rata-rata Beban</p>
				<h4 class="text-2xl font-black text-slate-800">{formatNumber(stats.loadStats.avgLoad)} <span class="text-sm font-medium text-slate-400">A</span></h4>
			</div>

			<!-- Rata-rata Durasi -->
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
				<div class="flex items-center justify-between mb-4">
					<div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
						<Clock class="w-5 h-5" />
					</div>
					<div class="flex flex-col items-end">
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min: {stats.durationStats.minDuration}m</span>
						<span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max: {stats.durationStats.maxDuration}m</span>
					</div>
				</div>
				<p class="text-slate-400 text-xs font-semibold mb-1">Durasi Rata-rata</p>
				<h4 class="text-2xl font-black text-slate-800">{formatNumber(stats.durationStats.avgDuration)} <span class="text-sm font-medium text-slate-400">m</span></h4>
			</div>

			<!-- Manuver Bulan Ini -->
			<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
				<div class="flex items-center justify-between mb-4">
					<div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
						<Calendar class="w-5 h-5" />
					</div>
					<span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">Growth</span>
				</div>
				<p class="text-slate-400 text-xs font-semibold mb-1">Manuver Bulan Ini</p>
				<h4 class="text-2xl font-black text-slate-800">{stats.currentMonthManuver} <span class="text-sm font-medium text-slate-400">TRX</span></h4>
			</div>
		</div>
	</div>

	<!-- Completion Ratio Progress Bar -->
	<div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
		<div class="flex justify-between items-end">
			<div class="space-y-1">
				<h3 class="text-xl font-bold text-slate-800">Rasio Penyelesaian Manuver</h3>
				<p class="text-slate-400 text-sm font-medium">Perbandingan manuver normal terhadap total record</p>
			</div>
			<div class="text-right">
				<span class="text-4xl font-black text-[#00A2E9]">{formatNumber(stats.completionRatio)}%</span>
			</div>
		</div>
		
		<div class="relative h-6 bg-red-100 rounded-full overflow-hidden shadow-inner flex">
			<div 
				class="h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-1000 ease-out flex items-center justify-center text-[10px] text-white font-bold"
				style="width: {stats.completionRatio}%"
			>
				{stats.completionRatio > 10 ? 'NORMALIZED' : ''}
			</div>
			<div class="flex-1 flex items-center justify-center text-[10px] text-red-600/50 font-bold">
				{stats.completionRatio < 90 ? 'ACTIVE' : ''}
			</div>
		</div>

		<div class="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
			<span class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Selesai (Hijau)</span>
			<span class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-red-500"></div> Aktif (Merah)</span>
		</div>
	</div>

	<!-- Penyulang Paling Sering Terlibat -->
	<div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
		<div class="flex items-center gap-3 mb-4">
			<div class="text-amber-500">
				<BarChart3 class="w-6 h-6" />
			</div>
			<h2 class="text-xl font-bold text-slate-800">Penyulang Paling Sering Terlibat</h2>
		</div>
		
		<div class="space-y-4">
			{#each topFeeders as feeder, i}
				<div class="flex items-center gap-6 group">
					<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm group-hover:bg-[#00A2E9]/10 group-hover:text-[#00A2E9] transition-all shrink-0">
						{i + 1}
					</div>
					<div class="flex-1 min-w-0">
						<h5 class="font-bold text-slate-800 text-lg leading-tight">{feeder.nama}</h5>
						<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feeder.ulp}</p>
					</div>
					<div class="flex flex-col items-end gap-1 w-32">
						<div class="flex items-baseline gap-1 text-slate-800">
							<span class="font-black text-xl">{feeder.count}</span>
							<span class="text-[10px] font-bold uppercase text-slate-400">MANUVER</span>
						</div>
						<div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
							<!-- Mocking a width percentage relative to max, let's say max is 10 for visuals -->
							<div class="h-full bg-gradient-to-r from-amber-500 to-amber-400" style="width: {Math.min(feeder.count * 10, 100)}%"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Main Grid Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Left Column: Active Monitoring -->
		<div class="space-y-6">

			<!-- Monitoring Manuver Aktif (Live) -->
			<section class="space-y-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="p-2 bg-red-50 rounded-lg text-red-600">
							<Activity class="w-5 h-5 animate-pulse" />
						</div>
						<h2 class="text-2xl font-bold text-slate-800">Monitoring Manuver Aktif</h2>
					</div>
					<div class="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full">
						<div class="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
						<span class="text-[10px] font-black text-red-600 uppercase tracking-tighter">Live Monitor</span>
					</div>
				</div>

				<div class="space-y-4">
					{#if activeManuvers.length === 0}
						<div class="bg-emerald-50 border border-emerald-100 p-12 rounded-3xl text-center space-y-4">
							<div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
								<CheckCircle2 class="w-10 h-10" />
							</div>
							<div>
								<h3 class="text-xl font-bold text-emerald-800 tracking-tight">Semua manuver sudah normal</h3>
								<p class="text-emerald-600/70 font-medium">Sistem kelistrikan dalam kondisi optimal saat ini.</p>
							</div>
						</div>
					{:else}
						{#each activeManuvers as m}
							<div class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
								<div class="bg-[#EF4444] px-6 py-2 text-white flex justify-between items-center bg-gradient-to-r from-red-600 to-red-500">
									<div class="flex items-center gap-2">
										<div class="w-7 h-7 bg-[#FFCC00] rounded-lg flex items-center justify-center overflow-hidden border border-white/20">
											<img src="/logo-pln.png" alt="PLN" class="w-full h-full object-cover" />
										</div>
										<span class="text-xs font-black uppercase tracking-widest text-[#FFCC00]">Manuver Aktif</span>
									</div>
									<span class="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{formatDate(m.waktuManuver)}</span>
								</div>
								
								<div class="p-8">
									<div class="flex items-center gap-6 mb-8">
										<div class="flex-1 text-center space-y-1">
											<p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Asal</p>
											<h4 class="text-xl font-black text-slate-800 truncate">{m.penyulangAsal.nama}</h4>
										</div>
										<div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#00A2E9] shadow-inner">
											<ArrowRight class="w-6 h-6" />
										</div>
										<div class="flex-1 text-center space-y-1">
											<p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Tujuan</p>
											<h4 class="text-xl font-black text-slate-800 truncate">{m.penyulangTujuan.nama}</h4>
										</div>
									</div>

									<div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
										<div class="flex items-center gap-4">
											<div class="p-2 bg-blue-100 rounded-xl text-blue-600">
												<TrendingUp class="w-5 h-5" />
											</div>
											<div>
												<p class="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Beban Manuver</p>
												<p class="text-2xl font-black text-blue-600">{m.bebanAmpereManuver} <span class="text-sm font-bold opacity-60">A</span></p>
											</div>
										</div>
										<form action="/manuver?/normalize" method="POST" use:enhance>
											<input type="hidden" name="id" value={m.id}>
											<button 
												type="submit" 
												class="bg-[#00A2E9] hover:bg-[#005B8F] text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-[#00A2E9]/20 transition-all text-sm flex items-center gap-2"
												onclick={(e) => { if(!confirm('Yakin ingin menormalkan beban ini?')) e.preventDefault(); }}
											>
												<CheckCircle2 class="w-4 h-4" />
												Normalkan
											</button>
										</form>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</section>
		</div>

		<!-- Right Column: Normal History -->
		<div class="space-y-6">
			<div class="flex items-center gap-3 px-2">
				<div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
					<History class="w-5 h-5" />
				</div>
				<h2 class="text-xl font-bold text-slate-800">Riwayat Normal Terakhir</h2>
			</div>

			<div class="space-y-4">
				{#if normalHistory.length === 0}
					<div class="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
						<p class="text-sm font-medium">Belum ada riwayat</p>
					</div>
				{:else}
					{#each normalHistory as h}
						<div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
							<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 group-hover:w-3 transition-all"></div>
							<div class="flex justify-between items-start mb-4">
								<div class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
									<CheckCircle2 class="w-3 h-3" />
									Normal
								</div>
								<span class="text-[10px] font-bold text-slate-400">{formatDate(h.waktuPenormalan!)}</span>
							</div>

							<div class="flex items-center gap-3 mb-4">
								<div class="flex-1 min-w-0">
									<p class="text-[10px] font-bold text-slate-300 uppercase leading-none mb-1">Penyulang</p>
									<p class="text-sm font-black text-slate-700 truncate">{h.penyulangAsal.nama} ➔ {h.penyulangTujuan.nama}</p>
								</div>
							</div>

							<div class="flex items-center gap-4 py-3 border-t border-slate-50 mt-3">
								<div class="flex items-center gap-1">
									<Activity class="w-3 h-3 text-emerald-500" />
									<span class="text-xs font-black text-slate-700">{h.bebanAmpereManuver} A</span>
								</div>
								<div class="w-1 h-1 rounded-full bg-slate-200"></div>
								<div class="flex items-center gap-1">
									<Timer class="w-3 h-3 text-slate-400" />
									<span class="text-[10px] font-bold text-slate-400">Selesai</span>
								</div>
							</div>
						</div>
					{/each}
				{/if}

				<a 
					href="/manuver" 
					class="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all hover:border-[#00A2E9]/20 hover:text-[#00A2E9]"
				>
					Lihat Semua Riwayat
					<ChevronRight class="w-4 h-4" />
				</a>
			</div>

			<!-- Catat Manuver CTA -->
			<div class="bg-gradient-to-br from-[#005B8F] to-[#4285F4] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group mt-6">
				<div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
				<div class="relative z-10 space-y-4">
					<h3 class="text-2xl font-bold text-white">Catat Manuver</h3>
					<p class="text-white/80 font-medium">Laporkan perubahan beban penyulang sekarang.</p>
					<a href="/manuver/input" class="inline-flex mt-4 items-center gap-2 bg-white text-[#005B8F] hover:bg-slate-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
						Mulai Input <ArrowRight class="w-4 h-4" />
					</a>
				</div>
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
