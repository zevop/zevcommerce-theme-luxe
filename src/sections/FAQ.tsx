'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function FAQ({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const {
    title,
    alignment = 'left',
    backgroundColor,
    accentColor = '#C9A96E',
  } = settings;

  const faqs = blocks.filter(b => b.type === 'accordion' || b.type === 'question');

  const titleAlignClass = alignment === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <section
      className="py-20"
      style={{ backgroundColor: backgroundColor || 'var(--color-background)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Section title */}
        {title && (
          <div className={`mb-14 ${titleAlignClass}`}>
            <h2
              className="text-4xl md:text-5xl font-normal tracking-wide"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-heading, #EDE8E0)',
              }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* FAQ items */}
        <div>
          {faqs.map((block, i) => {
            const s = block.settings || {};
            const isOpen = openIndex === i;
            const question = s.question || s.title || `Question ${i + 1}`;
            const answer = s.answer || s.content || '';

            return (
              <div
                key={i}
                className="relative transition-all duration-200"
                style={{
                  borderBottom: '1px solid var(--color-border, #252320)',
                  borderLeft: isOpen ? `2px solid ${accentColor}` : '2px solid transparent',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left transition-colors duration-200"
                  style={{ paddingLeft: isOpen ? '16px' : '0px' }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-lg font-normal pr-6 leading-snug"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: isOpen
                        ? 'var(--color-heading, #EDE8E0)'
                        : 'var(--color-text, #C4BDB4)',
                    }}
                  >
                    {question}
                  </span>
                  <span
                    className="shrink-0 transition-transform duration-300"
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      color: isOpen ? accentColor : 'var(--color-text, #C4BDB4)',
                    }}
                  >
                    <Plus size={18} />
                  </span>
                </button>

                {/* Answer — max-height transition */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '600px' : '0px',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed pb-6"
                    style={{
                      color: '#8A8279',
                      fontFamily: 'var(--font-body)',
                      paddingLeft: isOpen ? '16px' : '0px',
                    }}
                  >
                    {answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'faq',
  name: 'FAQ',
  settings: [
    { type: 'header', label: 'Content' },
    { type: 'text', id: 'title', label: 'Section Title', default: 'Frequently Asked Questions' },
    {
      type: 'select',
      id: 'alignment',
      label: 'Title Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'left',
    },
    { type: 'header', label: 'Colors' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color' },
    { type: 'color', id: 'accentColor', label: 'Accent Color', default: '#C9A96E' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'accordion',
      name: 'Question',
      settings: [
        { type: 'text', id: 'question', label: 'Question', default: 'What is your return policy?' },
        { type: 'textarea', id: 'answer', label: 'Answer', default: 'We offer a 30-day return policy on all items in original condition.' },
      ],
    },
  ]),
};
