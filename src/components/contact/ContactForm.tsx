"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  organisation: string;
  enquiryType: string;
  company: string;
  subject: string;
  message: string;
  consent: boolean;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  organisation: "",
  enquiryType: "General Enquiry",
  company: "BCU Group",
  subject: "",
  message: "",
  consent: false,
};

export default function ContactForm() {
  const searchParams = useSearchParams();

  const [formData, setFormData] =
    useState<FormState>(initialFormState);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    const subject = searchParams.get("subject");
    const company = searchParams.get("company");
    const type = searchParams.get("type");

    setFormData((current) => ({
      ...current,
      subject: subject ?? current.subject,
      company: company ?? current.company,
      enquiryType: type ?? current.enquiryType,
    }));
  }, [searchParams]);

  const updateField = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.consent) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          subject: `${formData.enquiryType}: ${formData.subject} (${formData.company})`,
          message: formData.message,
          website: "",
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setFormData(initialFormState);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="contact-form__heading">
        <div>
          <p>Send an Enquiry</p>
          <h2>Tell us what you want to build.</h2>
        </div>

        <span>Fields marked * are required</span>
      </div>

      <div className="contact-form__grid">
        <label className="contact-field">
          <span>Full name *</span>

          <input
            type="text"
            value={formData.fullName}
            onChange={(event) =>
              updateField("fullName", event.target.value)
            }
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </label>

        <label className="contact-field">
          <span>Email address *</span>

          <input
            type="email"
            value={formData.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="name@company.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="contact-field">
          <span>Phone number</span>

          <input
            type="tel"
            value={formData.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder="+255"
            autoComplete="tel"
          />
        </label>

        <label className="contact-field">
          <span>Organisation</span>

          <input
            type="text"
            value={formData.organisation}
            onChange={(event) =>
              updateField(
                "organisation",
                event.target.value
              )
            }
            placeholder="Company or institution"
            autoComplete="organization"
          />
        </label>

        <label className="contact-field">
          <span>Enquiry type *</span>

          <select
            value={formData.enquiryType}
            onChange={(event) =>
              updateField(
                "enquiryType",
                event.target.value
              )
            }
            required
          >
            <option>General Enquiry</option>
            <option>Strategic Partnership</option>
            <option>Investment Opportunity</option>
            <option>Government Collaboration</option>
            <option>Project Enquiry</option>
            <option>Media Enquiry</option>
            <option>Career Application</option>
            <option>Supplier Enquiry</option>
            <option>Technical Support</option>
          </select>
        </label>

        <label className="contact-field">
          <span>Company *</span>

          <select
            value={formData.company}
            onChange={(event) =>
              updateField("company", event.target.value)
            }
            required
          >
            <option>BCU Group</option>
            <option>Ready Food Company</option>
            <option>SmartCycle Technologies</option>
          </select>
        </label>

        <label className="contact-field contact-field--full">
          <span>Subject *</span>

          <input
            type="text"
            value={formData.subject}
            onChange={(event) =>
              updateField("subject", event.target.value)
            }
            placeholder="What would you like to discuss?"
            required
          />
        </label>

        <label className="contact-field contact-field--full">
          <span>Message *</span>

          <textarea
            value={formData.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            placeholder="Provide relevant details about your enquiry, project, organisation or proposed partnership."
            rows={8}
            required
          />
        </label>
      </div>

      <label className="contact-consent">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(event) =>
            updateField("consent", event.target.checked)
          }
        />

        <span>
          I consent to BCU Group storing and processing
          this information for the purpose of responding
          to my enquiry.
        </span>
      </label>

      {status === "success" && (
        <div
          className="contact-form__message contact-form__message--success"
          role="status"
        >
          <strong>Enquiry received.</strong>
          <span>Thank you. BCU Group will respond as soon as possible.</span>
        </div>
      )}

      {status === "error" && (
        <div
          className="contact-form__message contact-form__message--error"
          role="alert"
        >
          <strong>We could not submit your enquiry.</strong>
          <span>Check the required fields and consent, then try again.</span>
        </div>
      )}

      <div className="contact-form__footer">
        <p>
          BCU Group will use the information only to review
          and respond to this enquiry.
        </p>

        <button
          type="submit"
          className="button button--gold"
          disabled={status === "submitting"}
        >
          {status === "submitting"
            ? "Submitting..."
            : "Submit Enquiry"}

          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
