/**
 * Site-wide constants and configuration values
 * Centralized location for content that appears in multiple places
 */

/**
 * Primary site description used in metadata and structured data
 * Update this single constant to change the description everywhere
 */
export const SITE_DESCRIPTION =
  "Professional web solutions in Trinidad and Tobago. Fast, modern websites designed to get your business found on Google and convert visitors into customers.";

/**
 * Site name used across metadata and structured data
 */
export const SITE_NAME = "Jon Kumar Web Solutions";

/**
 * Full site title used in page <title> tag
 */
export const SITE_TITLE = `${SITE_NAME} | Websites That Get You Found on Google`;

/**
 * Contact email for business inquiries
 * Appears in JSON-LD structured data
 * Update here to change across the site
 */
export const CONTACT_EMAIL = "info@jonkumarwebsolutions.com";

/**
 * Gets the site URL from environment variable with validation
 * Falls back to localhost in development, warns if not set in production
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;

  // In production, warn if NEXT_PUBLIC_SITE_URL is not set
  if (!url && process.env.NODE_ENV === "production") {
    console.warn(
      "⚠️  NEXT_PUBLIC_SITE_URL is not set in production. Using localhost fallback. This will break SEO and structured data!",
    );
  }

  return (url || "http://localhost:3000").replace(/\/$/, "");
}
