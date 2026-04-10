import { FC } from 'react';
import { Shield, Lock, Eye, Server, Cpu, Globe } from 'lucide-react';

export const PrivacyPolicyPage: FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-fade-in-up">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-1000/10 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-semibold mb-4">
          <Shield className="w-3.5 h-3.5" />
          Privacy Policy
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
          How We Handle Your Data
        </h1>
        <p className="max-w-sm mx-auto text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed">
          FAINL is built privacy-first. Here's exactly what we collect, what we don't, and why.
        </p>
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600 font-medium">Version 1.0.0 · Effective immediately</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">

        <div className="glass-card card-shadow rounded-2xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Overview</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            FAINL is designed with a privacy-first architecture. Our goal is to provide powerful multi-model AI analysis while ensuring you remain the sole owner of your data. This document outlines exactly how your information is handled.
          </p>
        </div>

        <div className="glass-card card-shadow rounded-2xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Server className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Data Storage</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
            FAINL operates on a local-first storage model. Your data stays in your browser:
          </p>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span><strong className="text-zinc-700 dark:text-zinc-300">Session History:</strong> All your questions, council responses, and verdicts are stored in your browser's local storage only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span><strong className="text-zinc-700 dark:text-zinc-300">API Keys:</strong> Keys you enter in Settings are stored only in your browser. We never transmit them to our servers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span><strong className="text-zinc-700 dark:text-zinc-300">No Central Database:</strong> Unless you sign in with a social account, we maintain no server-side record of your activity.</span>
            </li>
          </ul>
        </div>

        <div className="glass-card card-shadow rounded-2xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">AI Processing</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
            When you submit a question, it is sent to third-party AI providers (Google, OpenAI, Anthropic, Groq, etc.) as configured in your settings. Please note:
          </p>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span>We do not use your inputs to train any models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span>When using managed access tiers, your queries are routed through our secure proxy before reaching the AI providers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span>Each provider has its own privacy policy governing how they handle inputs. We recommend reviewing those as well.</span>
            </li>
          </ul>
        </div>

        <div className="glass-card card-shadow rounded-2xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Authentication</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
            Authentication is handled via Supabase. When you sign in with Google, GitHub, or a magic link:
          </p>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span>We store only minimal data — your email address and user ID — to manage your access tier and purchase history.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
              <span>This identity is required to access your session history dashboard across devices.</span>
            </li>
          </ul>
        </div>

        <div className="glass-card card-shadow rounded-2xl p-6 md:p-7 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-400/15 to-transparent" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-1000/10 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Legal Compliance</h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            FAINL is committed to decentralized privacy standards. By using FAINL, you acknowledge responsibility for the content you input. We prohibit use of FAINL for any illegal activity, as described in our Terms of Service.
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-zinc-400 dark:text-zinc-600 font-medium">
        Questions?{' '}
        <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Reach out via the Contact page.</span>
      </p>
    </div>
  );
};
