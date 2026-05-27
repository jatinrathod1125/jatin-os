import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                <span className="text-sm font-bold tracking-tighter text-cyan-300">
                    JO
                </span>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white">
                    Jatin OS
                </span>
                <span className="truncate font-mono text-[9px] tracking-[0.18em] text-cyan-300/60">
                    CONSOLE
                </span>
            </div>
        </>
    );
}
