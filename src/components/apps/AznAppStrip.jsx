import React, { useMemo } from 'react';
import { AZN_APPS } from '../../data/appsData';
import { Smartphone, ExternalLink, Sparkles } from 'lucide-react';

const ANY_ALARM_SLOGANS = [
  {
    headline: "🚌 Never miss your stop in a bus or train again!",
    desc: "Set destination radius & our battery-optimized GPS location alarm wakes you up right on arrival."
  },
  {
    headline: "⚡ All types of alarms in one powerful app",
    desc: "GPS Commute Alarm, Math puzzles, Barcode scanner, Step counter & Memory challenges."
  },
  {
    headline: "🦷 Forced morning discipline for heavy sleepers",
    desc: "Set alarm to only turn off when you physically get out of bed and scan your bathroom barcode!"
  },
  {
    headline: "🧮 Wake up your brain with Math challenges",
    desc: "Solve arithmetic problems from simple to extreme to unlock the dismiss button. Zero excuses."
  },
  {
    headline: "⏰ Early morning coding rounds or exams?",
    desc: "Beat sleep inertia with unbreakable wake-up challenges that force your brain and body out of bed."
  }
];

export default function AznAppStrip({ appId = 'anyalarm', headline, customText, sloganIndex }) {
  const app = AZN_APPS.find((a) => a.id === appId) || AZN_APPS[0];

  const slogan = useMemo(() => {
    if (headline && customText) {
      return { headline, desc: customText };
    }
    if (customText) {
      return { headline: "Any Alarm: Hardcore Wake Up", desc: customText };
    }
    if (typeof sloganIndex === 'number') {
      return ANY_ALARM_SLOGANS[sloganIndex % ANY_ALARM_SLOGANS.length];
    }
    // Pick based on random or fallback
    return ANY_ALARM_SLOGANS[0];
  }, [headline, customText, sloganIndex]);

  return (
    <div className="azn-ad-strip">
      <div className="azn-ad-strip-left">
        <img src={app.icon} alt={app.name} className="azn-ad-strip-icon" />
        <div className="azn-ad-strip-text">
          <div className="azn-ad-strip-title">
            <span style={{ color: '#ffa116', fontWeight: 800 }}>{slogan.headline}</span>
            <span className="azn-ad-label" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
              <Sparkles size={11} />
              AZN Labs
            </span>
          </div>
          <div className="azn-ad-strip-desc">
            {slogan.desc}
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0 }}>
        <a
          href={app.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="playstore-btn"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
        >
          <Smartphone size={14} />
          <span>Get Any Alarm</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
