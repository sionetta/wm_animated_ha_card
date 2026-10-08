# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **`image_tap_action`** — choose what tapping the appliance illustration does,
  with Home Assistant's standard card actions: open another dashboard
  (`navigate`), a web page (`url`), a more-info dialog, or run an action. Handy for
  jumping to an appliance's own dashboard or to the WashData panel. Configurable in
  the visual editor with Home Assistant's own action picker. Not set by default,
  so existing cards behave exactly as before. Requested by
  [@Aaroneisele55](https://github.com/Aaroneisele55) (#26).
- **`standby_threshold`** — a new **standby** state for appliances that are left
  on after the cycle. With a `power_entity`, when no cycle is running but the
  appliance still draws more than this many watts, the card shows *Standby*
  instead of *Off* (and keeps the status panel visible even with
  `hide_status_panel`). Opt-in: not set by default, so plugs that report a little
  noise with the appliance off keep showing *Off*. Translated into all six
  languages and available in the visual editor. Based on a patch by
  [@entdgc](https://github.com/entdgc) (#29).

## [1.4.0] — 2026-10-03

### Added
- **Dutch** — the card's fifth UI language, covering every label and all five
  appliance types, plus Dutch entries in `running_states` and a full
  [`README_NL.md`](README_NL.md). Contributed by
  [@RienduPre](https://github.com/RienduPre) (#7, #21).
- **`media/demo_nl.gif`** and **`media/themes_nl.jpg`**, so the Dutch README
  shows the card in Dutch rather than borrowing the English screenshots.
- **Portuguese** — the sixth UI language, covering every label and all five
  appliance types, plus Portuguese entries in `running_states`. A `pt-BR`
  Home Assistant profile gets Brazilian date formatting, a `pt-PT` one European.
  Based on the translation by [@Pmoshbr](https://github.com/Pmoshbr) (#18), with
  the strings added since then filled in and the idle label made gender-neutral
  ("EM ESPERA" instead of "OCIOSA"), since the same badge is shown for
  *o forno* and *o micro-ondas*. `media/demo_pt.gif` shows it.
- **A paused cycle now says so.** With a `power_entity` configured the card
  distinguishes three states instead of two: *running* (a cycle is under way and
  the appliance is drawing power), *paused* (the cycle is under way but power has
  dropped below `power_threshold` — a soak or a drain) and *off*. Previously a
  soak was still reported as running. New `badge_paused` / `state_paused` /
  `ring_paused` strings in all five languages; the elapsed-time ring keeps
  counting through a pause, because the cycle has not ended.
  Thanks to [@KroFR](https://github.com/KroFR) (#19).
- **`show_raw_status`** — for a smart appliance, shows the state exactly as the
  integration reports it ("Spin", "Rinse", "Finished") instead of the card's
  translated label. Ignored for a `binary_sensor` or `input_boolean` status
  entity, where the raw value would only ever be "on" or "off", and hidden in
  the visual editor for them. Thanks to [@KroFR](https://github.com/KroFR) (#23).
- **Numbers follow the Home Assistant number format.** `_fmtNum()` now reads
  `hass.locale.number_format` — `comma_decimal`, `decimal_comma`, `space_comma`,
  `none` and `system` — instead of a decimal separator hardcoded per language,
  and applies a thousands separator. English now reads `1,234.5` where it read
  `1234.5`. Thanks to [@KroFR](https://github.com/KroFR) (#19).
- **`running_states` is editable from the visual editor** and each language now
  carries its own keyword list, which is what the card falls back to. When you
  switch the card's language, a custom list is migrated to the new language's
  defaults while keeping the keywords you added yourself; the editor remembers
  which language a list was saved in across page reloads, in the browser's local
  storage. Thanks to [@KroFR](https://github.com/KroFR) (#19, #23).

### Changed
- **`power_entity` is no longer an independent "running" detector.** It used to
  be able to report a cycle on its own, even while `status_entity` said nothing
  was happening. It now refines what `status_entity` reports rather than
  overriding it: the status entity decides whether a cycle is under way, and the
  power sensor decides whether that cycle is running or paused. The option's
  description has been reworded in all five READMEs.
  Thanks to [@KroFR](https://github.com/KroFR) (#19).
- **French: `badge_idle` was "EN PAUSE"**, which now belongs to the paused state.
  Idle became "EN VEILLE" so the two states no longer read identically.
- **Tapping the elapsed-time ring no longer opens anything.** It used to open the
  more-info dialog of `last_wash_entity` — an `input_datetime`, whose dialog is an
  editable date and time picker, so one stray tap on the largest element of the
  card could change the recorded cycle start. The start time is still one tap
  away in the START column. Thanks to [@KroFR](https://github.com/KroFR) (#25).
- The READMEs no longer claim the card is "responsive via CSS container
  queries". That stopped being true when the container queries were replaced by a
  `ResizeObserver` (#14); the wording now just describes the behaviour.

### Fixed
- **A stray divider appeared in the "Last cycle" panel** whenever its first
  column was hidden — for example without a `last_wash_entity`, which is common
  for smart appliances. The divider used to be removed only from the first
  column in the markup; now it is removed from the first *visible* one.
  Thanks to [@KroFR](https://github.com/KroFR) (#25).
- **Custom `running_states` were case-sensitive.** The entity state is lowercased
  before it is compared, so an entry written with a capital letter — `"Spin"`,
  `"Lavagem"` — could never match, and nothing said so. Matching is now
  case-insensitive. Thanks to [@KroFR](https://github.com/KroFR) (#23).
- **The ring label could lose its last pixel column** in the longest
  translations. `.ring-label` was capped at `58px`; Dutch "VERSTREKEN" measures
  59px. The cap is now `64px`, which clears every current label with room to
  spare and changes nothing for the others.
- **`drogen` was missing from `running_states`**, so a Dutch integration
  reporting that state was not detected as running even though the card has a
  dryer type. `spoelen` was also listed twice.
- **`séchage` was missing from the French `running_states`** — the same gap,
  present since French was added. The unaccented `sechage` is there too.
- **`duration_format: hhmm` rendered "1h05 min"** — the value already carries its
  own units, so the separate unit is now empty for that format.
- **The German README described `duration_format` in Dutch.** It slipped in with
  the 1.3.0 documentation and shipped that way; it is German now.

## [1.3.0] — 2026-09-12

### Added
- **Native Home Assistant theme** — the new `theme: ha` drops the card's own
  palette and paints it with the colours of whichever Home Assistant theme is
  active, so the card blends into a custom theme instead of sitting on top of
  it. `auto`, `light` and `dark` keep the card's own look as before.
  Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **`duration_format`** — with `hhmm`, a last-cycle duration of 60 minutes or
  more is shown as `1h05` instead of `65 min`. Defaults to `minutes`, so
  existing dashboards are unchanged.
  Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **`confirm_plug_off`** — a confirmation prompt before the plug button turns
  the socket **off**, so a mistap can no longer cut a running cycle. Turning the
  plug on is never gated. Defaults to `true`; set it to `false` for the old
  behaviour. Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **Three appliance states instead of two.** When a `power_entity` is
  configured the card now distinguishes *off* (below 1 W), *idle* (above 1 W but
  below `power_threshold`) and *running*. Without a power sensor it stays on
  *idle*, because there is no way to tell an unplugged appliance from a waiting
  one. Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **Visual editor improvements** — a live preview while you configure the card,
  a card name that follows the selected appliance type, and a link to the
  documentation. Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **The installation instructions now cover the entities, not just the card.**
  Installation is split into step 1 (the card file and the dashboard resource)
  and step 2 (the entities), with a walkthrough of the example package for an
  appliance on a smart plug and a table of what it creates. This also documents
  `input_number.el_tarif`, which no README had ever mentioned: it defaults to
  zero, so the cost column silently stayed at `0.00` for anyone who copied the
  package without setting a tariff.

### Changed
- **Dates and times now follow Home Assistant.** The card previously formatted
  them with a locale hardcoded per UI language (`en-GB`, `ru-RU`, …) and never
  looked at your Home Assistant settings. It now takes the locale from
  `hass.locale.language` and honours `hass.locale.time_format`, so a 12/24-hour
  preference is finally respected and a profile set to a regional variant gets
  that region's format — `en-GB` shows `5 Sept, 09:55`, `pt-BR` shows
  `5 de set., 09:55`. Note for English users: a profile set to plain `en` with
  the default time format now shows `Sep 5, 09:55 AM`, matching the rest of the
  Home Assistant interface. Set the Home Assistant time format to 24 hours to
  get `09:55` back. Thanks to [@KroFR](https://github.com/KroFR) (#17).
- **`language: auto`** is now an explicit value rather than an implicit default,
  and is what the visual editor selects for a new card.

### Fixed
- **An appliance with no `power_entity` reported "Off".** The new three-state
  logic defaulted to *off* whenever it could not read power, which is
  misleading: without a power sensor the card cannot tell an unplugged
  appliance from an idle one. It now falls back to *idle*.
  Found in review, fixed by [@KroFR](https://github.com/KroFR) (#17).
- **English showed 12-hour time regardless of the Home Assistant setting.**
  The time format was inferred from the UI language instead of being read from
  `hass.locale.time_format`. Found in review, fixed by
  [@KroFR](https://github.com/KroFR) (#17).

## [1.2.1] — 2026-09-02

### Fixed
- **Cycle duration was displayed incorrectly when it ended in a zero** — a
  30-minute cycle showed as `3 min`, 60 as `6 min`, 100 as `1 min`, and a zero
  duration rendered as an empty string. The trailing-zero trimming in
  `_fmtNum()` used an optional decimal point, so on whole numbers it stripped
  the number's own zeros. Trimming now runs only when there is a fractional
  part, leaving energy and cost formatting untouched.
  Reported and fixed by [@KroFR](https://github.com/KroFR) (#9, #16).

### Added
- **`hide_status_panel`** — when `true`, the status panel (elapsed-time ring and
  power gauge) is hidden while the appliance is idle and reappears as soon as a
  cycle starts. Useful for keeping idle appliances compact on a dashboard.
  Documented in all four languages. Thanks to
  [@KroFR](https://github.com/KroFR) (#16).

### Changed
- **Visual editor reorganized** — the flat fourteen-field form is now grouped
  into collapsible sections (Appliance, Power monitoring, Controls &
  notifications, Last cycle, Appearance), and the language and theme selectors
  show readable labels ("English", "Русский", "Auto (follow Home Assistant)")
  instead of raw codes. Thanks to [@KroFR](https://github.com/KroFR) (#16).

## [1.2.0] — 2026-08-24

### Added
- **Five appliance types** in one card via `appliance_type`: `washer`, `dryer`
  (alias `tumbler`), `dishwasher`, `oven` and `microwave` — each with its own
  SVG illustration, header icon, running animation and localized labels.
  Thanks to [@cr0co](https://github.com/cr0co) (#8).
- **Light and dark themes.** The card follows the Home Assistant theme
  automatically; `theme: auto | light | dark` pins it if you prefer.
- **Visual editor support** — `getConfigForm()` and `getStubConfig()`, so the
  card can be configured from the UI without writing YAML. Thanks to
  [@cr0co](https://github.com/cr0co) (#8).
- **French translation** of the interface. Thanks to
  [@tonyontheroad](https://github.com/tonyontheroad) (#3).
- `README_FR.md`, plus a demo GIF and a light/dark screenshot for every one of
  the four languages.

### Fixed
- SVG gradient IDs are now unique per card instance — two cards on the same
  dashboard no longer share (and corrupt) each other's gradients.
- Language detection matches the full tag first (`pt-br`), then the base
  language (`pt`), so adding a translation needs nothing but a new entry in
  `STRINGS`.

### Changed
- The project is now an **appliance** card rather than a washing-machine card:
  READMEs in all four languages were rewritten accordingly.
- Documentation for smart appliances that report their own state (Home Connect,
  Miele@home, LG ThinQ, SmartHQ) — see `examples/smart_appliance.yaml`.

## [1.1.0] — 2026-08-23

### Added
- **German translation** of the interface and `README_DE.md`. Thanks to
  [@its-me-prash](https://github.com/its-me-prash) (#1, #2).
- Language switcher in every README.

## [1.0.0] — 2026-08-22

First public release: an Oikos-style animated washing machine card for a dumb
machine on a smart plug — animated drum, live status with an elapsed-time ring,
power gauge, last-cycle stats (start / duration / energy / cost), English and
Russian interface, HACS support, MIT license.
