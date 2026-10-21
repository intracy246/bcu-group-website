"use client";

import styles from "./WhatsAppButton.module.css";

const WHATSAPP_URL =
  "https://wa.me/255672828587?text=Hello%20BCU%20Group%2C%20I%20would%20like%20to%20know%20more.";

export default function WhatsAppButton() {
  return (
    <a
      className={styles.button}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BCU Group on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M16.02 3.2A12.45 12.45 0 0 0 5.28 22l-1.7 6.2 6.36-1.67A12.46 12.46 0 1 0 16.02 3.2Zm0 22.62c-1.88 0-3.73-.5-5.36-1.45l-.38-.22-3.78.99 1.01-3.68-.25-.39A10.12 10.12 0 1 1 16.02 25.82Zm5.56-7.58c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"
        />
      </svg>
      <span className={styles.label}>Chat with us</span>
    </a>
  );
}
