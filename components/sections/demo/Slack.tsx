/**
 * Light-weight Slack-style primitives for the demo film.
 * The site's main `SlackUI` is too feature-rich and does its own state
 * management — for the film we want bare components that animate cleanly
 * under framer-motion control.
 *
 * Typography matches the home Slack figure: Lato face, 15px body. Avatars
 * use the same 36×36 squircle as the buys-cards Pancake avatar.
 */
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type AgentTone = "scout" | "ghostwriter" | "aria" | "pancake";

const AGENT_META: Record<AgentTone, { name: string; color: string; ink: string }> = {
  scout:       { name: "scout",       color: "#1264A3", ink: "#FFFFFF" },
  ghostwriter: { name: "ghostwriter", color: "#5B2C83", ink: "#FFFFFF" },
  aria:        { name: "aria",        color: "#E9738E", ink: "#FFFFFF" },
  pancake:     { name: "pancake",     color: "#FFF1DA", ink: "#2C002A" },
};

export function SlackChannelHeader({ channel }: { channel: string }) {
  return (
    <div className="demo-slack__channel">
      <span className="demo-slack__channel-hash">#</span>
      <span className="demo-slack__channel-name">{channel.replace(/^#/, "")}</span>
    </div>
  );
}

export function SlackUserMessage({
  name,
  initial,
  accent,
  accentInk,
  time,
  children,
  delay = 0,
}: {
  name: string;
  initial: string;
  accent: string;
  accentInk: string;
  time: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="demo-slack__msg"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div
        className="demo-slack__avatar"
        style={{ backgroundColor: accent, color: accentInk }}
        aria-hidden
      >
        {initial}
      </div>
      <div className="demo-slack__body">
        <div className="demo-slack__meta">
          <span className="demo-slack__author">{name}</span>
          <span className="demo-slack__time">{time}</span>
        </div>
        <div className="demo-slack__text">{children}</div>
      </div>
    </motion.div>
  );
}

export function SlackAgentMessage({
  agent,
  time,
  children,
  delay = 0,
  internalNote = false,
}: {
  agent: AgentTone;
  time: string;
  children: ReactNode;
  delay?: number;
  internalNote?: boolean;
}) {
  const meta = AGENT_META[agent];
  return (
    <motion.div
      className="demo-slack__msg"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div
        className="demo-slack__avatar"
        style={{ backgroundColor: meta.color, color: meta.ink }}
        aria-hidden
      >
        {agent === "pancake" ? (
          /* eslint-disable-next-line @next/next/no-img-element -- decorative */
          <img
            src="/pancake-monster.png"
            alt=""
            width={28}
            height={28}
            className="demo-slack__avatar-img"
          />
        ) : (
          meta.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="demo-slack__body">
        <div className="demo-slack__meta">
          <span className="demo-slack__author">{meta.name}</span>
          <span className="demo-slack__app-tag">APP</span>
          <span className="demo-slack__time">{time}</span>
        </div>
        <div
          className={
            internalNote
              ? "demo-slack__text demo-slack__text--internal"
              : "demo-slack__text"
          }
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function SlackInboundReply({
  fromName,
  fromMeta,
  text,
  delay = 0,
}: {
  fromName: string;
  fromMeta: string;
  text: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="demo-slack__inbound"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      <div className="demo-slack__inbound-meta">
        <span className="demo-slack__inbound-icon" aria-hidden>
          ✉
        </span>
        <span className="demo-slack__inbound-from">{fromName}</span>
        <span className="demo-slack__inbound-sub">· {fromMeta}</span>
      </div>
      <p className="demo-slack__inbound-text">“{text}”</p>
    </motion.div>
  );
}

export function ChannelDot({
  pulsing = false,
  className = "",
}: {
  pulsing?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`demo-slack__dot${pulsing ? " demo-slack__dot--pulsing" : ""} ${className}`}
      aria-hidden
    />
  );
}
