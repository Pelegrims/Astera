"use client";

import { useEffect, useState } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Button } from "@/components/ui/Button";

// NOTE: these are public, client-side values by design — the client
// token is meant to be used in the browser (it can't move money on its
// own), and the price ID is just an identifier. Both come from env vars
// so switching from sandbox to live later is a config change, not a code
// change — just update these two values in Vercel and flip
// NEXT_PUBLIC_PADDLE_ENVIRONMENT from "sandbox" to "production".
const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const PADDLE_ENV = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox") as
  | "sandbox"
  | "production";
const DEFAULT_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

export function PaddleCheckoutButton({
  priceId = DEFAULT_PRICE_ID,
  email,
  children,
  className = "",
}: {
  priceId?: string;
  email?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    if (!PADDLE_TOKEN) {
      // eslint-disable-next-line no-console
      console.error(
        "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set — checkout button will not work."
      );
      return;
    }
    initializePaddle({ environment: PADDLE_ENV, token: PADDLE_TOKEN }).then(
      (instance) => setPaddle(instance)
    );
  }, []);

  function handleClick() {
    if (!paddle || !priceId) return;
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(email ? { customer: { email } } : {}),
    });
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={!paddle || !priceId}
      className={className}
    >
      {children}
    </Button>
  );
}
