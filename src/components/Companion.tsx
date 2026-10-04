import { useState, useEffect } from "react";
import { MessageCircle, Volume2 } from "lucide-react";
import type { Level } from "../data/types";
import { companions } from "../data/companions";
export function CompanionArt({ level }: { level: Level }) {
  const name = companions[level].name;
  return (
    <svg
      className="companion-art"
      viewBox="0 0 160 160"
      role="img"
      aria-label={`${name}, your ${level.toLowerCase()} learning companion`}
    >
      <ellipse cx="80" cy="148" rx="45" ry="7" fill="#dce8cd" />
      {level === "Beginner" ? (
        <>
          <path
            d="M80 38Q56 16 69 5Q91 9 86 32Q99 12 119 23Q114 45 87 40"
            fill="#8bbb50"
          />
          <rect x="32" y="38" width="96" height="102" rx="43" fill="#86b952" />
          <path
            d="M36 92Q16 90 21 107M124 92Q144 86 140 102"
            fill="none"
            stroke="#66983c"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <ellipse cx="80" cy="113" rx="28" ry="17" fill="#b5d982" />
          <circle cx="58" cy="77" r="6" fill="#25442d" />
          <circle cx="102" cy="77" r="6" fill="#25442d" />
          <circle cx="57" cy="75" r="2" fill="white" />
          <circle cx="101" cy="75" r="2" fill="white" />
          <path
            d="M67 91Q80 106 93 91"
            fill="none"
            stroke="#25442d"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse cx="45" cy="91" rx="9" ry="5" fill="#e5b679" />
          <ellipse cx="115" cy="91" rx="9" ry="5" fill="#e5b679" />
        </>
      ) : level === "Intermediate" ? (
        <>
          <path
            d="M35 59L29 14L67 38M94 37L130 14L123 63"
            fill="#b38c48"
            stroke="#7b663c"
            strokeWidth="3"
          />
          <path
            d="M40 47Q80 20 121 47L127 95Q115 135 80 141Q42 135 32 95Z"
            fill="#be9654"
          />
          <path
            d="M34 78L80 100L126 78Q114 119 80 121Q46 115 34 78"
            fill="#f4e7c7"
          />
          <ellipse cx="59" cy="67" rx="5" ry="7" fill="#294333" />
          <ellipse cx="101" cy="67" rx="5" ry="7" fill="#294333" />
          <path d="M72 95Q80 87 88 95L80 104Z" fill="#294333" />
          <path
            d="M71 108Q80 117 89 108"
            fill="none"
            stroke="#294333"
            strokeWidth="3"
          />
          <path d="M42 119Q80 145 118 119L117 139H44Z" fill="#398344" />
          <rect x="64" y="123" width="33" height="22" rx="4" fill="#286a33" />
          <path d="M70 133H90" stroke="#b9d894" strokeWidth="3" />
        </>
      ) : (
        <>
          <path
            d="M35 53L40 15L66 32Q83 24 99 33L122 15L126 56V113Q115 143 80 145Q43 142 32 114Z"
            fill="#547451"
          />
          <path
            d="M43 59Q52 35 77 59Q107 33 119 60L111 100H49Z"
            fill="#dfe7cd"
          />
          <circle
            cx="59"
            cy="71"
            r="18"
            fill="none"
            stroke="#294333"
            strokeWidth="4"
          />
          <circle
            cx="101"
            cy="71"
            r="18"
            fill="none"
            stroke="#294333"
            strokeWidth="4"
          />
          <path d="M77 68H83" stroke="#294333" strokeWidth="4" />
          <circle cx="59" cy="71" r="5" fill="#294333" />
          <circle cx="101" cy="71" r="5" fill="#294333" />
          <path d="M72 92L80 103L88 92Z" fill="#caa851" />
          <path d="M46 112L80 123L115 112V136H45Z" fill="#294333" />
          <path d="M78 119L74 142H86L83 119" fill="#a4c77e" />
          <path
            d="M38 111L21 120L35 137M122 111L139 120L125 137"
            fill="#547451"
          />
        </>
      )}
    </svg>
  );
}
export function Companion({ level }: { level: Level }) {
  const guide = companions[level];
  const [tip, setTip] = useState(-1);
  const [speechStatus, setSpeechStatus] = useState("");
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  const message = tip < 0 ? guide.greeting : guide.tips[tip];
  return (
    <section className="companion-card">
      <CompanionArt level={level} />
      <div className="companion-message">
        <span>
          {guide.name} · {guide.role}
        </span>
        <p aria-live="polite">{message}</p>
        <div className="companion-actions">
          <button
            className="text-button"
            onClick={() => {
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              setTip((tip + 1) % guide.tips.length);
              setSpeechStatus("");
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            {level === "Advanced"
              ? "Give me a reading prompt"
              : "Give me a tip"}
          </button>
          <button
            className="text-button"
            onClick={() => {
              if (!("speechSynthesis" in window)) {
                setSpeechStatus("Audio isn’t available in this browser.");
                return;
              }
              if (speechStatus === "Reading aloud…") {
                window.speechSynthesis.cancel();
                setSpeechStatus("");
                return;
              }
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(message);
              utterance.onend = () => setSpeechStatus("");
              utterance.onerror = () =>
                setSpeechStatus("Audio isn’t available right now.");
              window.speechSynthesis.speak(utterance);
              setSpeechStatus("Reading aloud…");
            }}
          >
            <Volume2 size={16} aria-hidden="true" />
            {speechStatus === "Reading aloud…" ? "Stop reading" : "Read aloud"}
          </button>
        </div>
        <span className="speech-status" role="status">
          {speechStatus}
        </span>
      </div>
    </section>
  );
}
