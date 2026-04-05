<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Manuver Beban PLN</title>
</svelte:head>

<div class="flex h-screen bg-[#F8FAFC]">
	<!-- Sidebar -->
	<aside class="w-64 bg-[#00A2E9] text-white flex flex-col shadow-xl">
		<div class="p-6 text-xl font-bold border-b border-white/20 flex gap-3 items-center">
			<div class="w-8 h-8 bg-[#FFCC00] rounded-sm flex items-center justify-center text-[#00A2E9]">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<span>Manuver Beban</span>
		</div>
		<nav class="flex-1 px-4 py-6 space-y-2">
			<a href="/" class="block px-4 py-3 rounded-lg hover:bg-white/20 transition hover:-translate-y-0.5 font-medium">Dashboard</a>
			<a href="/gardu-induk" class="block px-4 py-3 rounded-lg hover:bg-white/20 transition hover:-translate-y-0.5 font-medium">Gardu Induk</a>
			<a href="/penyulang" class="block px-4 py-3 rounded-lg hover:bg-white/20 transition hover:-translate-y-0.5 font-medium">Penyulang</a>
			<a href="/manuver" class="block px-4 py-3 rounded-lg bg-[#FFCC00] text-[#005B8F] transition hover:-translate-y-0.5 font-bold shadow-lg shadow-[#FFCC00]/20 mt-4">Catat Manuver</a>
		</nav>
		<div class="p-4 text-sm text-center border-t border-white/20 text-white/80">
			&copy; 2026 PLN (Persero)
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col h-screen overflow-hidden">
		<!-- Topbar -->
		<header class="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
			<h1 class="text-lg font-semibold text-slate-800">Sistem Monitoring Manuver</h1>
		</header>
		
		<!-- Page Content -->
		<div class="flex-1 overflow-auto p-8 bg-slate-50 relative">
			<div class="max-w-6xl mx-auto space-y-6">
				{@render children()}
			</div>
		</div>
	</main>
</div>
