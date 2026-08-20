"use client"

import { useRef, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import { 
    Sparkles, 
    Code2, 
    Terminal, 
    GitBranch, 
    Eye, 
    Zap, 
    Cloud, 
    Layers,
    ChevronRight,
    Play,
    Users,
    Globe,
    Box,
    ArrowRight,
    Star,
    Check,
    X,
    Rocket,
    Crown,
    Building2,
    HelpCircle,
    ChevronDown
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Animated background with floating particles
const FloatingParticles = () => {
    const particles = useMemo(
        () => Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10 + 15,
            duration: Math.random() * 10 + 15,
        })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-up"
                    style={{
                        left: `${particle.left}%`,
                        bottom: "-20px",
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

// Aurora gradient background
const AuroraBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-20 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-cyan-500/25 via-blue-500/15 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-40 left-1/2 w-[700px] h-[400px] bg-gradient-to-b from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
    );
};

// Code preview window component
const CodePreviewWindow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "relative bg-[#0a0a0f]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl",
                className
            )}
        >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 h-5 mx-4 rounded bg-white/5" />
            </div>
            <div className="p-4">
                {children}
            </div>
        </motion.div>
    );
};

// Feature card component
const FeatureCard = ({ 
    icon: Icon, 
    title, 
    description, 
    delay 
}: { 
    icon: React.ElementType, 
    title: string, 
    description: string, 
    delay: number 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-500" />
            <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10">
                    <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

// Step component for how it works
const StepItem = ({ 
    number, 
    title, 
    description, 
    delay 
}: { 
    number: number, 
    title: string, 
    description: string, 
    delay: number 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="flex gap-6"
        >
            <div className="flex flex-col items-center">
                <motion.div 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold shadow-lg shadow-indigo-500/25"
                    whileHover={{ scale: 1.1 }}
                >
                    {number}
                </motion.div>
                {number < 3 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                )}
            </div>
            <div className="pb-8">
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/60 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

// Animated star component for testimonials
const AnimatedStar = ({ delay }: { delay: number }) => (
    <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay, type: "spring", stiffness: 200 }}
    >
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
    </motion.div>
);

// Testimonial component with enhanced animations
const TestimonialCard = ({ quote, author, role, delay, direction }: { quote: string, author: string, role: string, delay: number, direction: "left" | "right" | "up" }) => {
    const initialAnimation = direction === "left" 
        ? { opacity: 0, x: -50, rotate: -5 }
        : direction === "right"
        ? { opacity: 0, x: 50, rotate: 5 }
        : { opacity: 0, y: 50, scale: 0.9 };
    
    return (
        <motion.div
            initial={initialAnimation}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.3)"
            }}
            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/30 transition-all duration-500"
        >
            {/* Glow effect on hover */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.2) 0%, transparent 60%)",
                }}
            />
            
            <div className="relative">
                {/* Animated stars */}
                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <AnimatedStar key={i} delay={delay + i * 0.1} />
                    ))}
                </div>
                
                {/* Quote with reveal animation */}
                <motion.p 
                    className="text-white/80 mb-4 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.3 }}
                >
                    "{quote}"
                </motion.p>
                
                {/* Author info with slide animation */}
                <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.4 }}
                >
                    {/* Avatar placeholder with glow */}
                    <motion.div 
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        {author.split(' ').map(n => n[0]).join('')}
                    </motion.div>
                    <div>
                        <motion.p 
                            className="font-medium text-white"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            {author}
                        </motion.p>
                        <motion.p 
                            className="text-sm text-white/50"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: delay + 0.5 }}
                        >
                            {role}
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Shimmer effect component for popular card
const ShimmerEffect = () => (
    <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
            x: [-200, 400],
        }}
        transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
        }}
        style={{
            width: "100px",
            transform: "skewX(-20deg)",
        }}
    />
);

// Pricing tier component with enhanced animations
const PricingCard = ({
    name,
    price,
    description,
    features,
    cta,
    popular = false,
    delay
}: {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    delay: number;
}) => {
    const Icon = popular ? Crown : name === "Free" ? Rocket : Building2;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 group overflow-hidden",
                popular 
                    ? "bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-indigo-500/50 shadow-xl shadow-indigo-500/20"
                    : "bg-white/5 border-white/10 hover:border-white/20"
            )}
        >
            {/* Glow effect on hover */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: popular 
                        ? "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3) 0%, transparent 70%)"
                        : "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                }}
            />
            
            {/* Shimmer for popular card */}
            {popular && <ShimmerEffect />}
            
            {popular && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: delay + 0.3 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-semibold text-white shadow-lg shadow-indigo-500/50"
                >
                    <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Most Popular
                    </motion.span>
                </motion.div>
            )}
            
            <div className="relative flex items-center gap-3 mb-6">
                <motion.div 
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        popular ? "bg-gradient-to-br from-indigo-500 to-purple-500" : "bg-white/10"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <motion.div
                        animate={popular ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Icon className={cn("w-6 h-6", popular ? "text-white" : "text-white/70")} />
                    </motion.div>
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                </div>
            </div>
            
            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <motion.span 
                        className="text-4xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {price}
                    </motion.span>
                    {price !== "Free" && <span className="text-white/50">/month</span>}
                </div>
                <p className="text-sm text-white/60 mt-2">{description}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <motion.li 
                        key={i} 
                        className="flex items-start gap-3 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: delay + 0.1 * i }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className="mt-0.5"
                        >
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                        </motion.div>
                        <span className="text-white/70">{feature}</span>
                    </motion.li>
                ))}
            </ul>
            
            <SignUpButton mode="modal">
                <motion.button 
                    className={cn(
                        "w-full h-12 rounded-xl font-semibold transition-all duration-300 cursor-pointer relative overflow-hidden",
                        popular 
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.span
                        className="relative z-10"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {cta}
                    </motion.span>
                </motion.button>
            </SignUpButton>
        </motion.div>
    );
};

// Counting number animation component
const CountingNumber = ({ endValue, suffix, label, delay }: { endValue: number; suffix: string; label: string; delay: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const duration = 2000;
                        const steps = 60;
                        const increment = endValue / steps;
                        let current = 0;
                        const interval = setInterval(() => {
                            current += increment;
                            if (current >= endValue) {
                                setCount(endValue);
                                clearInterval(interval);
                            } else {
                                setCount(Math.floor(current));
                            }
                        }, duration / steps);
                        return () => clearInterval(interval);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [endValue]);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
        }
        return num.toString();
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="text-center group"
        >
            <motion.div 
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {formatNumber(count)}{suffix}
            </motion.div>
            <motion.p 
                className="text-sm text-white/50 group-hover:text-white/70 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.2 }}
            >
                {label}
            </motion.p>
        </motion.div>
    );
};

// FAQ item component
const FAQItem = ({ question, answer, delay }: { question: string; answer: string; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="border-b border-white/10 last:border-0"
        >
            <details className="group">
                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                    <span className="text-lg font-medium text-white">{question}</span>
                    <ChevronDown className="w-5 h-5 text-white/50 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="pb-6">
                    <p className="text-white/60 leading-relaxed">{answer}</p>
                </div>
            </details>
        </motion.div>
    );
};

// Enhanced feature comparison table with animations
const FeatureComparison = () => {
    const features = [
        { name: "AI Code Generation", free: true, pro: true, enterprise: true },
        { name: "Projects", free: "3 projects", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Storage", free: "1 GB", pro: "10 GB", enterprise: "100 GB" },
        { name: "Live Preview", free: true, pro: true, enterprise: true },
        { name: "GitHub Integration", free: "Import only", pro: "Import & Export", enterprise: "Import & Export" },
        { name: "AI Model Selection", free: "Limited", pro: "All models", enterprise: "All models" },
        { name: "Collaboration", free: false, pro: false, enterprise: true },
        { name: "Priority Support", free: false, pro: true, enterprise: true },
        { name: "Custom Domain", free: false, pro: true, enterprise: true },
        { name: "API Access", free: false, pro: false, enterprise: true },
    ];

    const getCellContent = (value: boolean | string, isHighlight: boolean = false) => {
        if (value === true) {
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Check className={cn(
                        "w-5 h-5 mx-auto",
                        isHighlight ? "text-indigo-400" : "text-green-400"
                    )} />
                </motion.div>
            );
        }
        if (value === false) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <X className="w-5 h-5 text-white/20 mx-auto" />
                </motion.div>
            );
        }
        return (
            <motion.span 
                className="text-sm text-white/70"
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                {value}
            </motion.span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-sm font-medium text-white/50">Feature</th>
                        <th className="py-4 px-4 text-center">
                            <motion.span 
                                className="text-sm font-medium text-white"
                                whileHover={{ scale: 1.1 }}
                            >
                                Free
                            </motion.span>
                        </th>
                        <th className="py-4 px-4 text-center">
                            <motion.span 
                                className="text-sm font-medium text-indigo-400"
                                whileHover={{ scale: 1.1 }}
                            >
                                Pro
                            </motion.span>
                        </th>
                        <th className="py-4 px-4 text-center">
                            <motion.span 
                                className="text-sm font-medium text-white"
                                whileHover={{ scale: 1.1 }}
                            >
                                Enterprise
                            </motion.span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature, i) => (
                        <motion.tr 
                            key={feature.name}
                            initial={{ 
                                opacity: 0, 
                                x: -20
                            }}
                            whileInView={{ 
                                opacity: 1, 
                                x: 0
                            }}
                            viewport={{ once: true }}
                            transition={{ 
                                delay: i * 0.08,
                                duration: 0.3
                            }}
                            whileHover={{ 
                                backgroundColor: "rgba(255,255,255,0.05)"
                            }}
                            className="border-b border-white/5 transition-colors"
                        >
                            <td className="py-4 px-4 text-sm text-white/70">{feature.name}</td>
                            <td className="py-4 px-4 text-center">{getCellContent(feature.free)}</td>
                            <td className="py-4 px-4 text-center bg-indigo-500/5">{getCellContent(feature.pro, true)}</td>
                            <td className="py-4 px-4 text-center">{getCellContent(feature.enterprise)}</td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const LandingPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
            {/* Background effects */}
            <AuroraBackground />
            <FloatingParticles />

            {/* Navigation */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative">
                            <Image
                                src="/logo.svg"
                                alt="Polaris"
                                width={36}
                                height={36}
                                className="drop-shadow-lg"
                            />
                            <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full" />
                        </div>
                        <span className="text-2xl font-bold text-white">Polaris</span>
                    </motion.div>

                    <div className="flex items-center gap-1">
                        <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                            Pricing
                        </Link>
                        <Link href="#faq" className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                            FAQ
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section 
                style={{ y, opacity, scale }}
                className="relative min-h-screen flex items-center justify-center px-6 pt-20"
            >
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        />
                        <span className="text-sm text-white/70">AI-powered development environment</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                    >
                        Build apps with
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            AI by your side
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Describe what you want to build in natural language. 
                        Watch as AI creates complete applications in your browser, 
                        with live preview and instant deployment.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <SignUpButton mode="modal">
                            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-8 h-12 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Building Free
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </SignUpButton>
                        <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 h-12 rounded-xl">
                            <Play className="w-4 h-4 mr-2" />
                            Watch Demo
                        </Button>
                    </motion.div>

                    {/* Floating code preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="relative mt-20 max-w-4xl mx-auto"
                    >
                        <CodePreviewWindow className="shadow-2xl shadow-indigo-500/10">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-white/40 text-sm">
                                        <Terminal className="w-4 h-4" />
                                        <span>AI Assistant</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                        <p className="text-sm text-indigo-300">
                                            Creating a React dashboard with charts and dark mode...
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        {["src/App.tsx", "src/components/Dashboard.tsx", "tailwind.config.js"].map((file, i) => (
                                            <motion.div
                                                key={file}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1.2 + i * 0.1 }}
                                                className="flex items-center gap-2 p-2 rounded bg-white/5 text-sm text-white/70"
                                            >
                                                <Code2 className="w-4 h-4 text-cyan-400" />
                                                <span>{file}</span>
                                                <motion.span 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ delay: 1.5 + i * 0.2, duration: 0.8 }}
                                                    className="ml-auto text-xs text-green-400"
                                                >
                                                    Created
                                                </motion.span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-white/40 text-sm">
                                        <Eye className="w-4 h-4" />
                                        <span>Live Preview</span>
                                    </div>
                                    <div className="relative aspect-video rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <motion.div
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center"
                                                >
                                                    <Globe className="w-8 h-8 text-white" />
                                                </motion.div>
                                                <p className="text-sm text-white/60">Dashboard Preview</p>
                                                <div className="flex items-center gap-2 mt-2 justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs text-green-400">Running</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Mini UI elements */}
                                        <div className="absolute top-2 left-2 right-2 flex gap-2">
                                            <div className="h-6 flex-1 rounded bg-white/10" />
                                            <div className="h-6 w-20 rounded bg-indigo-500/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CodePreviewWindow>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                    >
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/50"
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Everything you need to build
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto">
                            A complete development environment that runs entirely in your browser. No setup, no configuration, just code.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Sparkles}
                            title="AI Code Generation"
                            description="Describe features in plain English and watch AI create complete, working code with context awareness."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Code2}
                            title="Professional Editor"
                            description="CodeMirror 6 with syntax highlighting for 20+ languages, intelligent completions, and error detection."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="Integrated Terminal"
                            description="Full xterm.js terminal with command history, running npm scripts and build commands directly."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Eye}
                            title="Live Preview"
                            description="WebContainer-powered in-browser Node.js runtime with hot module reloading and instant feedback."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={GitBranch}
                            title="GitHub Integration"
                            description="Import existing projects from GitHub or push your creations back. Full version control workflow."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Cloud}
                            title="Cloud Storage"
                            description="Projects automatically saved to the cloud. Access your work from anywhere, anytime."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            From idea to app in minutes
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto">
                            Three simple steps to turn your vision into reality
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <StepItem
                                number={1}
                                title="Describe your vision"
                                description="Tell the AI what you want to build in plain English. 'Create a todo app with drag-and-drop' or 'Build a landing page with a pricing table.'"
                                delay={0}
                            />
                            <StepItem
                                number={2}
                                title="Watch AI build"
                                description="The AI reads your intent, creates all necessary files, and implements your feature complete with styling and functionality."
                                delay={0.2}
                            />
                            <StepItem
                                number={3}
                                title="Preview and iterate"
                                description="See your app running instantly in the browser. Chat with AI to refine, add features, or make changes until it's perfect."
                                delay={0.4}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <CodePreviewWindow className="shadow-2xl shadow-purple-500/10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">AI Chat</p>
                                            <p className="text-xs text-white/50">Context-aware assistant</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-white/5 text-sm">
                                            Create a recipe sharing app with categories and user profiles
                                        </div>
                                        <div className="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-sm text-indigo-200">
                                            <p className="mb-2">Creating project structure...</p>
                                            <div className="space-y-1 text-xs text-white/60">
                                                <p>✓ src/pages/index.tsx</p>
                                                <p>✓ src/components/RecipeCard.tsx</p>
                                                <p>✓ src/lib/api.ts</p>
                                                <p>✓ src/styles/globals.css</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CodePreviewWindow>

                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section with counting animation */}
            <section className="relative py-24 px-6">
                {/* Animated background accent */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
                        y: useTransform(scrollYProgress, [0.2, 0.5], [30, -30]),
                    }}
                />
                
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {[
                            { endValue: 50000, suffix: "+", label: "Projects Created" },
                            { endValue: 100, suffix: "+", label: "AI Models" },
                            { endValue: 99, suffix: "%", label: "Uptime" },
                            { endValue: 10, suffix: "s", label: "Avg. Deploy Time" },
                        ].map((stat, i) => (
                            <CountingNumber
                                key={stat.label}
                                endValue={stat.endValue}
                                suffix={stat.suffix}
                                label={stat.label}
                                delay={i * 0.15}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section with enhanced animations */}
            <section className="relative py-32 px-6 overflow-hidden">
                {/* Background animated gradient */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/30 to-transparent pointer-events-none"
                    style={{
                        y: useTransform(scrollYProgress, [0.4, 0.8], [50, -50]),
                        opacity: useTransform(scrollYProgress, [0.4, 0.6], [0.3, 0.8]),
                    }}
                />
                
                {/* Decorative floating shapes */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-20 h-20 rounded-full border border-indigo-500/10"
                        style={{
                            left: `${10 + i * 25}%`,
                            top: `${20 + i * 15}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 1.5,
                        }}
                    />
                ))}
                
                <div className="max-w-6xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.h2 
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            Loved by developers
                        </motion.h2>
                        <motion.p 
                            className="text-lg text-white/60"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            Join thousands of developers building faster with Polaris
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="Polaris has completely changed how I prototype ideas. I can go from a concept to a working demo in minutes instead of hours."
                            author="Sarah Chen"
                            role="Senior Engineer at Vercel"
                            delay={0}
                            direction="left"
                        />
                        <TestimonialCard
                            quote="The AI code generation is incredibly smart. It understands context and produces production-ready code that follows best practices."
                            author="Marcus Johnson"
                            role="Full-stack Developer"
                            delay={0.15}
                            direction="up"
                        />
                        <TestimonialCard
                            quote="Being able to run Node.js in the browser with live preview is a game-changer. No more context switching between tabs."
                            author="Elena Rodriguez"
                            role="Frontend Architect"
                            delay={0.3}
                            direction="right"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto">
                            Choose the plan that fits your needs. All plans include AI-powered development features.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <PricingCard
                            name="Free"
                            price="Free"
                            description="Perfect for getting started with AI-assisted development"
                            features={[
                                "3 projects",
                                "1 GB storage",
                                "AI code generation",
                                "Live preview",
                                "GitHub import",
                                "Community support"
                            ]}
                            cta="Get Started"
                            delay={0}
                        />
                        <PricingCard
                            name="Pro"
                            price="$29"
                            description="For developers who need more power and flexibility"
                            features={[
                                "Unlimited projects",
                                "10 GB storage",
                                "All AI models",
                                "GitHub import & export",
                                "Priority support",
                                "Custom domains"
                            ]}
                            cta="Start Pro Trial"
                            popular
                            delay={0.1}
                        />
                        <PricingCard
                            name="Enterprise"
                            price="$99"
                            description="For teams and organizations with advanced needs"
                            features={[
                                "Everything in Pro",
                                "100 GB storage",
                                "Team collaboration",
                                "API access",
                                "Dedicated support",
                                "Custom integrations"
                            ]}
                            cta="Contact Sales"
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* Feature Comparison Section */}
            <section className="relative py-24 px-6 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Compare plans
                        </h2>
                        <p className="text-white/60">
                            See what's included in each tier
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
                    >
                        <FeatureComparison />
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="relative py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 mb-6">
                            <HelpCircle className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Frequently asked questions
                        </h2>
                        <p className="text-white/60">
                            Everything you need to know about Polaris
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-6"
                    >
                        <FAQItem
                            question="How does AI code generation work?"
                            answer="Our AI analyzes your natural language descriptions and understands the context of your existing codebase. It then generates complete, working code files with proper styling, components, and functionality. You can iteratively refine the output by continuing the conversation."
                            delay={0}
                        />
                        <FAQItem
                            question="What makes Polaris different from other online IDEs?"
                            answer="Unlike traditional IDEs, Polaris combines AI-powered code generation with a complete in-browser development environment. You don't just write code—you describe what you want, and AI builds it. Plus, WebContainer technology means you can run Node.js applications directly in your browser without any backend."
                            delay={0.1}
                        />
                        <FAQItem
                            question="Is my code stored securely?"
                            answer="Yes. All projects are encrypted at rest and in transit. We use industry-standard encryption and security practices. Your code is only accessible to you and anyone you explicitly share it with."
                            delay={0.2}
                        />
                        <FAQItem
                            question="Can I export my projects to GitHub?"
                            answer="Absolutely! Pro and Enterprise plans include full GitHub integration. You can push projects to new repositories, update existing ones, and even import directly from any GitHub repository."
                            delay={0.3}
                        />
                        <FAQItem
                            question="What happens if I exceed my storage limit?"
                            answer="You'll receive notifications as you approach your limit. You can delete unused projects, upgrade to a higher plan, or export your code. We never delete your projects without explicit permission."
                            delay={0.4}
                        />
                        <FAQItem
                            question="Do you offer refunds?"
                            answer="Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team and we'll process your refund within 5 business days."
                            delay={0.5}
                        />
                    </motion.div>
                </div>
            </section>

            {/* CTA Section with enhanced animations */}
            <section id="cta" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Floating decorative orbs with scroll-linked parallax */}
                    <motion.div
                        className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-[60px]"
                        style={{
                            y: useTransform(scrollYProgress, [0, 1], [0, 100]),
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-[60px]"
                        style={{
                            y: useTransform(scrollYProgress, [0, 1], [0, -80]),
                        }}
                        animate={{
                            scale: [1, 0.8, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-[50px]"
                        style={{
                            y: useTransform(scrollYProgress, [0, 1], [0, 60]),
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 1
                        }}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/20 border border-white/10 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Animated background gradient */}
                        <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{
                                background: [
                                    "linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.4) 50%, rgba(6, 182, 212, 0.4) 100%)",
                                    "linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(6, 182, 212, 0.4) 50%, rgba(99, 102, 241, 0.4) 100%)",
                                ],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                        
                        {/* Animated particle effects */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white/30 rounded-full"
                                style={{
                                    left: `${15 + i * 12}%`,
                                    top: `${20 + (i % 3) * 25}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3 + (i % 2),
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                        
                        {/* Background effects */}
                        <motion.div 
                            className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[100px]"
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 20, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div 
                            className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/30 rounded-full blur-[100px]"
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, -20, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        
                        <div className="relative text-center">
                            {/* Animated icon with dramatic entrance */}
                            <motion.div
                                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center"
                                initial={{ scale: 0, rotate: -180, y: 50 }}
                                whileInView={{ scale: 1, rotate: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                whileHover={{ 
                                    scale: 1.15,
                                    boxShadow: "0 0 80px rgba(99, 102, 241, 0.6)"
                                }}
                            >
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 15, -15, 0],
                                        scale: [1, 1.15, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 0.5
                                    }}
                                >
                                    <Sparkles className="w-10 h-10 text-white" />
                                </motion.div>
                                {/* Glow ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                            </motion.div>
                            
                            <motion.h2 
                                className="text-4xl md:text-5xl font-bold text-white mb-6"
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            >
                                Ready to build something
                                <motion.span
                                    className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                >
                                    amazing?
                                </motion.span>
                            </motion.h2>
                            
                            <motion.p 
                                className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.35 }}
                            >
                                Join thousands of developers who are building faster, smarter, and more creatively with Polaris.
                            </motion.p>
                            
                            <motion.div 
                                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
                            >
                                <SignUpButton mode="modal">
                                    <motion.button
                                        whileHover={{ scale: 1.08, y: -3 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="bg-white text-indigo-900 hover:bg-white/90 px-10 h-14 rounded-xl font-semibold shadow-xl shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-3"
                                    >
                                        {/* Button shimmer effect */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                            initial={{ x: -150, opacity: 0 }}
                                            whileHover={{ x: 300, opacity: 1 }}
                                            transition={{ duration: 0.7 }}
                                        />
                                        <span className="relative z-10 text-lg flex items-center">
                                            Get Started Free
                                            <motion.span
                                                animate={{ x: [0, 6, 0] }}
                                                transition={{
                                                    duration: 1.2,
                                                    repeat: Infinity,
                                                    repeatDelay: 1.5
                                                }}
                                            >
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </motion.span>
                                        </span>
                                    </motion.button>
                                </SignUpButton>
                            </motion.div>
                            
                            {/* Trust indicators with enhanced animations */}
                            <motion.div
                                className="mt-12 flex items-center justify-center gap-8"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.55 }}
                            >
                                {[
                                    { icon: Check, text: "No credit card required", color: "text-green-400" },
                                    { icon: Check, text: "Free forever plan", color: "text-green-400" },
                                    { icon: Star, text: "4.9/5 rating", color: "text-amber-400" },
                                ].map((item, i) => (
                                    <motion.span 
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors cursor-default"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                    >
                                        <item.icon className={cn("w-4 h-4", item.color)} />
                                        {item.text}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.svg" alt="Polaris" width={28} height={28} />
                            <span className="text-lg font-semibold text-white">Polaris</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
                            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Twitter</a>
                        </div>
                        <p className="text-sm text-white/40">
                            © 2025 Polaris. Built with AI.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
