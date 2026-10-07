import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="contact-page contact-page--simple">
      <section
        id="contact-form"
        className="contact-form-section section"
      >
        <div className="section-container contact-form-section__simple">
          <div className="section-heading contact-form-section__simple-heading">
            <p className="section-kicker">Send Your Message</p>
            <h1>
              Contact
              <span> BCU Group.</span>
            </h1>
            <p>
              Enter your details and tell us what you would like to discuss.
              Your enquiry will be sent to the appropriate BCU team.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="contact-form-loading">
                Loading contact form...
              </div>
            }
          >
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
