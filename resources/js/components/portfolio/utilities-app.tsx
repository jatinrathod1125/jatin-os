import { Link } from '@inertiajs/react';
import {
    LockKeyhole,
    Music2,
    Pause,
    Play,
    RotateCcw,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function SettingsApp({
    authenticated,
    admin,
    glow,
    onToggleGlow,
    onReplayBoot,
}: {
    authenticated: boolean;
    admin: boolean;
    glow: boolean;
    onToggleGlow: () => void;
    onReplayBoot: () => void;
}) {
    return (
        <div className="space-y-5 p-5">
            <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-slate-500">
                    DISPLAY
                </p>
                <button
                    type="button"
                    onClick={onToggleGlow}
                    className="flex w-full items-center justify-between text-sm text-slate-200"
                >
                    Neon bloom effects
                    <span
                        className={`relative h-6 w-11 rounded-full transition ${
                            glow ? 'bg-cyan-400/70' : 'bg-white/10'
                        }`}
                    >
                        <span
                            className={`absolute top-1 size-4 rounded-full bg-white transition ${
                                glow ? 'left-6' : 'left-1'
                            }`}
                        />
                    </span>
                </button>
                <button
                    type="button"
                    onClick={onReplayBoot}
                    className="mt-5 flex items-center gap-2 text-sm text-cyan-300 transition hover:text-cyan-200"
                >
                    <RotateCcw className="size-4" />
                    Replay boot sequence
                </button>
            </section>
            <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-slate-500">
                    ACCESS
                </p>
                {authenticated ? (
                    <>
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-2 py-2 text-sm text-slate-200 hover:text-cyan-200"
                        >
                            <LockKeyhole className="size-4 text-cyan-300" />
                            Account settings
                        </Link>
                        {admin && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 py-2 text-sm text-slate-200 hover:text-cyan-200"
                            >
                                <ShieldCheck className="size-4 text-emerald-300" />
                                Admin console
                            </Link>
                        )}
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
                    >
                        <LockKeyhole className="size-4" />
                        Sign in to administration
                    </Link>
                )}
            </section>
        </div>
    );
}

type AudioNodes = {
    context: AudioContext;
    gain: GainNode;
    oscillators: OscillatorNode[];
};

export function MusicApp() {
    const audio = useRef<AudioNodes | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        return () => {
            audio.current?.oscillators.forEach((oscillator) =>
                oscillator.stop(),
            );
            void audio.current?.context.close();
        };
    }, []);

    const start = async () => {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(0.025, context.currentTime + 1.1);
        gain.connect(context.destination);
        const oscillators = [110, 164.81, 220].map((frequency, index) => {
            const oscillator = context.createOscillator();
            oscillator.type = index === 0 ? 'sine' : 'triangle';
            oscillator.frequency.setValueAtTime(frequency, context.currentTime);
            oscillator.connect(gain);
            oscillator.start();

            return oscillator;
        });

        audio.current = { context, gain, oscillators };
        await context.resume();
        setPlaying(true);
    };

    const stop = async () => {
        const current = audio.current;

        if (!current) {
            return;
        }

        current.gain.gain.linearRampToValueAtTime(
            0,
            current.context.currentTime + 0.2,
        );
        window.setTimeout(() => {
            current.oscillators.forEach((oscillator) => oscillator.stop());
            void current.context.close();
        }, 260);
        audio.current = null;
        setPlaying(false);
    };

    const toggle = () => {
        if (playing) {
            void stop();
        } else {
            void start();
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center p-7 text-center">
            <div className="relative mb-7 grid size-36 place-items-center rounded-full border border-cyan-400/20 bg-[radial-gradient(circle,rgba(34,211,238,0.14),transparent_68%)]">
                <Music2
                    className={`size-10 text-cyan-300 ${playing ? 'animate-pulse' : ''}`}
                />
                {playing && (
                    <span className="absolute inset-0 animate-ping rounded-full border border-cyan-300/15" />
                )}
            </div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-slate-500">
                AMBIENT SYSTEM
            </p>
            <h2 className="mt-3 text-lg font-medium text-white">
                Deep Focus Drone
            </h2>
            <p className="mt-2 text-xs text-slate-400">
                Generated locally with Web Audio
            </p>
            <button
                type="button"
                onClick={toggle}
                className="mt-7 grid size-12 place-items-center rounded-full bg-cyan-400 text-[#03111c] transition hover:bg-cyan-300"
            >
                {playing ? (
                    <Pause className="size-5" />
                ) : (
                    <Play className="ml-0.5 size-5" />
                )}
            </button>
        </div>
    );
}
