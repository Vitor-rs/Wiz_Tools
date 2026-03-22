```markdown
# Design System Specification: High-Precision Administrative Intelligence

## 1. Overview & Creative North Star
**Creative North Star: The Surgical Workspace**
This design system rejects the "fluff" of modern SaaS dashboards in favor of a high-density, methodical interface. It is inspired by medical instruments and aviation cockpits—where information density is a feature, not a bug. We move beyond "template" looks by utilizing **Tonal Layering** and **Micro-Precision** spacing. Instead of separating data with heavy lines, we use subtle shifts in surface values to create a "clinical" clarity that feels expensive, intentional, and hyper-efficient.

---

## 2. Colors & Surface Logic
The palette is rooted in functional utility. Every hue serves a diagnostic purpose: Green for "Active/Go," Blue for "Information/Guidance," and Red for "Critical/Exception."

### The "No-Line" Rule
To achieve a premium, high-end feel, **1px solid borders for sectioning are strictly prohibited.** 
*   **Boundary Definition:** Define areas using background shifts. For example, a `surface-container-low` (#f2f4f6) sidebar sitting against a `surface-container-lowest` (#ffffff) main workspace.
*   **Contrast as Structure:** Use the transition from `surface` (#f7f9fb) to `surface-container` (#eceef0) to denote hierarchy.

### Surface Hierarchy & Nesting
Treat the dashboard as a series of precision-milled layers:
*   **Base Layer:** `surface` (#f7f9fb) - Global background.
*   **The Workspace:** `surface-container-lowest` (#ffffff) - The primary data entry/table area.
*   **Information Bar (Sidebar):** `surface-container-low` (#f2f4f6) - Secondary navigation and filters.
*   **Header Accents:** `secondary-fixed` (#d8e2ff) - Used for table super-headers to provide a cooling, high-contrast anchor.

### Signature Textures: The Glass & Gradient Rule
While the system is "clinical," it isn't flat. 
*   **Floating Modals:** Use `surface-container-lowest` with a `backdrop-blur` of 12px and 80% opacity to create a "frosted lens" effect.
*   **Active States:** For primary CTAs, use a subtle linear gradient from `primary` (#006b2c) to `primary-container` (#00873a) at a 135-degree angle. This provides "visual soul" and depth without breaking the professional aesthetic.

---

## 3. Typography: The Inter Matrix
We utilize **Inter** for its neutral, high-legibility x-height. The type system is designed for high-contrast scanning.

*   **Display & Headlines:** Use `headline-sm` (1.5rem) for module titles. Maintain `on-surface` (#191c1e) with `font-weight: 600` for an authoritative, editorial feel.
*   **The Data Grid (Body-sm/Label-sm):** The core of the administrative experience. Use `body-sm` (0.75rem) for table rows. This allows for the requested "highly compact" layout while maintaining optical clarity.
*   **Labels:** Use `label-sm` (0.6875rem) with `letter-spacing: 0.02em` in uppercase for super-headers to act as metadata "anchors."

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Ambient Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` (#e0e3e5) element on top of a `surface` (#f7f9fb) background creates a "natural lift" that feels physically integrated into the hardware.
*   **Ambient Shadows:** If a floating element (like a context menu) requires a shadow, use a large blur (24px) with a color of `on-surface` at 4% opacity. It should look like a soft atmospheric occlusion, not a dark smudge.
*   **The Ghost Border:** If high-density data requires a container (e.g., stacked action buttons), use `outline-variant` (#bdcaba) at **15% opacity**. This creates a "ghost" boundary that guides the eye without cluttering the UI.

---

## 5. Components

### High-Density Tables (The Core)
*   **Super-Headers:** Use `secondary-fixed` (#d8e2ff) backgrounds. Text should be `label-md` bold.
*   **Rows:** Height set to `2.5` (0.5rem) padding top/bottom. Total row height should not exceed 32px.
*   **Row Highlighting:** Use `primary-fixed` (#7ffc97) at 20% opacity for "Today" or "Active" rows.
*   **Dividers:** Strictly forbidden. Use a 1px vertical gap of `surface` color if necessary, or simply rely on the alignment of the `Inter` typeface.

### Action Components
*   **Stacked Action Buttons:** Use `surface-container-high` (#e6e8ea) for the button base with `label-md` text. When grouped, they should be "butted" together with only a 1px `surface` gap between them.
*   **Pill Badges:** Use `full` (9999px) roundedness. Status colors:
    *   *Active:* `primary-fixed` (#7ffc97) background with `on-primary-fixed` (#002109) text.
    *   *Alert:* `tertiary-fixed` (#ffdad7) background with `on-tertiary-fixed` (#410004) text.
*   **Input Fields:** Use `surface-container-lowest` (#ffffff) with a 1px "Ghost Border." Focus state uses a 2px `secondary` (#0058be) "glow" with 0.15rem roundedness.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts for sidebars to create a "command center" feel.
*   **Do** lean on the Spacing Scale `1` (0.2rem) and `1.5` (0.3rem) for micro-adjustments in dense tables.
*   **Do** use `on-surface-variant` (#3e4a3d) for secondary labels to keep the hierarchy clear.

### Don’t:
*   **Don't** use 100% black shadows or 100% opaque borders. It breaks the clinical, high-end feel.
*   **Don't** use standard 44px touch targets; this is a precision-mouse interface. Aim for 28-32px compact targets.
*   **Don't** use rounded corners larger than `md` (0.375rem) except for badges. Sharpness equates to precision in this system.

---

## 7. Signature Utility Tokens
*   **Holiday/Closed State:** Apply `surface-dim` (#d8dadc) with a subtle diagonal CSS pattern to indicate non-working areas of a grid.
*   **Success Indicator:** `primary` (#006b2c) text on `primary-container` (#00873a) background—used only for final confirmation states.```