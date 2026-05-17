"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/app/lib/game-store";

interface AnswerInputProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function AnswerInput({ onSubmit, placeholder = "Escribe tu respuesta...", label }: AnswerInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div className="w-full">
      {label && <div className="text-sm font-bold tracking-widest text-white/50 uppercase mb-2">{label}</div>}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          className="
            flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white
            placeholder:text-white/30 font-bold text-lg outline-none
            focus:border-yellow-400/50 focus:bg-white/15 transition-all
          "
        />
        <button
          onClick={handleSubmit}
          className="
            px-6 py-3 rounded-xl bg-yellow-400 text-black font-black text-lg
            hover:bg-yellow-300 active:scale-95 transition-all
          "
        >
          ENVIAR
        </button>
      </div>
    </div>
  );
}
