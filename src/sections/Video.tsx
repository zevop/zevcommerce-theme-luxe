'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export default function Video({ settings }: { settings: any }) {
  const [playing, setPlaying] = useState(false);

  const {
    video_url,
    thumbnail_image,
    heading,
    caption,
    backgroundColor,
    autoplay = false,
  } = settings;

  const resolveImg = (img: any) => (typeof img === 'string' ? img : img?.url);
  const thumbSrc = resolveImg(thumbnail_image);

  const getEmbedUrl = (rawUrl: string): string | null => {
    if (!rawUrl) return null;

    const ytMatch = rawUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&autoplay=1&mute=${autoplay ? 1 : 0}`;
    }

    const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1${autoplay ? '&muted=1' : ''}`;
    }

    return rawUrl;
  };

  const isDirectVideo =
    video_url && (video_url.endsWith('.mp4') || video_url.endsWith('.webm'));
  const embedUrl = !isDirectVideo ? getEmbedUrl(video_url) : null;
  const hasVideo = !!video_url;

  return (
    <section
      className="py-20"
      style={{ backgroundColor: backgroundColor || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {heading && (
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl tracking-widest uppercase mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}
            >
              {heading}
            </h2>
            <div
              className="w-12 h-px mx-auto"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
          </div>
        )}

        {/* Video container */}
        <div
          className="relative overflow-hidden aspect-video"
          style={{ border: '1px solid var(--color-border)' }}
        >
          {/* Playing state: show embed or native video */}
          {playing && hasVideo ? (
            isDirectVideo ? (
              <video
                src={video_url}
                autoPlay
                muted={autoplay}
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={heading || 'Video'}
              />
            ) : null
          ) : (
            /* Thumbnail / placeholder state */
            <div className="relative w-full h-full">
              {thumbSrc ? (
                <img
                  src={thumbSrc}
                  alt={heading || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: '#161513' }}
                />
              )}

              {/* Dark overlay on thumbnail */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Gold play button */}
              <button
                onClick={() => hasVideo && setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center group"
              >
                <span
                  className="w-20 h-20 flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    border: '2px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {/* On hover: gold fill + dark icon via group-hover class using inline style approach */}
                  <span
                    className="w-20 h-20 absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  />
                  <Play
                    size={28}
                    className="relative z-10 transition-colors duration-300 ml-1"
                    style={{ color: 'var(--color-accent)' }}
                    // Override fill on hover via inline JS — instead, we swap via CSS variable trick
                    // The group-hover fill is handled in the wrapper's style below
                  />
                </span>
              </button>

              {!hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p
                    className="text-xs tracking-widest uppercase mt-28"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Enter a video URL in section settings
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {caption && (
          <p
            className="mt-5 text-center text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-text)' }}
          >
            {caption}
          </p>
        )}
      </div>

      {/* Play button hover style: swap icon color on gold fill */}
      <style>{`
        .luxe-play-btn:hover .luxe-play-icon {
          color: #0D0C0B !important;
        }
      `}</style>
    </section>
  );
}

export const schema = {
  type: 'video',
  name: 'Video',
  settings: [
    { type: 'text', id: 'video_url', label: 'Video URL (YouTube, Vimeo, or .mp4)', default: '' },
    { type: 'image', id: 'thumbnail_image', label: 'Thumbnail Image' },
    { type: 'text', id: 'heading', label: 'Heading' },
    { type: 'text', id: 'caption', label: 'Caption' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color' },
    { type: 'checkbox', id: 'autoplay', label: 'Autoplay (muted)', default: false },
  ],
};
