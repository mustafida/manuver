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
 * Parses MySQL/ISO datetime values while preserving wall-clock time from DB.
 * Timezone suffixes (Z, +07:00) are ignored intentionally to prevent UI shifts.
 */
export function parseSqlDate(dateStr: string | Date | null): Date | null {
    if (!dateStr) return null;
    if (dateStr instanceof Date) {
        // Normalize to a "timezone-less" local Date so display does not shift by client timezone.
        return new Date(
            dateStr.getFullYear(),
            dateStr.getMonth(),
            dateStr.getDate(),
            dateStr.getHours(),
            dateStr.getMinutes(),
            dateStr.getSeconds(),
            dateStr.getMilliseconds()
        );
    }

    const raw = String(dateStr).trim();

    // Accept: "YYYY-MM-DD HH:mm:ss", ISO, and ISO with timezone suffix (Z / +07:00).
    // Timezone suffix is intentionally ignored so values match DB wall-clock time.
    const match = raw.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?(?:Z|[+-]\d{2}:?\d{2})?$/
    );

    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
        const hour = Number(match[4] ?? '0');
        const minute = Number(match[5] ?? '0');
        const second = Number(match[6] ?? '0');
        const millisecond = Number((match[7] ?? '0').padEnd(3, '0'));

        return new Date(year, month, day, hour, minute, second, millisecond);
    }

    // Fallback for unknown formats
    const fallback = new Date(raw);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
}
