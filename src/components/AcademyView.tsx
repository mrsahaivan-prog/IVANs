/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, ShieldAlert, Sparkles, X, Lock, Flame, Info, Eye } from 'lucide-react';

interface AcademyViewProps {
  onBack: () => void;
  onJoinWaitlist?: () => void;
}

export default function AcademyView({ onBack, onJoinWaitlist }: AcademyViewProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 2500); // elegant delay allowing the page elements to load smoothly first
    return () => clearTimeout(timer);
  }, []);
  const [activeVideo, setActiveVideo] = useState<{
    id: number;
    title: string;
    module: string;
    subtitle: string;
    description: string;
  } | null>(null);

  const formations = [
    {
      id: 1,
      title: "Comment devenir la personne capable de générer des millions",
      subtitle: "Psychologie & Mindset Financier",
      module: "Module 1",
      description: "Tout commence dans votre esprit. Découvrez comment reprogrammer vos habitudes quotidiennes, éliminer vos croyances limitantes et développer la vision d'affaires indispensable pour attirer et gérer des opportunités de grande envergure.",
    },
    {
      id: 2,
      title: "Comment générer mon premier million avec MZ+",
      subtitle: "Plan de Route & Stratégies Clés",
      module: "Module 2",
      description: "Le guide d'action concret et pragmatique. Découvrez la feuille de route pas-à-pas et les piliers d'affaires exclusifs de MZ+ qui transforment les leviers de l'écosystème en votre plus grande réussite financière.",
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 relative">
      {/* High-end ambient lighting background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      {/* Elegant Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 mb-12 transition-colors duration-300 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
        <span>RETOUR AU RAMP DE LANCEMENT</span>
      </motion.button>

      {/* Immersive Academy Header - High emphasis, hyper-visible title */}
      <div className="mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Neon Badging */}
          <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-5 text-[10px] font-mono text-cyan-400 font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Flame className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ACCÈS ANTICIPÉ EXCLUSIF (MEMBRES 1/150)</span>
          </div>

          {/* Accentuated Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white mb-4 leading-tight">
            🎓 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">Académie MZ+</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl font-light italic leading-relaxed">
            Développez les compétences qui vous permettront de passer à l'action.
          </p>
          
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent mt-8" />
        </motion.div>
      </div>

      {/* Two Premium Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mb-16">
        {formations.map((formation, index) => (
          <motion.div
            key={formation.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
            className="group relative rounded-2xl border border-white/[0.05] bg-gradient-to-b from-slate-950 to-black overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.12)] flex flex-col justify-between"
          >
            {/* Elegant lighting overlay on card hover */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Immersive Dark "Noir" Video Miniature Placeholder */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-white/5 flex flex-col items-center justify-center p-6 text-center select-none">
              {/* Elegant cybernetic digital pattern layer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
              
              {/* Radial deep center gradient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.04),transparent_65%)] pointer-events-none" />
              
              {/* Mysterious glowing wave vector graphic */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20 pointer-events-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,15 C20,5 40,25 60,15 C80,5 90,20 100,10 L100,30 L0,30 Z" fill="#0891b2" className="animate-pulse" />
                </svg>
              </div>

              {/* Status information */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-500/20 text-[9px] font-mono text-cyan-400 font-extrabold tracking-widest uppercase">
                  {formation.module}
                </span>
              </div>

              {/* Live pending status label */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/20 text-[9px] font-mono text-red-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>PENDING</span>
              </div>

              {/* Holographic keylock status */}
              <div className="relative z-10 flex flex-col items-center gap-2 mb-2 transition-transform duration-500 group-hover:scale-95">
                <div className="w-10 h-10 rounded-full bg-slate-950/90 border border-white/5 flex items-center justify-center text-gray-500 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all duration-500">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase group-hover:text-gray-400 transition-colors">
                  FLUX CRYPTÉ HORS-LIGNE
                </span>
              </div>

              {/* Centered Premium Play Button */}
              <button
                onClick={() => setActiveVideo(formation)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-950/90 border border-white/15 text-white flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 group-hover:text-cyan-400 hover:bg-cyan-950/40 cursor-pointer z-20"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
            </div>

            {/* Details and Description */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest block mb-1.5 font-extrabold">
                  {formation.subtitle}
                </span>
                <h3 className="text-lg md:text-xl font-sans font-black text-white tracking-tight leading-snug mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {formation.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
                  {formation.description}
                </p>
              </div>

              {/* Secure exclusive warning note */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span className="uppercase tracking-wider text-[8px] text-cyan-500/60 font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-cyan-500/40" /> HAUTE CONFIDENTIALITÉ
                </span>
                <span className="text-cyan-400/80 animate-pulse font-bold text-[8px] uppercase tracking-widest bg-cyan-950/10 px-2 py-0.5 rounded border border-cyan-500/10">
                  LANCEMENT IMMINENT
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Discrete Footnote info */}
      <div className="text-center relative z-10 max-w-lg mx-auto py-4 border-t border-white/5">
        <p className="text-xs text-gray-500 font-sans tracking-wide leading-relaxed font-light">
          ✨ Plus de formations seront disponibles dans la version complète de MZ+.
        </p>
      </div>

      {/* High-End Immersive "Not Started Yet" Informative Modal Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setActiveVideo(null)}
            />

            {/* Neuromarketing Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-slate-950 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] z-10 flex flex-col overflow-hidden"
            >
              {/* Subtle light lines */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Danger Warning/Status indicator */}
              <div className="mx-auto mb-6 w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Lock className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>

              {/* Big Expectation Title */}
              <h3 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight leading-tight mb-4 flex items-center justify-center gap-2">
                🔒 Accès réservé aux membres MZ+
              </h3>

              {/* High desire neuromarketing text */}
              <div className="space-y-4 text-gray-300 text-xs md:text-sm leading-relaxed mb-6 text-left sm:text-center font-light">
                <p className="font-medium text-white">
                  Ces formations seront accessibles dès votre arrivée après le lancement officiel.
                </p>
                
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-2.5 text-cyan-300 font-sans font-normal text-left">
                  <span className="text-sm shrink-0">⚠️</span>
                  <span>
                    Les places sont volontairement limitées à <strong className="text-white font-extrabold underline decoration-cyan-500/50">150 membres</strong> afin de garantir un accompagnement de qualité.
                  </span>
                </div>

                <p className="text-gray-400">
                  Si vous souhaitez accéder à ces formations et découvrir l'ensemble de la plateforme, vous devrez faire partie des <strong className="text-cyan-400 font-extrabold">150 premiers membres éligibles</strong>.
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  setActiveVideo(null);
                  onJoinWaitlist?.();
                }}
                className="group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wide shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀 Rejoindre la liste d'attente</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Immersive first-time welcome popup - High emotional impact neuromarketing greeting */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setShowWelcomeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150 }}
              className="relative w-full max-w-lg bg-slate-950/95 border border-cyan-500/25 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.2)] z-10 overflow-hidden"
            >
              {/* Decorative premium elements */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/[0.03] blur-[70px] rounded-full pointer-events-none" />

              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold mb-3">
                💎 BIENVENUE DANS L'ACADÉMIE PRIVÉE
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl font-sans font-black text-white leading-snug tracking-tight mb-6">
                "C’est ici que nous allons te former et t’accompagner pas à pas jusqu’à ta liberté financière."
              </p>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                ACCÉDER AUX SECRETS DE FORMATION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
