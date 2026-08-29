import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  Sparkles,
  ExternalLink,
  Smartphone,
  Square,
  Monitor
} from 'lucide-react';
import { Quote } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

type ShareTab = 'image' | 'text';
type ImageTheme = 'sunset' | 'nature' | 'forest' | 'obsidian' | 'minimal';
type ImageRatio = '1:1' | '9:16' | '16:9';

// Paths to natural backgrounds
const NATURE_BG_PATH = '/src/assets/images/serene_nature_bg_1787994922188.jpg';
const FOREST_BG_PATH = '/src/assets/images/calm_forest_bg_1787994944231.jpg';

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  quote,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<ShareTab>('image');
  const [imageTheme, setImageTheme] = useState<ImageTheme>('sunset');
  const [imageRatio, setImageRatio] = useState<ImageRatio>('1:1');
  const [isCopiedText, setIsCopiedText] = useState(false);
  const [isCopiedImage, setIsCopiedImage] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to wrap text cleanly on Canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Calculate start Y to vertically center
    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, startY + i * lineHeight + lineHeight / 2);
    }

    return { totalHeight, startY, endY: startY + totalHeight };
  };

  // Generate the Canvas
  const generateCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    let width = 1080;
    let height = 1080;

    if (imageRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (imageRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Draw Background
    if (imageTheme === 'sunset') {
      // Warm sunset gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(1, '#e11d48');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Add ambient radial glow
      const radial = ctx.createRadialGradient(width * 0.2, height * 0.2, 50, width * 0.5, height * 0.5, width * 0.8);
      radial.addColorStop(0, 'rgba(254, 215, 170, 0.45)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

    } else if (imageTheme === 'obsidian') {
      // Deep obsidian dark gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.5, '#181210');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm ember glow
      const radial = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.5, height * 0.5, width * 0.8);
      radial.addColorStop(0, 'rgba(249, 115, 22, 0.15)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

    } else if (imageTheme === 'minimal') {
      // Warm porcelain / ivory
      ctx.fillStyle = '#fffbf5';
      ctx.fillRect(0, 0, width, height);

      // Light subtle border
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 16;
      ctx.strokeRect(32, 32, width - 64, height - 64);

    } else if (imageTheme === 'nature' || imageTheme === 'forest') {
      const imgPath = imageTheme === 'nature' ? NATURE_BG_PATH : FOREST_BG_PATH;
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgPath;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Cover draw
        const scale = Math.max(width / img.width, height / img.height);
        const nw = img.width * scale;
        const nh = img.height * scale;
        const nx = (width - nw) / 2;
        const ny = (height - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);

        // Dark/Warm gradient overlay for maximum readability
        const overlay = ctx.createLinearGradient(0, 0, 0, height);
        overlay.addColorStop(0, 'rgba(15, 10, 8, 0.45)');
        overlay.addColorStop(0.5, 'rgba(20, 12, 10, 0.65)');
        overlay.addColorStop(1, 'rgba(15, 10, 8, 0.85)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);
      } catch {
        // Fallback to warm sunset if image load fails
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#ea580c');
        grad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    }

    const isLightMinimal = imageTheme === 'minimal';
    const primaryTextColor = isLightMinimal ? '#1c1917' : '#ffffff';
    const secondaryTextColor = isLightMinimal ? '#78716c' : 'rgba(255, 255, 255, 0.82)';
    const accentColor = isLightMinimal ? '#d97706' : '#f59e0b';

    // 2. Draw Card Border/Card Backdrop if needed
    const margin = width * 0.08;
    const cardWidth = width - margin * 2;

    // 3. Category Tag Badge
    const badgeY = height * 0.16;
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isLightMinimal ? '#fef3c7' : 'rgba(255, 255, 255, 0.18)';
    
    // Draw badge capsule
    const badgeText = `✦  ${quote.category.toUpperCase()}  ✦`;
    const badgeMetrics = ctx.measureText(badgeText);
    const badgePaddingX = 32;
    const badgeHeight = 44;
    const badgeWidth = badgeMetrics.width + badgePaddingX * 2;
    const badgeX = width / 2 - badgeWidth / 2;

    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY - badgeHeight / 2, badgeWidth, badgeHeight, 22);
    ctx.fill();
    if (isLightMinimal) {
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = isLightMinimal ? '#b45309' : '#fde68a';
    ctx.fillText(badgeText, width / 2, badgeY + 8);

    // 4. Large Quote Mark
    ctx.font = 'italic 120px Lora, Georgia, serif';
    ctx.fillStyle = isLightMinimal ? 'rgba(217, 119, 6, 0.25)' : 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'center';
    ctx.fillText('“', width / 2, height * 0.28);

    // 5. Quote Text
    const quoteFontSize = quote.text.length > 120 ? 46 : quote.text.length > 70 ? 54 : 64;
    ctx.font = `italic 500 ${quoteFontSize}px Lora, Georgia, serif`;
    ctx.fillStyle = primaryTextColor;
    ctx.textAlign = 'center';

    const textBounds = wrapText(
      ctx,
      `“${quote.text}”`,
      width / 2,
      height * 0.48,
      cardWidth * 0.9,
      quoteFontSize * 1.42
    );

    // 6. Gradient Divider Line
    const dividerY = Math.max(textBounds.endY + 40, height * 0.68);
    const lineGrad = ctx.createLinearGradient(width / 2 - 120, dividerY, width / 2 + 120, dividerY);
    lineGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
    lineGrad.addColorStop(0.5, accentColor);
    lineGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, dividerY);
    ctx.lineTo(width / 2 + 120, dividerY);
    ctx.stroke();

    // 7. Author and Context
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = primaryTextColor;
    ctx.fillText(quote.author, width / 2, dividerY + 54);

    if (quote.context) {
      ctx.font = 'italic 24px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = secondaryTextColor;
      ctx.fillText(quote.context, width / 2, dividerY + 92);
    }

    // 8. Footer Brand Watermark
    const footerY = height - 60;
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isLightMinimal ? '#a8a29e' : 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('QuoteFlow • Daily Radiant Inspiration', width / 2, footerY);

    return canvas;
  }, [quote, imageTheme, imageRatio]);

  // Update preview when dependencies change
  useEffect(() => {
    if (!isOpen || activeTab !== 'image') return;
    setIsRendering(true);
    const timer = setTimeout(async () => {
      const canvas = await generateCanvas();
      if (canvas) {
        setPreviewUrl(canvas.toDataURL('image/png'));
      }
      setIsRendering(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, generateCanvas]);

  // Download Image Handler
  const handleDownloadImage = async () => {
    setIsRendering(true);
    const canvas = await generateCanvas();
    if (!canvas) {
      setIsRendering(false);
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        setIsRendering(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `QuoteFlow-${quote.author.replace(/\s+/g, '_')}-${quote.id}.png`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRendering(false);
      onShowToast('Quote image downloaded!', 'success');
    }, 'image/png');
  };

  // Copy Image to Clipboard Handler
  const handleCopyImage = async () => {
    try {
      setIsRendering(true);
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas rendering failed');

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob creation failed');
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setIsCopiedImage(true);
            onShowToast('Quote image copied to clipboard!', 'success');
            setTimeout(() => setIsCopiedImage(false), 2200);
          } catch {
            handleDownloadImage();
          }
        } else {
          handleDownloadImage();
        }
        setIsRendering(false);
      }, 'image/png');
    } catch {
      setIsRendering(false);
      onShowToast('Direct image copy not supported. Downloading instead.', 'info');
      handleDownloadImage();
    }
  };

  // Web Share API (Image)
  const handleWebShareImage = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `QuoteFlow-${quote.author}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Quote by ${quote.author}`,
            text: `"${quote.text}" — ${quote.author}`,
            files: [file]
          });
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            handleDownloadImage();
          }
        }
      } else {
        handleDownloadImage();
      }
    }, 'image/png');
  };

  // Text Formats
  const formattedStandardText = `"${quote.text}"\n\n— ${quote.author}${quote.context ? ` (${quote.context})` : ''}\n#${quote.category} #QuoteFlow`;
  const formattedMarkdownText = `> "${quote.text}"\n>\n> — **${quote.author}** *(${quote.category})*`;
  const formattedShortTwitter = `"${quote.text}" — ${quote.author} #${quote.category}`;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopiedText(true);
      onShowToast('Quote text copied to clipboard!', 'success');
      setTimeout(() => setIsCopiedText(false), 2000);
    });
  };

  // Quick Social Intent Links
  const shareToTwitter = () => {
    const text = encodeURIComponent(`"${quote.text}"\n— ${quote.author}\n\n#Inspiration #${quote.category}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`"${quote.text}"\n\n— *${quote.author}*\n\n_Shared from QuoteFlow_`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = () => {
    const summary = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${summary}`, '_blank', 'noopener,noreferrer');
  };

  const shareToThreads = () => {
    const text = encodeURIComponent(`"${quote.text}" — ${quote.author} #${quote.category}`);
    window.open(`https://threads.net/intent/post?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Inspirational Quote by ${quote.author}`);
    const body = encodeURIComponent(`"${quote.text}"\n\n— ${quote.author}${quote.context ? ` (${quote.context})` : ''}\n\nCategory: ${quote.category}\n\nShared from QuoteFlow.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Offscreen Hidden Canvas for High-DPI Rendering */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#1A1210] rounded-[2rem] border border-amber-200/80 dark:border-amber-950/80 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-amber-200/60 dark:border-stone-800 flex items-center justify-between bg-white/80 dark:bg-[#1C1412]/90 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="share-modal-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Share Quote
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Export as a high-res image card or send formatted text
                  </p>
                </div>
              </div>

              <button
                id="close-share-modal-button"
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Mode Selector: Share as Image VS Share as Text */}
            <div className="p-4 sm:px-6 bg-amber-50/50 dark:bg-stone-900/40 border-b border-amber-200/40 dark:border-stone-800/80">
              <div className="grid grid-cols-2 p-1 bg-white dark:bg-stone-900 rounded-2xl border border-amber-200/70 dark:border-stone-800 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('image')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'image'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Share as Image Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Share as Text & Apps</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: SHARE AS IMAGE */}
              {activeTab === 'image' && (
                <div className="space-y-6">
                  
                  {/* Style Customizers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Theme selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                        Card Aesthetic Theme
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setImageTheme('sunset')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            imageTheme === 'sunset'
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20'
                              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Sunset Glow
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTheme('nature')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            imageTheme === 'nature'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Misty Nature
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTheme('forest')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            imageTheme === 'forest'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Calm Forest
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTheme('obsidian')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            imageTheme === 'obsidian'
                              ? 'border-stone-500 bg-stone-900 text-white ring-2 ring-stone-500/20'
                              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Obsidian
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageTheme('minimal')}
                          className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            imageTheme === 'minimal'
                              ? 'border-amber-400 bg-amber-100/70 text-amber-900 ring-2 ring-amber-400/20'
                              : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Minimalist
                        </button>
                      </div>
                    </div>

                    {/* Aspect Ratio selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                        Format / Ratio
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setImageRatio('1:1')}
                          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            imageRatio === '1:1'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          <Square className="w-3.5 h-3.5" />
                          <span>1:1 Square</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageRatio('9:16')}
                          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            imageRatio === '9:16'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>9:16 Story</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageRatio('16:9')}
                          className={`p-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            imageRatio === '16:9'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>16:9 Wide</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Visual Preview */}
                  <div className="relative rounded-2xl bg-stone-900/10 dark:bg-black/30 p-3 sm:p-4 flex items-center justify-center border border-amber-200/60 dark:border-stone-800 overflow-hidden min-h-[260px]">
                    {isRendering ? (
                      <div className="flex flex-col items-center gap-2 py-10 text-stone-500">
                        <Sparkles className="w-6 h-6 animate-spin text-amber-500" />
                        <span className="text-xs font-bold">Rendering high-res card...</span>
                      </div>
                    ) : previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={`Quote card by ${quote.author}`}
                        className={`rounded-xl shadow-lg border border-white/20 dark:border-stone-700 object-contain max-h-[320px] transition-transform`}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="py-10 text-xs text-stone-400">Loading preview...</div>
                    )}
                  </div>

                  {/* Image Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      id="download-quote-image-button"
                      type="button"
                      onClick={handleDownloadImage}
                      className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PNG</span>
                    </button>

                    <button
                      id="copy-quote-image-button"
                      type="button"
                      onClick={handleCopyImage}
                      className="py-3.5 px-4 rounded-xl bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-amber-300/80 dark:border-stone-700 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCopiedImage ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Image Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Copy Image</span>
                        </>
                      )}
                    </button>

                    <button
                      id="native-share-quote-image-button"
                      type="button"
                      onClick={handleWebShareImage}
                      className="py-3.5 px-4 rounded-xl bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-amber-300/80 dark:border-stone-700 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span>Device Share</span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: SHARE AS TEXT & QUICK APPS */}
              {activeTab === 'text' && (
                <div className="space-y-6">
                  
                  {/* Formatted Text Preview Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                        Formatted Text
                      </label>
                      <span className="text-[11px] text-stone-400">
                        {formattedStandardText.length} characters
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-sm font-serif italic relative">
                      <p className="whitespace-pre-line leading-relaxed">
                        {formattedStandardText}
                      </p>
                    </div>
                  </div>

                  {/* Copy Text Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyText(formattedStandardText)}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCopiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>Copy Full Quote Text</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyText(formattedMarkdownText)}
                      className="py-3 px-4 rounded-xl bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-amber-200/80 dark:border-stone-700 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Copy as Markdown</span>
                    </button>
                  </div>

                  {/* 1-Click Social Apps Integration */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      Quick Share to Apps
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {/* WhatsApp */}
                      <button
                        type="button"
                        onClick={shareToWhatsApp}
                        className="p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] dark:text-[#25D366] text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>

                      {/* X (Twitter) */}
                      <button
                        type="button"
                        onClick={shareToTwitter}
                        className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>X / Twitter</span>
                      </button>

                      {/* LinkedIn */}
                      <button
                        type="button"
                        onClick={shareToLinkedIn}
                        className="p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#70B5F9] text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </button>

                      {/* Threads */}
                      <button
                        type="button"
                        onClick={shareToThreads}
                        className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Threads</span>
                      </button>

                      {/* Email */}
                      <button
                        type="button"
                        onClick={shareViaEmail}
                        className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800/80 dark:hover:bg-stone-700 border border-amber-200 dark:border-stone-700 text-amber-800 dark:text-amber-300 text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-amber-200/60 dark:border-stone-800 bg-white/60 dark:bg-[#1C1412]/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>High definition export (2x retina quality)</span>
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
              >
                Done
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
