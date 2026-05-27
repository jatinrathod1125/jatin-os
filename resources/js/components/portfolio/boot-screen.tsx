import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const bootLines = [
    'Loading Laravel kernel 13.7...',
    'Mounting portfolio filesystem...',
    'Starting Inertia desktop services...',
    'Connecting ORBIT assistant...',
    'Workspace ready.',
];

export function BootScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(4);
    const [lineCount, setLineCount] = useState(1);

    useEffect(() => {
        const progressTimer = window.setInterval(() => {
            setProgress((value) =>
                Math.min(value + Math.ceil(Math.random() * 14), 100),
            );
        }, 180);
        const linesTimer = window.setInterval(() => {
            setLineCount((value) => Math.min(value + 1, bootLines.length));
        }, 430);
        const completionTimer = window.setTimeout(onComplete, 2600);

        return () => {
            window.clearInterval(progressTimer);
            window.clearInterval(linesTimer);
            window.clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#03070f]"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.55 }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(15,216,255,0.14),transparent_38%)]" />
            <motion.div
                className="relative w-[min(90vw,510px)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="mb-10 flex items-center justify-center gap-4">
                    <div className="relative grid size-16 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/8 shadow-[0_0_50px_rgba(34,211,238,0.18)]">
                        <span className="text-2xl font-semibold tracking-tighter text-cyan-300">
                            JO
                        </span>
                        <span className="absolute -right-1 -bottom-1 size-3 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]" />
                    </div>
                    <div>
                        <p className="text-xl font-semibold tracking-[0.24em] text-white">
                            JATIN OS
                        </p>
                        <p className="mt-1 font-mono text-[11px] tracking-[0.28em] text-cyan-300/70">
                            PORTFOLIO KERNEL
                        </p>
                    </div>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 shadow-[0_0_18px_#22d3ee]"
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-5 min-h-28 rounded-xl border border-white/8 bg-white/[0.025] p-4 font-mono text-xs text-slate-400">
                    <AnimatePresence>
                        {bootLines.slice(0, lineCount).map((line) => (
                            <motion.p
                                key={line}
                                className="mb-1.5 flex gap-2"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="text-emerald-400">[OK]</span>
                                {line}
                            </motion.p>
                        ))}
                    </AnimatePresence>
                </div>
                <button
                    type="button"
                    onClick={onComplete}
                    className="mx-auto mt-6 block rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-200"
                >
                    skip boot sequence
                </button>
            </motion.div>
        </motion.div>
    );
}
