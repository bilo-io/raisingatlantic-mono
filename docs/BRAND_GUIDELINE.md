# Brand Guideline: Raising Atlantic 🌊

## 1. Brand Heart

### Brand Promise
To provide absolute peace of mind for parents and impeccable clinical continuity for pediatricians through a secure, modern, and immutable Road to Health platform.

### Core Mission
To modernize and digitalize the South African National Department of Health (DoH) Road to Health booklet, eliminating the fragmentation of care caused by lost or incomplete physical health records.

### Vision
A unified ecosystem where every child's developmental journey is seamlessly tracked, effortlessly shared between guardians and clinicians, and actively supports early intervention.

---

## 2. Target Personas

### The Parent
*   **Mindset:** Diligent but overwhelmed. They want to do everything right for their child but find tracking paper booklets, growth charts, and complex EPI vaccination schedules stressful.
*   **Needs:** Automated reminders, easy-to-use mobile interfaces, and a clear, readable summary of their child’s health.
*   **Value:** Peace of mind, zero "lost book" anxiety.

### The Clinician (Pediatricians & Specialists)
*   **Mindset:** Busy, precise, and heavily regulated. They need instant access to accurate historical data to make informed clinical decisions.
*   **Needs:** Fast access to patient rosters, longitudinal growth charts, verifiable HPCSA/SANC compliance, and reduced administrative liability.
*   **Value:** Streamlined workflow, reduced clinical liability, improved continuity of care.

---

## 3. Tone of Voice

**Empathy meets Clinical Precision.**

Our voice must balance the warmth and reassurance needed by anxious parents with the strict, unyielding professionalism expected by medical regulatory bodies.

*   **Authoritative but Accessible:** We use correct medical terminology (e.g., "EPI Schedule", "Growth Velocity") but explain it in a way that is easily understood by laymen.
*   **Reassuring:** We alleviate anxiety by providing clear, actionable alerts (e.g., "Upcoming Vaccination") without causing panic.
*   **Professional:** Data integrity and security are paramount. Our language must convey trust, stability, and HIPAA/POPIA compliance natively.
*   **Direct:** Interfaces should favor clarity over cleverness. "Pending Assessment" is better than "Waiting for the Doc."

---

## 4. Visual Identity

Our design language prioritizes clarity, warmth, and accessibility. We utilize a "Warm Glass" aesthetic that feels modern, premium, and humanized, diverging from cold, sterile medical software.

### Primary Color Palette 

The core palette relies on warm, earthy tones to evoke humanity, care, and approachability.

*   **Primary (Terracotta / Coral)**
    *   Light Mode: `#D97757`
    *   Dark Mode: `#E2896D`
    *   *Usage:* Primary calls to action, active states, progress indicators.
*   **Primary Gradient**
    *   Light Mode: `linear-gradient(135deg, #D97757 0%, #B85F41 100%)`
    *   Dark Mode: `linear-gradient(135deg, #E2896D 0%, #D97757 100%)`
    *   *Usage:* Premium highlights, brand moments, icons.

### Neutral / Foundation Colors

We use exceptionally warm off-whites and soft dark greys to reduce eye strain and modernize the interface.

*   **Background (Canvas)**
    *   Light Mode: `#F3F1E9` (Warm Bone/Parchment)
    *   Dark Mode: `#1F1D1B` (Warm Charcoal)
*   **Foreground (Text)**
    *   Light Mode: `#1A1915` (Deep Warm Black)
    *   Dark Mode: `#F3F1E9` (Warm Bone)
*   **Card & Popover Backgrounds**
    *   Light Mode: `#FCFAF6` 
    *   Dark Mode: `#262421`
*   **Borders & Inputs**
    *   Light Mode: `#DCD9D1`
    *   Dark Mode: `#383530`

### Semantic Colors

*   **Destructive / Error:** `#EF4444` (Used sparingly for critical clinical alerts or destructive actions).
*   **Success / Charts:** `#34D399` (Used for positive growth metrics and chart visualizations).
*   **Warning / Charts:** `#F97316` / `#F4A261`

---

## 5. Typography

**Typeface: PT Sans**

We exclusively use `PT Sans` (from Google Fonts) for both Body and Headline text. 

*   **Why PT Sans?** It is highly legible on digital screens, offers excellent readability for complex clinical data tables, and possesses a humanistic sans-serif quality that aligns perfectly with our warm brand identity.
*   **Weights:** 
    *   Regular (400) - For body copy, clinical notes, and data tables.
    *   Bold (700) - For hierarchy, dashboard metrics, and primary buttons.
*   **Variable Use:** The font is loaded variably (`--font-pt-sans`) to ensure highly optimized rendering across the global platform.

---

## 6. Design Language & UI Tokens

*   **Radii:** Soft, rounded corners (Base Radius: `0.5rem`) to ensure the interface feels safe and approachable. 
*   **Gradients:** Subtle use of primary gradients on text hover states (`.hover-gradient-text`) and button borders (`.hover-gradient-border`) to add a premium, dynamic feel without overwhelming the user.
*   **Dark Mode:** Natively supported and deeply considered. The dark mode utilizes warm darks (`#1F1D1B`) rather than pure blacks or cool blues, maintaining the brand's empathetic feel even in low-light environments.
*   **Animations:** Micro-animations (like accordion smooth-scrolling `accordion-down 0.2s ease-out`) are used judiciously to provide feedback without delaying critical task completion.