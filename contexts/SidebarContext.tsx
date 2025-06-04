'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from 'react';

interface SidebarContextType {
  isOpen: boolean;
  show: () => void;
  hide: () => void;
  move: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
// ms that need to pass until a close followed by a open actually is executed
const minToggleTime = 1000;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const refToggleTime = useRef<number>(0);
  // a debounce-like functionality that works around the fact that
  // mobile devices do trigger onMouseEnter and onMouseLeave for a touch
  // and never trigger a onMouseMove. Therefore if we receive a hide event
  // right after a show event, we ignore the hide-event. If the mouse-cursor
  // moves between show & hide, that indicates its a desktop user
  const show = useCallback(() => {
    setIsOpen(true);
    refToggleTime.current = Date.now();
  }, [setIsOpen]);
  const hide = useCallback(() => {
    if (Date.now() - refToggleTime.current < minToggleTime) {
      return;
    }
    setIsOpen(false);
    refToggleTime.current = 0;
  }, [setIsOpen]);
  const move = useCallback(() => {
    // when we register a move, the user is on a desktop, so we can
    // safely ignore the boundary for the close as we receive a onMouseLeave
    // at the appropriate time.
    // This wont happen on mobile.
    refToggleTime.current = 0;
  }, []);
  const value = useMemo(() => {
    return {
      show,
      hide,
      move,
      isOpen,
    };
  }, [isOpen, show, hide, move]);
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
