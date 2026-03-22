/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Youtube, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  GraduationCap, 
  Search,
  Filter,
  Clock,
  ChevronRight,
  Facebook,
  MessageCircle,
  Send,
  Users,
  Share2,
  Briefcase,
  FileText,
  Mail,
  Keyboard,
  AlertCircle,
  Lock,
  Bot,
  Sparkles,
  Loader2,
  Lightbulb,
  Info,
  TrendingUp,
  Video,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { fetchChannelVideos, type YouTubeVideo } from './services/youtubeService';
import { getUnityAgentResponse } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumStep, setPremiumStep] = useState<'selection' | 'warning'>('selection');
  
  // Unity Agent State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'স্বাগতম! আমি ইউনিটি এজেন্ট (Unity Agent)। ইউনিটি আর্নিং-এর পক্ষ থেকে আপনাকে সাহায্য করতে আমি প্রস্তুত। আপনাকে কিভাবে সাহায্য করতে পারি?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewcomerAdvice, setShowNewcomerAdvice] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
      // Focus input after animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [chatMessages, showChat]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userMsg = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Prepare history for Gemini
    const history = chatMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await getUnityAgentResponse(userMsg, history);
    setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const premiumWorks = [
    { 
      id: 'data', 
      title: 'Data Entry Work', 
      description: 'Professional data management & processing',
      badge: 'High Paying',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'typing', 
      title: 'Typing Work', 
      description: 'Accurate speed typing & transcription',
      badge: 'Exclusive',
      icon: <Keyboard className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'form', 
      title: 'Form Fill Up Work', 
      description: 'Bulk form submission & validation',
      badge: 'Pro',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'email', 
      title: 'Email Marketing work', 
      description: 'Strategic campaign management',
      badge: 'Premium',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-600'
    },
  ];

  const socialLinks = [
    {
      title: "Official Facebook Page",
      description: "আমাদের অফিসিয়াল ফেসবুক পেজে জয়েন করুন। যেকোনো ধরনের সমস্যা বা তথ্য জানার জন্য সরাসরি পেজে মেসেজ করে সাপোর্ট নিতে পারবেন।",
      link: "https://www.facebook.com/share/1KEphuw4kE/",
      icon: <Facebook className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Official Facebook Group",
      description: "নিচের লিংকে ক্লিক করে আমাদের অফিসিয়াল ফেসবুক গ্রুপে জয়েন করুন। উইথড্র নেওয়ার পর অবশ্যই গ্রুপে আপনার পেমেন্টের স্ক্রিনশট শেয়ার করে একটি ফিডব্যাক দিতে হবে।",
      link: "https://www.facebook.com/groups/1464671445272305/?ref=share&mibextid=NSMWBT",
      icon: <Users className="w-6 h-6 text-blue-700" />,
      color: "bg-blue-100"
    },
    {
      title: "WhatsApp Channel",
      description: "আমাদের অফিসিয়াল হোয়াটসঅ্যাপ চ্যানেলে জয়েন করুন। এখানে নিয়মিত পেমেন্ট প্রুফ এবং আপডেট শেয়ার করা হয়।",
      link: "https://whatsapp.com/channel/0029VbB4RqI3mFY5nkzbCs0p",
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      color: "bg-green-50"
    },
    {
      title: "YouTube Channel",
      description: "আমাদের ইউটিউব চ্যানেলে জয়েন করে অবশ্যই Subscribe করে রাখবেন। কাজ সম্পর্কিত সকল গাইডলাইন ও ভিডিও আপডেট এখানে শেয়ার করা হবে।",
      link: "https://youtube.com/@unityearning-un?si=BJHHh9X7hGClM-BZ",
      icon: <Youtube className="w-6 h-6 text-red-600" />,
      color: "bg-red-50"
    },
    {
      title: "Telegram Group",
      description: "নিচের লিংকে ক্লিক করে আমাদের টেলিগ্রাম গ্রুপে জয়েন করুন। এখানে বিভিন্ন গুরুত্বপূর্ণ আপডেট ও নোটিশ দেওয়া হয়।",
      link: "https://t.me/+HuNGXZXbqktmNzg9",
      icon: <Send className="w-6 h-6 text-sky-500" />,
      color: "bg-sky-50"
    }
  ];

  const categories = ['All', 'Video Editing', 'Photo Editing', 'Data Entry', 'Digital Marketing', 'Finance'];

  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true);
      const data = await fetchChannelVideos();
      setVideos(data.videos);
      setNextPageToken(data.nextPageToken);
      setLoading(false);
    };
    loadInitialVideos();
  }, []);

  const handleLoadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    const data = await fetchChannelVideos(nextPageToken);
    setVideos(prev => [...prev, ...data.videos]);
    setNextPageToken(data.nextPageToken);
    setLoadingMore(false);
  };

  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Social Links Banner */}
      <div className="bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold py-3 px-6 text-center shadow-sm relative overflow-hidden group">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-white/20 skew-x-[-20deg] pointer-events-none"
        />
        <button 
          onClick={() => setShowSocialModal(true)}
          className="relative text-brand-navy font-bold text-sm md:text-base flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform"
        >
          <div className="bg-brand-navy/10 p-1.5 rounded-full">
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="tracking-tight">আমাদের সকল সোশ্যাল প্ল্যাটফর্মে যুক্ত থাকার জন্য ক্লিক করুন</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 animate-bounce-x" />
        </button>
      </div>

      {/* Premium Work Banner */}
      <div className="bg-brand-navy py-3 px-6 text-center border-b border-white/10 relative overflow-hidden group">
        <motion.div 
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-brand-teal/5 pointer-events-none"
        />
        <button 
          onClick={() => {
            setPremiumStep('selection');
            setShowPremiumModal(true);
          }}
          className="relative text-brand-gold font-bold text-sm md:text-base flex items-center justify-center gap-3 mx-auto hover:text-brand-teal transition-colors"
        >
          <div className="bg-brand-gold/10 p-1.5 rounded-full">
            <Lock className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="tracking-tight">প্রিমিয়াম ওয়ার্ক সাবমিট করার জন্য এখানে ক্লিক করুন</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-brand-navy border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
              <GraduationCap className="text-brand-navy w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-xl leading-tight">Unity Earning</h1>
              <p className="text-brand-teal text-[10px] uppercase tracking-widest font-semibold">E-learning Platform</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/70 hover:text-brand-teal transition-colors text-sm font-medium">Courses</a>
            <button 
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 text-brand-gold hover:text-white transition-colors text-sm font-bold"
            >
              <Bot className="w-4 h-4" />
              Unity Agent
            </button>
            <a href="#" className="text-white/70 hover:text-brand-teal transition-colors text-sm font-medium">About</a>
            <button className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-brand-navy pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#64FFDA_0%,transparent_50%)] blur-3xl transform -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-widest mb-6 border border-brand-teal/20">
              Unity Earning E-learning Platform
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Master New Skills with <span className="text-brand-gold">Expert Tutorials</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                    selectedCategory === cat 
                      ? "bg-brand-teal border-brand-teal text-brand-navy shadow-lg shadow-brand-teal/20" 
                      : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Video Gallery */}
      <main className="max-w-7xl mx-auto w-full px-6 -mt-16 pb-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-xl animate-pulse">
                <div className="aspect-video bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <motion.div
                key={`${video.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.05 }}
                className="group bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col"
              >
                <div 
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer mb-4"
                  onClick={() => handleVideoClick(video)}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-brand-teal rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <Play className="text-brand-navy fill-brand-navy w-8 h-8 ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-brand-navy/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                    {video.category}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3" />
                    {(() => {
                      try {
                        const date = new Date(video.publishedAt);
                        return isNaN(date.getTime()) ? 'Recently' : format(date, 'MMM dd, yyyy');
                      } catch (e) {
                        return 'Recently';
                      }
                    })()}
                  </div>
                  <h3 className="text-lg font-display font-bold text-brand-navy mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                    {video.description}
                  </p>
                  
                  <button 
                    onClick={() => handleVideoClick(video)}
                    className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all group/btn"
                  >
                    Watch Now
                    <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-300 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold text-brand-navy mb-2">No tutorials found</h3>
              <p className="text-slate-500">Try adjusting your search query or category to find what you're looking for.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {nextPageToken && !loading && (
          <div className="flex justify-center mb-20">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-white border-2 border-slate-200 text-brand-navy px-10 py-4 rounded-2xl font-bold hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Loading More...
                </>
              ) : (
                <>
                  Load More Tutorials
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Social Platforms Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-brand-navy mb-4">আমাদের সোশ্যাল প্ল্যাটফর্মগুলোতে জয়েন করুন</h2>
            <div className="w-20 h-1.5 bg-brand-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialLinks.map((social, idx) => (
              <a 
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", social.color)}>
                  {social.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-brand-navy mb-3">{social.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{social.description}</p>
                <div className="text-brand-navy font-bold text-sm flex items-center gap-2 group-hover:text-brand-gold transition-colors">
                  Join Now <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy pt-20 pb-10 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-brand-navy w-6 h-6" />
                </div>
                <h2 className="text-white font-display font-bold text-2xl">Unity Earning</h2>
              </div>
              <p className="text-white/50 max-w-md mb-8 leading-relaxed">
                Unity Earning is a leading e-learning platform dedicated to providing high-quality tutorials and resources for digital skills. Join our community and start your journey today.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">All Courses</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Premium Work</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Unity Agent</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-white/50 hover:text-brand-teal transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} All rights reserved by Unity Earning.
            </p>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <span>Created by Unity Earning</span>
              <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              <span>for the community</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence mode="wait">
        {/* Social Links Modal */}
        {showSocialModal && (
          <motion.div
            key="social-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-navy/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowSocialModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-brand-navy transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-display font-bold text-brand-navy mb-2">আমাদের সব সোশ্যাল প্ল্যাটফর্ম</h2>
                  <p className="text-slate-500">নিচের লিঙ্কে ক্লিক করে আমাদের সাথে যুক্ত হন</p>
                </div>
                
                <div className="space-y-4">
                  {socialLinks.map((social, idx) => (
                    <a 
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-6 p-6 rounded-3xl border border-slate-100 hover:border-brand-gold hover:bg-slate-50 transition-all group"
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", social.color)}>
                        {social.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors">{social.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{social.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Premium Work Modal */}
        {showPremiumModal && (
          <motion.div
            key="premium-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-navy/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-brand-navy transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-10">
                {premiumStep === 'selection' ? (
                  <>
                    <div className="text-center mb-10">
                      <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-brand-gold w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-display font-bold text-brand-navy mb-2">প্রিমিয়াম ওয়ার্ক সাপোর্ট</h2>
                      <p className="text-slate-500">নিচের যেকোনো একটি কাজ নির্বাচন করুন</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {premiumWorks.map((work) => (
                        <button 
                          key={work.id}
                          onClick={() => setPremiumStep('warning')}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-brand-gold hover:bg-slate-50 transition-all group text-left relative overflow-hidden"
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md group-hover:scale-110 transition-transform shrink-0",
                            work.color
                          )}>
                            <div className="scale-90">{work.icon}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-base text-brand-navy leading-tight">{work.title}</h3>
                              <span className="px-1.5 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-[9px] font-bold uppercase tracking-wider">
                                {work.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{work.description}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-all shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="text-red-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-brand-navy mb-6 leading-relaxed">
                      আপনি এই কাজটি করার জন্য এখনো প্রস্তুত না কাজটি করতে হলে অবশ্যই আপনাকে পূর্বের কাজগুলো করতে হবে যেগুলো টিম লিডার আপনাদেরকে দিয়েছে
                    </h2>
                    <button 
                      onClick={() => setPremiumStep('selection')}
                      className="bg-brand-navy text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-navy/90 transition-all"
                    >
                      ফিরে যান
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Newcomer Advice Modal */}
        {showNewcomerAdvice && (
          <motion.div
            key="newcomer-advice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-brand-navy/80 backdrop-blur-md"
            onClick={() => setShowNewcomerAdvice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="bg-brand-teal p-10 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl" />
                
                <button 
                  onClick={() => setShowNewcomerAdvice(false)}
                  className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative z-10"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles className="w-8 h-8 text-brand-gold" />
                  </div>
                  <h2 className="text-4xl font-display font-bold tracking-tight">সফলতার মূলমন্ত্র</h2>
                  <p className="text-white/80 mt-3 text-lg font-medium">Unity Earning-এ আপনার ক্যারিয়ার গড়ার সেরা গাইডলাইন</p>
                </motion.div>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-8 custom-scrollbar">
                <div className="space-y-8">
                  {[
                    {
                      title: "কঠোর পরিশ্রম ও নিষ্ঠা",
                      text: "নতুন অবস্থায় জয়েন করার পর অবশ্যই আপনাকে কাজ করতে হবে। অলসতা পরিহার করে কাজে মনোযোগী হতে হবে।",
                      icon: <TrendingUp className="w-6 h-6" />,
                      color: "bg-blue-500"
                    },
                    {
                      title: "নিয়মিত মিটিংয়ে অংশগ্রহণ",
                      text: "নিয়মিত মিটিংয়ে জয়েন করতে হবে, অন্যথায় কাজের ধরন এবং গুরুত্বপূর্ণ আপডেটগুলো বোঝা যাবে না।",
                      icon: <Users className="w-6 h-6" />,
                      color: "bg-purple-500"
                    },
                    {
                      title: "ক্লাসে মনোযোগ ও শিক্ষা",
                      text: "নিয়মিত ক্লাসে জয়েন করতে হবে এবং টিচার যেভাবে শিখাচ্ছেন ঠিক সেভাবে সঠিকভাবে শিখতে হবে।",
                      icon: <Video className="w-6 h-6" />,
                      color: "bg-emerald-500"
                    },
                    {
                      title: "ডেইলি ওয়ার্ক সাবমিট",
                      text: "নিয়মিত ক্লাসের কাজগুলো (Work) সাবমিট করতে হবে। প্রতিদিনের কাজ প্রতিদিন নির্দিষ্ট সময়েই শেষ করতে হবে।",
                      icon: <ClipboardCheck className="w-6 h-6" />,
                      color: "bg-orange-500"
                    },
                    {
                      title: "টিম লিডার ও ট্রেইনার গাইডলাইন",
                      text: "টিম লিডার এবং টিম ট্রেইনারের দেওয়া সকল গাইডলাইন ও নির্দেশনা সবসময় মেনে চলতে হবে। এটি আপনার সফলতার জন্য অত্যন্ত জরুরি।",
                      icon: <GraduationCap className="w-6 h-6" />,
                      color: "bg-indigo-500"
                    },
                    {
                      title: "অ্যাকাউন্ট নিরাপত্তা",
                      text: "আপনার অ্যাকাউন্টের পাসওয়ার্ড সবসময় সুরক্ষিত রাখতে হবে। এটি আপনার ব্যক্তিগত সম্পদ, তাই কাউকে শেয়ার করবেন না।",
                      icon: <ShieldCheck className="w-6 h-6" />,
                      color: "bg-red-500"
                    }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6 group"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-300",
                        item.color
                      )}>
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                          {item.title}
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-teal transition-colors" />
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-medium">{item.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowNewcomerAdvice(false)}
                  className="w-full bg-brand-navy text-white py-5 rounded-2xl font-bold hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20 flex items-center justify-center gap-3 text-lg"
                >
                  <CheckCircle2 className="w-6 h-6 text-brand-gold" />
                  আমি সবগুলো নিয়ম মেনে চলব
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Unity Agent Chat Modal */}
        {showChat && (
          <div key="chat-modal" className="fixed inset-0 z-[60] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm pointer-events-auto" 
              onClick={() => setShowChat(false)} 
            />
            
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="absolute bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[85vh] sm:h-[600px] bg-white sm:rounded-[32px] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
              <div className="bg-brand-navy p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center">
                    <Bot className="text-brand-navy w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold leading-none">Unity Agent</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-pulse" />
                      <span className="text-brand-teal text-[10px] font-bold uppercase tracking-widest">Online Support</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-white/50 hover:text-white transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "flex w-full",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-brand-navy text-white rounded-tr-none" 
                        : "bg-white text-brand-navy border border-slate-100 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex gap-2"
                >
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="আপনার প্রশ্ন লিখুন..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-gold transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="w-12 h-12 bg-brand-gold text-brand-navy rounded-xl flex items-center justify-center hover:bg-brand-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <motion.div
            key="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-brand-navy/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white max-w-2xl px-6">
              <h3 className="text-xl font-display font-bold mb-2">{selectedVideo.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2">{selectedVideo.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewcomerAdvice(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-brand-teal text-white rounded-full shadow-2xl flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Lightbulb className="w-7 h-7 relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full border-2 border-white animate-bounce" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-gold text-brand-navy rounded-full shadow-2xl flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Bot className="w-7 h-7 relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>
    </div>
  );
}
