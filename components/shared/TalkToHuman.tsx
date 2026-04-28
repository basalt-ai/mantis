import { talkToHuman } from "@/lib/copy";

export function TalkToHuman() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--text)] sm:text-4xl">
            {talkToHuman.title}
          </h2>
          <p className="mt-4 text-lg text-[var(--text-muted)]">
            {talkToHuman.subtitle}
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <iframe
            src="https://zcal.co/i/4mlnC2bQ?embed=1&embedType=iframe"
            loading="lazy"
            scrolling="no"
            id="zcal-invite"
            title="Schedule a meeting"
            className="w-full max-w-[1096px]"
            style={{
              border: "none",
              minWidth: 320,
              minHeight: 544,
              height: 675,
            }}
          />
        </div>
      </div>
    </section>
  );
}
