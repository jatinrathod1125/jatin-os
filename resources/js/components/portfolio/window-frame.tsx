import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import { Minus, X } from 'lucide-react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { AppId } from '@/components/portfolio/types';

type WindowFrameProps = {
    app: AppId;
    title: string;
    subtitle: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    children: ReactNode;
    onClose: (app: AppId) => void;
    onFocus: (app: AppId) => void;
    onMinimize: (app: AppId) => void;
};

export function WindowFrame({
    app,
    title,
    subtitle,
    position,
    size,
    zIndex,
    children,
    onClose,
    onFocus,
    onMinimize,
}: WindowFrameProps) {
    const controls = useDragControls();
    const reduceMotion = useReducedMotion();
    const [canDrag, setCanDrag] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)');
        const update = () => setCanDrag(media.matches);

        update();
        media.addEventListener('change', update);

        return () => media.removeEventListener('change', update);
    }, []);

    const style = {
        zIndex,
        '--window-left': `${position.x}px`,
        '--window-top': `${position.y}px`,
        '--window-width': `${size.width}px`,
        '--window-height': `${size.height}px`,
    } as CSSProperties;

    const startDragging = (event: PointerEvent<HTMLDivElement>) => {
        onFocus(app);

        if (canDrag) {
            controls.start(event);
        }
    };

    return (
        <motion.section
            drag={canDrag}
            dragControls={controls}
            dragListener={false}
            dragMomentum={false}
            onPointerDown={() => onFocus(app)}
            initial={
                reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
                reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            style={style}
            className="absolute inset-x-3 top-16 bottom-20 flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#071221]/92 shadow-[0_28px_80px_rgba(0,0,0,0.5),0_0_35px_rgba(15,216,255,0.07)] backdrop-blur-2xl md:inset-auto md:top-[var(--window-top)] md:left-[var(--window-left)] md:h-[var(--window-height)] md:w-[var(--window-width)]"
        >
            <div
                onPointerDown={startDragging}
                className="flex h-12 shrink-0 cursor-default items-center justify-between border-b border-white/8 bg-white/[0.035] px-4 md:cursor-grab md:active:cursor-grabbing"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-rose-400/80" />
                        <span className="size-2.5 rounded-full bg-amber-300/80" />
                        <span className="size-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                            {title}
                        </p>
                        <p className="truncate font-mono text-[10px] text-slate-500">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label={`Minimize ${title}`}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => onMinimize(app)}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-white/8 hover:text-slate-200"
                    >
                        <Minus className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        aria-label={`Close ${title}`}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={() => onClose(app)}
                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-400/15 hover:text-rose-300"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </motion.section>
    );
}
