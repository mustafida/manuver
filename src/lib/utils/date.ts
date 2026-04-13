/**
 * Formats a Date object to a MySQL-compliant datetime string (YYYY-MM-DD HH:mm:ss)
 */
export function formatToSql(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Returns the current date and time.
 * Standardized for use across server actions.
 */
export function getIndonesianDate(): Date {
    return new Date();
}

/**
 * Returns the date part in WIB (DD/MM/YYYY)
 */
export function formatWibDate(dateStr: string | Date | null): string {
    if (!dateStr) return '-';
    let d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return '-';
    // If it's a Date object already representing WIB wall-clock, we just use its values.
    // If it's a UTC date, we shift it. 
    // BUT we will rely on formatDisplayDate for local consistency.
    return formatDisplayDate(dateStr, { includeTime: false, shortMonth: false });
}

/**
 * Returns the time part in WIB (HH:mm)
 */
export function formatWibTime(dateStr: string | Date | null): string {
    if (!dateStr) return '-';
    return formatDisplayDate(dateStr, { includeTime: true }).split(', ')[1] || '-';
}

/**
 * Robust date formatting for Indonesian display (WIB - GMT+7)
 */
export function formatDisplayDate(date: string | Date | null, options: { includeTime?: boolean, shortMonth?: boolean } = {}): string {
    if (!date) return '-';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    // We force Asia/Jakarta timezone for display
    try {
        return d.toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit',
            month: options.shortMonth ? 'short' : '2-digit',
            year: 'numeric',
            hour: options.includeTime ? '2-digit' : undefined,
            minute: options.includeTime ? '2-digit' : undefined,
        }).replace(/\./g, ':'); // Fix many locales using . instead of :
    } catch (e) {
        // Fallback for environments with missing IANA data
        return d.toISOString().slice(0, 16);
    }
}

/**
 * Parses MySQL/ISO datetime strings while ignoring TZ shifts by assuming they are wall-clock WIB.
 */
export function parseSqlDate(dateStr: string | Date | null): Date | null {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    
    const raw = String(dateStr).trim();
    // Simple parse, but we treat it as local-agnostic by stripping Z if found for manual construction later
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
}
