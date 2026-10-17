"use client";

import { useEffect } from "react";

/**
 * The server renders <body class="is-loading"> (opacity 0). Once React has
 * mounted, the class is dropped and the page fades in.
 */
export function PageReady() {
  useEffect(() => {
    document.body.classList.remove("is-loading");
  }, []);
  return null;
}
