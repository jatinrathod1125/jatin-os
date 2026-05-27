import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bot,
    BriefcaseBusiness,
    CircleUserRound,
    FolderKanban,
    LockKeyhole,
    Mail,
    Music2,
    Settings2,
    TerminalSquare,
    Wifi,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AboutApp } from '@/components/portfolio/about-app';
import { AssistantApp } from '@/components/portfolio/assistant-app';
import { BootScreen } from '@/components/portfolio/boot-screen';
import { ContactApp } from '@/components/portfolio/contact-app';
import { ProjectsApp } from '@/components/portfolio/projects-app';
import { TerminalApp } from '@/components/portfolio/terminal-app';
import type {
    AppId,
    PortfolioProject,
    PortfolioSkill,
    Profile,
} from '@/components/portfolio/types';
import { MusicApp, SettingsApp } from '@/components/portfolio/utilities-app';
import { WindowFrame } from '@/components/portfolio/window-frame';
import type { User } from '@/types';

type Props = {
    projects: PortfolioProject[];
    skills: PortfolioSkill[];
    profile: Profile;
};

type WindowState = {
    open: boolean;
    minimized: boolean;
    zIndex: number;
};

type AppConfig = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    position: { x: number; y: number };
    size: { width: number; height: number };
};

const applications: Record<AppId, AppConfig> = {
    terminal: {
        title: 'Terminal',
        subtitle: 'shell / guest',
        icon: TerminalSquare,
        position: { x: 52, y: 122 },
        size: { width: 570, height: 390 },
    },
    projects: {
        title: 'Projects',
        subtitle: 'filesystem / builds',
        icon: FolderKanban,
        position: { x: 194, y: 96 },
        size: { width: 820, height: 540 },
    },
    about: {
        title: 'About',
        subtitle: 'identity / skills',
        icon: CircleUserRound,
        position: { x: 235, y: 128 },
        size: { width: 720, height: 520 },
    },
    assistant: {
        title: 'ORBIT Assistant',
        subtitle: 'ai / active',
        icon: Bot,
        position: { x: 650, y: 104 },
        size: { width: 450, height: 545 },
    },
    contact: {
        title: 'Contact',
        subtitle: 'inbox / encrypted',
        icon: Mail,
        position: { x: 332, y: 120 },
        size: { width: 700, height: 500 },
    },
    settings: {
        title: 'Settings',
        subtitle: 'system / preferences',
        icon: Settings2,
        position: { x: 580, y: 180 },
        size: { width: 390, height: 430 },
    },
    music: {
        title: 'Audio',
        subtitle: 'ambient / local',
        icon: Music2,
        position: { x: 725, y: 182 },
        size: { width: 345, height: 410 },
    },
};

const startingWindows: Record<AppId, WindowState> = {
    terminal: { open: true, minimized: false, zIndex: 12 },
    projects: { open: false, minimized: false, zIndex: 11 },
    about: { open: false, minimized: false, zIndex: 10 },
    assistant: { open: true, minimized: false, zIndex: 13 },
    contact: { open: false, minimized: false, zIndex: 10 },
    settings: { open: false, minimized: false, zIndex: 10 },
    music: { open: false, minimized: false, zIndex: 10 },
};

export default function Portfolio({ projects, skills, profile }: Props) {
    const page = usePage<{ auth: { user: User | null } }>();
    const user = page.props.auth.user;
    const nextZ = useRef(13);
    const [booting, setBooting] = useState(true);
    const [glow, setGlow] = useState(true);
    const [windows, setWindows] = useState(startingWindows);
    const [time, setTime] = useState(() => formatTime());

    useEffect(() => {
        const timer = window.setInterval(() => setTime(formatTime()), 1000);

        return () => window.clearInterval(timer);
    }, []);

    const completeBoot = useCallback(() => setBooting(false), []);

    const focus = (app: AppId) => {
        nextZ.current += 1;
        setWindows((current) => ({
            ...current,
            [app]: { ...current[app], zIndex: nextZ.current },
        }));
    };

    const open = (app: AppId) => {
        nextZ.current += 1;
        setWindows((current) => ({
            ...current,
            [app]: { open: true, minimized: false, zIndex: nextZ.current },
        }));
    };

    const close = (app: AppId) => {
        setWindows((current) => ({
            ...current,
            [app]: { ...current[app], open: false },
        }));
    };

    const minimize = (app: AppId) => {
        setWindows((current) => ({
            ...current,
            [app]: { ...current[app], minimized: true },
        }));
    };

    return (
        <>
            <Head title="Jatin OS | Laravel Developer Portfolio" />
            <main
                className={`relative h-screen min-h-[620px] overflow-hidden bg-[#030812] text-slate-100 ${
                    glow ? 'os-glow' : ''
                }`}
            >
                <div className="os-grid absolute inset-0 opacity-45" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(124,58,237,0.19),transparent_30%),radial-gradient(circle_at_25%_74%,rgba(6,182,212,0.18),transparent_33%)]" />
                <div className="os-scanlines pointer-events-none absolute inset-0 z-[90] opacity-20" />

                <AnimatePresence>
                    {booting && <BootScreen onComplete={completeBoot} />}
                </AnimatePresence>

                {!booting && (
                    <motion.div
                        className="relative h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <StatusBar time={time} user={user} onOpen={open} />
                        <DesktopIcons onOpen={open} />

                        <AnimatePresence>
                            {(Object.entries(windows) as [AppId, WindowState][])
                                .filter(
                                    ([, window]) =>
                                        window.open && !window.minimized,
                                )
                                .map(([app, window]) => {
                                    const config = applications[app];

                                    return (
                                        <WindowFrame
                                            key={app}
                                            app={app}
                                            title={config.title}
                                            subtitle={config.subtitle}
                                            position={config.position}
                                            size={config.size}
                                            zIndex={window.zIndex}
                                            onClose={close}
                                            onFocus={focus}
                                            onMinimize={minimize}
                                        >
                                            {app === 'terminal' && (
                                                <TerminalApp
                                                    projects={projects}
                                                    skills={skills}
                                                    onOpen={open}
                                                />
                                            )}
                                            {app === 'projects' && (
                                                <ProjectsApp
                                                    projects={projects}
                                                />
                                            )}
                                            {app === 'about' && (
                                                <AboutApp
                                                    profile={profile}
                                                    skills={skills}
                                                />
                                            )}
                                            {app === 'assistant' && (
                                                <AssistantApp />
                                            )}
                                            {app === 'contact' && (
                                                <ContactApp profile={profile} />
                                            )}
                                            {app === 'settings' && (
                                                <SettingsApp
                                                    authenticated={Boolean(
                                                        user,
                                                    )}
                                                    admin={Boolean(
                                                        user?.is_admin,
                                                    )}
                                                    glow={glow}
                                                    onToggleGlow={() =>
                                                        setGlow(
                                                            (value) => !value,
                                                        )
                                                    }
                                                    onReplayBoot={() =>
                                                        setBooting(true)
                                                    }
                                                />
                                            )}
                                            {app === 'music' && <MusicApp />}
                                        </WindowFrame>
                                    );
                                })}
                        </AnimatePresence>

                        <Dock windows={windows} onOpen={open} />
                    </motion.div>
                )}
            </main>
        </>
    );
}

function StatusBar({
    time,
    user,
    onOpen,
}: {
    time: string;
    user: User | null;
    onOpen: (app: AppId) => void;
}) {
    return (
        <header className="absolute inset-x-0 top-0 z-40 flex h-11 items-center justify-between border-b border-white/8 bg-[#030812]/65 px-4 backdrop-blur-xl">
            <button
                type="button"
                onClick={() => onOpen('about')}
                className="flex items-center gap-3"
            >
                <span className="grid size-7 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 font-mono text-[10px] font-semibold text-cyan-300">
                    JO
                </span>
                <span className="hidden font-mono text-[11px] tracking-[0.18em] text-slate-400 sm:inline">
                    JATIN_OS
                </span>
            </button>
            <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
                <span className="hidden items-center gap-1.5 text-emerald-300 sm:flex">
                    <Wifi className="size-3.5" />
                    ONLINE
                </span>
                <span>{time}</span>
                {user ? (
                    <Link
                        href={user.is_admin ? '/admin' : '/dashboard'}
                        className="rounded-full border border-white/10 px-3 py-1 text-slate-200 hover:border-cyan-300/30"
                    >
                        {user.name}
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-slate-300 hover:border-cyan-300/30 hover:text-cyan-200"
                    >
                        <LockKeyhole className="size-3" />
                        LOGIN
                    </Link>
                )}
            </div>
        </header>
    );
}

function DesktopIcons({ onOpen }: { onOpen: (app: AppId) => void }) {
    const iconApps: AppId[] = ['projects', 'about', 'assistant', 'contact'];

    return (
        <div className="absolute top-16 left-4 z-[1] hidden flex-col gap-3 md:flex">
            {iconApps.map((app) => {
                const config = applications[app];
                const Icon = config.icon;

                return (
                    <button
                        key={app}
                        type="button"
                        onDoubleClick={() => onOpen(app)}
                        onClick={() => onOpen(app)}
                        className="group flex w-[88px] flex-col items-center gap-2 rounded-xl px-2 py-3 text-xs text-slate-300 transition hover:bg-white/[0.055]"
                    >
                        <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.045] transition group-hover:border-cyan-300/30 group-hover:text-cyan-200">
                            <Icon className="size-5" />
                        </span>
                        {config.title}
                    </button>
                );
            })}
        </div>
    );
}

function Dock({
    windows,
    onOpen,
}: {
    windows: Record<AppId, WindowState>;
    onOpen: (app: AppId) => void;
}) {
    const dockApps: AppId[] = [
        'terminal',
        'projects',
        'about',
        'assistant',
        'contact',
        'music',
        'settings',
    ];

    return (
        <nav className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/10 bg-[#071221]/75 p-2 shadow-2xl backdrop-blur-xl">
            {dockApps.map((app) => {
                const config = applications[app];
                const Icon = config.icon;

                return (
                    <button
                        key={app}
                        type="button"
                        title={config.title}
                        onClick={() => onOpen(app)}
                        className="relative grid size-11 place-items-center rounded-xl text-slate-400 transition hover:bg-white/8 hover:text-cyan-200"
                    >
                        <Icon className="size-5" />
                        {windows[app].open && (
                            <span className="absolute bottom-1 size-1 rounded-full bg-cyan-300" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}

function formatTime(): string {
    return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date());
}
