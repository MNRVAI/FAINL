import { FC } from 'react';
import { Shield, Lock, Eye, Server, Cpu, Globe } from 'lucide-react';

export const PrivacyPolicyPage: FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 md:p-16 shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] dark:shadow-[24px_24px_0px_1px_rgba(255,255,255,0.1)]">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 pb-16 border-b-4 border-black/5 dark:border-white/5">
          <div className="w-24 h-24 bg-black dark:bg-white rounded flex items-center justify-center shrink-0 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[12px_12px_0px_1px_rgba(255,255,255,0.05)]">
            <Shield className="text-white dark:text-black w-12 h-12" />
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-4 text-black dark:text-white">Neural Privacy Protocol</h1>
            <p className="text-black/40 dark:text-white/40 font-bold uppercase text-xs md:text-sm tracking-[0.3em]">Compliance Standards & Data Transparency • Version 1.0.0</p>
          </div>
        </div>

        <div className="prose prose-xl max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-p:text-black/70 dark:prose-p:text-white/70 prose-strong:text-black dark:prose-strong:text-white prose-li:text-black/70 dark:prose-li:text-white/70 leading-relaxed space-y-16">
          
          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Eye className="w-8 h-8" />
              <h2 className="text-3xl m-0">01. Overview</h2>
            </div>
            <p>
              FAINL (Fully Autonomous Intelligence Network & Logic) is designed with a **Privacy-First** architecture. 
              Our mission is to provide high-complexity neural deliberation while ensuring that the user remains the sole owner of their data. 
              This protocol outlines exactly how your information is handled within the neural corridors of our application.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Server className="w-8 h-8" />
              <h2 className="text-3xl m-0">02. Data Persistence</h2>
            </div>
            <p>
              FAINL operates primarily on a **Local-Only Persistence** model. 
            </p>
            <ul>
              <li>**Session History**: All mission logs, council deliberations, and verdicts are stored directly in your browser's `localStorage`.</li>
              <li>**API Keys**: Credentials provided in the Settings terminal are encrypted and stored locally. We never transmit these keys to our own servers.</li>
              <li>**No Cloud Database**: Unless explicitly stated (e.g., through Third-Party Social Auth), we do not maintain a centralized database of your mission strings.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Cpu className="w-8 h-8" />
              <h2 className="text-3xl m-0">03. Neural Processing</h2>
            </div>
            <p>
              To initialize missions, your input is transmitted to third-party Large Language Model (LLM) providers (Google, OpenAI, Anthropic, etc.) as configured in your settings.
            </p>
            <ul>
              <li>**Transient State**: Data sent to these providers is treated as transient. We do not use your inputs for model training.</li>
              <li>**Managed Access**: If using our "Managed Access" tiers, your query is proxied through our secure encryption layer before reaching the processing nodes.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Lock className="w-8 h-8" />
              <h2 className="text-3xl m-0">04. Authentication (Neural Vault)</h2>
            </div>
            <p>
              Authentication is managed via **Supabase**. When you connect via Google, GitHub, or Email:
            </p>
            <ul>
              <li>We collect minimal metadata (Email/UID) to manage your neural access tiers and purchase history.</li>
              <li>Access to the "My FAINLS" dashboard is gated by this identity verification to prevent unauthorized local terminal access.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6 text-black dark:text-white">
              <Globe className="w-8 h-8" />
              <h2 className="text-3xl m-0">05. Law & Compliance</h2>
            </div>
            <p>
              FAINL adheres to decentralized privacy standards. By using this terminal, you acknowledge that you are responsible for the data you input. 
              We strictly forbid the use of FAINL for illegal activities, as outlined in our Terms of Protocol.
            </p>
          </section>

          <div className="pt-16 border-t-4 border-black dark:border-white/20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 dark:text-white/20 text-center">
              End of Protocol • Secure Transmission Confirmed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
