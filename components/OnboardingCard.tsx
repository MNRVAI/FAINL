import { FC, useState } from 'react';
import { X, Sparkles, Cpu, BookOpen, Swords, ArrowRight } from 'lucide-react';

interface Props {
  onDismiss: () => void;
  onNavigate?: (view: string) => void;
}

const TIPS = [
  {
    icon: Cpu,
    title: 'Bouw je eigen AI-raad',
    body: 'Kies welke AI-modellen jouw vragen beantwoorden. Ga naar Mijn AI-Nodes om de samenstelling aan te passen.',
    action: 'Nodes openen',
    view: 'NODES',
  },
  {
    icon: Swords,
    title: 'Laat ze debatteren',
    body: 'Na elke analyse kunnen de AI-modellen met elkaar in debat gaan. Open de Debatkamer en zie wie het sterkste argument heeft.',
    action: 'Debatkamer',
    view: 'DEBATES',
  },
  {
    icon: BookOpen,
    title: 'Inspiratie nodig?',
    body: 'Bekijk de Inspiratie-hub met 200+ voorbeeldvragen voor betere, meer gefundeerde antwoorden.',
    action: 'Inspiratie',
    view: 'COOKBOOK',
  },
];

export const OnboardingCard: FC<Props> = ({ onDismiss, onNavigate }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const tip = TIPS[tipIndex];
  const Icon = tip.icon;
  const isLast = tipIndex === TIPS.length - 1;

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 300);
  };

  const handleNext = () => {
    if (isLast) {
      handleDismiss();
    } else {
      setTipIndex(i => i + 1);
    }
  };

  return (
    <div className={`onboarding-card ${exiting ? 'onboarding-card--exit' : ''}`} role="status" aria-live="polite">
      {/* Dismiss */}
      <button className="onboarding-dismiss" onClick={handleDismiss} aria-label="Sluiten">
        <X />
      </button>

      {/* Pill */}
      <span className="onboarding-pill">
        <Sparkles className="onboarding-pill-icon" aria-hidden="true" />
        Tip {tipIndex + 1} van {TIPS.length}
      </span>

      {/* Icon */}
      <div className="onboarding-icon-circle" aria-hidden="true">
        <Icon className="onboarding-icon" />
      </div>

      {/* Text */}
      <h3 className="onboarding-title">{tip.title}</h3>
      <p className="onboarding-body">{tip.body}</p>

      {/* Progress dots */}
      <div className="onboarding-dots" aria-hidden="true">
        {TIPS.map((_, i) => (
          <button
            key={i}
            className={`onboarding-dot ${i === tipIndex ? 'onboarding-dot--active' : ''}`}
            onClick={() => setTipIndex(i)}
            aria-label={`Ga naar tip ${i + 1}`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="onboarding-actions">
        {onNavigate && (
          <button className="onboarding-btn-secondary" onClick={() => { onNavigate(tip.view); handleDismiss(); }}>
            {tip.action}
          </button>
        )}
        <button className="onboarding-btn-primary" onClick={handleNext}>
          {isLast ? 'Begrepen' : (
            <><span>Volgende</span><ArrowRight className="onboarding-arrow" aria-hidden="true" /></>
          )}
        </button>
      </div>
    </div>
  );
};
