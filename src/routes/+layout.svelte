<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { 
		LayoutDashboard, 
		Activity, 
		FileEdit, 
		User, 
		Zap,
		ChevronRight,
		Database,
		History,
		FileSpreadsheet
	} from 'lucide-svelte';
	import { clsx, type ClassValue } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	function cn(...inputs: ClassValue[]) {
		return twMerge(clsx(inputs));
	}

	let { children } = $props();

	const menuItems = [
		{ name: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ name: 'Input Manuver', href: '/manuver/input', icon: FileEdit },
		{ name: 'Riwayat Manuver', href: '/manuver', icon: History },
		{ name: 'Data Master', href: '/master', icon: Database },
		{ name: 'Export Data', href: '/export', icon: FileSpreadsheet },
	];

	let isSidebarCollapsed = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Monitoring Manuver Penyulang - PLN</title>
</svelte:head>

<div class="flex h-screen bg-[#F8FAFC] font-sans">
	<!-- Sidebar -->
	<aside 
		class={cn(
			"flex flex-col text-white shadow-2xl transition-all duration-300 ease-in-out z-50",
			"bg-gradient-to-b from-[#005B8F] to-[#00A2E9]",
			isSidebarCollapsed ? "w-20" : "w-72"
		)}
	>
		<!-- Logo Section -->
		<div class="p-6 border-b border-white/10 flex items-center gap-3">
			<div class="w-12 h-12 bg-[#FFCC00] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/20 overflow-hidden group-hover:scale-105 transition-transform duration-500">
				<img src="/logo-pln.png" alt="PLN Logo" class="w-full h-full object-cover" />
			</div>
			{#if !isSidebarCollapsed}
				<div class="flex flex-col">
					<span class="font-black text-2xl tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">PLN</span>
					<span class="text-[9px] uppercase tracking-[0.3em] text-blue-200 font-black">Manuver Beban</span>
				</div>
			{/if}
		</div>

		<!-- Navigation Menu -->
		<nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
			{#if !isSidebarCollapsed}
				<p class="text-[10px] uppercase font-bold text-white/50 px-4 mb-4 tracking-widest">Main Menu</p>
			{/if}
			
			{#each menuItems as item}
				{@const isActive = $page.url.pathname === item.href}
				<a 
					href={item.href} 
					class={cn(
						"flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
						isActive 
							? "bg-white text-[#005B8F] shadow-lg font-bold" 
							: "hover:bg-white/10 text-white/80 hover:text-white"
					)}
				>
					<item.icon class={cn("w-5 h-5", isActive ? "text-[#005B8F]" : "text-white/60 group-hover:text-white")} />
					{#if !isSidebarCollapsed}
						<span class="flex-1">{item.name}</span>
						{#if isActive}
							<ChevronRight class="w-4 h-4 ml-auto" />
						{/if}
					{/if}
					
					{#if isSidebarCollapsed}
						<div class="absolute left-full ml-4 px-2 py-1 bg-[#1E293B] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
							{item.name}
						</div>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Sidebar Footer -->
		<div class="p-6 border-t border-white/10">
			{#if !isSidebarCollapsed}
				<button 
					class="bg-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-all w-full text-left" 
					onclick={() => alert('Menu Profil Administrator')}
					type="button"
				>
					<div class="w-10 h-10 rounded-full bg-[#FFCC00]/20 flex items-center justify-center border border-[#FFCC00]/30">
						<User class="w-5 h-5 text-[#FFCC00]" />
					</div>
					<div class="flex flex-col min-w-0">
						<p class="text-sm font-bold truncate">Administrator</p>
						<p class="text-[10px] text-white/60 truncate uppercase tracking-tighter">Unit Induk Distribusi</p>
					</div>
				</button>
			{/if}
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex-1 flex flex-col h-screen overflow-hidden bg-[#F1F5F9]">
		<!-- Topbar -->
		<header class="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-40">
			<div class="flex items-center gap-4">
				<button 
					onclick={() => isSidebarCollapsed = !isSidebarCollapsed}
					class="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
					aria-label="Toggle Sidebar"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				<h1 class="text-xl font-bold text-slate-800 tracking-tight">Monitoring Manuver Penyulang</h1>
			</div>

			<div class="flex items-center gap-6">
			</div>
		</header>
		
		<!-- Page Content -->
		<div class="flex-1 overflow-auto bg-[#F8FAFC]">
			<div class="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
				{@render children()}
			</div>
		</div>
	</main>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>
