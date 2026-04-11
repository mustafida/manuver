/**
 * Formats a Date object to a MySQL-compliant datetime string (YYYY-MM-DD HH:mm:ss)
 * using the server's local time.
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
 * Returns a new Date object shifted to Indonesian time (WIB - GMT+7)
 * Useful for servers running in UTC (like Vercel).
 */
export function getIndonesianDate(): Date {
    const now = new Date();
    // Vercel is UTC (0), Indonesia is GMT+7
    // This allows us to "pretend" the server's local time is WIB
    // when using Date methods like getHours(), etc.
    const wibOffset = 7 * 60 * 60 * 1000;
    return new Date(now.getTime() + wibOffset);
}

/**
 * Ensures a date string from MySQL is treated as local time
 * by inserting the 'T' separator if missing.
 */
export function parseSqlDate(dateStr: string | Date | null): Date | null {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    
    // Replace space with T to force local interpretation in standard environments
    return new Date(dateStr.replace(' ', 'T'));
}
