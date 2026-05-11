"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { pricing as pricingCopy } from "@/lib/copy";

type Pricing = typeof pricingCopy;

type Props = {
  pricing: Pricing;
};

export function PricingCard({ pricing }: Props) {
  const { plan, priceSuffix, creditsLabel } = pricing;
  const tiers = plan.tiers;

  const [selectedIndex, setSelectedIndex] = useState<number>(plan.defaultTierIndex);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(plan.defaultTierIndex);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const selected = tiers[selectedIndex];

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setActiveIndex(index);
      closeAndFocusTrigger();
    },
    [closeAndFocusTrigger],
  );

  // Click outside closes.
  useEffect(() => {
    if (!open) return;
    function onMouseDown(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // When opening, seed the active option with the current selection.
  useEffect(() => {
    if (open) setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListboxKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % tiers.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + tiers.length) % tiers.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(tiers.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectIndex(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocusTrigger();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="pricing-card">
      <p className="pricing-card__name">{plan.name}</p>

      <div className="pricing-select__wrapper" ref={wrapperRef}>
        <button
          ref={triggerRef}
          type="button"
          className="pricing-select"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onTriggerKeyDown}
        >
          <span>
            {selected.credits.toLocaleString()} {creditsLabel}
          </span>
          <Chevron open={open} />
        </button>

        {open ? (
          <ul
            id={listboxId}
            className="pricing-select__listbox"
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${listboxId}-option-${activeIndex}`}
            onKeyDown={onListboxKeyDown}
            ref={(el) => el?.focus()}
          >
            {tiers.map((tier, i) => {
              const isSelected = i === selectedIndex;
              const isActive = i === activeIndex;
              return (
                <li
                  key={tier.credits}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  data-active={isActive ? "true" : undefined}
                  className="pricing-select__option"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectIndex(i);
                  }}
                >
                  <span>
                    {tier.credits.toLocaleString()} {creditsLabel}
                  </span>
                  <span className="pricing-select__option-price">${tier.price}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <p className="pricing-card__price">
        ${selected.price}
        <span className="pricing-card__price-suffix">{priceSuffix}</span>
      </p>

      <ul className="pricing-card__features">
        {plan.features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={plan.href} className="button" data-size="lg" prefetch={false}>
        {plan.cta}
      </Link>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 120ms ease" }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="pricing-card__feature-icon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
