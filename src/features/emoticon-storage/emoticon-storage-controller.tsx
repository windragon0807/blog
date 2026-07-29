'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import {
  type ActionFeedback,
  type ActionKey,
  BottomActionSheet,
} from './components/emoticon-action-sheet';
import { VirtualizedEmoticonGrid } from './components/emoticon-grid';
import { EmoticonSearchField } from './components/emoticon-search-field';
import { EmoticonStorageSkeleton } from './components/emoticon-storage-skeleton';
import {
  EMOTICON_CONTENT_CLASS_NAME,
  EMOTICON_PAGE_SHELL_CLASS_NAME,
} from './emoticon-layout-contract';
import { getEmoticonManifestQueryOptions } from './emoticon-manifest-query';
import { useEmoticonFavorites } from './hooks/useEmoticonFavorites';
import {
  copyPngToClipboard,
  downloadBlob,
  fetchPngBlob,
  fetchSvgBlob,
  fetchSvgText,
} from './media/emoticon-media';
import {
  CollectionLogo,
  getCollectionLabel,
  getDefaultSubcategory,
  getSubcategories,
} from './model/collection-config';
import { filterEmoticonSections, normalizeEmoticonSearchQuery } from './model/filter-items';
import {
  type EmoticonGridSection,
  type PreparedEmoticonCollection,
  prepareEmoticonCollection,
} from './model/prepare-collections';
import type { EmoticonCollectionId, EmoticonItem, EmoticonSourceCollectionId } from './types';

const SHEET_EXIT_DURATION_MS = 180;
const ACTION_FEEDBACK_DURATION_MS = 1200;
const ACTION_SHEET_MAX_WIDTH = 540;

function getClampedSheetCenterX(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const sheetWidth = Math.min(ACTION_SHEET_MAX_WIDTH, window.innerWidth - 24);
  const minCenterX = 12 + sheetWidth / 2;
  const maxCenterX = window.innerWidth - 12 - sheetWidth / 2;
  const elementCenterX = rect.left + rect.width / 2;

  return Math.min(Math.max(elementCenterX, minCenterX), maxCenterX);
}

export function EmoticonStoragePage() {
  const pageShellRef = useRef<HTMLElement | null>(null);
  const selectedTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sheetCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: manifest, error: manifestError } = useQuery(getEmoticonManifestQueryOptions());
  const {
    items: favoriteItems,
    isFavorite,
    toggleFavorite,
    getSourceCollectionId,
  } = useEmoticonFavorites(manifest);
  const [activeCollectionId, setActiveCollectionId] = useState<EmoticonCollectionId>('material');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSheetClosing, setIsSheetClosing] = useState(false);
  const [sheetCenterX, setSheetCenterX] = useState<number | null>(null);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState('all');
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const resetSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, []);

  const normalizedSearchQuery = useMemo(() => {
    return normalizeEmoticonSearchQuery(searchQuery);
  }, [searchQuery]);

  const isSearchFiltering = normalizedSearchQuery.length > 0;
  const portalContainer = typeof document === 'undefined' ? null : document.body;
  const loadError = manifestError
    ? manifestError instanceof Error
      ? manifestError.message
      : '이모티콘 목록을 불러오지 못했습니다.'
    : '';

  const collectionTabs = useMemo(() => {
    const sourceCollections = manifest?.collections ?? [];

    return [
      ...sourceCollections,
      {
        id: 'favorites' as const,
        name: 'Favorites',
        sourceLabel: 'Favorites',
        count: favoriteItems.length,
        items: favoriteItems,
      },
    ];
  }, [favoriteItems, manifest?.collections]);

  const preparedCollections = useMemo(() => {
    if (!manifest) {
      return new Map<EmoticonCollectionId, PreparedEmoticonCollection>();
    }

    return new Map(
      manifest.collections.map((collection) => {
        return [
          collection.id,
          prepareEmoticonCollection(collection, getSubcategories(collection.id)),
        ] as const;
      }),
    );
  }, [manifest]);

  const activePreparedCollection = useMemo<PreparedEmoticonCollection | null>(() => {
    if (activeCollectionId === 'favorites') {
      return {
        collection: {
          id: 'favorites',
          name: 'Favorites',
          sourceLabel: 'Favorites',
          count: favoriteItems.length,
          items: favoriteItems,
        },
        sectionsBySubcategory: new Map([
          [
            'all',
            {
              id: 'all',
              label: 'Favorites',
              items: favoriteItems,
            },
          ],
        ]),
      };
    }

    return preparedCollections.get(activeCollectionId) ?? null;
  }, [activeCollectionId, favoriteItems, preparedCollections]);

  const activeCollection = activePreparedCollection?.collection ?? null;

  const subcategories = getSubcategories(activeCollectionId);

  const allSections = useMemo<EmoticonGridSection[]>(() => {
    if (!activePreparedCollection) {
      return [];
    }

    if (activeCollectionId === 'favorites') {
      const favoritesSection = activePreparedCollection.sectionsBySubcategory.get('all');

      return favoritesSection ? [favoritesSection] : [];
    }

    return subcategories
      .filter((subcategory) => subcategory.id !== 'all')
      .map((subcategory) => {
        return activePreparedCollection.sectionsBySubcategory.get(subcategory.id);
      })
      .filter((section): section is EmoticonGridSection => {
        return Boolean(section && section.items.length > 0);
      });
  }, [activeCollectionId, activePreparedCollection, subcategories]);

  const baseSections = useMemo<EmoticonGridSection[]>(() => {
    if (!activePreparedCollection) {
      return [];
    }

    if (activeSubcategoryId === 'all') {
      return allSections;
    }

    const activeSection = activePreparedCollection.sectionsBySubcategory.get(activeSubcategoryId);

    return activeSection ? [activeSection] : [];
  }, [activePreparedCollection, activeSubcategoryId, allSections]);

  const visibleSections = useMemo(() => {
    if (isSearchFiltering) {
      return filterEmoticonSections(allSections, searchQuery);
    }

    return baseSections;
  }, [allSections, baseSections, isSearchFiltering, searchQuery]);

  const visibleItemCount = visibleSections.reduce((count, section) => {
    return count + section.items.length;
  }, 0);
  const showSectionHeadings =
    activeCollectionId !== 'favorites' && (isSearchFiltering || activeSubcategoryId === 'all');

  const emptyMessage = loadError
    ? loadError
    : isSearchFiltering
      ? '검색 결과가 없습니다.'
      : activeCollectionId === 'favorites'
        ? '별 아이콘으로 이모지를 즐겨찾기에 추가하세요.'
        : '표시할 이모티콘이 없습니다.';

  const selectedItem = useMemo(() => {
    if (!selectedItemId) {
      return null;
    }

    return activeCollection?.items.find((item) => item.id === selectedItemId) ?? null;
  }, [activeCollection, selectedItemId]);

  const sheetSourceCollectionId: EmoticonSourceCollectionId | null =
    activeCollectionId === 'favorites'
      ? selectedItem
        ? getSourceCollectionId(selectedItem.id)
        : null
      : activeCollectionId;

  const clearSheetCloseTimer = useCallback(() => {
    if (!sheetCloseTimeoutRef.current) {
      return;
    }

    clearTimeout(sheetCloseTimeoutRef.current);
    sheetCloseTimeoutRef.current = null;
  }, []);

  const clearActionFeedbackTimer = useCallback(() => {
    if (!actionFeedbackTimeoutRef.current) {
      return;
    }

    clearTimeout(actionFeedbackTimeoutRef.current);
    actionFeedbackTimeoutRef.current = null;
  }, []);

  const resetActionFeedback = useCallback(() => {
    clearActionFeedbackTimer();
    setActionFeedback(null);
  }, [clearActionFeedbackTimer]);

  const clearSelectedItemImmediately = useCallback(() => {
    clearSheetCloseTimer();
    resetActionFeedback();
    setSelectedItemId(null);
    setIsSheetClosing(false);
    setSheetCenterX(null);
    selectedTriggerRef.current = null;
  }, [clearSheetCloseTimer, resetActionFeedback]);

  const closeSelectedItem = useCallback(() => {
    if (!selectedItemId || isSheetClosing) {
      return;
    }

    const trigger = selectedTriggerRef.current;

    clearSheetCloseTimer();
    setIsSheetClosing(true);
    resetActionFeedback();

    sheetCloseTimeoutRef.current = setTimeout(() => {
      sheetCloseTimeoutRef.current = null;
      setSelectedItemId(null);
      setIsSheetClosing(false);
      setSheetCenterX(null);

      requestAnimationFrame(() => {
        if (trigger?.isConnected) {
          trigger.focus({ preventScroll: true });
        }
      });
    }, SHEET_EXIT_DURATION_MS);
  }, [clearSheetCloseTimer, isSheetClosing, resetActionFeedback, selectedItemId]);

  useEffect(() => {
    if (activeCollectionId !== 'favorites' || !selectedItemId || selectedItem) {
      return;
    }

    const trigger = selectedTriggerRef.current;
    const frame = requestAnimationFrame(() => {
      clearSelectedItemImmediately();

      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
        return;
      }

      pageShellRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeCollectionId, clearSelectedItemImmediately, selectedItem, selectedItemId]);

  const handleSelectItem = useCallback(
    (item: EmoticonItem, trigger: HTMLButtonElement) => {
      selectedTriggerRef.current = trigger;

      if (selectedItemId === item.id && !isSheetClosing) {
        closeSelectedItem();
        return;
      }

      clearSheetCloseTimer();
      resetActionFeedback();
      setIsSheetClosing(false);
      setSelectedItemId(item.id);
    },
    [clearSheetCloseTimer, closeSelectedItem, isSheetClosing, resetActionFeedback, selectedItemId],
  );

  useEffect(() => {
    const closePanelOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSelectedItem();
      }
    };

    window.addEventListener('keydown', closePanelOnEscape);

    return () => {
      window.removeEventListener('keydown', closePanelOnEscape);
    };
  }, [closeSelectedItem]);

  useEffect(() => {
    return () => {
      clearSheetCloseTimer();
      clearActionFeedbackTimer();
    };
  }, [clearActionFeedbackTimer, clearSheetCloseTimer]);

  useLayoutEffect(() => {
    if (!selectedItem) {
      return;
    }

    const pageShell = pageShellRef.current;

    if (!pageShell) {
      return;
    }

    const updateSheetCenter = () => {
      setSheetCenterX(getClampedSheetCenterX(pageShell));
    };

    updateSheetCenter();
    const observer = new ResizeObserver(updateSheetCenter);
    observer.observe(pageShell);
    window.addEventListener('resize', updateSheetCenter);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSheetCenter);
    };
  }, [selectedItem]);

  const setTimedActionFeedback = useCallback(
    (key: ActionKey, status: 'success' | 'error') => {
      clearActionFeedbackTimer();
      setActionFeedback({ key, status });
      actionFeedbackTimeoutRef.current = setTimeout(() => {
        actionFeedbackTimeoutRef.current = null;
        setActionFeedback(null);
      }, ACTION_FEEDBACK_DURATION_MS);
    },
    [clearActionFeedbackTimer],
  );

  const setSuccess = (key: ActionKey) => {
    setTimedActionFeedback(key, 'success');
  };

  const setError = (key: ActionKey) => {
    setTimedActionFeedback(key, 'error');
  };

  const handleDownloadSvg = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      const blob = await fetchSvgBlob(selectedItem);
      downloadBlob(blob, selectedItem.filename);
      setSuccess('download-svg');
    } catch {
      setError('download-svg');
    }
  };

  const handleCopySvg = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      const svg = await fetchSvgText(selectedItem);
      await navigator.clipboard.writeText(svg);
      setSuccess('copy-svg');
    } catch {
      setError('copy-svg');
    }
  };

  const handleDownloadPng = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      const blob = await fetchPngBlob(selectedItem);
      downloadBlob(blob, selectedItem.filename.replace(/\.svg$/i, '.png'));
      setSuccess('download-png');
    } catch {
      setError('download-png');
    }
  };

  const handleCopyImage = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      const blob = await fetchPngBlob(selectedItem);
      await copyPngToClipboard(blob);
      setSuccess('copy-png');
    } catch {
      setError('copy-png');
    }
  };

  if (!manifest && !loadError) {
    return <EmoticonStorageSkeleton />;
  }

  return (
    <>
      <section
        ref={pageShellRef}
        tabIndex={-1}
        data-emoticon-page-shell=""
        data-emoticon-viewport-contract="dynamic-safe-area"
        className={EMOTICON_PAGE_SHELL_CLASS_NAME}
      >
        <div
          data-emoticon-sticky-header=""
          className="z-20 shrink-0 bg-background pb-1 dark:bg-background"
        >
          <div className={EMOTICON_CONTENT_CLASS_NAME}>
            <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-1.5 sm:mb-4 sm:gap-x-6 sm:gap-y-2 md:mb-6 md:gap-x-7">
              <div
                role="tablist"
                aria-label="이모티콘 종류"
                className="flex min-w-0 flex-wrap items-end gap-x-5 gap-y-1.5 sm:gap-x-6 md:gap-x-7"
              >
                {collectionTabs.map((collection) => {
                  const isActive = collection.id === activeCollectionId;

                  return (
                    <button
                      key={collection.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        resetSearch();
                        setActiveCollectionId(collection.id);
                        setActiveSubcategoryId(getDefaultSubcategory(collection.id));
                        clearSelectedItemImmediately();
                      }}
                      className={cn(
                        'group inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-xl text-[1.375rem] font-black leading-none tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 sm:text-2xl md:gap-2 md:text-3xl',
                        isActive
                          ? 'text-zinc-950 dark:text-zinc-50'
                          : 'text-zinc-300 hover:text-zinc-500 dark:text-zinc-700 dark:hover:text-zinc-500',
                      )}
                    >
                      <CollectionLogo id={collection.id} isActive={isActive} />
                      <span className="emoticon-collection-label">
                        {getCollectionLabel(collection.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <EmoticonSearchField
                isOpen={isSearchOpen}
                query={searchQuery}
                onOpenChange={(open) => {
                  if (!open) {
                    resetSearch();
                    return;
                  }
                  setIsSearchOpen(true);
                }}
                onQueryChange={setSearchQuery}
              />
            </div>

            {activeCollectionId === 'favorites' || subcategories.length === 0 ? null : (
              <nav
                aria-label="이모티콘 세부 카테고리"
                className="-mx-1 mb-3 bg-background px-1 py-1 dark:bg-background sm:-mx-2 sm:mb-4 sm:px-2 sm:py-2"
              >
                <ScrollArea
                  orientation="horizontal"
                  data-emoticon-subcategory-scroll=""
                  className="w-full"
                >
                  <div
                    data-emoticon-subcategory-list=""
                    className="flex w-max gap-1.5 pr-1 sm:gap-2 sm:pr-2"
                  >
                    {subcategories.map((subcategory) => {
                      const isActive = subcategory.id === activeSubcategoryId;

                      return (
                        <button
                          key={subcategory.id}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            if (isSearchOpen) return;
                            setActiveSubcategoryId(subcategory.id);
                            clearSelectedItemImmediately();
                          }}
                          className={cn(
                            'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 sm:h-12 sm:gap-2 sm:px-5 sm:text-base',
                            isActive
                              ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'
                              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-zinc-100',
                            isSearchOpen && 'pointer-events-none opacity-40',
                          )}
                        >
                          {subcategory.icon ? (
                            <span className="grid place-items-center">{subcategory.icon}</span>
                          ) : null}
                          <span>{subcategory.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </nav>
            )}
          </div>
        </div>

        <div data-emoticon-grid-shell="" className="relative min-h-0 flex-1 overflow-hidden">
          {visibleItemCount > 0 && activeCollection ? (
            <VirtualizedEmoticonGrid
              key={`${activeCollection.id}-${activeSubcategoryId}-${normalizedSearchQuery}`}
              collectionId={activeCollection.id}
              sections={visibleSections}
              showSectionHeadings={showSectionHeadings}
              selectedItemId={selectedItemId}
              onSelect={handleSelectItem}
            />
          ) : (
            <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-zinc-200 bg-white/55 text-sm font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/45">
              {emptyMessage}
            </div>
          )}
        </div>

        {portalContainer && selectedItem && sheetSourceCollectionId
          ? createPortal(
              <BottomActionSheet
                item={selectedItem}
                sourceCollectionId={sheetSourceCollectionId}
                isFavorite={isFavorite(sheetSourceCollectionId, selectedItem.id)}
                feedback={actionFeedback}
                isClosing={isSheetClosing}
                centerX={sheetCenterX}
                onClose={() => {
                  closeSelectedItem();
                }}
                onToggleFavorite={() => {
                  toggleFavorite(sheetSourceCollectionId, selectedItem.id);
                }}
                onDownloadSvg={handleDownloadSvg}
                onDownloadPng={handleDownloadPng}
                onCopySvg={handleCopySvg}
                onCopyImage={handleCopyImage}
              />,
              portalContainer,
            )
          : null}
      </section>
    </>
  );
}
