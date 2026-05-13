import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const OtpInput = ({ value, onChange, disabled }: Props) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Always work with exactly 6 slots
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? '');

  const focusAt = (i: number) => {
    setTimeout(() => inputsRef.current[i]?.focus(), 0);
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;

    // handle paste of multiple digits into one box
    if (raw.length > 1) {
      const filled = raw.slice(0, 6);
      const next = digits.map((d, idx) => filled[idx] ?? d);
      onChange(next.join(''));
      focusAt(Math.min(filled.length, 5));
      return;
    }

    const next = [...digits];
    next[i] = raw[0];
    onChange(next.join(''));
    if (i < 5) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = '';
        onChange(next.join(''));
      } else if (i > 0) {
        next[i - 1] = '';
        onChange(next.join(''));
        focusAt(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight' && i < 5) {
      focusAt(i + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '');
    onChange(next.join(''));
    focusAt(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          autoFocus={i===0}
          disabled={disabled}
          className="input input-bordered w-11 h-12 text-center text-lg font-bold focus:input-primary focus:outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;