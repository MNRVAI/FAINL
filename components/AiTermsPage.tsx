import { FC } from 'react';
import { Cpu } from 'lucide-react';
import { SEO } from './SEO';

export const AiTermsPage: FC = () => {
  return (
    <>
    <SEO
      title="Aanvullende AI-Gebruiksvoorwaarden — FAINL"
      description="De aanvullende gebruiksvoorwaarden voor AI-functionaliteiten van FAINL. Versie 03-2026."
      canonical="/ai-voorwaarden"
      keywords="FAINL AI voorwaarden, AI gebruiksvoorwaarden, AI terms FAINL"
    />
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-white/20 p-8 md:p-16 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-10 border-b-4 border-black/10 dark:border-white/10">
          <div className="w-16 h-16 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0">
            <Cpu className="text-white dark:text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-none mb-2">Aanvullende AI-Gebruiksvoorwaarden</h1>
            <p className="text-sm font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">FAINL — MNRV · Versie 03.2026 · Bijgewerkt 13-03-2026</p>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-base max-w-none dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-p:text-black/70 dark:prose-p:text-white/60 prose-li:text-black/70 dark:prose-li:text-white/60 prose-strong:text-black dark:prose-strong:text-white">

          <h2>Toepasselijkheid</h2>
          <p>Deze aanvullende voorwaarden zijn van toepassing op ieder gebruik van AI-functionaliteiten binnen FAINL en vormen een aanvulling op de algemene voorwaarden. Bij strijdigheid prevaleren deze aanvullende voorwaarden voor zover het specifiek AI-functionaliteiten betreft.</p>

          <h2>Karakter van de Dienst</h2>
          <p>FAINL levert een AI-ondersteunde dienst waarbij Input van Gebruiker geautomatiseerd wordt verwerkt tot Output. De website presenteert FAINL publiekelijk als oplossing waarbij meerdere AI's tot één antwoord worden gebracht. Gebruiker erkent dat de Dienst probabilistisch werkt en geen menselijke beoordeling vervangt.</p>

          <h2>Geen garantie op juistheid</h2>
          <p>FAINL geeft geen garantie dat Output:</p>
          <ul>
            <li>feitelijk juist is;</li>
            <li>volledig is;</li>
            <li>actueel is;</li>
            <li>vrij is van vooringenomenheid, hallucinaties of onwenselijke patronen;</li>
            <li>geschikt is voor juridische, financiële, medische, HR-, compliance- of andere hoog-risicobeslissingen.</li>
          </ul>
          <p>Gebruiker blijft te allen tijde zelf verantwoordelijk voor verificatie en beoordeling van de Output.</p>

          <h2>Verboden gebruik</h2>
          <p>Het is verboden om FAINL te gebruiken voor:</p>
          <ul>
            <li>onrechtmatige surveillance, profiling of discriminatie;</li>
            <li>misleiding, fraude of identiteitsmisbruik;</li>
            <li>geautomatiseerde besluitvorming met rechtsgevolgen zonder passende menselijke beoordeling;</li>
            <li>het genereren van onrechtmatige, haatdragende, gewelddadige of anderszins verboden content;</li>
            <li>het omzeilen van beveiliging, rate limits of toegangsbeperkingen;</li>
            <li>het testen of ontwikkelen van concurrerende modellen of diensten door extractie, scraping, modeldistillatie of systematische outputverzameling.</li>
          </ul>

          <h2>Persoonsgegevens en vertrouwelijkheid</h2>
          <p>Gebruiker zal geen persoonsgegevens of vertrouwelijke informatie invoeren tenzij daarvoor een geldige rechtsgrond en noodzaak bestaat.</p>
          <p>Het invoeren van bijzondere persoonsgegevens, bedrijfsgeheimen, staatsgeheimen, medische dossiers, BSN's, paspoortgegevens, strafrechtelijke gegevens of vergelijkbare gevoelige informatie is zonder uitdrukkelijke schriftelijke toestemming van FAINL verboden.</p>
          <p>Gebruiker vrijwaart FAINL voor aanspraken die voortvloeien uit ongeoorloofde of onrechtmatige invoer van gegevens.</p>

          <h2>Menselijke controle</h2>
          <p>Gebruiker zal geen wezenlijke zakelijke, juridische, financiële, operationele of personele beslissingen uitsluitend baseren op Output zonder passende menselijke controle, vakinhoudelijke toetsing en contextuele verificatie.</p>

          <h2>Beschikbaarheid van modellen</h2>
          <p>FAINL mag onderliggende modellen, modelcombinaties, providers, prompts, orkestratie en drempelwaarden op ieder moment aanpassen. Gebruiker heeft geen aanspraak op een specifiek model of een identieke uitkomst bij herhaalde invoer.</p>

          <h2>Rechten op Output</h2>
          <p>Voor zover wettelijk mogelijk en behoudens rechten van derden mag Gebruiker de rechtmatig verkregen Output gebruiken voor eigen interne of overeengekomen bedrijfsdoeleinden. Het is Gebruiker niet toegestaan Output zodanig te gebruiken dat daarmee de Dienst, de onderliggende logica of een concurrerend product wordt nagebootst.</p>

          <h2>Audit en handhaving</h2>
          <p>FAINL mag gebruik monitoren voor beveiliging, naleving en misbruikdetectie. Bij vermoeden van verboden gebruik mag FAINL accounts, sessies, Input of toegang blokkeren, onderzoeken, verwijderen of bewaren voor bewijsdoeleinden.</p>

          <h2>Rangorde</h2>
          <p>Bij strijdigheid tussen deze AI-gebruiksvoorwaarden en andere voorwaarden van FAINL prevaleren deze AI-gebruiksvoorwaarden ten aanzien van AI-functionaliteiten.</p>

        </div>
      </div>
    </div>
    </>
  );
};
