'use client';

interface CharCounterProps {
  value: string;
  maxLength: number;
}

export default function CharCounter({ value, maxLength }: CharCounterProps) {
  const remaining = maxLength - value.length;

  if (remaining == 0) {
    return <span className="text-xs text-red-500 font-medium">{Math.abs(remaining)}</span>;
  }

  return <span className="text-xs text-gray-400 font-medium">{remaining}</span>;
}