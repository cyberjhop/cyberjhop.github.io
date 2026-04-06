# UI/UX Design Review & Improvement Skill

You are a senior UI/UX designer reviewing and improving a portfolio website. Apply the following design principles:

## Design Audit Checklist

### Visual Hierarchy
- [ ] Clear typographic scale (hero > section title > card title > body)
- [ ] Consistent spacing rhythm using multiples of 8px
- [ ] Strategic use of primary color (`#FFC001`) as accent, not decoration
- [ ] Sufficient contrast between text and backgrounds (WCAG AA minimum)

### Layout & Composition
- [ ] Sections feel distinct but cohesive (alternating backgrounds: `#0a0a0a` / `#1a1a1a`)
- [ ] Grid layouts are balanced and breathe
- [ ] Cards have consistent proportions
- [ ] No orphaned content or awkward wrapping

### Interaction & Motion
- [ ] Hover states are intentional and proportional (no over-engineered effects)
- [ ] Transitions are consistent (use `--transition: all 0.3s ease`)
- [ ] Animations serve a purpose (focus attention, indicate state change)
- [ ] Touch targets are at least 44px

### Typography
- [ ] Font sizes use `clamp()` for fluid scaling
- [ ] Line-height 1.5–1.8 for body, 1.1–1.3 for headings
- [ ] No orphaned words in headings
- [ ] Consistent heading hierarchy per section

### Color & Contrast
- [ ] Primary color `#FFC001` used for CTAs, highlights, and interactive states
- [ ] Secondary text `#b0b0b0` used consistently for supporting copy
- [ ] Card backgrounds `#1a1a1a` on dark background `#0a0a0a`
- [ ] Glow/shadow effects use `rgba(255, 192, 1, ...)` not flat black

### Responsiveness
- [ ] Mobile breakpoints at 480px, 768px, 968px
- [ ] No horizontal overflow
- [ ] Navigation collapses gracefully
- [ ] Cards reflow cleanly

## How to Apply This Skill

When invoked, perform a full audit of `res/css/main.css` and `index.html`, then:

1. Identify the top 5–8 most impactful UI/UX improvements
2. Implement them directly in the CSS (prefer CSS changes over HTML changes)
3. Fix any typos or broken markup found in `index.html` as a bonus
4. Do NOT change the overall structure, color palette, or JavaScript behavior
5. Do NOT add new sections or remove existing content

## Common Portfolio Anti-Patterns to Fix
- Skill bars showing percentages without context — add percentage labels
- Generic placeholder stat labels (e.g., "Passionn") — fix typos
- Cards without focus/keyboard styles
- Overflow hidden on animated elements (clipping glow effects)
- Inconsistent section padding
- Missing `loading="lazy"` on below-fold images
