# UI/UX & Web Development Standards

All web design, code structures, and copywriting in this repository must align with the following premium visual and conversion standards.

## 1. Visual Design & Theme
- **Color Palette**: Use a cohesive dark theme by default (Zinc-black backgrounds like `#0c0e0d`, emerald accents like `#22c55e`).
- **Typography**: Import and use Google Fonts `Space Grotesk` (for headlines) and `DM Sans` (for body text).
- **Background Graphics**:
  - Dotted patterns (`radial-gradient`) in the background to add a modern tech feel.
  - Fine check grid lines (`.grid-lines-bg` styled at `96px` blocks) to resemble a designer workbench.
- **Glassmorphism**: Use translucent card backgrounds (`rgba(255, 255, 255, 0.02)`) with blurred backdrops (`backdrop-filter: blur(20px)`) and fine border dividers (`1px solid rgba(255, 255, 255, 0.05)`).

## 2. Layout & Spacing
- **Container Max-Width**: Maintain container max-width at `1400px` on desktop screen views for optimal line-length and spacious grid columns.
- **Breathing Space**: Separate page content sections with consistent vertical padding (e.g., `6.5rem 0`) and separation border lines.

## 3. Micro-Animations & Interactions
- **Custom Cursor**: Track mouse coordinates to render an active green trailing pointer.
- **Icon Pops**: Add spring-scale hover transitions (`transform: scale(1.05) rotate(25deg)`) to icon buttons.
- **Progress Shimmer**: Add infinite loading glow gradients to metrics and building progress bars.

## 4. Single-Page Architecture (SPA)
- **Hash Routing**: Swap container states smoothly using `window.location.hash` changes. Prevent reloading page flickers.
- **Safe Initialization**: Bind routing listeners (`handleRoute()`) at the very bottom of the execution script to guarantee all DOM hooks and variables are fully initialized first.

## 5. Theme Toggling
- **Root selectors**: Always apply `.light-mode` overrides at the root `<html>` level (`document.documentElement`) instead of `body` to prevent background color cutoffs on scroll.
