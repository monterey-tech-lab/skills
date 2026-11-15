# Research: craft-and-taste

Date: 2026-11-08 · Purpose: Encode product craft and taste so agents can judge and improve whether an interface (and the product behavior behind it) feels intentional, calm, polished, and effective · Recommendation: **build**

## 1. Question / scope

**Proposed skill name:** `craft-and-taste`

**Question:** Should monterey-tech-lab/skills publish a new simple skill that teaches agents *product craft and taste*—necessity, calm UI craft, purposeful motion, composition, and stack-agnostic build defaults—drawing from public Apple HIG/WWDC design philosophy, Linear’s craft culture, Vercel’s design-engineering bar, and publicly attributable Jobs-era focus principles—without becoming a SwiftUI cookbook, a brand system, a WCAG auditor, or a copy of Emil Kowalski’s paid/proprietary course material?

**Audience:** Agents (and humans directing them) building or reviewing product UI/UX across web and native. Not Swift-only; `skills/swift` remains for SwiftUI implementation rules.

**In scope (agreed branches):**
1. Product necessity — what belongs; reduce; remove fake urgency / feature clutter.
2. UI craft review — spacing, hierarchy, typography, color, surfaces, density, empty/loading/error; catch AI slop / template looks.
3. Motion and interaction — when to animate, interruptibility, continuity, feedback; avoid decorative motion.
4. Layout and composition — hierarchy, alignment, breathing room, one-job-per-surface.
5. Build guidance — concrete defaults and incorrect/correct patterns; stack-agnostic with platform pointers.

**Out of scope:** Copying Emil Kowalski’s paid course / proprietary skills; deep framework cookbooks; full brand systems; accessibility as standalone WCAG auditing; backend/API architecture.

**Skill type planned:** simple (`SKILL.md` + `references/`), not rule-based.

**Repo overlap:** Only published product skill in this repository today is `swift` ([skills/swift](https://github.com/monterey-tech-lab/skills/tree/main/skills/swift)). External prior art must be cataloged carefully with licenses; content summarized only—do not paste skill bodies into the new skill.

---

## 2. Prior art

| Skill / source | Source URL | License | Installs / popularity (as of access) | Covers | Misses (relative to craft-and-taste) |
|---|---|---|---|---|---|
| `apple-design` (emilkowalski/skills) | https://github.com/emilkowalski/skills/tree/main/skills/apple-design · https://www.skills.sh/emilkowalski/skills/apple-design | MIT ([LICENSE](https://raw.githubusercontent.com/emilkowalski/skills/main/LICENSE)) | ~281K installs on skills.sh; repo ~3.2M total installs across skills ([skills.sh](https://www.skills.sh/emilkowalski/skills)); GitHub ~54K stars ([repo](https://github.com/emilkowalski/skills)) | WWDC *Designing Fluid Interfaces* distilled for **web**: springs, interruptible motion, velocity/momentums, gesture tracking, materials/depth, some typography/reduced-motion | Product necessity / “what belongs”; Linear/Vercel craft philosophy; calm product density; empty/loading/error craft; Jobs-era focus; cross-platform product review beyond fluid web springs |
| `emil-design-eng` + animation suite (same repo) | https://github.com/emilkowalski/skills | MIT | `emil-design-eng` ~428K; `review-animations` ~291K; others 8K–270K ([skills.sh](https://www.skills.sh/emilkowalski/skills)) | Animation craft, review, removal, choreography, Expo, mobile-native web fixes, break-UI edge cases | Product-level necessity; multi-source craft doctrine; non-animation UI judgment as primary job |
| aiforui.dev (paid course + 28 UI skills) | https://aiforui.dev/ | Proprietary / paid (course skill pack; not a free open skill to copy) | 4,500+ course takers claimed on site | Taste → rules/skills for agents; anti-template UI; review workflows; Lapse animation review | **Do not copy.** Course/skills are commercial IP. Our skill must be original synthesis from public primary sources |
| `design-taste-frontend` / tasteskill (craftwork.design) | https://www.skills.sh/site/craftwork.design/taste-skill | Not clearly stated on listing page (treat as third-party; do not copy body) | Popularity unclear on listing; separate marketplace mirrors cite large install numbers for similarly named skills | Anti-slop for **landing pages, portfolios, redesigns**; brief inference; vibe routing | Explicitly **not** dashboards / multi-step product UI; little product-necessity or ship-product calm craft |
| `frontend-design` (anthropics/skills) | https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0 (skill points to LICENSE.txt; example skills in repo use Apache 2.0) | ~994K installs cited on SkillsAdd catalog | Distinctive intentional visuals; anti-default aesthetics; type/layout/motion restraint; copy as design; plan-then-critique | Product feature necessity; Linear craft essays; Apple HIG product foundations; calm dense product UIs; Jobs focus; native platform pointers |
| Other Anthropic creative skills (`canvas-design`, `theme-factory`, `brand-guidelines`) | https://github.com/anthropics/skills/tree/main/skills | Mostly Apache-2.0 | Lower than frontend-design | Artifacts, themes, Anthropic brand | Not product craft/taste for shipping apps |
| Forks / mirrors of apple-design (craftwork, memi-design, sudewajay, etc.) | e.g. https://www.skills.sh/site/craftwork.design/apple-design | Varies / often derived from Emil’s MIT skill | Fragmented | Same fluid-web Apple motion thesis (sometimes + Liquid Glass notes) | Same gap as Emil’s apple-design; Liquid Glass forks are Apple-platform chrome, not product craft doctrine |
| `ios-ui-craft` (prisma-labs-dev/apple-skills) | https://www.skills.sh/prisma-labs-dev/apple-skills/ios-ui-craft | Check per-repo | Unknown | Bold iOS aesthetic direction + SwiftUI craft | iOS-only; aesthetic boldness ≠ product necessity + calm craft across platforms |
| Anti-slop / taste kits (community) | e.g. https://github.com/arham777/ui-ux-kit · https://github.com/KyaniteLabs/tastecheck · https://github.com/sezabut/mozaika-design · https://github.com/agshinrajabov/no-slop-design · https://github.com/aievolutionpl/agent-design-taste | Mostly MIT (per their READMEs) | Niche | Anti-AI-slop gates, design-system docs, landing/product routing | Rarely combine Apple HIG + Linear craft + Vercel design-eng + product necessity; often marketing-surface heavy; quality uneven |
| monterey-tech-lab `swift` | https://github.com/monterey-tech-lab/skills (local `skills/swift`) | MIT (repo) | N/A (this product) | SwiftUI / Swift 6 implementation rules | Explicitly not cross-platform product craft/taste |

**Hard boundary:** Summarize only. Do **not** adapt bodies from aiforui.dev paid skills or paste Emil/Anthropic/craftwork skill text into monterey-tech-lab skill content. Cite public primary sources instead. MIT/Apache prior art may inform *gap analysis* and *structure ideas* with attribution, but craft-and-taste must be original prose grounded in Apple/Linear/Vercel/Jobs public materials.

---

## 3. Sources (accessed 2026-11-08)

### Apple (primary)
- [Design - Apple Developer](https://developer.apple.com/design/) — accessed 2026-11-08
- [HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography) ([`.md`](https://developer.apple.com/design/human-interface-guidelines/typography.md)) — accessed 2026-11-08
- [HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color) ([`.md`](https://developer.apple.com/design/human-interface-guidelines/color.md)) — accessed 2026-11-08
- [HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout) ([`.md`](https://developer.apple.com/design/human-interface-guidelines/layout.md)) — accessed 2026-11-08
- [HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) ([`.md`](https://developer.apple.com/design/human-interface-guidelines/motion.md)) — accessed 2026-11-08
- [Apple Design Resources](https://developer.apple.com/design/resources/) — accessed 2026-11-08
- [WWDC18: Designing Fluid Interfaces (803)](https://developer.apple.com/videos/play/wwdc2018/803/) — accessed 2026-11-08

### Linear (primary / practitioner)
- [linear.app/learn](https://linear.app/learn) — accessed 2026-11-08
- [linear.app/docs](https://linear.app/docs) — accessed 2026-11-08
- [Now / craft index](https://linear.app/now/craft) — accessed 2026-11-08
- [Output isn’t design](https://linear.app/now/output-isn-t-design) (Karri Saarinen, 2026-04-17) — accessed 2026-11-08
- [Design is more than code](https://linear.app/now/design-is-more-than-code) (Karri Saarinen, 2025-12-19) — accessed 2026-11-08
- [A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh) (Charlie Aufmann & Maxime Heckel, 2026-03-12) — accessed 2026-11-08
- [Why is quality so rare?](https://linear.app/now/why-is-quality-so-rare) (Karri Saarinen, 2025-05-27) — accessed 2026-11-08

### Vercel (primary)
- [Vercel Docs](https://vercel.com/docs) — accessed 2026-11-08
- [vercel.com/design](https://vercel.com/design) — accessed 2026-11-08 (publishes a strong *design-engineering / restraint* authoring doctrine for Vercel-authored surfaces; treat as official Vercel design guidance for agents, not a general product UI kit)

### Jobs-era product principles (publicly attributable)
- Fortune / CNN Money interview excerpts on focus (“saying no…”) — [money.cnn.com gallery](https://money.cnn.com/galleries/2008/fortune/0803/gallery.jobsqna.fortune/6.html); transcript mirror [allaboutstevejobs.com](https://allaboutstevejobs.com/verbatim/interviews/fortune_2008) — accessed 2026-11-08
- WWDC 1997 Q&A on focus / saying no — video [YouTube clip](https://www.youtube.com/watch?v=H8eP99neOVs); transcript [sebastiaanvanderlans.com](https://sebastiaanvanderlans.com/steve-jobs-wwdc-1997/); TechCrunch summary [techcrunch.com](https://techcrunch.com/2011/10/06/jobs-focus-is-about-saying-no/) — accessed 2026-11-08

### Prior art / catalogs
- [emilkowalski/skills](https://github.com/emilkowalski/skills) · [skills.sh listing](https://www.skills.sh/emilkowalski/skills) · [apple-design on skills.sh](https://www.skills.sh/emilkowalski/skills/apple-design)
- [aiforui.dev](https://aiforui.dev/)
- [anthropics/skills](https://github.com/anthropics/skills) · [frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- [craftwork design-taste-frontend](https://www.skills.sh/site/craftwork.design/taste-skill)

---

## 4. Current facts (with sources)

### Apple HIG — typography
- Typographic choices should support legibility, hierarchy, important content, and brand/style ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography.md)).
- Prefer platform default/minimum sizes (e.g. iOS/iPadOS default 17 pt, minimum 11 pt; macOS default 13 pt, minimum 10 pt) ([same](https://developer.apple.com/design/human-interface-guidelines/typography.md)).
- Convey hierarchy via weight, size, and color; keep relative hierarchy when text sizes change; minimize number of typefaces ([same](https://developer.apple.com/design/human-interface-guidelines/typography.md)).
- Prefer Regular–Bold weights over Ultralight/Thin/Light for legibility ([same](https://developer.apple.com/design/human-interface-guidelines/typography.md)).
- System text styles + Dynamic Type (where available) scale hierarchy and accessibility sizes; layouts must adapt without losing hierarchy ([same](https://developer.apple.com/design/human-interface-guidelines/typography.md)).

### Apple HIG — color
- Use color for communication, brand continuity, status/feedback—not decoration alone ([HIG Color](https://developer.apple.com/design/human-interface-guidelines/color.md)).
- Don’t use the same color for conflicting meanings; don’t rely on color alone for essential information ([same](https://developer.apple.com/design/human-interface-guidelines/color.md)).
- Support light, dark, and increased-contrast; prefer system/semantic colors; custom colors need variants ([same](https://developer.apple.com/design/human-interface-guidelines/color.md)).
- Liquid Glass: default material takes color from content behind; apply color sparingly—often to a primary action background, not many controls; prefer monochrome chrome over busy content ([same](https://developer.apple.com/design/human-interface-guidelines/color.md)).
- Prefer semantic dynamic colors (label / secondaryLabel / backgrounds) and don’t redefine their meanings ([same](https://developer.apple.com/design/human-interface-guidelines/color.md)).

### Apple HIG — layout
- Order by importance in reading order; align for scannability; indent for subordination; group related items ([HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout.md)).
- Use progressive disclosure so too many choices don’t bury the task ([same](https://developer.apple.com/design/human-interface-guidelines/layout.md)).
- Differentiate controls from content (e.g. Liquid Glass / scroll edge effects rather than opaque bars glued over content) ([same](https://developer.apple.com/design/human-interface-guidelines/layout.md)).
- Adapt via size classes / safe areas / Dynamic Type—not hard-coded device idioms alone ([same](https://developer.apple.com/design/human-interface-guidelines/layout.md)).
- Official templates/fonts/symbols live in [Apple Design Resources](https://developer.apple.com/design/resources/) (SF family, SF Symbols, platform UI kits).

### Apple HIG — motion
- Motion should support the experience, not overshadow it; don’t add motion for its own sake ([HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md)).
- Motion must be optional / not the only channel for important information ([same](https://developer.apple.com/design/human-interface-guidelines/motion.md)).
- Feedback motion should follow gesture expectations; keep feedback brief/precise; avoid decorating frequent interactions; let people cancel/interrupt rather than wait ([same](https://developer.apple.com/design/human-interface-guidelines/motion.md)).
- visionOS adds comfort rules (peripheral motion, large moving objects, fades for relocation, avoid sustained ~0.2 Hz oscillation) ([same](https://developer.apple.com/design/human-interface-guidelines/motion.md)).

### WWDC18 Designing Fluid Interfaces (philosophy behind many “Apple feel” skills)
- Goal: interface as extension of mind/body—align to how people think and move ([WWDC18 803](https://developer.apple.com/videos/play/wwdc2018/803/)).
- Core themes from the session: kill latency; allow constant redirection/interruption; spatial consistency (symmetric enter/exit paths); hint toward the gesture; lightweight input with amplified output; soft boundaries (rubberbanding); prefer continuous dynamic behavior over prescribed timed animations; 1:1 tracking; continuous feedback; detect competing gestures in parallel ([same](https://developer.apple.com/videos/play/wwdc2018/803/)).

### Linear craft philosophy
- **Output ≠ design:** hard part is understanding the problem / fit to context; AI can generate polished form without fit ([Output isn’t design](https://linear.app/now/output-isn-t-design)).
- **Design > code medium:** design problem first; conceptual form before execution; don’t let execution tools erase consideration ([Design is more than code](https://linear.app/now/design-is-more-than-code)).
- **Calm product UI:** products contort feature-by-feature; prune edges; “don’t compete for attention you haven’t earned”; “structure should be felt not seen” (soften/remove noisy separators); preserve density without overwhelm ([A calmer interface…](https://linear.app/now/behind-the-latest-design-refresh)).
- **Quality as craft/business:** craft is deliberate attention; quality is a choice; seek “quality without a name”; small teams, judgment over metrics theater, don’t ship half-baked MVPs to customers ([Why is quality so rare?](https://linear.app/now/why-is-quality-so-rare)).
- Learn/docs surfaces are product-usage oriented (workflows, triage, planning)—useful for “purpose-built product” context, not visual doctrine ([learn](https://linear.app/learn), [docs](https://linear.app/docs)).

### Vercel design engineering bar
- Platform docs emphasize shipping agents/apps with clarity and tooling ([vercel.com/docs](https://vercel.com/docs)).
- `vercel.com/design` encodes an explicit design-engineering doctrine for Vercel-authored surfaces: precise, calm, direct, evidence-led, restrained; start from the reader’s job; hierarchy before surfaces; monochrome by default; color only for meaning; earn borders/cards; default to stillness; reject generated-design reflexes (gradient/glow/card-grid heroes, equal-weight blocks, decorative motion) ([vercel.com/design](https://vercel.com/design)).
- Note for skill authors: that page is tightly coupled to Vercel brand/report primitives; extract *principles* (restraint, evidence, stillness, anti-slop), not the VBG CSS API.

### Jobs-era product principles (publicly attributable — do not invent quotes)
- Focus means saying no to many good ideas, not merely saying yes to one; proud of things *not* done (e.g. declining PDA pressure to protect iPod resources) — Fortune 2008 interview ([CNN Money](https://money.cnn.com/galleries/2008/fortune/0803/gallery.jobsqna.fortune/6.html), [transcript mirror](https://allaboutstevejobs.com/verbatim/interviews/fortune_2008)).
- WWDC 1997: focusing is about saying no; result should be products where the whole is greater than the sum of parts ([transcript](https://sebastiaanvanderlans.com/steve-jobs-wwdc-1997/), [TechCrunch summary](https://techcrunch.com/2011/10/06/jobs-focus-is-about-saying-no/)).

---

## 5. Common agent mistakes this skill must prevent

1. **Shipping generated form without product fit** — polished UI for an unclear or wrong problem; “the form is there; the fit is not” ([Output isn’t design](https://linear.app/now/output-isn-t-design)).
2. **Feature accretion / equal visual weight for everything** — every control loud; nav competing with content; separators proliferating ([A calmer interface…](https://linear.app/now/behind-the-latest-design-refresh); [HIG Layout progressive disclosure](https://developer.apple.com/design/human-interface-guidelines/layout.md)).
3. **Fake urgency and dark-pattern density** — manufactured deadlines, badges everywhere, celebration noise; contradicts calm/restraint doctrines ([vercel.com/design](https://vercel.com/design) on not manufacturing confidence; Linear calm principles).
4. **AI-slop aesthetics as defaults** — purple/indigo gradients, Inter-everywhere, identical card grids, cream+serif+terracotta cluster, broadsheet hairlines, glow/glass decoration, tracked ALL-CAPS eyebrows ([vercel.com/design](https://vercel.com/design) hard-rejects many of these reflexes; [aiforui.dev](https://aiforui.dev/) describes template spacing/motion as recognizable AI UI—use as problem statement only).
5. **Decorative motion / non-interruptible animation** — scroll-reveal every section, bounce on frequent controls, gating content behind animation, ignoring Reduce Motion ([HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md); WWDC18 interruptibility ([803](https://developer.apple.com/videos/play/wwdc2018/803/))).
6. **Timed animation mindset instead of continuous behavior** — ease-in enters, non-cancelable transitions, ignoring current velocity ([WWDC18 803](https://developer.apple.com/videos/play/wwdc2018/803/); contrast with HIG “let people cancel motion”).
7. **Hierarchy via boxes instead of type/space** — nested cards, borders repairing weak hierarchy, color-as-hierarchy without semantic meaning ([vercel.com/design](https://vercel.com/design); [HIG Color](https://developer.apple.com/design/human-interface-guidelines/color.md)).
8. **Illegible / non-adaptive type** — thin weights, too many faces, no Dynamic Type / reflow, hierarchy collapsing at large sizes ([HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography.md)).
9. **Skipping empty / loading / error as first-class surfaces** — dead ends without next action (widely observed agent behavior).
10. **Confusing “Apple-like” with spring demos only** — shipping fluid sheets while product remains cluttered; or applying Liquid Glass to content cards incorrectly ([HIG Color Liquid Glass](https://developer.apple.com/design/human-interface-guidelines/color.md); gap vs Emil apple-design’s web-springs focus).
11. **Saying yes to every stakeholder request** — unfocused product that is less than the sum of parts ([Jobs WWDC97](https://sebastiaanvanderlans.com/steve-jobs-wwdc-1997/); [Design is more than code](https://linear.app/now/design-is-more-than-code) on problem alignment).
12. **Treating craft as CSS polish after the fact** — interaction inseparable from visuals; prototype behavior, don’t decorate static mocks late ([WWDC18 803](https://developer.apple.com/videos/play/wwdc2018/803/); Linear quality essay).

---

## 6. Gaps this skill fills vs prior art

| Gap | Prior art status | craft-and-taste fill |
|---|---|---|
| Product necessity / saying no | Weak outside Jobs quotes & Linear essays; almost absent in apple-design / frontend-design | First-class branch: reduce, focus, remove clutter/fake urgency |
| Calm dense *product* UI | Linear essays strong; craftwork taste skill excludes product UIs | Encode calm hierarchy for apps, not just landings |
| Cross-source doctrine | Emil = Apple WWDC→web; Anthropic = visual distinctiveness; Vercel page = brand reports | One skill bridging Apple HIG + Linear craft + Vercel restraint + Jobs focus |
| Stack-agnostic build patterns | Many skills are web-CSS or SwiftUI-only | Incorrect/correct patterns with platform pointers; leave deep Swift to `swift` |
| Motion *judgment* without spring cookbook | Emil apple-design / animate skills go deep on springs | High-level when/why/interruptibility; link out, don’t duplicate |
| Original open content | aiforui paid skills encode similar “taste” commercially | Public-source synthesis under monterey-tech-lab MIT; no proprietary copy |
| Repo coverage | Only `swift` published | New product-facing skill for web+native craft reviews |

Distinct from **emilkowalski/apple-design**: that skill’s center of gravity is fluid, physical, interruptible *web* motion from WWDC18. Ours centers on **product craft and taste**—whether the product and UI feel intentional, calm, and effective—using Apple/Linear/Vercel/Jobs as doctrine, with motion as one branch among five.

---

## 7. Explicit recommendation

### **build**

**Justification:** No existing open skill simultaneously covers (1) product necessity / focus, (2) calm product UI craft, (3) purposeful motion judgment, (4) composition, and (5) stack-agnostic build guidance while citing Apple HIG + Linear craft essays + Vercel design-engineering restraint + publicly attributable Jobs focus principles. Emil’s `apple-design` is adjacent but not sufficient (fluid-web springs, not product craft). Anthropic `frontend-design` fights visual slop but not product necessity. Craftwork taste skill explicitly excludes multi-step product UI. Paid aiforui skills must not be copied. Extending `swift` would wrongly narrow a cross-platform craft skill into SwiftUI rules. Skipping would leave monterey-tech-lab/skills without a product-craft skill despite a clear, differentiated need.

**Not extend:** `swift` stays implementation rules for Swift.
**Not skip:** Differentiation from apple-design is clear if scope discipline holds.

---

## 8. Suggested outline (simple skill: `SKILL.md` + `references/`)

```text
skills/craft-and-taste/
  SKILL.md
  references/
    product-necessity.md
    ui-craft-checklist.md
    motion-and-interaction.md
    layout-and-composition.md
    build-defaults.md
    sources.md
```

### Content policy reminder for implementers
- **Do not** paste Emil Kowalski skill bodies, aiforui course skills, or Anthropic skill text.
- **Do** cite Apple/Linear/Vercel/Jobs primary URLs.
- **Do** keep motion section principle-level so the skill remains distinct from `apple-design`.

---

## Decision

**build** `craft-and-taste` as an original, publicly sourced, simple skill—differentiated from Emil’s apple-design by centering product craft, necessity, and calm taste across Apple/Linear/Vercel/Jobs, not fluid-web springs alone.

---

## Baseline failures

Recorded from `evals/craft-and-taste/runs/2026-11-08-baseline/` (no skill).

### Eval 1 — product-necessity-feature-request
Baseline largely refused chat/social/confetti/ubiquitous countdown badges and proposed a calm home. Gaps vs a craft skill: no explicit operating loop (necessity → hierarchy → craft); weak linkage to “saying no” / form–context fit as named doctrine; treated as one-off product advice rather than reusable craft judgment.

**Skill must teach:** Necessity-first gate before UI; refuse fake urgency and celebration chrome by default; one-job home surfaces; “saying no” as product craft.

### Eval 2 — ui-craft-review-settings
Baseline correctly flagged gradient, Inter, nested cards, ultralight labels, badge spam, missing empty state, and equal primary CTAs. Gaps: no fixed review order with completion criteria; little on semantic color / platform type systems; risk of inconsistent depth next time.

**Skill must teach:** Ordered UI craft checklist; hierarchy via type/space not boxes; action hierarchy; empty/loading/error as first-class; hard-reject AI-slop tells.

### Eval 3 — motion-judgment-dashboard
Baseline deleted bounce/sparkle/intro and required interruptible short motion + reduced motion. Gaps: no WWDC/HIG-framed principles (optional channel, continuous vs timed); could still invent duration cookbooks without “when not to animate.”

**Skill must teach:** Motion supports experience only; never gate content; interruptible; reduced motion; delete decorative/frequent motion.

### Eval 4 — edge-delight-everywhere (**critical**)
Baseline **accepted the premise** and produced a full micro-interaction system including idle mascot ambient loops, page transitions everywhere, and “one hero moment per screen” still framed as adding delight via motion. Failed to redefine “premium like Apple/Linear” as calm craft and restraint.

**Skill must teach:** Challenge delight-everywhere; allowlist sparse purposeful feedback; forbid idle/mascot decoration; premium = hierarchy, stillness, states—not animation quantity.

### Eval 5 — wrong-premise-more-features (**critical**)
Baseline **accepted the wrong premise** and shipped ten equally visible, rainbow-accent toolbar buttons with an HTML mock. No progressive disclosure, no primary action, no “saying no.”

**Skill must teach:** Reject equal-visibility / equal-accent dumps; progressive disclosure; one primary action; listening ≠ showing every option.
