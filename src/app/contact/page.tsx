import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="contact-page contact-page--simple">
      <section className="contact-hero contact-hero--compact">
        <div className="contact-hero__grid" />
        <div className="contact-hero__gold-glow" />

        <div className="section-container contact-hero__container contact-hero__container--compact">
          <aside className="contact-hero__panel">
            <p>BCU Group Headquarters</p>

            <div>
              <span>Location</span>
              <strong>Dar es Salaam, Tanzania</strong>
            </div>

            <div>
              <span>General email</span>
              <a href="mailto:info@bcu.co.tz">info@bcu.co.tz</a>
            </div>

            <div>
              <span>RFC telephone</span>
              <a href="tel:+255749308289">+255 749 308 289</a>
            </div>

            <div>
              <span>WhatsApp</span>
              <a href="https://wa.me/255672828587">+255 672 828 587</a>
            </div>

            <small>
              Meetings with the group leadership should be arranged in advance.
            </small>
          </aside>
        </div>
      </section>

      <section id="contact-form" className="contact-form-section section">
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
