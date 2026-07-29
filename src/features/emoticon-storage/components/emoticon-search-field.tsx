'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

export type EmoticonSearchFieldProps = {
  isOpen: boolean;
  query: string;
  onOpenChange: (open: boolean) => void;
  onQueryChange: (query: string) => void;
};

export function EmoticonSearchField({
  isOpen,
  query,
  onOpenChange,
  onQueryChange,
}: EmoticonSearchFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const closeAndRestoreFocus = () => {
    onOpenChange(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <div ref={rootRef} className="relative ml-auto shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label="이모티콘 검색"
        tabIndex={isOpen ? -1 : 0}
        aria-hidden={isOpen}
        onClick={() => onOpenChange(true)}
        className={cn(
          'grid size-9 place-items-center rounded-xl text-zinc-400 transition',
          'hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35',
          'dark:text-zinc-500 dark:hover:text-zinc-200 sm:size-10',
          isOpen && 'invisible pointer-events-none',
        )}
      >
        <Search className="size-5" strokeWidth={2.25} />
      </button>
      {isOpen ? (
        <div
          role="search"
          className={cn(
            'absolute inset-y-0 right-0 z-10 flex items-center',
            'w-[calc(100vw-3rem)] sm:w-[min(22.5rem,calc(100vw-2rem))]',
            'motion-safe:animate-[emoticon-search-enter_300ms_cubic-bezier(0.22,1,0.36,1)_both]',
          )}
        >
          <div className="flex h-10 w-full items-center gap-2 rounded-2xl bg-zinc-100 px-3 dark:bg-zinc-900 sm:h-12 sm:px-4">
            <Search className="size-4 shrink-0 text-zinc-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  event.stopPropagation();
                  closeAndRestoreFocus();
                }
              }}
              onBlur={(event) => {
                const next = event.relatedTarget;

                if (next instanceof Node && rootRef.current?.contains(next)) {
                  return;
                }

                if (query.trim() === '') {
                  onOpenChange(false);
                }
              }}
              aria-label="이모티콘 검색"
              placeholder="검색"
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
            />
            <button
              type="button"
              aria-label="검색 닫기"
              onClick={closeAndRestoreFocus}
              className="grid size-8 shrink-0 place-items-center rounded-xl text-zinc-500 transition hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 dark:hover:text-zinc-200"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
