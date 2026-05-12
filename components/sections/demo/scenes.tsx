/**
 * All six acts of the /demo film. Each scene takes a `localTime` prop
 * (seconds elapsed since its act started) and renders accordingly.
 *
 * The acts are kept in one file so the timing constants and visual
 * vocabulary stay coherent — nothing in here needs to be shared with
 * the rest of the app.
 *
 * Storyboard: ACT 1 OOO → ACT 2 handoff → ACT 3 departure → ACT 4 the
 * five days (Mon–Fri, with the voice-memo apex on Day 3) → ACT 5
 * return + "Yes." → ACT 6 close.
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import {
  ChannelDot,
  SlackAgentMessage,
  SlackChannelHeader,
  SlackInboundReply,
  SlackUserMessage,
} from "./Slack";

const CEO = {
  name: "Maya",
  initial: "M",
  accent: "#E8E0F2",
  accentInk: "#4A3C7B",
};

/* ──────────────────────────────────────────────────────────────────────
   ACT 1 — Out of office (0–8s)
   ────────────────────────────────────────────────────────────────────── */

export function Act1OOO({ localTime }: { localTime: number }) {
  // Type characters progressively over 4 seconds.
  const fullText =
    "Out of office Aug 12–17. For anything urgent, talk to @pancake in Slack.";
  const typingDuration = 4;
  const typed = Math.min(
    fullText.length,
    Math.floor((localTime / typingDuration) * fullText.length),
  );
  const visible = fullText.slice(0, typed);
  const sent = localTime > 5;
  const screenOff = localTime > 6.6;

  return (
    <div className="demo-stage demo-stage--dark">
      <motion.div
        className="demo-phone"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
      >
        <motion.div
          className="demo-phone__screen"
          animate={{ opacity: screenOff ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="demo-phone__bar">
            <span>9:47</span>
            <span>Settings</span>
            <span>●</span>
          </div>
          <div className="demo-phone__compose">
            <p className="demo-phone__compose-label">Auto-reply</p>
            <p className="demo-phone__compose-text">
              {visible}
              {!sent && <span className="demo-phone__caret" />}
            </p>
            <motion.button
              type="button"
              className="demo-phone__send"
              animate={{
                opacity: sent ? 0.45 : 1,
                scale: sent ? 0.96 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {sent ? "Saved" : "Save"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ACT 2 — Handoff (8–22s)
   ────────────────────────────────────────────────────────────────────── */

export function Act2Handoff({ localTime }: { localTime: number }) {
  // Two CEO messages, then Pancake replies after a beat.
  const showCEO1 = localTime > 0.4;
  const showCEO2 = localTime > 7.2;
  const showPancake = localTime > 10.4;

  return (
    <div className="demo-stage demo-stage--slack">
      <div className="demo-slack-card demo-slack-card--lg">
        <SlackChannelHeader channel="#gtm" />
        <div className="demo-slack__feed">
          {showCEO1 && (
            <SlackUserMessage
              key="ceo1"
              name={CEO.name}
              initial={CEO.initial}
              accent={CEO.accent}
              accentInk={CEO.accentInk}
              time="9:47 AM"
            >
              I’m out Mon–Fri. Run the EU mid-market e-comm campaign. 30
              demos booked by next week. Send from my Apollo, book on my
              Cal, escalate hot replies in #pancake-hot. Don’t ship to
              anyone you can’t pre-qualify.
            </SlackUserMessage>
          )}
          {showCEO2 && (
            <SlackUserMessage
              key="ceo2"
              name={CEO.name}
              initial={CEO.initial}
              accent={CEO.accent}
              accentInk={CEO.accentInk}
              time="9:48 AM"
            >
              You’re in charge.
            </SlackUserMessage>
          )}
          {showPancake && (
            <SlackAgentMessage agent="pancake" time="9:48 AM">
              On it. Daily summaries at 8am your local time. I’ll only ping
              you for the four things in #pancake-hot. Have a great trip.
            </SlackAgentMessage>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ACT 3 — Departure (22–30s)
   Three quick stylized scenes: laptop closing, suitcase, plane window.
   ────────────────────────────────────────────────────────────────────── */

export function Act3Departure({ localTime }: { localTime: number }) {
  // 8s split across three frames: 0–2.6s, 2.6–5.2s, 5.2–8s
  const frame =
    localTime < 2.6 ? "laptop" : localTime < 5.2 ? "suitcase" : "plane";

  return (
    <div className="demo-stage demo-stage--departure">
      <AnimatePresence mode="wait">
        {frame === "laptop" && (
          <motion.div
            key="laptop"
            className="demo-departure__frame demo-departure__frame--laptop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LaptopGlyph />
            <p className="demo-departure__caption">Closing up.</p>
          </motion.div>
        )}
        {frame === "suitcase" && (
          <motion.div
            key="suitcase"
            className="demo-departure__frame demo-departure__frame--suitcase"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <SuitcaseGlyph />
            <p className="demo-departure__caption">Heading out.</p>
          </motion.div>
        )}
        {frame === "plane" && (
          <motion.div
            key="plane"
            className="demo-departure__frame demo-departure__frame--plane"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <PlaneWindowGlyph />
            <p className="demo-departure__caption">Off the grid.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ACT 4 — The Five Days
   Each Day takes its own localTime (we slice the master clock per day).
   ────────────────────────────────────────────────────────────────────── */

function DayShell({
  label,
  time,
  location,
  palette,
  glyph,
  children,
}: {
  label: string;
  time: string;
  location: string;
  palette: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  glyph: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={`demo-stage demo-stage--day demo-stage--day-${palette}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="demo-day__lifestyle">
        <div className="demo-day__glyph" aria-hidden>
          {glyph}
        </div>
        <div className="demo-day__chip">
          <span className="demo-day__chip-day">{label}</span>
          <span className="demo-day__chip-meta">
            {time} · {location}
          </span>
        </div>
      </div>
      <div className="demo-day__slack">
        <SlackChannelHeader channel="#gtm" />
        <div className="demo-slack__feed">{children}</div>
      </div>
    </motion.div>
  );
}

export function Day1Monday({ localTime }: { localTime: number }) {
  // 7 seconds. Two messages stagger.
  const showA = localTime > 0.6;
  const showB = localTime > 3.2;
  return (
    <DayShell
      label="MONDAY"
      time="10:42 AM"
      location="Café"
      palette="monday"
      glyph={<CoffeeGlyph />}
    >
      {showA && (
        <SlackAgentMessage agent="scout" time="10:42 AM">
          Sourced 247 prospects matching ICP. 184 cleared deliverability +
          LinkedIn freshness check.
        </SlackAgentMessage>
      )}
      {showB && (
        <SlackAgentMessage agent="ghostwriter" time="3:18 PM">
          Drafted 142 cold emails, 6 angles A/B&apos;d. Sample thread in
          #review.
        </SlackAgentMessage>
      )}
    </DayShell>
  );
}

export function Day2Tuesday({ localTime }: { localTime: number }) {
  // 11 seconds: two messages, then disqualification beat (inbound + internal note + reply).
  const showA = localTime > 0.5;
  const showB = localTime > 2.6;
  const showInbound = localTime > 4.8;
  const showInternal = localTime > 6.6;
  const showReply = localTime > 8.4;
  return (
    <DayShell
      label="TUESDAY"
      time="7:14 AM"
      location="At sea"
      palette="tuesday"
      glyph={<WaveGlyph />}
    >
      {showA && (
        <SlackAgentMessage agent="aria" time="7:14 AM">
          Sent 142 cold emails. Apollo confirmed.
        </SlackAgentMessage>
      )}
      {showB && (
        <SlackAgentMessage agent="aria" time="11:23 AM">
          First 6 replies. 3 booked.
        </SlackAgentMessage>
      )}
      {showInbound && (
        <SlackInboundReply
          fromName="Lina @ MeshLoop"
          fromMeta="inbound reply"
          text="Interested. Tell me more about pricing."
        />
      )}
      {showInternal && (
        <SlackAgentMessage
          agent="pancake"
          time="11:24 AM"
          internalNote
        >
          Checking against ICP: MeshLoop · 8 employees · Pre-seed · B2C
          marketplace. Two flags: under 50-employee floor, B2C not B2B SaaS.
        </SlackAgentMessage>
      )}
      {showReply && (
        <SlackAgentMessage agent="aria" time="11:25 AM">
          Hi Lina, thanks for jumping on this. We&apos;re focused on B2B
          SaaS teams 50+ right now, so it&apos;s probably not the moment
          for us. Wishing MeshLoop the best — happy to revisit if your
          shape changes.
        </SlackAgentMessage>
      )}
    </DayShell>
  );
}

/**
 * Day 3 — the dramatic spine of the film.
 * Sub-beats:
 *   3a (0–3s)   the flag (#pancake-hot pulses)
 *   3b (3–13s)  voice memo, full-frame
 *   3c (13–18s) execution, smash cut back to split-frame
 */
export function Day3Wednesday({ localTime }: { localTime: number }) {
  if (localTime < 3) return <Day3Flag />;
  if (localTime < 13) return <Day3VoiceMemo localTime={localTime - 3} />;
  return <Day3Execution localTime={localTime - 13} />;
}

function Day3Flag() {
  return (
    <DayShell
      label="WEDNESDAY"
      time="4:47 PM"
      location="On the trail"
      palette="wednesday"
      glyph={<MountainGlyph />}
    >
      <SlackAgentMessage agent="aria" time="4:47 PM">
        4 hot conversations need a call. Top one: Northstar — wants a closer
        time, leaning Tuesday.
      </SlackAgentMessage>
      <div className="demo-day__pulse-row">
        <ChannelDot pulsing />
        <span>#pancake-hot · 4 unread</span>
      </div>
    </DayShell>
  );
}

function Day3VoiceMemo({ localTime }: { localTime: number }) {
  // Words appear synced with the recording timeline.
  const lines = [
    { at: 1.2, text: "Northstar — yes, Tuesday. Push for 2pm, my time." },
    { at: 3.4, text: "Brio — pass, they’re not ready." },
    { at: 5.4, text: "Cellartech — hold for next week, want to think." },
    { at: 7.4, text: "Helm — let them lead, send the deck." },
  ];
  return (
    <motion.div
      className="demo-stage demo-stage--voice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="demo-voice__phone">
        <div className="demo-voice__phone-bar">
          <span>4:47</span>
          <span className="demo-voice__phone-bar-mid">Voice memo</span>
          <span>●</span>
        </div>
        <div className="demo-voice__title">Memo to @pancake</div>
        <Waveform progress={Math.min(1, localTime / 9)} />
        <div className="demo-voice__transcript">
          {lines.map((l, i) =>
            localTime >= l.at ? (
              <motion.p
                key={i}
                className="demo-voice__line"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
              >
                {l.text}
              </motion.p>
            ) : null,
          )}
        </div>
        <div className="demo-voice__meta">
          0:{Math.min(20, Math.round(localTime * 2))
            .toString()
            .padStart(2, "0")} · sending to pancake…
        </div>
      </div>
    </motion.div>
  );
}

function Day3Execution({ localTime }: { localTime: number }) {
  const showA = localTime > 0.2;
  const showB = localTime > 1.2;
  const showC = localTime > 2.2;
  const showD = localTime > 3.2;
  return (
    <DayShell
      label="WEDNESDAY"
      time="4:51 PM"
      location="Six minutes later"
      palette="wednesday"
      glyph={<MountainGlyph />}
    >
      {showA && (
        <SlackAgentMessage agent="pancake" time="4:48 PM">
          Got it. Executing.
        </SlackAgentMessage>
      )}
      {showB && (
        <SlackAgentMessage agent="aria" time="4:51 PM">
          Northstar booked Tuesday 2pm your time. Confirmation in your inbox.
        </SlackAgentMessage>
      )}
      {showC && (
        <SlackAgentMessage agent="aria" time="4:52 PM">
          Brio: graceful pass sent. Helm: deck sent, no ask.
        </SlackAgentMessage>
      )}
      {showD && (
        <SlackAgentMessage agent="aria" time="4:53 PM">
          Cellartech: holding, will follow up Tuesday.
        </SlackAgentMessage>
      )}
    </DayShell>
  );
}

export function Day4Thursday({ localTime }: { localTime: number }) {
  const showA = localTime > 0.6;
  const showB = localTime > 3.2;
  // Pulse appears, ignored, then settles
  return (
    <DayShell
      label="THURSDAY"
      time="9:24 AM"
      location="Long dinner"
      palette="thursday"
      glyph={<WineGlyph />}
    >
      {showA && (
        <SlackAgentMessage agent="pancake" time="9:24 AM">
          Two more hot conversations from yesterday. Held them — kept them
          warm with one follow-up each. No action needed unless you want to
          weigh in.
        </SlackAgentMessage>
      )}
      {showB && (
        <SlackAgentMessage agent="aria" time="2:47 PM">
          3 more demos booked from yesterday&apos;s batch.
        </SlackAgentMessage>
      )}
      <div className="demo-day__pulse-row demo-day__pulse-row--ignored">
        <ChannelDot pulsing />
        <span>#pancake-hot · holding</span>
      </div>
    </DayShell>
  );
}

export function Day5Friday({ localTime }: { localTime: number }) {
  const showA = localTime > 0.6;
  return (
    <DayShell
      label="FRIDAY"
      time="5:32 PM"
      location="Packing up"
      palette="friday"
      glyph={<SuitcaseGlyph />}
    >
      {showA && (
        <SlackAgentMessage agent="pancake" time="5:32 PM">
          <strong>Final tally:</strong> 31 demos booked. €847k qualified
          pipeline. 23 companies in Series A–C range. Full report ready.
        </SlackAgentMessage>
      )}
    </DayShell>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ACT 5 — Return + "Yes." (80–90s)
   ────────────────────────────────────────────────────────────────────── */

export function Act5Return({ localTime }: { localTime: number }) {
  const summaryShow = localTime > 0.6;
  // Cursor blinks, then keystrokes.
  const charCount =
    localTime < 5 ? 0 : localTime < 5.7 ? 1 : localTime < 6.2 ? 2 : localTime < 6.7 ? 3 : 4;
  const typed = "Yes.".slice(0, charCount);
  const sent = localTime > 7.6;

  return (
    <div className="demo-stage demo-stage--slack demo-stage--return">
      <div className="demo-slack-card demo-slack-card--lg">
        <SlackChannelHeader channel="#gtm" />
        <div className="demo-slack__feed">
          {summaryShow && (
            <SlackAgentMessage agent="pancake" time="Sat 8:00 AM">
              <strong>Trip summary</strong>
              <ul className="demo-summary">
                <li>✓ 31 demos booked (target: 30)</li>
                <li>✓ €847k qualified pipeline</li>
                <li>✓ 23 companies in Series A–C range</li>
                <li>✓ 8 disqualified with polite passes</li>
                <li>✓ 7 hot conversations live, all in #pancake-hot</li>
                <li>✓ Apollo + Cal in sync. Nothing dropped.</li>
              </ul>
              Want me to keep the campaign running?
            </SlackAgentMessage>
          )}
        </div>
        <div className="demo-slack__composer">
          <span className="demo-slack__composer-text">
            {typed}
            {!sent && (
              <span className="demo-slack__composer-caret" aria-hidden />
            )}
          </span>
          {sent && (
            <motion.span
              className="demo-slack__composer-sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              · sent
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ACT 6 — Close (90–95s)
   ────────────────────────────────────────────────────────────────────── */

export function Act6Close({ localTime }: { localTime: number }) {
  const showWord = localTime > 0.4;
  const showTag = localTime > 1.2;
  const showUrl = localTime > 2.0;
  const showFine = localTime > 2.7;

  return (
    <div className="demo-stage demo-stage--close">
      <motion.div
        className="demo-close"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {showWord && (
          <Image
            src="/pancake-wordmark.png"
            alt="Pancake"
            width={739}
            height={291}
            quality={100}
            className="demo-close__wordmark"
            priority
          />
        )}
        {showTag && (
          <motion.p
            className="demo-close__tag"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Human board. AI execution.
          </motion.p>
        )}
        {showUrl && (
          <motion.p
            className="demo-close__url"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            getpancake.ai
          </motion.p>
        )}
        {showFine && (
          <motion.p
            className="demo-close__fine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            7 days free. No card required.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Glyphs — minimalist SVG iconography for the lifestyle frames.
   ────────────────────────────────────────────────────────────────────── */

function CoffeeGlyph() {
  return (
    <svg viewBox="0 0 120 120" className="demo-glyph">
      <path
        d="M30 50h50v32a18 18 0 0 1-18 18H48a18 18 0 0 1-18-18V50z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M80 58h8a10 10 0 0 1 10 10v6a10 10 0 0 1-10 10h-8"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M44 30c0 6 4 6 4 12M58 28c0 6 4 6 4 12M72 32c0 6 4 6 4 12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function WaveGlyph() {
  return (
    <svg viewBox="0 0 160 100" className="demo-glyph">
      <circle cx="130" cy="22" r="14" fill="currentColor" opacity="0.85" />
      <path
        d="M0 60c20-12 32 0 52 0s32-12 52 0 32 0 52 0v40H0z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M0 75c20-10 32 2 52 2s32-12 52-12 32 2 52 2v33H0z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function MountainGlyph() {
  return (
    <svg viewBox="0 0 160 100" className="demo-glyph">
      <circle cx="118" cy="30" r="10" fill="currentColor" opacity="0.85" />
      <path
        d="M0 92l38-52 22 26 18-22 28 36 30-22 24 34z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function WineGlyph() {
  return (
    <svg viewBox="0 0 80 120" className="demo-glyph">
      <path
        d="M22 12h36v18a18 18 0 0 1-36 0V12z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M40 48v50" stroke="currentColor" strokeWidth="3" />
      <path d="M22 102h36" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function SuitcaseGlyph() {
  return (
    <svg viewBox="0 0 120 100" className="demo-glyph">
      <rect
        x="14"
        y="26"
        width="92"
        height="58"
        rx="8"
        fill="currentColor"
        opacity="0.9"
      />
      <rect
        x="46"
        y="14"
        width="28"
        height="14"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <line
        x1="14"
        y1="50"
        x2="106"
        y2="50"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
    </svg>
  );
}

function LaptopGlyph() {
  return (
    <svg viewBox="0 0 160 100" className="demo-glyph">
      <rect
        x="22"
        y="18"
        width="116"
        height="62"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <rect
        x="34"
        y="28"
        width="92"
        height="42"
        rx="2"
        fill="currentColor"
        opacity="0.18"
      />
      <path d="M8 84h144l-8 8H16z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function PlaneWindowGlyph() {
  return (
    <svg viewBox="0 0 160 100" className="demo-glyph">
      <rect
        x="32"
        y="14"
        width="96"
        height="72"
        rx="36"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="32"
        y="14"
        width="96"
        height="72"
        rx="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="62" cy="42" r="6" fill="currentColor" opacity="0.85" />
      <path
        d="M46 70c20-10 50-10 70 0"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.65"
      />
    </svg>
  );
}

function Waveform({ progress }: { progress: number }) {
  // 36 bars, deterministic pseudo-random heights for a natural look.
  const bars = Array.from({ length: 36 }, (_, i) => {
    const seed = Math.sin((i + 1) * 12.9898) * 43758.5453;
    const r = seed - Math.floor(seed);
    return 18 + r * 56;
  });
  const activeBars = Math.floor(progress * bars.length);
  return (
    <div className="demo-voice__wave" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={
            i < activeBars
              ? "demo-voice__bar demo-voice__bar--on"
              : "demo-voice__bar"
          }
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
