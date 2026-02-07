"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Constants
const SUCCESS_RESPONSE_TIME = "I'll respond within 24 hours.";
const ERROR_MESSAGE = "Something went wrong. Please try again.";

// Validation error messages
const ERROR_MESSAGES = {
  name: "Please enter your name",
  email: "Please enter a valid email address",
  message: "Please tell me a bit about your business",
} as const;

// Validation constants
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 10;

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

// Validation functions
const validateName = (value: string): string | undefined => {
  if (!value.trim() || value.trim().length < MIN_NAME_LENGTH) {
    return ERROR_MESSAGES.name;
  }
  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value.trim() || !emailRegex.test(value)) {
    return ERROR_MESSAGES.email;
  }
  return undefined;
};

const validateMessage = (value: string): string | undefined => {
  if (!value.trim() || value.trim().length < MIN_MESSAGE_LENGTH) {
    return ERROR_MESSAGES.message;
  }
  return undefined;
};

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let error: string | undefined;

    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "message":
        error = validateMessage(value);
        break;
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot - silently reject spam
    if (honeypot) return;

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    if (nameError || emailError || messageError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        message: messageError,
      });
      return;
    }

    setStatus("loading");
    setSubmittedName(formData.name);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: honeypot,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
  };

  const isLoading = status === "loading";

  // Success state
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-center py-8"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <p className="text-xl font-semibold text-foreground">
          Thanks, {submittedName}!
        </p>
        <p className="text-muted-foreground mt-2">{SUCCESS_RESPONSE_TIME}</p>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="text-center py-8"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <p className="text-xl font-semibold text-foreground">
          Oops!
        </p>
        <p className="text-muted-foreground mt-2">{ERROR_MESSAGE}</p>
        <Button
          type="button"
          onClick={handleRetry}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot - hidden from real users, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">
          Website
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {/* Name field */}
      <div className="space-y-2">
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-foreground"
        >
          Name
        </label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          aria-invalid={fieldErrors.name ? "true" : undefined}
          aria-describedby="name-error"
          className="min-h-[44px]"
        />
        <p
          id="name-error"
          className={`text-sm text-red-500 ${fieldErrors.name ? "" : "sr-only"}`}
          aria-live="polite"
        >
          {fieldErrors.name || ""}
        </p>
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-foreground"
        >
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          aria-invalid={fieldErrors.email ? "true" : undefined}
          aria-describedby="email-error"
          className="min-h-[44px]"
        />
        <p
          id="email-error"
          className={`text-sm text-red-500 ${fieldErrors.email ? "" : "sr-only"}`}
          aria-live="polite"
        >
          {fieldErrors.email || ""}
        </p>
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          aria-describedby="message-error"
          className="min-h-[120px]"
          rows={4}
        />
        <p
          id="message-error"
          className={`text-sm text-red-500 ${fieldErrors.message ? "" : "sr-only"}`}
          aria-live="polite"
        >
          {fieldErrors.message || ""}
        </p>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
};
