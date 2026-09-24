"use client";

import { useState } from "react";

export function useTurnstile() {
  const [token, setToken] = useState("");

  const reset = () => {
    setToken("");
  };

  return {
    token,
    setToken,
    reset,
    isVerified: Boolean(token),
  };
}