/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Users, Clock, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  flag: string;
  launchHour: string;
}

const COUNTRIES: Country[] = [
  // West & Central Africa (Primary Market)
  { name: "Côte d'Ivoire", code: "+225", flag: "🇨🇮", launchHour: "19h00 (Heure d'Abidjan)" },
  { name: "Sénégal", code: "+221", flag: "🇸🇳", launchHour: "19h00 (Heure de Dakar)" },
  { name: "Cameroun", code: "+237", flag: "🇨🇲", launchHour: "20h00 (Heure de Douala)" },
  { name: "Mali", code: "+223", flag: "🇲🇱", launchHour: "19h00 (Heure de Bamako)" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫", launchHour: "19h00 (Heure de Ouagadougou)" },
  { name: "Bénin", code: "+229", flag: "🇧🇯", launchHour: "20h00 (Heure de Cotonou)" },
  { name: "Togo", code: "+228", flag: "🇹🇬", launchHour: "19h00 (Heure de Lomé)" },
  { name: "Guinée", code: "+224", flag: "🇬🇳", launchHour: "19h00 (Heure de Conakry)" },
  { name: "Gabon", code: "+241", flag: "🇬🇦", launchHour: "20h00 (Heure de Libreville)" },
  { name: "Rép. Dém. du Congo", code: "+243", flag: "🇨🇩", launchHour: "20h00 (Heure de Kinshasa)" },
  { name: "Congo-Brazzaville", code: "+242", flag: "🇨🇬", launchHour: "20h00 (Heure de Brazzaville)" },
  { name: "Niger", code: "+227", flag: "🇳🇪", launchHour: "20h00 (Heure de Niamey)" },
  { name: "Tchad", code: "+235", flag: "🇹🇩", launchHour: "20h00 (Heure de N'Djamena)" },
  { name: "Centrafrique", code: "+236", flag: "🇨🇫", launchHour: "20h00 (Heure de Bangui)" },
  { name: "Guinée Équatoriale", code: "+240", flag: "🇬🇶", launchHour: "20h00 (Heure de Malabo)" },
  { name: "France", code: "+33", flag: "🇫🇷", launchHour: "21h00 (Heure de Paris)" },
  { name: "Belgique", code: "+32", flag: "🇧🇪", launchHour: "21h00 (Heure de Bruxelles)" },
  { name: "Canada", code: "+1", flag: "🇨🇦", launchHour: "15h00 (Heure de Montréal)" },
  { name: "Suisse", code: "+41", flag: "🇨🇭", launchHour: "21h00 (Heure de Zurich)" },
  { name: "États-Unis", code: "+1", flag: "🇺🇸", launchHour: "15h00 (Heure de New York)" },

  // Rest of Africa & World Alphabetical
  { name: "Algérie", code: "+213", flag: "🇩🇿", launchHour: "20h00 (Heure d'Alger)" },
  { name: "Allemagne", code: "+49", flag: "🇩🇪", launchHour: "21h00 (Heure de Berlin)" },
  { name: "Maroc", code: "+212", flag: "🇲🇦", launchHour: "20h00 (Heure de Casablanca)" },
  { name: "Tunisie", code: "+216", flag: "🇹🇳", launchHour: "20h00 (Heure de Tunis)" },
  { name: "Royaume-Uni", code: "+44", flag: "🇬🇧", launchHour: "20h00 (Heure de Londres)" },
  { name: "La Réunion", code: "+262", flag: "🇷🇪", launchHour: "23h00 (Heure de Saint-Denis)" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬", launchHour: "22h00 (Heure de Antananarivo)" }
];

interface WaitlistMember {
  rank: number;
  email: string;
  phone: string;
  country: string;
  flag: string;
  time: string;
  isUser?: boolean;
}

function getRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "À l'instant";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "À l'instant";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `il y a ${diffHour} h`;
    const diffDays = Math.floor(diffHour / 24);
    return `il y a ${diffDays} j`;
  } catch (e) {
    return "À l'instant";
  }
}

async function fetchRealWaitlist(): Promise<any[]> {
  try {
    const response = await fetch('/api/waitlist');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Error fetching from local waitlist API:", err);
  }
  return [];
}

interface WaitlistPageProps {
  onBack: () => void;
  source?: string;
}

export default function WaitlistPage({ onBack, source = 'general' }: WaitlistPageProps) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('mz_user_registered') === 'true';
  });
  const [showList, setShowList] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Base 300 members state
  const [members, setMembers] = useState<WaitlistMember[]>([]);
  const [totalCount, setTotalCount] = useState(() => {
    const saved = localStorage.getItem('mz_waitlist_total_count');
    return saved ? parseInt(saved, 10) : 300;
  });
  const [userRank, setUserRank] = useState<number>(() => {
    const saved = localStorage.getItem('mz_user_rank');
    return saved ? parseInt(saved, 10) : 301;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically detect country on mount based on timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        const lowerTz = tz.toLowerCase();
        let detected: Country | undefined;
        if (lowerTz.includes('douala') || lowerTz.includes('yaounde') || lowerTz.includes('cameroon')) {
          detected = COUNTRIES.find(c => c.name === "Cameroun");
        } else if (lowerTz.includes('abidjan') || lowerTz.includes('cote d') || lowerTz.includes('ivoire')) {
          detected = COUNTRIES.find(c => c.name === "Côte d'Ivoire");
        } else if (lowerTz.includes('dakar') || lowerTz.includes('senegal')) {
          detected = COUNTRIES.find(c => c.name === "Sénégal");
        } else if (lowerTz.includes('bamako') || lowerTz.includes('mali')) {
          detected = COUNTRIES.find(c => c.name === "Mali");
        } else if (lowerTz.includes('ouagadougou') || lowerTz.includes('burkina')) {
          detected = COUNTRIES.find(c => c.name === "Burkina Faso");
        } else if (lowerTz.includes('libreville') || lowerTz.includes('gabon')) {
          detected = COUNTRIES.find(c => c.name === "Gabon");
        } else if (lowerTz.includes('cotonou') || lowerTz.includes('benin')) {
          detected = COUNTRIES.find(c => c.name === "Bénin");
        } else if (lowerTz.includes('lome') || lowerTz.includes('togo')) {
          detected = COUNTRIES.find(c => c.name === "Togo");
        } else if (lowerTz.includes('conakry') || lowerTz.includes('guinee')) {
          detected = COUNTRIES.find(c => c.name === "Guinée");
        } else if (lowerTz.includes('paris') || lowerTz.includes('france')) {
          detected = COUNTRIES.find(c => c.name === "France");
        } else if (lowerTz.includes('brussels') || lowerTz.includes('belgique')) {
          detected = COUNTRIES.find(c => c.name === "Belgique");
        }

        if (detected) {
          setSelectedCountry(detected);
        }
      }
    } catch (e) {
      console.error("Timezone country detection error:", e);
    }
  }, []);

  // Generate the 300 base members and append real ones from Supabase database
  useEffect(() => {
    let active = true;

    const loadAndBuildWaitlist = async () => {
      // 1. Generate 300 base members deterministically
      const providers = ['gmail.com', 'yahoo.fr', 'outlook.com', 'hotmail.fr', 'icloud.com', 'live.fr'];
      const firstNames = ['Amadou', 'Koffi', 'Yao', 'Moussa', 'Abdoulaye', 'Seydou', 'Ousmane', 'Cheikh', 'Youssouf', 'Mamadou', 'Ibrahim', 'Marc', 'Jean', 'Pierre', 'Thomas', 'Nicolas', 'Antoine', 'Lucas', 'Sarah', 'Awa', 'Fatou', 'Aminata', 'Mariam', 'Yasmina', 'Chloé', 'Marie', 'Sophie', 'Isabelle', 'Bachir', 'Arthur'];
      const lastNames = ['Kouadio', 'Koné', 'Diallo', 'Diop', 'Sow', 'Ndiaye', 'Coulibaly', 'Traoré', 'Keita', 'Kamara', 'Bamba', 'Ouedraogo', 'Fofana', 'Touré', 'Gomez', 'Martin', 'Dubois', 'Moreau', 'Laurent', 'Lefebvre', 'Michel', 'Bernard', 'David', 'Simon', 'Soro', 'Cissé'];
      
      const countryPool = COUNTRIES.slice(0, 15); // Primary African and European countries
      const baseMembers: WaitlistMember[] = [];
      
      // Fill up to 300 items
      for (let i = 1; i <= 300; i++) {
        const nameSeed = (i * 73) % firstNames.length;
        const lastSeed = (i * 101) % lastNames.length;
        const provSeed = (i * 13) % providers.length;
        const countrySeed = (i * 17) % countryPool.length;
        
        const country = countryPool[countrySeed];
        const fn = firstNames[nameSeed].toLowerCase();
        const ln = lastNames[lastSeed].toLowerCase();
        
        const emailStr = `${fn.slice(0, 1)}${ln.slice(0, 6)}***@${providers[provSeed]}`;
        const phoneSuffix = String((i * 12345) % 90 + 10);
        const phoneStr = `${country.code} •••••••${phoneSuffix}`;
        
        const ageMinutes = 300 - i + 2; 
        let timeStr = "";
        if (ageMinutes < 60) {
          timeStr = `il y a ${ageMinutes} min`;
        } else {
          const hours = Math.floor(ageMinutes / 60);
          if (hours < 24) {
            timeStr = `il y a ${hours} h`;
          } else {
            timeStr = `il y a ${Math.floor(hours / 24)} j`;
          }
        }

        baseMembers.push({
          rank: i,
          email: emailStr,
          phone: phoneStr,
          country: country.name,
          flag: country.flag,
          time: timeStr
        });
      }

      // 2. Fetch real entries from Supabase
      const realEntries = await fetchRealWaitlist();
      
      if (!active) return;

      const userEmail = localStorage.getItem('mz_user_email');
      const userWhatsapp = localStorage.getItem('mz_user_whatsapp');
      
      const mappedRealMembers: WaitlistMember[] = realEntries.map((entry: any, index: number) => {
        const rank = 301 + index;
        const entryEmail = entry.email || '';
        const entryWhatsapp = entry.whatsapp || '';
        
        // Check if this is the user
        const isUserMatch = (userEmail && entryEmail.toLowerCase() === userEmail.toLowerCase()) || 
                            (userWhatsapp && entryWhatsapp === userWhatsapp);

        if (isUserMatch && active) {
          localStorage.setItem('mz_user_rank', String(rank));
          setUserRank(rank);
        }

        // Anonymize email: e.g., ab***@gmail.com
        let emailStr = entryEmail;
        if (emailStr.includes('@')) {
          const parts = emailStr.split('@');
          emailStr = parts[0].slice(0, 2) + "***@" + parts[1];
        } else if (emailStr) {
          emailStr = emailStr.slice(0, 2) + "***";
        } else {
          emailStr = "anonyme***";
        }

        // Phone format
        let phoneStr = "";
        const countryCode = entry.country_code || "+225";
        if (entryWhatsapp) {
          phoneStr = `${countryCode} •••••••${entryWhatsapp.slice(-2)}`;
        } else {
          phoneStr = `${countryCode} •••••••00`;
        }

        // Find country flag
        const entryCountryName = entry.country_name || "Côte d'Ivoire";
        const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === entryCountryName.toLowerCase()) || COUNTRIES[0];

        // Format relative time
        const timeStr = entry.created_at ? getRelativeTime(entry.created_at) : "À l'instant";

        return {
          rank,
          email: emailStr,
          phone: phoneStr,
          country: matchedCountry.name,
          flag: matchedCountry.flag,
          time: timeStr,
          isUser: !!isUserMatch
        };
      });

      // Combine lists
      const combined = [...baseMembers, ...mappedRealMembers];

      // Check if user is registered but NOT matched in the real entries list
      const hasUserMatch = mappedRealMembers.some(m => m.isUser);
      if (isSubmitted && !hasUserMatch && userEmail) {
        const userCountryName = localStorage.getItem('mz_user_country') || selectedCountry.name;
        const matchedCountry = COUNTRIES.find(c => c.name.toLowerCase() === userCountryName.toLowerCase()) || selectedCountry;
        
        let anonEmail = userEmail;
        if (anonEmail.includes('@')) {
          const parts = anonEmail.split('@');
          anonEmail = parts[0].slice(0, 2) + "***@" + parts[1];
        }

        const calculatedUserRank = parseInt(localStorage.getItem('mz_user_rank') || String(301 + mappedRealMembers.length), 10);
        setUserRank(calculatedUserRank);
        
        combined.push({
          rank: calculatedUserRank,
          email: anonEmail,
          phone: userWhatsapp ? `${userWhatsapp.slice(0, 4)} •••••••${userWhatsapp.slice(-2)}` : `${selectedCountry.code} •••••••99`,
          country: matchedCountry.name,
          flag: matchedCountry.flag,
          time: "À l'instant",
          isUser: true
        });
      }

      // Sort to show highest rank first (newest at top)
      combined.sort((a, b) => b.rank - a.rank);
      setMembers(combined);
      setTotalCount(300 + realEntries.length);
    };

    loadAndBuildWaitlist();

    // Poll every 10 seconds to keep the list updated in real-time
    const interval = setInterval(loadAndBuildWaitlist, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isSubmitted, selectedCountry]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    if (!whatsapp || whatsapp.length < 5) {
      setErrorMsg('Veuillez entrer un numéro WhatsApp valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cleanWhatsapp = whatsapp.replace(/\s+/g, '');
    const fullWhatsapp = `${selectedCountry.code}${cleanWhatsapp}`;

    const submissionData = {
      email: email.trim(),
      whatsapp: fullWhatsapp,
      country_code: selectedCountry.code,
      country_name: selectedCountry.name,
      source: source,
      created_at: new Date().toISOString()
    };

    let nextRank = Math.max(totalCount + 1, 301);

    try {
      // Primary: Register on local server API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.list && Array.isArray(resData.list)) {
          const index = resData.list.findIndex((item: any) => item.email.toLowerCase() === email.trim().toLowerCase());
          if (index !== -1) {
            nextRank = 301 + index;
          } else {
            nextRank = 300 + resData.list.length;
          }
        }
      }
    } catch (err) {
      console.warn("Error posting to local waitlist API:", err);
    }
    
    localStorage.setItem('mz_user_registered', 'true');
    localStorage.setItem('mz_user_email', email.trim());
    localStorage.setItem('mz_user_whatsapp', fullWhatsapp);
    localStorage.setItem('mz_user_country', selectedCountry.name);
    localStorage.setItem('mz_user_flag', selectedCountry.flag);
    localStorage.setItem('mz_user_rank', String(nextRank));
    localStorage.setItem('mz_waitlist_total_count', String(nextRank));

    setTotalCount(nextRank);
    setUserRank(nextRank);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Scroll waitlist smoothly to the top to let them see their entry
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative pb-16">
      {/* Decorative cyber grid or glowing lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.03),transparent_60%)] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
            <span>RETOUR AU RAMP DE LANCEMENT</span>
          </button>

          <div className="font-sans font-black text-xl tracking-tighter text-white">
            MZ<span className="text-cyan-400 font-bold ml-0.5 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">+</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-full px-3 py-1 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EN DIRECT</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-12 relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* CENTERED REGISTRATION CARD */
            <motion.div
              key="register-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.05)] space-y-6 mt-4"
            >
              <div className="h-0.5 w-16 bg-cyan-400/80 rounded-full mx-auto" />

              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/20 rounded-full px-3 py-1 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Lancement officiel le 4 Juillet</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-tight">
                  Prendre ma place sur la Liste d'Attente MZ+
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  Les places prioritaires sont strictement limitées à <strong className="text-cyan-400 font-extrabold">150 membres</strong>. Entrez vos coordonnées WhatsApp pour obtenir vos accès exclusifs à la seconde du feu vert.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Adresse e-mail principale
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-light placeholder:text-gray-600"
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Country Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Pays de résidence
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCountry.name}
                      onChange={(e) => {
                        const found = COUNTRIES.find(c => c.name === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                      className="w-full pl-11 pr-10 py-3 bg-slate-950 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none cursor-pointer font-bold"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.name} value={country.name} className="bg-slate-950 text-white text-xs">
                          {country.flag} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-3.5 text-sm pointer-events-none">{selectedCountry.flag}</div>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-[9px] text-cyan-400">▼</div>
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-bold">
                    Numéro WhatsApp (Sans indicatif pays)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Ex: 07080910"
                      className="w-full pl-16 pr-4 py-3 bg-slate-950 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-gray-600"
                    />
                    <div className="absolute left-4 top-3.5 text-xs text-cyan-400 font-mono font-black pointer-events-none">
                      {selectedCountry.code}
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] text-gray-500 font-mono">
                      Format : Sans le code {selectedCountry.code}
                    </span>
                    <span className="text-[9px] text-cyan-400 font-mono font-semibold animate-pulse">
                      Lancement local : {selectedCountry.launchHour.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-xs font-mono font-medium">{errorMsg}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-black tracking-wide text-xs shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>TRAITEMENT EN COURS...</span>
                  ) : (
                    <>
                      <span>REJOINDRE LA LISTE D'ATTENTE</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 pt-3 border-t border-white/5 justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-500/60" />
                <span>Confidentialité totale garantie. Aucun spam.</span>
              </div>
            </motion.div>
          ) : !showList ? (
            /* CENTERED SUCCESS INSTRUCTIONS CARD (NO CLUTTER) */
            <motion.div
              key="success-instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto bg-slate-900/80 border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.06)] space-y-6 mt-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-5 text-left md:text-center max-w-md mx-auto">
                <div className="flex items-start gap-3 md:justify-center">
                  <span className="text-emerald-400 text-lg">✔</span>
                  <p className="text-emerald-300 font-sans font-bold text-base md:text-lg leading-snug">
                    Vous avez rejoint la liste d'attente avec succès.
                  </p>
                </div>

                <div className="flex items-start gap-3 md:justify-center border-y border-white/5 py-4 my-2">
                  <span className="text-amber-400 text-lg">⚠️</span>
                  <p className="text-gray-200 font-sans font-medium text-sm md:text-base leading-relaxed">
                    Déjà plus de <strong className="text-amber-400 font-black">300 personnes</strong> sont en attente.
                  </p>
                </div>

                <div className="flex items-start gap-3 md:justify-center">
                  <span className="text-cyan-400 text-lg">⏳</span>
                  <p className="text-cyan-200 font-sans font-extrabold text-sm md:text-base leading-relaxed">
                    Le plus important maintenant est d'être présent demain à <span className="text-white underline decoration-cyan-400 decoration-2 underline-offset-4">{
                      COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country') || selectedCountry.name))?.launchHour || selectedCountry.launchHour
                    }</span>.
                  </p>
                </div>

                <div className="flex items-start gap-3 md:justify-center">
                  <span className="text-cyan-400 text-lg">🚀</span>
                  <p className="text-gray-300 font-sans font-medium text-sm md:text-base leading-relaxed">
                    C'est à ce moment que vous pourrez tenter de faire partie des <strong className="text-cyan-400 font-extrabold">150 premiers membres</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowList(true)}
                  className="group relative w-full max-w-xs mx-auto py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>VOIR LA LISTE D'ATTENTE</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* IMMERSIVE LIVE WAITLIST DASHBOARD VIEW */
            <motion.div
              key="queue-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full space-y-6"
            >
              {/* Sub Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <button
                    onClick={() => setShowList(false)}
                    className="group inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer uppercase tracking-wider font-bold mb-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    <span>RETOUR AUX INSTRUCTIONS DE CONFIRMATION</span>
                  </button>
                  <h2 className="text-xl font-sans font-black uppercase tracking-tight text-white flex items-center gap-2">
                    La File d'Attente MZ+ <span className="text-cyan-400 animate-pulse text-sm">● LIVE</span>
                  </h2>
                </div>

                {/* Small Counter Info */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wider">Votre Rang</span>
                    <span className="text-base font-mono font-black text-cyan-400">
                      #{userRank}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wider">Total Inscrits</span>
                    <span className="text-base font-mono font-black text-white">
                      {totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side Status */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/40 border border-cyan-500/10 rounded-2xl p-5 space-y-4">
                    <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/20 text-center">
                      <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-wide">
                        Votre Position Actuelle
                      </span>
                      <span className="text-3xl font-mono font-black text-white block mt-1">
                        #{userRank}
                      </span>
                    </div>

                    <div className="space-y-4 text-xs text-gray-200 font-light leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="text-emerald-400 text-sm flex-shrink-0 mt-0.5">✅</span>
                        <p>
                          Vous êtes la <strong className="text-cyan-400 font-extrabold">n°{userRank}</strong> à avoir rejoint la liste d'attente MZ+.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠️</span>
                        <p>
                          Cependant, seules <strong className="text-amber-400 font-black">150 places</strong> seront disponibles lors du lancement.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-cyan-400 text-sm flex-shrink-0 mt-0.5">⏳</span>
                        <p>
                          L'idéal est donc d'être présent le <strong className="text-white font-semibold">4 juillet à {
                            COUNTRIES.find(c => c.name === (localStorage.getItem('mz_user_country') || selectedCountry.name))?.launchHour || selectedCountry.launchHour
                          }</strong> afin d'avoir une chance de faire partie des <strong className="text-cyan-400 font-extrabold">150 premiers membres</strong>.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 pt-1.5 border-t border-white/5">
                        <span className="text-cyan-400 text-sm flex-shrink-0 mt-0.5">🚀</span>
                        <p className="font-bold text-cyan-300">
                          Chaque minute pourra compter.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if(confirm("Voulez-vous enregistrer un autre numéro ou modifier vos coordonnées ?")) {
                          localStorage.removeItem('mz_user_registered');
                          localStorage.removeItem('mz_user_email');
                          localStorage.removeItem('mz_user_whatsapp');
                          localStorage.removeItem('mz_user_country');
                          localStorage.removeItem('mz_user_flag');
                          localStorage.removeItem('mz_user_rank');
                          setUserRank(301);
                          setIsSubmitted(false);
                          setShowList(false);
                        }
                      }}
                      className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl text-[10px] font-mono text-gray-500 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-wider"
                    >
                      S'inscrire avec un autre numéro
                    </button>
                  </div>
                </div>

                {/* Right Side Queue Table */}
                <div className="lg:col-span-8">
                  <div className="bg-slate-900/60 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[520px] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {/* Table Header */}
                    <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">
                      <span>Position & Utilisateur</span>
                      <span>Pays & Statut</span>
                    </div>

                    {/* Scrollable Members List */}
                    <div 
                      ref={scrollContainerRef}
                      className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar pr-1"
                    >
                      <AnimatePresence initial={false}>
                        {members.map((member) => (
                          <motion.div
                            key={`${member.rank}-${member.email}`}
                            initial={{ opacity: 0, y: -15, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            className={`flex items-center justify-between p-4 text-xs transition-colors overflow-hidden ${
                              member.isUser
                                ? "bg-cyan-950/40 border-l-2 border-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.08)]"
                                : "hover:bg-slate-900/20"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`font-mono font-black text-xs min-w-[36px] ${member.isUser ? 'text-cyan-400' : 'text-gray-500'}`}>
                                #{member.rank}
                              </div>
                              
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${member.isUser ? 'text-cyan-300 font-extrabold' : 'text-gray-200'}`}>
                                    {member.email}
                                  </span>
                                  {member.isUser && (
                                    <span className="bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded uppercase animate-pulse">
                                      Votre Position
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 font-mono">
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-0.5">
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-[11px]">{member.flag}</span>
                                <span className="text-[10px] text-gray-300 font-mono font-medium">{member.country}</span>
                              </div>
                              <div className="text-[9px] text-gray-500 font-mono italic">
                                {member.time}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* List Footer Warning */}
                    <div className="p-4 bg-slate-950/90 border-t border-white/5 text-[10px] text-gray-400 font-mono text-center flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500/80 animate-pulse" />
                      <span>Pression d'enregistrement maximale. Le flux de demandes s'accélère à l'approche du 4 Juillet.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
