import { Cpu, MapPin, Sparkles } from 'lucide-react';
import type { PortfolioSkill, Profile } from '@/components/portfolio/types';

export function AboutApp({
    profile,
    skills,
}: {
    profile: Profile;
    skills: PortfolioSkill[];
}) {
    const categories = Object.groupBy(skills, (skill) => skill.category);

    return (
        <div className="p-5 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                <section>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 px-3 py-1 text-xs text-cyan-300">
                        <Sparkles className="size-3.5" />
                        {profile.availability ??
                            'Available for new opportunities'}
                    </div>
                    <p className="font-mono text-xs tracking-[0.24em] text-cyan-300">
                        {profile.role ?? 'FULL-STACK DEVELOPER'}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                        {profile.owner_name ?? 'Jatin'}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                        {profile.intro}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="size-4 text-cyan-300" />
                        {profile.location ?? 'Remote'}
                    </div>
                </section>
                <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                    <p className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-slate-500">
                        <Cpu className="size-3.5" />
                        CAPABILITY MATRIX
                    </p>
                    <div className="space-y-5">
                        {Object.entries(categories).map(
                            ([category, entries]) => (
                                <div key={category}>
                                    <p className="mb-2 text-xs font-medium text-slate-400">
                                        {category}
                                    </p>
                                    <div className="space-y-3">
                                        {(entries ?? []).map((skill) => (
                                            <div key={skill.id}>
                                                <div className="mb-1.5 flex justify-between text-xs">
                                                    <span className="text-slate-200">
                                                        {skill.name}
                                                    </span>
                                                    <span className="font-mono text-cyan-300">
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-white/8">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                                                        style={{
                                                            width: `${skill.level}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
