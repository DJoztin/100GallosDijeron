"use client";

import { useEffect } from "react";
import { useGameStore } from "@/app/lib/game-store";
import { initSync, cleanup } from "@/app/lib/broadcast-sync";

export function SyncManager() {
  const viewMode = useGameStore((s) => s.viewMode);

  useEffect(() => {
    initSync(viewMode === "host");
    return () => cleanup();
  }, [viewMode]);

  return null;
}
