import { Suspense } from "react";
import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

const contactChannels = [
  {
    number: "01",
    title: "Corporate Enquiries",
    description:
      "Group strategy, governance, institutional engagement and general corporate information.",
    email: "info@bcu.co.tz",
    company: "BCU Group",
  },
  {
    number: "02",
    title: "Ready Food Company",
    description:
      "Food services, dairy, cold-chain, logistics, suppliers and RFC partnerships.",
    email: "eat@readyfood.com",
    company: "Ready Food Company",
  },
  {
    number: "03",
    title: "SmartCycle Technologies",
    description:
      "Technology projects, demonstrations, institutional software and technical partnerships.",
    email: "technology@bcu.co.tz",
    company: "SmartCycle Technologies",
  },
  {
    number: "04",
    title: "Media and Communications",
    description:
      "Official statements, project briefings, interviews and corporate media enquiries.",
    email: "media@bcu.co.tz",
    company: "BCU Group",
  },
];

const enquiryAreas = [
  "Strategic partnerships",
  "Government collaboration",
  "Investment opportunities",
  "Technology demonstrations",
  "Food supply and distribution",
  "Institutional service contracts",
  "Research and university partnerships",
  "Media and corporate information",
];

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero__grid" />
        <div className="contact-hero__gold-glow" />
        <div className="contact-hero__green-glow" />
        <div className="contact-hero__blue-glow" />

        <div className="section-container contact-hero__container">
          <div className="contact-hero__content">
            <p className="section-kicker">Contact BCU Group</p>

            <h1>
              Start a conversation.
              <span>Build something important.</span>
            </h1>

            <p>
              Connect with BCU Group, Ready Food Company
              or SmartCycle Technologies regarding
              partnerships, investments, projects,
              services and institutional collaboration.
            </p>

            <div className="contact-hero__actions">
              <a
                href="#contact-form"
                className="button button--gold"
              >
                Send an Enquiry
                <span aria-hidden="true">↓</span>
              </a>

              <a
                href="mailto:info@bcu.co.tz"
                className="button button--outline"
              >
                Email BCU Group
              </a>
            </div>
          </div>

          <aside className="contact-hero__panel">
            <p>BCU Group Headquarters</p>

            <div>
              <span>Location</span>
              <strong>
                Dar es Salaam, Tanzania
              </strong>
            </div>

            <div>
              <span>General email</span>
              <a href="mailto:info@bcu.co.tz">
                info@bcu.co.tz
              </a>
            </div>

            <div>
              <span>RFC telephone</span>
              <a href="tel:+255749308289">
                +255 749 308 289
              </a>
            </div>

            <div>
              <span>WhatsApp</span>
              <a href="tel:+255672828587">
                +255 672 828 587
              </a>
            </div>

            <small>
              Meetings with the group leadership should
              be arranged in advance.
            </small>
          </aside>
        </div>
      </section>

      <section className="contact-introduction section">
        <div className="section-container contact-introduction__grid">
          <div className="section-heading">
            <p className="section-kicker">
              How We Can Connect
            </p>

            <h2>
              Direct your enquiry
              <br />
              to the
              <br />
              <span>right company.</span>
            </h2>
          </div>

          <div className="contact-introduction__copy">
            <p>
              BCU Group receives enquiries covering
              corporate partnerships, project development,
              investments, public-sector collaboration,
              technology and food services.
            </p>

            <p>
              Selecting the correct company and enquiry
              category helps the message reach the
              appropriate team faster.
            </p>

            <p>
              Messages submitted through the website will
              later be assigned, tracked and managed
              through the BCU Admin Dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-channels section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">
                Contact Channels
              </p>

              <h2>
                One group.
                <br />
                <span>Specialised teams.</span>
              </h2>
            </div>
          </div>

          <div className="contact-channels__grid">
            {contactChannels.map((channel) => (
              <article
                key={channel.number}
                className="contact-channel-card"
              >
                <span>{channel.number}</span>

                <h3>{channel.title}</h3>

                <p>{channel.description}</p>

                <a href={`mailto:${channel.email}`}>
                  {channel.email}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact-form"
        className="contact-form-section section"
      >
        <div className="section-container contact-form-section__layout">
          <div className="contact-form-section__information">
            <p className="section-kicker">
              Send Your Message
            </p>

            <h2>
              Let&apos;s understand
              <span>your objective.</span>
            </h2>

            <p>
              Provide enough information for the relevant
              BCU team to evaluate and respond to your
              enquiry.
            </p>

            <div className="contact-form-section__areas">
              {enquiryAreas.map((area, index) => (
                <div key={area}>
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>{area}</strong>
                </div>
              ))}
            </div>
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

      <section className="contact-companies section">
        <div className="section-container">
          <div className="section-header-row">
            <div className="section-heading">
              <p className="section-kicker">
                Explore Before Contacting
              </p>

              <h2>
                Understand our
                <br />
                <span>companies and projects.</span>
              </h2>
            </div>
          </div>

          <div className="contact-companies__grid">
            <Link
              href="/companies/rfc"
              className="contact-company-card contact-company-card--rfc"
            >
              <span>Ready Food Company</span>

              <h3>
                Food systems, dairy, cold chain and consumer
                services.
              </h3>

              <strong>
                Explore RFC
                <span aria-hidden="true">↗</span>
              </strong>
            </Link>

            <Link
              href="/companies/smartcycle"
              className="contact-company-card contact-company-card--smartcycle"
            >
              <span>SmartCycle Technologies</span>

              <h3>
                AI, institutional software and digital
                infrastructure.
              </h3>

              <strong>
                Explore SmartCycle
                <span aria-hidden="true">↗</span>
              </strong>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}