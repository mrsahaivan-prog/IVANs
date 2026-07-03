/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowLeft, Sparkles, X, Lock, Flame, Eye, BookOpen, Clock, CheckCircle, Trophy, GraduationCap, ChevronRight } from 'lucide-react';

// @ts-ignore
import lessonOneImg from '../assets/images/academy_lesson_one_1783048319165.jpg';
// @ts-ignore
import lessonTwoImg from '../assets/images/academy_lesson_two_1783048332916.jpg';

interface AcademyViewProps {
  onBack: () => void;
  onJoinWaitlist?: () => void;
}

export default function AcademyView({ onBack, onJoinWaitlist }: AcademyViewProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{
    id: number;
    title: string;
    module: string;
    subtitle: string;
    description: string;
    duration: string;
    lessons: string[];
    author: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeModal(true);
    }, 1500); // Elegant delay for high-impact entry
    return () => clearTimeout(timer);
  }, []);

  const formations = [
    {
      id: 1,
      title: "Comment devenir la personne capable de générer des millions",
      subtitle: "Psychologie & Mindset Financier",
      module: "MODULE 1",
      duration: "1h 45m de formation immersive",
      author: "Par les Experts Fondateurs MZ+",
      image: lessonOneImg,
      description: "Tout commence dans votre esprit. Découvrez comment reprogrammer vos habitudes quotidiennes, éliminer vos croyances limitantes et développer la vision d'affaires indispensable pour attirer et gérer des opportunités de grande envergure.",
      lessons: [
        "Reprogrammation mentale : Briser les croyances limitantes sur l'argent",
        "La psychologie des multimillionnaires : Rituels et habitudes quotidiennes",
        "Vision d'affaires à fort impact : Aligner ambitions et exécution",
        "Gestion émotionnelle face au risque et décisions à haute valeur"
      ]
    },
    {
      id: 2,
      title: "Comment générer mon premier million avec MZ+",
      subtitle: "Plan de Route & Stratégies Clés",
      module: "MODULE 2",
      duration: "2h 15m de plan d'action pur",
      author: "Par les Experts Fondateurs MZ+",
      image: lessonTwoImg,
      description: "Le guide d'action concret et pragmatique. Découvrez la feuille de route pas-à-pas et les piliers d'affaires exclusifs de MZ+ qui transforment les leviers de l'écosystème en votre plus grande réussite financière.",
      lessons: [
        "L'écosystème MZ+ : Architecture et leviers de gains secrets",
        "Plan d'action pas-à-pas : Passer de 0 à vos premiers 10 000 €",
        "Optimisation des revenus passifs et automatisation de vos systèmes",
        "Stratégies de scaling pour démultiplier votre liberté financière"
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 relative">
      {/* Absolute Ambient light flares for futuristic luxury style */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* Elegant Back Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-gray-400 hover:text-cyan-400 mb-10 transition-colors duration-300 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
        <span>RETOUR AU RAMP DE LANCEMENT</span>
      </motion.button>

      {/* 👑 HEADLINE SECTION - Prominent, centered, high focus on Title */}
      <div className="mb-14 text-center relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Neon Badging */}
          <div className="inline-flex items-center gap-2 bg-cyan-950/40 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 text-[10px] font-mono text-cyan-400 font-extrabold tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>ACCÈS ANTICIPÉ EXCLUSIF (MEMBRES 1/150)</span>
          </div>

          {/* Majestic High-Focus Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white mb-6 uppercase leading-tight">
            🎓 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">Académie MZ+</span>
          </h1>

          {/* Slogan with high contrast container to draw complete focus */}
          <div className="relative inline-block px-6 py-4 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/90 border border-cyan-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] max-w-2xl">
            <span className="absolute top-1 left-3 text-cyan-500/20 text-4xl font-serif">“</span>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed italic relative z-10 px-4">
              C'est ici que nous allons te former et t'accompagner pas à pas jusqu'à ta liberté financière.
            </p>
            <span className="absolute bottom-1 right-3 text-cyan-500/20 text-4xl font-serif">”</span>
          </div>
          
          <div className="w-40 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mt-8" />
        </motion.div>
      </div>

      {/* Grid containing the highly optimized Premium Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
        {formations.map((formation, index) => (
          <motion.div
            key={formation.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
            className="group relative rounded-3xl border border-white/[0.04] bg-gradient-to-b from-slate-900/70 to-slate-950/95 overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col justify-between"
          >
            {/* Top glowing edge line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Premium Video Media Frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-white/5 flex flex-col items-center justify-center">
              {/* Dynamic Image with slow elegant zoom on hover */}
              <img 
                src={formation.image} 
                alt={formation.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              {/* Radial gradient shadow on top of the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Tag Overlays */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-black tracking-widest uppercase shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {formation.module}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-950/90 border border-white/10 text-[9px] font-mono text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  <span>{formation.duration.split(' ')[0]}</span>
                </span>
              </div>

              {/* Live locked state marker */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-500/30 text-[9px] font-mono text-red-400 font-bold tracking-wider shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>FLUX RESTREINT</span>
              </div>

              {/* Locked overlay effect */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-500 z-10">
                <div className="w-12 h-12 rounded-full bg-slate-950/90 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-500 group-hover:scale-95 group-hover:border-cyan-400">
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase mt-3 bg-slate-950/85 px-3 py-1 rounded-full border border-white/5 font-extrabold shadow-md">
                  CYBER-SÉCURISÉ
                </span>
              </div>

              {/* Centered Large Premium Play Button */}
              <button
                onClick={() => setActiveVideo(formation)}
                className="absolute m-auto w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 hover:bg-cyan-400 cursor-pointer z-20"
              >
                <Play className="w-6 h-6 ml-1 fill-slate-950 stroke-slate-950" />
              </button>
            </div>

            {/* Course details & Full Syllabus description */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-cyan-400 tracking-widest font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{formation.subtitle}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-sans font-black text-white tracking-tight leading-snug group-hover:text-cyan-300 transition-colors duration-300">
                  {formation.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                  {formation.description}
                </p>

                {/* Course Syllabus section */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
                    Programme d'apprentissage :
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {formation.lessons.map((lesson, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle className="w-4 h-4 text-cyan-500/70 shrink-0 mt-0.5" />
                        <span className="font-light">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom course footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span className="uppercase tracking-wider text-[8px] text-cyan-500 font-bold flex items-center gap-1 bg-cyan-950/20 border border-cyan-500/10 px-2 py-0.5 rounded">
                  <Eye className="w-3 h-3 text-cyan-400" /> ACCÈS RESTREINT AUX MEMBRES
                </span>
                <span className="text-gray-400 font-bold text-[9px] flex items-center gap-1">
                  {formation.duration}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Discrete bottom reassurance note */}
      <div className="text-center relative z-10 max-w-xl mx-auto py-6 border-t border-white/5 space-y-3">
        <div className="flex justify-center gap-2 text-cyan-400 text-xs font-mono font-bold">
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span>MZ+ LEADER ACADEMY</span>
        </div>
        <p className="text-xs text-gray-500 font-sans tracking-wide leading-relaxed font-light">
          Déverrouillez ces secrets dès le lancement du 4 Juillet. Rejoignez la liste d'attente dès aujourd'hui pour obtenir votre accès membre instantané.
        </p>
      </div>

      {/* Course Detail / Join Modal Overlay */}
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

            {/* Masterclass Content Presentation Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/25 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.25)] z-10 flex flex-col overflow-hidden"
            >
              {/* Radiant light bars */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Big Header Lock icon */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Lock className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>

              {/* Module Header */}
              <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase font-black block mb-2">
                {activeVideo.module} • {activeVideo.subtitle}
              </span>

              {/* Big Course Title */}
              <h3 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight leading-snug mb-4">
                {activeVideo.title}
              </h3>

              {/* Sincere desire text */}
              <div className="space-y-4 text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 text-left font-light">
                <p className="font-medium text-white text-center">
                  Le contenu complet de ce cours de haut niveau vous sera entièrement ouvert au moment du lancement.
                </p>
                
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-start gap-2.5 text-cyan-300 font-sans text-left">
                  <span className="text-base shrink-0 mt-0.5">💡</span>
                  <span className="text-xs sm:text-sm leading-relaxed">
                    Ce programme a été conçu par des experts financiers pour propulser l'ensemble des <strong className="text-white font-extrabold underline decoration-cyan-500/50">150 membres fondateurs</strong> vers le succès.
                  </span>
                </div>

                <div className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 block mb-1 uppercase font-bold">Inclus dans la leçon :</span>
                  <p className="text-xs text-gray-300 leading-normal flex items-center gap-1.5 font-light">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> {activeVideo.lessons.length} modules de cours d'élite + exercices d'application pratiques.
                  </p>
                </div>
              </div>

              {/* Call to action button */}
              <button
                onClick={() => {
                  setActiveVideo(null);
                  onJoinWaitlist?.();
                }}
                className="group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀 REJOINDRE LA LISTE D'ATTENTE MZ+</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Dynamic Welcome invitation Card popup */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowWelcomeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 150 }}
              className="relative w-full max-w-lg bg-slate-950 border border-cyan-500/25 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(6,182,212,0.25)] z-10 overflow-hidden"
            >
              {/* Decorative gold lines */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/[0.03] blur-[70px] rounded-full pointer-events-none" />

              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold mb-3">
                💎 BIENVENUE DANS L'ACADÉMIE PRIVÉE
              </h2>

              <p className="text-xl sm:text-2xl font-sans font-black text-white leading-snug tracking-tight mb-6">
                "C’est ici que nous allons te former et t’accompagner pas à pas jusqu’à ta liberté financière."
              </p>

              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-sans font-black tracking-wider text-xs shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                DÉCOUVRIR LE PROGRAMME DE FORMATION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
