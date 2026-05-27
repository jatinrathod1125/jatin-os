export type AppId =
    | 'terminal'
    | 'projects'
    | 'about'
    | 'assistant'
    | 'contact'
    | 'settings'
    | 'music';

export type PortfolioProject = {
    id: number;
    title: string;
    slug: string;
    tagline: string;
    description: string;
    tech_stack: string[] | null;
    repository_url: string | null;
    live_url: string | null;
    accent: 'cyan' | 'violet' | 'emerald' | 'amber';
    featured: boolean;
};

export type PortfolioSkill = {
    id: number;
    name: string;
    category: string;
    level: number;
    summary: string | null;
};

export type Profile = Record<string, string | null>;
