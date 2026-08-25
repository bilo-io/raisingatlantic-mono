import { scrubSentryEvent, scrubString, scrubValue } from "../scrub";

describe("scrubString", () => {
  it("redacts emails", () => {
    expect(scrubString("jane.doe@example.com logged in")).toBe(
      "[redacted] logged in",
    );
  });

  it("redacts SA 13-digit ID numbers", () => {
    expect(scrubString("ID: 9001015009087")).toBe("ID: [redacted]");
  });

  it("redacts HPCSA numbers", () => {
    expect(scrubString("Doctor MP1234567 saw the patient")).toBe(
      "Doctor [redacted] saw the patient",
    );
  });

  it("redacts SANC numbers", () => {
    expect(scrubString("Nurse SANC12345678 verified the record")).toBe(
      "Nurse [redacted] verified the record",
    );
  });

  it("redacts phone numbers", () => {
    expect(scrubString("Call +27 82 123 4567 now")).toBe("Call [redacted] now");
  });

  it("leaves non-PII strings alone", () => {
    expect(scrubString("Request failed with status 500")).toBe(
      "Request failed with status 500",
    );
  });
});

describe("scrubValue", () => {
  it("redacts string values under sensitive keys", () => {
    const out = scrubValue({ name: "Jane Doe", id: "child-123" }) as Record<
      string,
      unknown
    >;
    expect(out.name).toBe("[redacted]");
    expect(out.id).toBe("child-123");
  });

  it("recurses into nested objects and arrays", () => {
    const out = scrubValue({
      records: [{ email: "a@b.com", note: "child Sarah" }],
    }) as { records: Array<Record<string, unknown>> };
    expect(out.records[0]!.email).toBe("[redacted]");
    expect(out.records[0]!.note).toBe("[redacted]");
  });

  it("scrubs PII inside string values of non-sensitive keys", () => {
    const out = scrubValue({ description: "Contact a@b.com" }) as Record<
      string,
      unknown
    >;
    expect(out.description).toBe("Contact [redacted]");
  });
});

describe("scrubSentryEvent", () => {
  it("redacts message, exception value, breadcrumb, extra, and user.email", () => {
    const scrubbed = scrubSentryEvent({
      message: "Jane Doe (jane@example.com) hit an error",
      exception: {
        values: [{ value: "user MP1234567 failed: 9001015009087" }],
      },
      breadcrumbs: [
        { message: "Loaded child name=Sarah", data: { email: "x@y.com" } },
      ],
      extra: { hpcsa_number: "MP9876543", note: "free text" },
      user: { id: "u-1", email: "leak@example.com", username: "leak" },
      request: { headers: { authorization: "Bearer eyJ..." } },
      tags: { release: "1.0.0" },
    });

    expect(scrubbed.message).not.toContain("jane@example.com");
    expect((scrubbed.exception?.values?.[0]?.value ?? "")).not.toContain(
      "MP1234567",
    );
    expect((scrubbed.exception?.values?.[0]?.value ?? "")).not.toContain(
      "9001015009087",
    );
    expect(scrubbed.breadcrumbs?.[0]?.data?.email).toBe("[redacted]");
    expect(scrubbed.extra?.hpcsa_number).toBe("[redacted]");
    expect(scrubbed.user?.email).toBeUndefined();
    expect(scrubbed.user?.username).toBeUndefined();
    expect(scrubbed.tags?.release).toBe("1.0.0");
  });
});
