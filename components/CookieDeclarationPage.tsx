import { FC } from 'react';
import { Cookie } from 'lucide-react';
import { SEO } from './SEO';

export const CookieDeclarationPage: FC = () => {
  return (
    <>
    <SEO
      title="Cookieverklaring — FAINL"
      description="Welke cookies FAINL gebruikt en hoe je ze beheert. Versie 13-03-2026."
      canonical="/cookies"
      keywords="FAINL cookies, cookieverklaring, cookiebeleid FAINL"
    />
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-10 border-b-4 border-black/10 dark:border-white/10">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="text-white dark:text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-none mb-2">Cookieverklaring</h1>
            <p className="text-sm font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">FAINL — MNRV · Versie 13-03-2026</p>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-base max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-p:text-black/70 dark:prose-p:text-white/60 prose-li:text-black/70 dark:prose-li:text-white/60 prose-strong:text-black dark:prose-strong:text-white">

          <p>FAINL gebruikt functionele, analytische en, indien van toepassing, marketingcookies.</p>

          <h2>Functionele cookies</h2>
          <p>Deze zijn noodzakelijk voor het correct functioneren van de website en applicatie, waaronder sessiebeheer, beveiliging, inloggen en voorkeuren. Voor deze cookies is geen toestemming vereist.</p>

          <h2>Analytische cookies</h2>
          <p>Deze helpen FAINL om gebruik, prestaties, fouten en gebruikerservaring te analyseren en de Dienst te verbeteren. Waar wettelijk vereist wordt hiervoor toestemming gevraagd.</p>

          <h2>Marketingcookies</h2>
          <p>Alleen indien FAINL marketing- of remarketingtools inzet en voor zover wettelijk vereist uitsluitend na voorafgaande toestemming. Zonder toestemming worden geen marketingcookies geplaatst.</p>

          <h2>Cookiebeheer</h2>
          <p>Gebruikers kunnen hun voorkeuren aanpassen via de cookiebanner of browserinstellingen. Het uitschakelen van bepaalde cookies kan de werking van de website beïnvloeden.</p>

          <h2>Derde partijen</h2>
          <p>Indien derde partijen cookies plaatsen, vermeldt FAINL deze in het cookieoverzicht met naam, doel, bewaartermijn en aanbieder. FAINL kan dit overzicht bijwerken wanneer nieuwe derde partijen worden ingezet.</p>

          <h2>Contact</h2>
          <p>Voor vragen over cookies: <a href="mailto:info@mnrv.nl">info@mnrv.nl</a></p>

        </div>
      </div>
    </div>
    </>
  );
};
