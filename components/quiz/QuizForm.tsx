"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuiz } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { CityAutocomplete } from "@/components/ui/CityAutocomplete";
import { offsetForDate } from "@/lib/city-timezone";
import { FOCUS_LABELS, FocusArea } from "@/lib/types";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? "Sending…" : "Get my report"}
    </Button>
  );
}

interface StepDef {
  key: string;
  eyebrow: string;
  title: string;
  helper: string;
  render: () => React.ReactNode;
  isValid: (data: FormValues) => boolean;
}

interface FormValues {
  firstName: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTimeKnown: boolean;
  birthTime: string;
  birthLocation: string;
  timezone: string | null;
  gender: "male" | "female";
  focus: FocusArea | "";
  consent: boolean;
}

const initialValues: FormValues = {
  firstName: "",
  email: "",
  phone: "",
  birthDate: "",
  birthTimeKnown: true,
  birthTime: "",
  birthLocation: "",
  timezone: null,
  gender: "female",
  focus: "",
  consent: false,
};

const focusOptions: { value: FocusArea; label: string; helper: string }[] = [
  { value: "love", label: FOCUS_LABELS.love, helper: "Patterns in how you connect and attach." },
  { value: "career", label: FOCUS_LABELS.career, helper: "Timing, direction, and where effort pays off." },
  { value: "money", label: FOCUS_LABELS.money, helper: "Your relationship to security and abundance." },
  { value: "personal_growth", label: FOCUS_LABELS.personal_growth, helper: "What this season is asking you to work on." },
  { value: "life_direction", label: FOCUS_LABELS.life_direction, helper: "The bigger question of where you're headed." },
];

export function QuizForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  const steps: StepDef[] = [
    {
      key: "name",
      eyebrow: "1 of 6 · Getting started",
      title: "What should we call you?",
      helper: "Your report is written to you, personally — not a template.",
      isValid: (d) => d.firstName.trim().length > 0,
      render: () => (
        <input
          autoFocus
          type="text"
          value={values.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          placeholder="First name"
          className={inputClass}
        />
      ),
    },
    {
      key: "contact",
      eyebrow: "2 of 6 · Where to send it",
      title: "Where should your report go?",
      helper: "We'll email a private link the moment it's ready. Phone is optional, only used if we need to reach you about your reading.",
      isValid: (d) => /\S+@\S+\.\S+/.test(d.email),
      render: () => (
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email address"
            className={inputClass}
          />
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone (optional)"
            className={inputClass}
          />
        </div>
      ),
    },
    {
      key: "birthDate",
      eyebrow: "3 of 6 · Your chart",
      title: "When were you born?",
      helper: "Your birth date sets the position of every planet in your chart — it's the foundation everything else is read from.",
      isValid: (d) => d.birthDate.trim().length > 0,
      render: () => (
        <input
          autoFocus
          type="date"
          value={values.birthDate}
          onChange={(e) => update("birthDate", e.target.value)}
          className={inputClass}
        />
      ),
    },
    {
      key: "birthTime",
      eyebrow: "4 of 6 · Precision",
      title: "What time were you born?",
      helper: "Birth time determines your rising sign and house placements. Check your birth certificate if you have it — an estimate is fine if you don't.",
      isValid: () => true,
      render: () => (
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            type="time"
            value={values.birthTime}
            disabled={!values.birthTimeKnown}
            onChange={(e) => update("birthTime", e.target.value)}
            className={`${inputClass} disabled:opacity-40`}
          />
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={!values.birthTimeKnown}
              onChange={(e) => {
                update("birthTimeKnown", !e.target.checked);
                if (e.target.checked) update("birthTime", "");
              }}
              className="h-4 w-4 rounded border-line bg-transparent accent-gold"
            />
            I don&apos;t know my exact birth time
          </label>
        </div>
      ),
    },
    {
      key: "cityAndGender",
      eyebrow: "5 of 6 · Your chart",
      title: "Where were you born?",
      helper: "Start typing and pick your city from the list — we'll work out your time zone automatically, no need to look it up yourself.",
      isValid: (d) => d.birthLocation.trim().length > 0 && d.timezone !== null,
      render: () => (
        <div className="flex flex-col gap-5">
          <div>
            <CityAutocomplete
              value={values.birthLocation}
              onSelect={(label, tz) => {
                update("birthLocation", label);
                update("timezone", tz);
              }}
              inputClassName={inputClass}
            />
            <p className="mt-1 text-xs text-ink-faint">
              {values.timezone
                ? `Time zone resolved: ${values.timezone}`
                : "Pick a city from the suggestions to continue."}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Gender</p>
            <p className="mb-2 text-xs text-ink-faint">
              BaZi&apos;s luck-cycle calculation is gender-specific — this is
              a property of the traditional method itself, not a comment on
              identity.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update("gender", "female")}
                className={`flex-1 rounded-xl2 border px-4 py-2 text-sm ${
                  values.gender === "female"
                    ? "border-gold bg-plum-soft/60"
                    : "border-stone/30 bg-white/50 text-ink-muted"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => update("gender", "male")}
                className={`flex-1 rounded-xl2 border px-4 py-2 text-sm ${
                  values.gender === "male"
                    ? "border-gold bg-plum-soft/60"
                    : "border-stone/30 bg-white/50 text-ink-muted"
                }`}
              >
                Male
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "focus",
      eyebrow: "6 of 6 · Almost there",
      title: "What's on your mind most right now?",
      helper: "Your astrologer will write your report toward this — the rest of your chart is read in support of it.",
      isValid: (d) => d.focus !== "",
      render: () => (
        <div className="flex flex-col gap-2">
          {focusOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => update("focus", opt.value)}
              className={`rounded-xl2 border p-4 text-left transition-colors ${
                values.focus === opt.value
                  ? "border-gold bg-plum-soft/60"
                  : "border-stone/30 bg-white/50 hover:border-mauve/50 hover:bg-petal/30"
              }`}
            >
              <p className="font-medium">{opt.label}</p>
              <p className="mt-1 text-xs text-ink-muted">{opt.helper}</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLastStep = step === steps.length - 1;
  const canAdvance = current.isValid(values);

  function handleNext() {
    if (!canAdvance) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // Computed once here (not stored in state) from the resolved timezone +
  // birth date/time, so the person never has to pick a UTC offset by hand.
  const resolvedUtcOffset =
    values.timezone && values.birthDate
      ? (() => {
          const [y, mo, d] = values.birthDate.split("-").map(Number);
          const [h, mi] = values.birthTimeKnown && values.birthTime
            ? values.birthTime.split(":").map(Number)
            : [12, 0];
          return offsetForDate(values.timezone, y, mo, d, h, mi);
        })()
      : -5;

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex gap-1.5">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-gold" : "bg-line"
            }`}
          />
        ))}
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        {current.eyebrow}
      </p>
      <h1 className="mt-3 text-balance font-display text-2xl font-medium sm:text-3xl">
        {current.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {current.helper}
      </p>

      <div className="mt-8">{current.render()}</div>

      {isLastStep && (
        <label className="mt-6 flex items-start gap-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line bg-transparent accent-gold"
          />
          I agree to be contacted about my report and understand this is for
          entertainment and reflection purposes.
        </label>
      )}

      <div className="mt-10 flex items-center justify-between">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {!isLastStep ? (
          <Button type="button" disabled={!canAdvance} onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <form action={submitQuiz}>
            <input type="hidden" name="firstName" value={values.firstName} />
            <input type="hidden" name="email" value={values.email} />
            <input type="hidden" name="phone" value={values.phone} />
            <input type="hidden" name="birthDate" value={values.birthDate} />
            <input
              type="hidden"
              name="birthTime"
              value={values.birthTimeKnown ? values.birthTime : ""}
            />
            <input
              type="hidden"
              name="birthLocation"
              value={values.birthLocation}
            />
            <input type="hidden" name="gender" value={values.gender} />
            <input
              type="hidden"
              name="utcOffset"
              value={String(resolvedUtcOffset)}
            />
            <input type="hidden" name="focus" value={values.focus} />
            {values.consent && <input type="hidden" name="consent" value="on" />}
            <SubmitButton disabled={!canAdvance || !values.consent} />
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl2 border border-stone/40 bg-white/60 px-4 py-3 text-base text-ink placeholder:text-ink-faint outline-none focus:border-gold/60 focus:bg-white";
