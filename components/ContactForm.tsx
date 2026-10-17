"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  // When the form appeared; sent along so the server can reject bots that
  // submit instantly.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFeedback("");

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("_ts", String(shownAt.current));
    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      const json = (await res.json()) as { ok: boolean; message: string };
      setFeedback(json.message);
      setStatus(json.ok ? "sent" : "error");
    } catch {
      setFeedback("Sorry, something went wrong sending your message. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="contact-form" aria-label="Contact form">
      <form
        className={`contact-form__inner${status === "sent" ? " is-sent" : ""}`}
        method="post"
        action="/api/contact"
        onSubmit={onSubmit}
        noValidate={false}
      >
        <input
          className="contact-form__honeypot"
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
        />
        <label className="contact-form__field">
          <em className="contact-form__label">Your Name</em>
          <input className="contact-form__input" type="text" name="name" placeholder="Your Name" />
        </label>
        <label className="contact-form__field">
          <em className="contact-form__label">Your Email</em>
          <input
            className="contact-form__input"
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />
        </label>
        <label className="contact-form__field">
          <em className="contact-form__label">Message</em>
          <textarea
            className="contact-form__input contact-form__input--textarea"
            name="message"
            placeholder="Message"
            required
          />
        </label>
        <button className="contact-form__button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        <div
          className={`contact-form__feedback${status === "error" ? " contact-form__feedback--error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      </form>
    </section>
  );
}
