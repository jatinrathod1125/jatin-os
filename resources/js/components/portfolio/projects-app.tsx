import { ArrowUpRight, Code2, FolderGit2, Layers3 } from 'lucide-react';
import { useState } from 'react';
import type { PortfolioProject } from '@/components/portfolio/types';

const accents: Record<PortfolioProject['accent'], string> = {
    cyan: 'border-cyan-400/35 bg-cyan-400/8 text-cyan-300',
    violet: 'border-violet-400/35 bg-violet-400/8 text-violet-300',
    emerald: 'border-emerald-400/35 bg-emerald-400/8 text-emerald-300',
    amber: 'border-amber-400/35 bg-amber-400/8 text-amber-300',
};

export function ProjectsApp({ projects }: { projects: PortfolioProject[] }) {
    const [selectedId, setSelectedId] = useState(projects[0]?.id);
    const selected =
        projects.find((project) => project.id === selectedId) ?? projects[0];

    if (!selected) {
        return (
            <p className="p-6 text-sm text-slate-400">
                No published projects yet.
            </p>
        );
    }

    return (
        <div className="grid min-h-full gap-0 md:grid-cols-[235px_1fr]">
            <div className="border-b border-white/8 p-3 md:border-r md:border-b-0">
                <p className="mb-3 px-2 font-mono text-[10px] tracking-[0.24em] text-slate-500">
                    /PROJECTS
                </p>
                <div className="flex gap-2 overflow-x-auto md:block md:space-y-2">
                    {projects.map((project) => (
                        <button
                            type="button"
                            key={project.id}
                            onClick={() => setSelectedId(project.id)}
                            className={`min-w-52 rounded-xl border px-3 py-3 text-left transition md:w-full md:min-w-0 ${
                                selected.id === project.id
                                    ? accents[project.accent]
                                    : 'border-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.035]'
                            }`}
                        >
                            <span className="block truncate text-sm font-medium text-slate-100">
                                {project.title}
                            </span>
                            <span className="mt-1 block truncate text-xs opacity-70">
                                {project.tagline}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <article className="p-5 sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <div
                            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] ${accents[selected.accent]}`}
                        >
                            <Layers3 className="size-3" />
                            {selected.featured
                                ? 'FEATURED BUILD'
                                : 'CASE STUDY'}
                        </div>
                        <h2 className="text-2xl font-semibold text-white">
                            {selected.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-cyan-100/75">
                            {selected.tagline}
                        </p>
                    </div>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-300">
                    {selected.description}
                </p>
                <div className="mt-7">
                    <p className="mb-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-slate-500">
                        <Code2 className="size-3" />
                        TECHNOLOGY STACK
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {(selected.tech_stack ?? []).map((technology) => (
                            <span
                                key={technology}
                                className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-300"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                    {selected.live_url && (
                        <a
                            href={selected.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-[#03111b] transition hover:bg-cyan-300"
                        >
                            Live demo <ArrowUpRight className="size-4" />
                        </a>
                    )}
                    {selected.repository_url && (
                        <a
                            href={selected.repository_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/35 hover:text-cyan-200"
                        >
                            <FolderGit2 className="size-4" />
                            Source
                        </a>
                    )}
                </div>
            </article>
        </div>
    );
}
