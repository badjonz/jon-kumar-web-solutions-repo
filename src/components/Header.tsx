"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const lastLinkRef = useRef<HTMLAnchorElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Focus trap: Handle keyboard navigation within mobile menu
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isMenuOpen) return;

    // Close on Escape
    if (event.key === "Escape") {
      closeMenu();
      menuButtonRef.current?.focus();
      return;
    }

    // Focus trap on Tab
    if (event.key === "Tab") {
      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isMenuOpen]);

  // Set up focus trap and keyboard handling
  useEffect(() => {
    if (isMenuOpen) {
      // Add keyboard listener
      document.addEventListener("keydown", handleKeyDown);

      // Focus first nav link when menu opens
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);

      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, handleKeyDown]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Site Name */}
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-accent transition-colors"
          >
            Jon Kumar
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-md hover:bg-muted transition-colors"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <motion.nav
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden fixed inset-0 top-16 bg-background z-40"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          aria-label="Mobile navigation"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col items-center justify-start pt-8 gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                ref={index === 0 ? firstLinkRef : index === navLinks.length - 1 ? lastLinkRef : null}
                href={link.href}
                className="text-lg font-medium text-foreground hover:text-accent transition-colors"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  );
};
