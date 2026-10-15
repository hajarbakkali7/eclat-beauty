import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  IMAGES  (dossier : public/images/)                                 */
/*  encodeURI gère les espaces, ex. "soin de corp.jpg"                 */
/* ------------------------------------------------------------------ */
const img = (name) => encodeURI(`/images/${name}`);

const IMAGES = {
  logo: img('logo-eclat.jpg'),
  salon: img('galerie-salon.jpg'),
  visage: img('soindevisage.jpg'),
  corps: img('soin de corp.jpg'),
  epilation: img('epilation.jpg'),
  maquillage: img('maquep.jpg'),
  // Onglerie : si pied/main sont inversés, échange simplement ces 2 lignes
  pedicure: img('ongle.jpg'),
  manicure: img('ongles.jpg'),
  // Galerie
  galerieSalon: img('galerie-salon.jpg'),
  galerieOnglerie: img('espace-menicure-et-pedicure.jpg'),
  galerieSoin: img('soin.jpg'),
};

const phoneNumber = '212711903377';

const services = [
  {
    cat: 'Soins du visage',
    items: ['Nettoyage profond du visage', 'Soin hydratant', 'Soin anti-imperfections', 'Soin éclat du teint', 'Massage facial relaxant'],
    img: IMAGES.visage,
  },
  {
    cat: 'Soins du corps',
    items: ['Massage relaxant 30min', 'Massage relaxant 60min', 'Gommage corporel', 'Enveloppement hydratant', 'Soin des mains et des pieds'],
    img: IMAGES.corps,
  },
  {
    cat: 'Épilation & Regard',
    items: ['Épilation des sourcils', 'Épilation lèvre supérieure', 'Épilation des jambes', 'Épilation des aisselles', 'Teinture des sourcils'],
    img: IMAGES.epilation,
  },
  {
    cat: 'Onglerie',
    items: ['Manucure classique', 'Pédicure classique', 'Vernis semi-permanent', 'Pose de gel', 'Nail art simple'],
    nails: true, // image animée pied → main
  },
  {
    cat: 'Maquillage',
    items: ['Maquillage naturel', 'Maquillage de soirée', 'Maquillage de mariée', 'Coiffure de cérémonie'],
    img: IMAGES.maquillage,
  },
];

// Les 3 packs ont exactement le même style et la même animation
const packs = [
  { name: 'Pack Éclat', desc: 'Nettoyage du visage + soin hydratant', price: 'Sur devis' },
  { name: 'Pack Détente', desc: 'Gommage corporel + massage de 30 minutes', price: 'Sur devis' },
  { name: 'Pack Beauté Mains & Pieds', desc: 'Manucure + pédicure classique', price: 'Sur devis' },
];

const gallery = [
  { id: 'salon', src: IMAGES.galerieSalon, title: 'Notre salon', sub: 'Lumière douce, matières nobles' },
  { id: 'onglerie', src: IMAGES.galerieOnglerie, title: 'Espace mains & pieds', sub: 'Manucure et pédicure en toute sérénité' },
  { id: 'soin', src: IMAGES.galerieSoin, title: 'Cabine de soin', sub: 'Un moment rien que pour vous' },
];

/* ------------------------------------------------------------------ */
/*  CARTE SERVICE (avec animation pied → main pour l'onglerie)         */
/* ------------------------------------------------------------------ */
function ServiceCard({ s, onReserve }) {
  const [hand, setHand] = useState(false); // false = pied, true = main

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onHoverStart={() => setHand(true)}
      onHoverEnd={() => setHand(false)}
      className="group bg-white rounded-[32px] p-6 shadow-lg border border-black/5 hover:shadow-2xl transition-shadow duration-500 flex flex-col"
    >
      <div
        className="relative h-40 rounded-2xl overflow-hidden mb-6"
        // Sur mobile (tactile) : un tap alterne pied / main
        onPointerDown={(e) => {
          if (s.nails && e.pointerType === 'touch') setHand((v) => !v);
        }}
      >
        {s.nails ? (
          <>
            {/* Pédicure (affichée par défaut) */}
            <motion.img
              src={IMAGES.pedicure}
              alt="Pédicure"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: hand ? 0 : 1, scale: hand ? 1.15 : 1, filter: hand ? 'blur(6px)' : 'blur(0px)' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            {/* Manucure (au survol) */}
            <motion.img
              src={IMAGES.manicure}
              alt="Manucure"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: hand ? 1 : 0, scale: hand ? 1 : 0.9, filter: hand ? 'blur(0px)' : 'blur(6px)' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            <AnimatePresence mode="wait">
              <motion.span
                key={hand ? 'main' : 'pied'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 left-3 bg-white/85 backdrop-blur px-3 py-1 rounded-full text-[11px] tracking-wider text-[#1A1A1A]"
              >
                {hand ? 'Manucure' : 'Pédicure'}
              </motion.span>
            </AnimatePresence>
          </>
        ) : (
          <img
            src={s.img}
            alt={s.cat}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />
        )}
      </div>

      <h4 className="font-cormorant text-xl font-semibold mb-3">{s.cat}</h4>
      <ul className="text-xs text-gray-500 space-y-1.5 flex-1">
        {s.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-[#C9A96A]">•</span> {item}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onReserve(s.cat)}
        className="mt-6 w-full border border-[#C9A96A] text-[#C9A96A] py-2.5 rounded-full text-xs tracking-widest hover:bg-[#C9A96A] hover:text-white transition"
      >
        RÉSERVER
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CARTE PACK (même couleur + même animation pour les 3)              */
/* ------------------------------------------------------------------ */
function PackCard({ p, i, onReserve }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: i * 0.18, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      {/* flottement continu, identique pour les 3 */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
      >
        <motion.div
          whileHover={{ y: -10, scale: 1.03, boxShadow: '0 30px 80px -20px rgba(201,169,106,0.55)' }}
          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
          className="relative overflow-hidden rounded-[32px] p-8 border border-[#C9A96A]/40 bg-gradient-to-b from-white/10 to-white/[0.03] backdrop-blur"
        >
          {/* reflet doré qui traverse la carte */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#C9A96A]/25 to-transparent"
            initial={{ left: '-50%' }}
            animate={{ left: ['-50%', '150%'] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut', delay: i * 0.3 }}
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full bg-[#C9A96A]/15 border border-[#C9A96A]/50 flex items-center justify-center text-[#C9A96A]"
          >
            <Sparkles size={18} />
          </motion.div>

          <h4 className="font-cormorant text-3xl mt-5 text-white">{p.name}</h4>
          <p className="mt-2 text-sm text-white/70">{p.desc}</p>
          <p className="font-cormorant text-2xl mt-6 text-[#C9A96A]">{p.price}</p>

          <button
            onClick={() => onReserve(p.name)}
            className="relative w-full mt-8 py-4 rounded-full font-medium bg-[#C9A96A] text-white hover:bg-[#b89455] transition"
          >
            Réserver ce pack
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  GALERIE MAGIQUE                                                    */
/* ------------------------------------------------------------------ */
// Généré une seule fois, hors du rendu React (évite l'erreur ESLint sur Math.random)
const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 3 + Math.random() * 7,
  dur: 3 + Math.random() * 4,
  delay: Math.random() * 4,
}));

function FloatingSparkles() {
  const reduce = useReducedMotion();
  const dots = SPARKLES;
  if (reduce) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-[#C9A96A]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, boxShadow: '0 0 12px 2px rgba(201,169,106,0.7)' }}
          animate={{ y: [0, -40, 0], opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function MagicCard({ item, i, onOpen }) {
  const [failed, setFailed] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 160, damping: 16 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 160, damping: 16 });
  const lightX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const light = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,235,190,0.35), transparent 55%)`;

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.2, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={i === 1 ? 'md:mt-14' : ''}
      style={{ perspective: 1100 }}
    >
      <motion.button
        type="button"
        onMouseMove={move}
        onMouseLeave={leave}
        onClick={() => onOpen(item)}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.97 }}
        className="group relative block w-full h-[460px] rounded-[32px] p-[2px] overflow-hidden text-left cursor-zoom-in"
        aria-label={`Agrandir : ${item.title}`}
      >
        {/* bordure dorée qui tourne */}
        <motion.span
          aria-hidden
          className="absolute -inset-[60%] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'conic-gradient(from 0deg, transparent 0 60%, #C9A96A 80%, #fff3d1 90%, transparent 100%)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        <span className="relative block w-full h-full rounded-[30px] overflow-hidden bg-black">
          {failed ? (
            <span className="flex w-full h-full items-center justify-center p-6 text-center text-xs text-white/70 bg-[#2a2a2a]">
              Image introuvable :<br />
              {decodeURI(item.src)}
            </span>
          ) : (
            <img
              src={item.src}
              alt={item.title}
              loading="eager"
              onError={() => setFailed(true)}
              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
          )}

          {/* lumière qui suit la souris */}
          <motion.span aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: light }} />

          {/* reflet qui balaie l'image */}
          <span
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-0 group-hover:translate-x-[450%] transition-transform duration-[1100ms] ease-out"
          />

          {/* légende */}
          <span className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <span className="flex items-center gap-2 text-[#C9A96A] text-xs tracking-widest">
              <Sparkles size={14} /> ÉCLAT BEAUTY
            </span>
            <span className="block font-cormorant text-2xl text-white mt-1">{item.title}</span>
            <span className="block text-xs text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {item.sub}
            </span>
          </span>
        </span>
      </motion.button>
    </motion.div>
  );
}

function Gallery() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section id="galerie" className="relative py-24 px-6 overflow-hidden">
      <FloatingSparkles />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C9A96A] tracking-[0.4em] text-xs">NOTRE UNIVERS</p>
          <h3 className="font-cormorant text-5xl mt-2">
            Entrez dans <span className="italic text-[#C9A96A]">l'écrin</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {gallery.map((g, i) => (
            <MagicCard key={g.id} item={g} i={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              src={open.src}
              alt={open.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="max-h-[88vh] max-w-full rounded-3xl shadow-[0_0_120px_rgba(201,169,106,0.45)] object-contain"
            />
            <button
              onClick={() => setOpen(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#C9A96A] transition"
              aria-label="Fermer"
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleWhatsApp = (service = '') => {
    const message = service
      ? `Bonjour Éclat Beauty Studio ✨, je souhaite réserver : *${service}*. Pouvez-vous me donner vos disponibilités ?`
      : `Bonjour Éclat Beauty Studio ✨, je souhaite prendre un rendez-vous.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#FDF8F5] text-[#1A1A1A] overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#C9A96A]/20">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <a href="#" aria-label="Éclat Beauty - accueil">
            <img src={IMAGES.logo} alt="Éclat Beauty" className="h-14 w-auto mix-blend-multiply" />
          </a>
          <div className="hidden md:flex gap-8 text-sm tracking-widest font-light">
            <a href="#services" className="hover:text-[#C9A96A] transition">SERVICES</a>
            <a href="#packs" className="hover:text-[#C9A96A] transition">PACKS</a>
            <a href="#galerie" className="hover:text-[#C9A96A] transition">GALERIE</a>
            <a href="#contact" className="hover:text-[#C9A96A] transition">CONTACT</a>
          </div>
          <button
            onClick={() => handleWhatsApp()}
            className="hidden md:flex bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#C9A96A] transition items-center gap-2"
          >
            <MessageCircle size={16} /> Réserver
          </button>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden" aria-label="Menu">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t p-6 flex flex-col gap-4">
            <a href="#services" onClick={() => setMobileMenu(false)}>SERVICES</a>
            <a href="#packs" onClick={() => setMobileMenu(false)}>PACKS</a>
            <a href="#galerie" onClick={() => setMobileMenu(false)}>GALERIE</a>
            <a href="#contact" onClick={() => setMobileMenu(false)}>CONTACT</a>
            <button onClick={() => handleWhatsApp()} className="bg-[#C9A96A] text-white py-3 rounded-full">
              Réserver sur WhatsApp
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen pt-20 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F5] via-white to-[#F9E8E0]"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#C9A96A]/20 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full py-12">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <p className="text-[#C9A96A] tracking-[0.3em] text-xs mb-4 flex items-center gap-2">
              <Sparkles size={14} /> RABAT • DEPUIS 2024
            </p>
            <h2 className="font-cormorant text-6xl md:text-7xl font-light leading-[0.9]">
              Révélez<br />
              <span className="italic font-medium text-[#C9A96A]">Votre Éclat</span>
            </h2>
            <p className="text-gray-500 mt-6 font-light leading-relaxed max-w-md">
              Un espace dédié à la beauté, aux soins du visage et du corps, dans une ambiance élégante et relaxante au cœur de Rabat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handleWhatsApp()}
                className="bg-[#C9A96A] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition shadow-xl shadow-[#C9A96A]/30"
              >
                Réserver sur WhatsApp <ArrowRight size={18} />
              </button>
              <a href="#services" className="px-8 py-4 rounded-full border border-black/10 hover:bg-white transition text-center">
                Découvrir
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative h-[500px] hidden md:block"
          >
            <div className="absolute inset-0 bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden border border-white p-3 rotate-3 hover:rotate-0 transition duration-700">
              <img src={IMAGES.salon} className="w-full h-full object-cover rounded-[32px]" alt="Salon Éclat Beauty" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">Soins Visage & Corps</p>
                  <p className="text-xs text-gray-500">Disponible Lun - Sam</p>
                </div>
                <div className="w-10 h-10 bg-[#C9A96A] rounded-full flex items-center justify-center text-white">
                  <Star size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[#C9A96A] tracking-[0.4em] text-xs">NOS EXPERTISES</p>
          <h3 className="font-cormorant text-5xl mt-2">
            Une expérience <span className="italic text-[#C9A96A]">sur-mesure</span>
          </h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.cat} s={s} onReserve={handleWhatsApp} />
          ))}
        </div>
      </section>

      {/* PACKS */}
      <section id="packs" className="py-20 bg-[#1A1A1A] rounded-[50px] mx-4 md:mx-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96A]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <p className="text-[#C9A96A] tracking-[0.3em] text-xs">OFFRES SIGNATURES</p>
              <h3 className="font-cormorant text-5xl">Nos Packs Éclat</h3>
            </div>
            <p className="text-white/60 font-light max-w-sm text-sm">
              Le meilleur de nos soins réuni en rituels d'exception à prix doux.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packs.map((p, i) => (
              <PackCard key={p.name} p={p} i={i} onReserve={handleWhatsApp} />
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <Gallery />

      {/* CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-black/5 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-cormorant text-4xl">
              Visitez votre<br />écrin de beauté
            </h3>
            <div className="mt-8 space-y-4 text-sm font-light">
              <p className="flex gap-3"><MapPin className="text-[#C9A96A]" /> Centre d'esthétique • Rabat, Maroc</p>
              <p className="flex gap-3">
                <Clock className="text-[#C9A96A]" /> Lundi - Samedi : 09h30 - 19h00<br />Dimanche : Fermé
              </p>
              <p className="flex gap-3"><Phone className="text-[#C9A96A]" /> 07 11 90 33 77</p>
            </div>
            <button
              onClick={() => handleWhatsApp()}
              className="mt-8 w-full bg-[#25D366] text-white py-4 rounded-full flex justify-center items-center gap-2 font-medium hover:scale-105 transition"
            >
              <MessageCircle /> Discuter sur WhatsApp
            </button>
          </div>
          <div className="bg-[#FDF8F5] rounded-3xl p-8">
            <h4 className="font-cormorant text-2xl mb-6">Réservation instantanée</h4>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-4 rounded-xl border border-black/10 bg-white text-sm"
            >
              <option value="">Choisissez un service</option>
              {services.flatMap((s) => s.items).map((item) => (
                <option key={item}>{item}</option>
              ))}
              {packs.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={() => handleWhatsApp(selectedService || 'une réservation')}
              className="w-full mt-4 bg-[#1A1A1A] text-white py-4 rounded-xl hover:bg-black transition"
            >
              Envoyer ma demande →
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">Réponse en moins de 5 minutes sur WhatsApp</p>
          </div>
        </div>
      </section>

      {/* WhatsApp flottant */}
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse z-50"
        aria-label="WhatsApp"
      >
        <MessageCircle />
      </a>

      <footer className="flex flex-col items-center gap-3 py-8 text-xs tracking-widest text-gray-400">
        <img src={IMAGES.logo} alt="Éclat Beauty" className="h-16 w-auto mix-blend-multiply" />
        <span>© 2025 Éclat Beauty Studio • Rabat • Tous droits réservés</span>
      </footer>
    </div>
  );
}