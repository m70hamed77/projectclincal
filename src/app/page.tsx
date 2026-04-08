"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Star,
  MapPin,
  MessageCircle,
  Clock,
  Heart,
  CheckCircle2,
  User,
  Stethoscope,
  Play,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from "@/hooks/useTranslations";
import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   HOOK: useScrolled — header changes on scroll
   ============================================================ */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* ============================================================
   HOOK: useInView — fires once when element enters viewport
   ============================================================ */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);
  return { ref, inView };
}

/* ============================================================
   HOOK: useCountUp — animates number from 0 to target
   ============================================================ */
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // If target is 0, just show 0
    if (target === 0) {
      setTimeout(() => {
        setCount(0);
        hasAnimatedRef.current = true;
      }, 0);
      return;
    }

    // If not started or already animated, just show the target value
    if (!start || hasAnimatedRef.current) {
      setTimeout(() => {
        setCount(target);
      }, 0);
      return;
    }

    // Start animation from 0
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.floor(eased * target);
      setCount(newCount);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        hasAnimatedRef.current = true;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [start, target, duration]);

  return count;
}

/* ============================================================
   COMPONENT: StatCard — stat with count-up animation
   ============================================================ */
function StatCard({
  emoji,
  value,
  label,
  numClassName = "",
  delay,
  start,
}: {
  emoji: string;
  value: number;
  label: string;
  numClassName?: string;
  delay: string;
  start: boolean;
}) {
  const count = useCountUp(value, 1800, start);
  return (
    <Card
      className="border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-default"
      style={{
        animationDelay: delay,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <CardContent className="pt-8 text-center">
        <div className="text-4xl mb-3 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
          {emoji}
        </div>
        <div className={`text-responsive-3xl font-bold mb-1 text-white ${numClassName}`}>
          +{count.toLocaleString()}
        </div>
        <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   COMPONENT: AnimatedSection — fade-in-up on scroll
   ============================================================ */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

interface HomeStats {
  activeStudents: number;
  activePatients: number;
  completedCases: number;
  averageRating: number;
}

export default function Home() {
  const { t, getData, locale, loading } = useTranslations();
  const isRTL = locale === "ar";
  const [isLoaded, setIsLoaded] = useState(false);
  const scrolled = useScrolled(20);

  // Mouse position for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Stats state
  const [stats, setStats] = useState<HomeStats>({
    activeStudents: 0,
    activePatients: 0,
    completedCases: 0,
    averageRating: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const { ref: heroStatsRef, inView: heroStatsInView } = useInView();

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Fetch real-time statistics with auto-refresh
  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('[HOME] Fetching stats from /api/home-stats...');
        const response = await fetch('/api/home-stats', {
          cache: 'no-store', // Disable caching to always get fresh data
        });

        const data = await response.json();

        if (data.success) {
          console.log('[HOME] Stats loaded successfully:', data.data);
          setStats(data.data);
        } else {
          console.error('[HOME] Failed to load stats:', data.error);
        }
      } catch (error) {
        console.error('[HOME] Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }

    // Initial fetch
    fetchStats();

    // Auto-refresh every 15 seconds (reduced from 30 for better responsiveness)
    const interval = setInterval(fetchStats, 15000);

    // Also refresh when user returns to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[HOME] Tab visible, refreshing stats...');
        fetchStats();
      }
    };

    // Refresh when window gains focus
    const handleFocus = () => {
      console.log('[HOME] Window focused, refreshing stats...');
      fetchStats();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleHoverColor = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, color: string) => {
    e.currentTarget.style.color = color;
  }, []);

  const handleHoverBackground = useCallback((e: React.MouseEvent<HTMLButtonElement>, color: string) => {
    e.currentTarget.style.background = color;
  }, []);

  const handleHoverBorderColor = useCallback((e: React.MouseEvent<HTMLElement>, color: string) => {
    e.currentTarget.style.borderColor = color;
  }, []);

  const handleLeaveColor = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.currentTarget.style.color = "";
  }, []);

  const handleLeaveBackground = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = "";
  }, []);

  const handleLeaveBorderColor = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "";
  }, []);

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" suppressHydrationWarning>
        <div className="text-center animate-slide-in-left">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-responsive-base" style={{ color: "rgba(255,255,255,0.6)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)" }} suppressHydrationWarning>

      {/* ==========================================
           HEADER
      ========================================== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
        style={{
          background: "rgba(13, 27, 64, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "2px solid rgba(147, 51, 234, 0.3)",
          boxShadow: "0 2px 20px rgba(108, 63, 197, 0.2)",
        }}
      >
        <div className="container-full flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: "50ms" }}>
            <div
              className={`rounded-xl flex items-center justify-center transition-all duration-500 ${scrolled ? "w-9 h-9" : "w-11 h-11"}`}
              style={{
                background: "linear-gradient(135deg, #9333ea, #ec4899)",
                boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
              }}
            >
              <span
                className={`transition-all duration-500 ${scrolled ? "text-xl" : "text-2xl"}`}
                style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
                  fontSize: 'inherit'
                }}
              >🦷</span>
            </div>
            <span
              className="text-responsive-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("home.brand")}
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
            {[
              { href: "#features",     label: t("home.features")   },
              { href: "#how-it-works", label: t("home.howItWorks") },
              { href: "#faq",          label: t("home.faq")        },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-responsive-sm font-semibold transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
                onMouseEnter={(e) => handleHoverColor(e, "#a855f7")}
                onMouseLeave={handleLeaveColor}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3 animate-slide-in-left" style={{ animationDelay: "150ms" }}>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              asChild
              className="font-semibold text-responsive-sm"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <Link href="/auth/login">{t("home.login")}</Link>
            </Button>
            <Button
              asChild
              className="font-bold text-responsive-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              style={{
                background: "linear-gradient(135deg, #9333ea, #ec4899)",
                boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(236, 72, 153, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(236, 72, 153, 0.4)";
              }}
            >
              <Link href="/auth/register-verification">{t("home.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ==========================================
           HERO SECTION
      ========================================== */}
      <section className="section-spacing-lg relative overflow-hidden">
        {/* Animated Background Orbs with Parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
          <div
            className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '0s',
              transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
            }}
          />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)`
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"
          />

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-particle-1" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-particle-2" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-particle-3" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-particle-4" />
        </div>

        <div className="container-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8 animate-slide-in-left" style={{ animationDelay: "200ms" }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: "rgba(147, 51, 234, 0.2)",
                  border: "1px solid rgba(147, 51, 234, 0.4)",
                  color: "#a855f7",
                }}
              >
                <Sparkles className="w-4 h-4" />
                🚀 {t("home.badge")}
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="text-responsive-5xl font-bold leading-tight text-white">
                {t("home.title")}
                <span
                  className="block pt-2"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #ec4899, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "200% 200%",
                    animation: "gradient 3s ease infinite",
                  }}
                >
                  {t("home.titleHighlight")}
                </span>
              </h1>

              <p className="text-responsive-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.75)" }}>
                {t("home.description")}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  asChild
                  className="font-bold text-responsive-base text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    boxShadow: "0 6px 24px rgba(236, 72, 153, 0.5)",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 32px rgba(236, 72, 153, 0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(236, 72, 153, 0.5)";
                  }}
                >
                  <Link href="/auth/register-verification?type=student">
                    <Stethoscope className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("home.registerAsStudent")}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="font-bold text-responsive-base text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                  style={{
                    background: "transparent",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(147, 51, 234, 0.2)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(147, 51, 234, 0.3)";
                    e.currentTarget.style.borderColor = "rgba(147, 51, 234, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                >
                  <Link href="/auth/register-verification?type=patient">
                    <User className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("home.registerAsPatient")}
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                {[t("home.freeTreatment"), t("home.verifiedStudents"), t("home.comprehensiveRating")].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-responsive-sm font-semibold text-white">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(147, 51, 234, 0.2)",
                        border: "2px solid #a855f7",
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: "#a855f7" }} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stat cards */}
            <div
              ref={heroStatsRef}
              className="grid grid-cols-2 gap-6 animate-slide-in-right"
              style={{ animationDelay: "300ms" }}
            >
              <StatCard
                emoji="👨‍⚕️"
                value={statsLoading ? 0 : stats.activeStudents}
                label={t("home.activeStudents")}
                numClassName=""
                delay="0ms"
                start={heroStatsInView}
              />
              <StatCard
                emoji="👥"
                value={statsLoading ? 0 : stats.activePatients}
                label={t("home.registeredPatients")}
                numClassName=""
                delay="100ms"
                start={heroStatsInView}
              />
              <StatCard
                emoji="✅"
                value={statsLoading ? 0 : stats.completedCases}
                label={t("home.completedCases")}
                numClassName=""
                delay="200ms"
                start={heroStatsInView}
              />

              {/* Rating card — static */}
              <Card
                className="border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
              >
                <CardContent className="pt-8 text-center">
                  <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">⭐</div>
                  <div
                    className="text-responsive-3xl font-bold mb-1"
                    style={{
                      background: "linear-gradient(135deg, #FFAE00, #ffcf57)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {statsLoading ? "0.0" : stats.averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {t("home.averageRating")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           FOR WHOM SECTION - USER TYPES
      ========================================== */}
      <section
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "80px 5vw",
          position: "relative",
          background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
          <div
            className="absolute top-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '3s' }}
          />
        </div>

        {/* Content */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <AnimatedSection>
            <div
              className="eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{
                background: "rgba(147, 51, 234, 0.2)",
                border: "1px solid rgba(147, 51, 234, 0.4)",
                color: "#a855f7",
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t("home.userTypes.eyebrow") || "من لأجله؟"}
              <Sparkles className="w-4 h-4" />
            </div>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#fff",
              }}
            >
              {t("home.userTypes.title") || "المنصة لك سواء كنت..."}
            </h2>
          </AnimatedSection>
        </div>

        <div
          className="user-types"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Patient Card */}
          <AnimatedSection delay={100}>
            <div
              className="user-card patient"
              onClick={() => window.location.href = "/auth/register-verification?type=patient"}
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: "24px",
                padding: "40px 32px",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "2px solid rgba(147, 51, 234, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 24px 40px rgba(147, 51, 234, 0.3)";
                e.currentTarget.style.borderColor = "#a855f7";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(147, 51, 234, 0.2)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <span className="uc-icon" style={{ display: "block", textAlign: "center", fontSize: "56px", marginBottom: "24px", transition: "all 0.3s ease" }}>
                {t("home.userTypes.patient.icon") || "🏥"}
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", textAlign: "center", color: "#fff" }}>
                {t("home.userTypes.patient.title") || "مريض يبحث عن علاج"}
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "24px", lineHeight: 1.8 }}>
                {t("home.userTypes.patient.description") || "تصفّح الحالات المتاحة، قدّم على ما يناسبك، وتواصل مع الطالب مباشرة"}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0" }}>
                {(() => {
                  const patientFeatures = getData("home.userTypes.patient.features");
                  const safeFeatures = Array.isArray(patientFeatures)
                    ? patientFeatures
                    : [
                        "علاج مجاني أو بأسعار منخفضة",
                        "طلاب موثّقون وذوو تقييمات عالية",
                        "تتبع حالتك خطوة بخطوة",
                        "نظام إبلاغ لضمان سلامتك",
                      ];
                  return safeFeatures.map((feature, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ color: "#a855f7", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>{feature}</span>
                    </li>
                  ));
                })()}
              </ul>
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "/auth/register-verification?type=patient";
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #9333ea, #ec4899)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 6px 24px rgba(236, 72, 153, 0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 10px 32px rgba(236, 72, 153, 0.5)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #a855f7, #f472b6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(236, 72, 153, 0.35)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #9333ea, #ec4899)";
                }}
              >
                {t("home.userTypes.patient.button") || "سجّل كمريض ←"}
              </button>
            </div>
          </AnimatedSection>

          {/* Student Card */}
          <AnimatedSection delay={200}>
            <div
              className="user-card student"
              onClick={() => window.location.href = "/auth/register-verification?type=student"}
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: "24px",
                padding: "40px 32px",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "2px solid rgba(236, 72, 153, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 24px 40px rgba(236, 72, 153, 0.3)";
                e.currentTarget.style.borderColor = "#ec4899";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.2)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <span className="uc-icon" style={{ display: "block", textAlign: "center", fontSize: "56px", marginBottom: "24px", transition: "all 0.3s ease" }}>
                {t("home.userTypes.student.icon") || "🎓"}
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", textAlign: "center", color: "#fff" }}>
                {t("home.userTypes.student.title") || "طالب طب أسنان"}
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "24px", lineHeight: 1.8 }}>
                {t("home.userTypes.student.description") || "انشر حالاتك المطلوبة، اقبل المرضى المناسبين، وطوّر مهاراتك مع كل حالة"}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0" }}>
                {(() => {
                  const studentFeatures = getData("home.userTypes.student.features");
                  const safeFeatures = Array.isArray(studentFeatures)
                    ? studentFeatures
                    : [
                        "حالات عملية متنوعة ومصنّفة",
                        "نظام نقاط وشارات تحفيزي",
                        "بورتفوليو احترافي للإنجازات",
                        "لوحة تحكم شاملة للحالات",
                      ];
                  return safeFeatures.map((feature, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ color: "#ec4899", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>{feature}</span>
                    </li>
                  ));
                })()}
              </ul>
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = "/auth/register-verification?type=student";
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #ec4899, #f472b6)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 6px 24px rgba(236, 72, 153, 0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 10px 32px rgba(236, 72, 153, 0.5)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #f472b6, #fb7185)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(236, 72, 153, 0.35)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #ec4899, #f472b6)";
                }}
              >
                {t("home.userTypes.student.button") || "سجّل كطالب ←"}
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==========================================
           VIDEO DEMO SECTION
      ========================================== */}
      <section
        className="section-spacing relative"
        style={{
          backgroundImage: "url('/img/video-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 z-0" style={{ background: "rgba(13,27,64,0.85)" }} />
        <div className="container-full relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{ background: "rgba(147, 51, 234, 0.2)", color: "#a855f7", border: "1px solid rgba(147, 51, 234, 0.35)" }}
            >
              <Play className="w-4 h-4" />
              Demo
              <Play className="w-4 h-4" />
            </span>
            <h2 className="text-responsive-4xl font-bold mb-6 text-white" suppressHydrationWarning>
              {t("home.videoSection.title")}
            </h2>
            <p className="text-responsive-lg max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }} suppressHydrationWarning>
              {t("home.videoSection.subtitle")}
            </p>
          </AnimatedSection>

          <AnimatedSection className="container-wide" delay={150}>
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500"
              style={{
                background: "#0a0a0a",
                border: "2px solid rgba(147, 51, 234, 0.3)",
              }}
            >
              <video className="w-full aspect-video" controls poster="/img/video-poster.jpg" preload="metadata">
                <source src="/img/poster.mp4" type="video/mp4" />
                <source src="/img/platform-demo.webm" type="video/webm" />
                <p className="text-white text-center p-8">{t("home.videoSection.notSupported")}</p>
              </video>
              <div
                className="absolute bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
              >
                <Play className="w-4 h-4" style={{ color: "#a855f7" }} />
                <span suppressHydrationWarning>{t("home.videoSection.watchFull")}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: Clock,        bg: "linear-gradient(135deg,#a855f7,#ec4899)", title: t("home.videoSection.quick"),  desc: t("home.videoSection.quickDesc")  },
                { icon: CheckCircle2, bg: "linear-gradient(135deg,#ec4899,#f472b6)", title: t("home.videoSection.easy"),   desc: t("home.videoSection.easyDesc")   },
                { icon: Shield,       bg: "linear-gradient(135deg,#a855f7,#8b5cf6)", title: t("home.videoSection.secure"), desc: t("home.videoSection.secureDesc") },
              ].map(({ icon: Icon, bg, title, desc }, i) => (
                <Card
                  key={i}
                  className="text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(147, 51, 234, 0.2)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CardContent className="pt-8 pb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      style={{ background: bg }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-responsive-base font-bold mb-2 text-white" suppressHydrationWarning>{title}</h3>
                    <p className="text-responsive-sm" style={{ color: "rgba(255,255,255,0.65)" }} suppressHydrationWarning>{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==========================================
           FEATURES SECTION
      ========================================== */}
      <section
        id="features"
        className="section-spacing relative"
        style={{
          background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="container-full relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{ background: "rgba(147, 51, 234, 0.2)", color: "#a855f7", border: "1px solid rgba(147, 51, 234, 0.35)" }}
            >
              <Star className="w-4 h-4" />
              Features
              <Star className="w-4 h-4" />
            </span>
            <h2 className="text-responsive-4xl font-bold mb-4 text-white">
              {t("home.whySmiley")}
            </h2>
            <p className="text-responsive-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              {t("home.platformOffers")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield,        iconBg: "linear-gradient(135deg, #a855f7, #8b5cf6)", title: t("home.verifiedStudents"),     desc: t("home.verifiedStudentsDesc")     },
              { icon: Star,          iconBg: "linear-gradient(135deg, #fbbf24, #f59e0b)", title: t("home.comprehensiveRating"),  desc: t("home.comprehensiveRatingDesc")  },
              { icon: MapPin,        iconBg: "linear-gradient(135deg, #ec4899, #f472b6)", title: t("home.locationBasedSearch"),  desc: t("home.locationBasedSearchDesc")  },
              { icon: MessageCircle, iconBg: "linear-gradient(135deg, #8b5cf6, #a855f7)", title: t("home.directMessaging"),      desc: t("home.directMessagingDesc")      },
              { icon: Clock,         iconBg: "linear-gradient(135deg, #f97316, #ea580c)", title: t("home.appointmentReminders"), desc: t("home.appointmentRemindersDesc") },
              { icon: Heart,         iconBg: "linear-gradient(135deg, #ec4899, #f43f5e)", title: t("home.freeTreatment"),        desc: t("home.freeTreatmentDesc")        },
            ].map(({ icon: Icon, iconBg, title, desc }, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <Card
                  className="h-full transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl group cursor-default"
                  style={{
                    border: "2px solid rgba(147, 51, 234, 0.2)",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)"
                  }}
                  onMouseEnter={(e) => {
                    handleHoverBorderColor(e, "#a855f7");
                    e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    handleLeaveBorderColor(e);
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  <CardHeader>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                      style={{ background: iconBg }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-responsive-lg font-bold text-white">
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-responsive-base leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
           HOW IT WORKS SECTION
      ========================================== */}
      <section
        id="how-it-works"
        className="section-spacing relative"
        style={{
          background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
          <div
            className="absolute top-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '1.5s' }}
          />
        </div>

        <div className="container-full relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{ background: "rgba(236, 72, 153, 0.2)", color: "#ec4899", border: "1px solid rgba(236, 72, 153, 0.35)" }}
            >
              <Zap className="w-4 h-4" />
              Process
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-responsive-4xl font-bold mb-4 text-white">
              {t("home.howItWorks")}
            </h2>
            <p className="text-responsive-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              {t("home.howItWorksSubtitle") || "Simple steps to get started with your dental journey"}
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Patients */}
            <AnimatedSection delay={100}>
              <h3 className="text-responsive-2xl font-bold mb-8 flex items-center gap-4 text-white">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, #a855f7, #8b5cf6)" }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                {t("home.forPatients")}
              </h3>
              <div className="space-y-4">
                {[
                  t("home.step1Patient"), t("home.step2Patient"), t("home.step3Patient"),
                  t("home.step4Patient"), t("home.step5Patient"),
                ].map((step, i) => (
                  <AnimatedSection key={i} delay={i * 80}>
                    <Card
                      className="shadow-sm transition-all duration-300 hover:shadow-lg group"
                      style={{
                        border: "1.5px solid rgba(147, 51, 234, 0.2)",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(8px)"
                      }}
                      onMouseEnter={(e) => {
                        handleHoverBorderColor(e, "#a855f7");
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        handleLeaveBorderColor(e);
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex gap-4 items-start">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                            style={{ background: "linear-gradient(135deg, #a855f7, #8b5cf6)" }}
                          >
                            {i + 1}
                          </div>
                          <span className="font-semibold text-responsive-base leading-relaxed pt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {step}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            {/* Students */}
            <AnimatedSection delay={200}>
              <h3 className="text-responsive-2xl font-bold mb-8 flex items-center gap-4 text-white">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, #ec4899, #f472b6)" }}
                >
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                {t("home.forStudents")}
              </h3>
              <div className="space-y-4">
                {[
                  t("home.step1Student"), t("home.step2Student"), t("home.step3Student"),
                  t("home.step4Student"), t("home.step5Student"),
                ].map((step, i) => (
                  <AnimatedSection key={i} delay={i * 80}>
                    <Card
                      className="shadow-sm transition-all duration-300 hover:shadow-lg group"
                      style={{
                        border: "1.5px solid rgba(236, 72, 153, 0.2)",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(8px)"
                      }}
                      onMouseEnter={(e) => {
                        handleHoverBorderColor(e, "#ec4899");
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        handleLeaveBorderColor(e);
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex gap-4 items-start">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                            style={{ background: "linear-gradient(135deg, #ec4899, #f472b6)" }}
                          >
                            {i + 1}
                          </div>
                          <span className="font-semibold text-responsive-base leading-relaxed pt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {step}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==========================================
           FAQ SECTION
      ========================================== */}
      <section
        id="faq"
        className="section-spacing relative"
        style={{
          background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
          <div
            className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: '2.5s' }}
          />
        </div>

        <div className="container-full relative z-10">
          <div className="container-medium">
            <AnimatedSection className="text-center mb-16">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
                style={{ background: "rgba(168, 85, 247, 0.2)", color: "#a855f7", border: "1px solid rgba(168, 85, 247, 0.35)" }}
              >
                <MessageCircle className="w-4 h-4" />
                FAQ
                <MessageCircle className="w-4 h-4" />
              </span>
              <h2 className="text-responsive-4xl font-bold mb-4 text-white">
                {t("home.faqTitle")}
              </h2>
              <p className="text-responsive-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
                {t("home.faqSubtitle") || "Find answers to frequently asked questions"}
              </p>
            </AnimatedSection>

            <div className="space-y-5">
              {[
                { q: t("home.faq1"), a: t("home.faq1Answer") },
                { q: t("home.faq2"), a: t("home.faq2Answer") },
                { q: t("home.faq3"), a: t("home.faq3Answer") },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <Card
                    className="transition-all duration-300 hover:shadow-lg group"
                    style={{
                      border: "2px solid rgba(147, 51, 234, 0.2)",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(8px)"
                    }}
                    onMouseEnter={(e) => {
                      handleHoverBorderColor(e, "#a855f7");
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      handleLeaveBorderColor(e);
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-responsive-base font-bold flex items-start gap-3 text-white">
                        <span
                          className="font-black transition-all duration-300 group-hover:scale-125 inline-block"
                          style={{ color: "#a855f7" }}
                        >
                          Q{i + 1}.
                        </span>
                        <span className="leading-relaxed">{item.q}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-responsive-sm leading-relaxed pl-7" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {item.a}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
           FOOTER
      ========================================== */}
      <footer
        className="py-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D1B40 0%, #1a2a6c 50%, #2d1b69 100%)",
          borderTop: "2px solid rgba(147, 51, 234, 0.3)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0]">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container-full relative z-10">
          <AnimatedSection>
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #9333ea, #ec4899)",
                        boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
                      }}
                    >
                      <span className="text-2xl">🦷</span>
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{
                        background: "linear-gradient(135deg, #a855f7, #ec4899)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("home.brand")}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-sm leading-relaxed">
                    {t("home.footerDescription")}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">{t("home.quickLinks")}</h3>
                <ul className="space-y-3">
                  {[
                    { href: "#features", label: t("home.features") },
                    { href: "#how-it-works", label: t("home.howItWorks") },
                    { href: "#faq", label: t("home.faq") },
                    { href: "#", label: t("home.support") },
                    { href: "#", label: t("home.contactUs") },
                    { href: "#", label: t("home.termsAndConditions") },
                    { href: "#", label: t("home.privacyPolicy") },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm transition-all duration-200 hover:text-purple-400 hover:translate-x-1 inline-block"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">{t("home.contactUs")}</h3>
                <p style={{ color: "rgba(255,255,255,0.7)" }} className="text-sm leading-relaxed mb-4">
                  {t("home.contactUsQuestion")}
                </p>
                <button
                  className="px-6 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
                  }}
                >
                  {t("home.contactUsButton")}
                </button>
              </div>

              {/* Team Info */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">{t("home.teamSection")}</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: "rgba(147, 51, 234, 0.1)", border: "1px solid rgba(147, 51, 234, 0.2)" }}>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{t("home.graduationTeam")}</p>
                    <p className="text-purple-300 font-bold text-lg">Team CS-22</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(236, 72, 153, 0.1)", border: "1px solid rgba(236, 72, 153, 0.2)" }}>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{t("home.graduationProject")}</p>
                    <p className="text-pink-300 font-bold text-lg">2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              className="pt-8 border-t border-white/10"
            >
              <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-center text-sm">
                {t("home.copyright")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes particle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(100px, -50px) scale(1.5); opacity: 1; }
        }

        @keyframes particle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-80px, 100px) scale(1.3); opacity: 1; }
        }

        @keyframes particle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(120px, 80px) scale(1.4); opacity: 1; }
        }

        @keyframes particle-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-100px, -60px) scale(1.2); opacity: 1; }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-particle-1 {
          animation: particle-1 15s ease-in-out infinite;
        }

        .animate-particle-2 {
          animation: particle-2 18s ease-in-out infinite;
        }

        .animate-particle-3 {
          animation: particle-3 12s ease-in-out infinite;
        }

        .animate-particle-4 {
          animation: particle-4 20s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
