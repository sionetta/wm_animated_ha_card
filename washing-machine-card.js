/**
 * Washing Machine Animated Card for Home Assistant
 * ================================================
 * An Oikos-style Lovelace card for a "dumb" appliance on a smart plug:
 * animated illustration (washer / dryer / dishwasher / oven / microwave), live status,
 * power gauge and last-cycle stats.
 *
 * https://github.com/sionetta/wm_animated_ha_card
 * License: MIT
 * Version: 1.4.0
 *
 * UI languages: en, ru, de, fr (auto-detected from Home Assistant, or set `language:`).
 * Appliances: washer, dryer, dishwasher, oven, microwave (`appliance_type:`).
 * Theme: follows the Home Assistant theme automatically (`theme: auto | light | dark`),
 * or `theme: ha` to adopt the colours of your active Home Assistant theme.
 *
 * Install:
 *   1. Copy to /config/www/washing-machine-card.js
 *   2. Add a dashboard resource:
 *        url: /local/washing-machine-card.js?v=5
 *        type: module
 *   3. Add the card — full example at the bottom of this file.
 *
 * Every entity option except status_entity is optional — blocks without
 * an entity are simply hidden.
 */

class WashingMachineCard extends HTMLElement {
    static APPLIANCE_TYPES = ["washer", "dryer", "dishwasher", "oven", "microwave"];

    static STRINGS = {
        en: {
            name: "Washing machine",
            badge_running: "RUNNING", badge_idle: "IDLE", badge_paused: "PAUSED", badge_off: "OFF", badge_nodata: "NO DATA",
            state_running: "Washing", state_idle: "Idle", state_paused: "Paused", state_off: "Off", state_nodata: "No data",
            ring_running: "ELAPSED", ring_idle: "IDLE", ring_paused: "PAUSED", ring_off: "OFF",
            power: "Current power", current: "Current draw",
            last_cycle: "LAST CYCLE", start: "START", duration: "DURATION",
            energy: "ENERGY", cost: "COST",
            min: "min", kwh: "kWh", kw: "kW",
            today: "Today", yesterday: "Yesterday",
            tip_notify: "Finish notification", tip_plug: "Machine plug", tip_history: "History",
            confirm_plug_off: "Turn off the plug? This may interrupt the current cycle.",
            types: {
                washer: { name: "Washing machine", state_running: "Washing" },
                dryer: { name: "Dryer", state_running: "Drying" },
                dishwasher: { name: "Dishwasher", state_running: "Washing dishes" },
                oven: { name: "Oven", state_running: "Baking" },
                microwave: { name: "Microwave", state_running: "Heating" },
            },
            running_states: [
                "washing", "running", "run", "wash", "spin", "rinse", "drying", "dry", "tumble",
                "baking", "bake", "cooking", "cook", "heating", "heat", "microwave", "oven",
            ],
        },
        ru: {
            name: "Стиральная машина",
            badge_running: "В РАБОТЕ", badge_idle: "ОЖИДАНИЕ", badge_paused: "ПАУЗА", badge_off: "ВЫКЛ", badge_nodata: "НЕТ ДАННЫХ",
            state_running: "Идёт стирка", state_idle: "Ожидание", state_paused: "Пауза", state_off: "Выключено", state_nodata: "Нет данных",
            ring_running: "ПРОШЛО", ring_idle: "ОЖИДАНИЕ", ring_paused: "ПАУЗА", ring_off: "ВЫКЛ",
            power: "Текущая мощность", current: "Текущий ток",
            last_cycle: "ПОСЛЕДНИЙ ЦИКЛ", start: "СТАРТ", duration: "ДЛИТЕЛЬН.",
            energy: "РАСХОД", cost: "СТОИМОСТЬ",
            min: "мин", kwh: "кВт·ч", kw: "кВт",
            today: "Сегодня", yesterday: "Вчера",
            tip_notify: "Уведомление об окончании", tip_plug: "Розетка машины", tip_history: "История",
            confirm_plug_off: "Выключить розетку? Это может прервать текущий цикл.",
            types: {
                washer: { name: "Стиральная машина", state_running: "Идёт стирка" },
                dryer: { name: "Сушилка", state_running: "Сушка" },
                dishwasher: { name: "Посудомойка", state_running: "Моет посуду" },
                oven: { name: "Духовка", state_running: "Выпечка" },
                microwave: { name: "Микроволновка", state_running: "Разогрев" },
            },
            running_states: [
                "стирка", "отжим", "полоскание",
            ],
        },
        de: {
            name: "Waschmaschine",
            badge_running: "LÄUFT", badge_idle: "BEREIT", badge_paused: "PAUSE", badge_off: "AUS", badge_nodata: "KEINE DATEN",
            state_running: "Läuft", state_idle: "Bereit", state_paused: "Pause", state_off: "Aus", state_nodata: "Keine Daten",
            ring_running: "VERGANGEN", ring_idle: "BEREIT", ring_paused: "PAUSE", ring_off: "AUS",
            power: "Aktuelle Leistung", current: "Stromaufnahme",
            last_cycle: "LETZTER DURCHGANG", start: "START", duration: "DAUER",
            energy: "VERBRAUCH", cost: "KOSTEN",
            min: "Min", kwh: "kWh", kw: "kW",
            today: "Heute", yesterday: "Gestern",
            tip_notify: "Benachrichtigung bei Ende", tip_plug: "Steckdose der Maschine", tip_history: "Verlauf",
            confirm_plug_off: "Steckdose ausschalten? Der laufende Durchgang könnte dadurch unterbrochen werden.",
            types: {
                washer: { name: "Waschmaschine", state_running: "Wäsche läuft" },
                dryer: { name: "Tumbler", state_running: "Trocknet" },
                dishwasher: { name: "Geschirrspüler", state_running: "Spült" },
                oven: { name: "Backofen", state_running: "Backt" },
                microwave: { name: "Mikrowelle", state_running: "Erwärmt" },
            },
            running_states: [
                "waschen", "läuft", "schleudern", "spülen", "trocknen",
                "backen", "heizen", "erwärmen",
            ],
        },
        fr: {
            name: "Lave-linge", badge_running: "EN MARCHE", badge_idle: "EN VEILLE", badge_paused: "EN PAUSE", badge_off: "ÉTEINT", badge_nodata: "PAS DE DONNÉES",
            state_running: "Lavage en cours", state_idle: "En veille", state_paused: "En pause", state_off: "Éteint", state_nodata: "Pas de données",
            ring_running: "ÉCOULÉ", ring_idle: "VEILLE", ring_paused: "PAUSE", ring_off: "ÉTEINT",
            power: "Puissance actuelle", current: "Courant instantané",
            last_cycle: "DERNIER CYCLE", start: "DÉPART", duration: "DURÉE",
            energy: "ÉNERGIE", cost: "COÛT",
            min: "min", kwh: "kWh", kw: "kW",
            today: "Aujourd'hui", yesterday: "Hier",
            tip_notify: "Notification de fin", tip_plug: "Prise machine", tip_history: "Historique",
            confirm_plug_off: "Éteindre la prise ? Cela peut interrompre le cycle en cours.",
            types: {
                washer: { name: "Lave-linge", state_running: "Lavage en cours" },
                dryer: { name: "Sèche-linge", state_running: "Séchage en cours" },
                dishwasher: { name: "Lave-vaisselle", state_running: "Lavage en cours" },
                oven: { name: "Four", state_running: "Cuisson en cours" },
                microwave: { name: "Micro-ondes", state_running: "Réchauffage en cours" },
            },
            running_states: [
                "lavage", "en cours", "essorage", "rincage", "rinçage",
                "cuisson", "chauffage", "réchauffage", "rechauffage", "séchage", "sechage",
            ],
        },
        nl: {
            name: "Wasmachine",
            badge_running: "BEZIG", badge_idle: "INACTIEF", badge_paused: "GEPAUZEERD", badge_off: "UIT", badge_nodata: "GEEN DATA",
            state_running: "Wast", state_idle: "Inactief", state_paused: "Gepauzeerd", state_off: "Uit", state_nodata: "Geen data",
            ring_running: "VERSTREKEN", ring_idle: "INACTIEF", ring_paused: "GEPAUZEERD", ring_off: "UIT",
            power: "Huidig vermogen", current: "Huidig verbruik",
            last_cycle: "LAATSTE CYCLUS", start: "START", duration: "DUUR",
            energy: "ENERGIE", cost: "KOSTEN",
            min: "min", kwh: "kWh", kw: "kW",
            today: "Vandaag", yesterday: "Gisteren",
            tip_notify: "Melding bij voltooiing", tip_plug: "Stekker apparaat", tip_history: "Geschiedenis",
            confirm_plug_off: "Stekker uitschakelen? Dit kan de huidige cyclus onderbreken.",
            types: {
                washer: { name: "Wasmachine", state_running: "Wast" },
                dryer: { name: "Droger", state_running: "Droogt" },
                dishwasher: { name: "Vaatwasser", state_running: "Wast af" },
                oven: { name: "Oven", state_running: "Bakt" },
                microwave: { name: "Magnetron", state_running: "Verwarmt" },
            },
            running_states: [
                "wassen", "bezig", "centrifugeren", "spoelen", "drogen",
                "bakken", "verwarmen",
            ],
        },
    };

    static DEFAULTS = {
        appliance_type: "washer",
        language: "auto",
        theme: "auto",
        currency: "€",
        power_threshold: 10,
        power_max: 2500,
        hide_status_panel: false,
        show_raw_status: false,
        confirm_plug_off: true,
        duration_format: "minutes",
    };

    static get DEFAULT_RUNNING_STATES() {
        return Object.values(WashingMachineCard.STRINGS).flatMap(
            (lang) => lang.running_states || []);
    }

    static normalizeType(value) {
        const raw = String(value || "washer").toLowerCase().trim();
        if (raw === "tumbler" || raw === "tumble_dryer" || raw === "tumble-dryer")
            return "dryer";
        if (raw === "washing_machine" || raw === "washing-machine")
            return "washer";
        if (raw === "backofen" || raw === "bakeoven" || raw === "bake-oven")
            return "oven";
        if (raw === "mikrowelle" || raw === "micro-wave" || raw === "micro_wave")
            return "microwave";
        if (WashingMachineCard.APPLIANCE_TYPES.includes(raw))
            return raw;
        return "washer";
    }

    static detectLanguage(hass) {
        const S = WashingMachineCard.STRINGS;
        const haLang = String(hass?.locale?.language || hass?.language || "en").toLowerCase();
        if (S[haLang])
            return haLang;
        const short = haLang.split(/[-_]/)[0];
        if (S[short])
            return short;
        return "en";
    }

    static isBooleanStatusEntity(entityId) {
        const domain = String(entityId || "").split(".")[0];
        return domain === "input_boolean" || domain === "binary_sensor";
    }

    static capitalize(value, locale) {
        const str = String(value ?? "");
        if (!str)
            return str;
        const [first, ...rest] = str;
        return first.toLocaleUpperCase(locale) + rest.join("");
    }

    static languageDisplayName(code) {
        try {
            const dn = new Intl.DisplayNames([code], {
                type: "language"
            });
            const name = dn.of(code);
            if (name)
                return WashingMachineCard.capitalize(name);
        } catch (e) {
            // Intl.DisplayNames unsupported, or code not recognized — fall through.
        }
        return code.toUpperCase();
    }

    setConfig(config) {
        if (!config.status_entity) {
            throw new Error("washing-machine-card: status_entity is required");
        }
        this._config = {
            ...WashingMachineCard.DEFAULTS,
            running_states: WashingMachineCard.DEFAULT_RUNNING_STATES,
            ...config,
            appliance_type: WashingMachineCard.normalizeType(config.appliance_type),
        };
        this._uid = `a${Math.random().toString(36).slice(2, 9)}`;
        this._built = false;
    }

    set hass(hass) {
        this._hass = hass;
        if (!this._built)
            this._build();
        this._update();
    }

    getCardSize() {
        return 6;
    }

    static getConfigElement() {
        return document.createElement("washing-machine-card-editor");
    }

    static getStubConfig() {
        return {
            status_entity: "binary_sensor.washing_in_progress",
        };
    }

    _observeWidth() {
        if (this._ro || typeof ResizeObserver === "undefined")
            return;
        this._ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect?.width;
            if (!w || !this._built)
                return;
            const wrap = this._el("wrap");
            if (!wrap)
                return;
            wrap.classList.toggle("narrow", w <= 430);
            wrap.classList.toggle("xnarrow", w <= 320);
        });
        this._ro.observe(this);
    }

    connectedCallback() {
        this._observeWidth();
        if (this._timer)
            clearInterval(this._timer);
        this._timer = setInterval(() => {
            if (this._hass && this._built && this._applianceState() !== "off")
                this._update();
        }, 30000);
    }

    disconnectedCallback() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (this._ro) {
            this._ro.disconnect();
            this._ro = null;
        }
    }

    get _applianceType() {
        return WashingMachineCard.normalizeType(this._config?.appliance_type);
    }

    get _t() {
        const S = WashingMachineCard.STRINGS;
        const cfg = this._config?.language;
        const isAuto = !cfg || cfg === WashingMachineCardEditor.AUTO_LANGUAGE;
        const lang = !isAuto && S[cfg] ? cfg : WashingMachineCard.detectLanguage(this._hass);
        const base = S[lang];
        const typeStrings = base.types?.[this._applianceType] || {};
        return {
            ...base,
            ...typeStrings,
            locale: this._hass?.locale?.language || lang
        };
    }

    _st(entityId) {
        return entityId ? this._hass.states[entityId] : undefined;
    }

    _cycleIsActive() {
        const c = this._config;
        const status = this._st(c.status_entity);
        const state = status ? String(status.state).toLowerCase() : "";
        const byStatus = !!status && c.running_states.some((k) => String(k).toLowerCase() === state);
        const byBinaryOn = state === "on";
        return byStatus || byBinaryOn;
    }

    _isRunning() {
        const c = this._config;
        const cycleIsActive = this._cycleIsActive();
        // Without a power sensor, the status entity is the only source of truth.
        if (!c.power_entity)
            return cycleIsActive;
        // With a power sensor, RUNNING requires an active cycle and power consumption above the configured threshold.
        const p = parseFloat(this._st(c.power_entity)?.state);
        return cycleIsActive && !isNaN(p) && p > c.power_threshold;
    }

    _applianceState() {
        const c = this._config;
        const cycleIsActive = this._cycleIsActive();
        if (!c.power_entity)
            return cycleIsActive ? "running" : "off";
        const p = parseFloat(this._st(c.power_entity)?.state);
        if (cycleIsActive)
            return !isNaN(p) && p > c.power_threshold ? "running" : "paused";
        return "off";
    }

    _parseDate(state) {
        if (!state || ["unknown", "unavailable", "none"].includes(String(state).toLowerCase()))
            return null;
        const d = new Date(String(state).replace(" ", "T"));
        return isNaN(d) ? null : d;
    }

    _hour12() {
      const tf = this._hass?.locale?.time_format; // "12" | "24" | "language" | "system"
      if (tf === "12") return true;
      if (tf === "24") return false;

      const testLocale = tf === "system" ? undefined : this._t.locale;

      return new Date(2023, 0, 1, 22, 0, 0)
        .toLocaleTimeString(testLocale)
        .includes("10");
    }

    _fmtDateTime(state) {
        const t = this._t;
        const d = this._parseDate(state);
        if (!d)
            return "—";
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        const yest = new Date(now);
        yest.setDate(now.getDate() - 1);
        const time = d.toLocaleTimeString(t.locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: this._hour12(),
        });
        if (sameDay)
            return `${t.today}, ${time}`;
        if (d.toDateString() === yest.toDateString())
            return `${t.yesterday}, ${time}`;
        return d.toLocaleDateString(t.locale, {
            day: "numeric",
            month: "short"
        }) + `, ${time}`;
    }

    _fmtClock(fromDate) {
        const s = Math.max(0, Math.floor((Date.now() - fromDate.getTime()) / 1000));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h}:${String(m).padStart(2, "0")}`;
    }

    static NUMBER_SEPARATORS = {
        comma_decimal: { group: ",", decimal: "." },
        decimal_comma: { group: ".", decimal: "," },
        space_comma: { group: " ", decimal: "," },
    };
    _fmtNum(value, digits = 2) {
        const n = parseFloat(value);
        if (isNaN(n))
            return null;
        // Trim trailing zeros (e.g. 2.50 -> 2.5, 2.00 -> 2), same as before.
        let trimmedDigits = '';
        if (digits > 0) {
            const stripped = n.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
            const dotIndex = stripped.indexOf(".");
            trimmedDigits = dotIndex === -1 ? 0 : stripped.length - dotIndex - 1;
        }
        const numberFormat = this._hass?.locale?.number_format;
        // "None": raw number, no thousands separator, dot as decimal point.
        if (numberFormat === "none")
            return n.toFixed(trimmedDigits);
        // "System": defer entirely to the browser/OS locale.
        if (numberFormat === "system") {
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: trimmedDigits,
                maximumFractionDigits: trimmedDigits,
            }).format(n);
        }
        // comma_decimal / decimal_comma / space_comma: build the string from the separators the option name itself describes.
        const separators = WashingMachineCard.NUMBER_SEPARATORS[numberFormat];
        if (separators) {
            const isNegative = n < 0;
            const [intPart, decPart] = Math.abs(n).toFixed(trimmedDigits).split(".");
            const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separators.group);
            return `${isNegative ? "-" : ""}${grouped}${decPart ? separators.decimal + decPart : ""}`;
        }
        // Default ("language", or unset): follow the interface's own language, untouched.
        return new Intl.NumberFormat(this._hass?.locale?.language, {
            minimumFractionDigits: trimmedDigits,
            maximumFractionDigits: trimmedDigits,
        }).format(n);
    }

    _fmtDuration(state) {
        const t = this._t;
        const n = parseFloat(state);
        if (isNaN(n))
            return null;
        if (this._config.duration_format === "hhmm" && n >= 60) {
            const h = Math.floor(n / 60);
            const m = Math.round(n % 60);
            return {
                value: `${h}h${String(m).padStart(2, "0")}`,
                unit: ""
            };
        }
        return {
            value: this._fmtNum(n, 0),
            unit: t.min
        };
    }

    _startDate() {
        const c = this._config;
        const status = this._st(c.status_entity);
        return (
            (c.last_wash_entity && this._parseDate(this._st(c.last_wash_entity)?.state)) ||
            (status && this._parseDate(status.last_changed)) ||
            null);
    }

    _moreInfo(entityId) {
        this.dispatchEvent(
            new CustomEvent("hass-more-info", {
                detail: {
                    entityId
                },
                bubbles: true,
                composed: true,
            }));
    }

    _toggle(entityId) {
        const domain = entityId.split(".")[0];
        const svcDomain = ["switch", "light", "input_boolean", "fan", "automation"].includes(domain)
         ? domain
         : "homeassistant";
        this._hass.callService(svcDomain, "toggle", {
            entity_id: entityId
        });
    }

    _confirmTogglePlug() {
        const c = this._config;
        const t = this._t;
        const isOn = this._st(c.plug_entity)?.state === "on";
        if (isOn && c.confirm_plug_off !== false && !window.confirm(t.confirm_plug_off))
            return;
        this._toggle(c.plug_entity);
    }

    _headerIcon() {
        const type = this._applianceType;
        if (type === "dryer") {
            return `
        <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/>
          <circle cx="12" cy="12.2" r="4.4"/>
          <circle cx="12" cy="12.2" r="1.5" fill="#f0a04b" stroke="none"/>
          <line x1="7.2" y1="19.2" x2="16.8" y2="19.2"/>
          <line x1="8" y1="20.4" x2="16" y2="20.4"/>
        </svg>`;
        }
        if (type === "dishwasher") {
            return `
        <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/>
          <rect x="6" y="7.2" width="12" height="10.5" rx="1.8"/>
          <line x1="8" y1="4.6" x2="16" y2="4.6"/>
          <line x1="9" y1="19.4" x2="15" y2="19.4"/>
        </svg>`;
        }
        if (type === "oven") {
            return `
        <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/>
          <rect x="6" y="8" width="12" height="9.5" rx="1.5"/>
          <circle cx="17.2" cy="5.4" r="1.3" fill="#f0a04b" stroke="none"/>
          <line x1="8" y1="19.6" x2="16" y2="19.6"/>
        </svg>`;
        }
        if (type === "microwave") {
            return `
        <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.6"/>
          <rect x="5" y="7.4" width="10.2" height="9.2" rx="1.4"/>
          <circle cx="18.2" cy="9" r="1.2"/>
          <line x1="17.2" y1="12.2" x2="19.2" y2="12.2"/>
          <line x1="17.2" y1="14.4" x2="19.2" y2="14.4"/>
        </svg>`;
        }
        return `
      <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
           stroke-linecap="round" stroke-linejoin="round">
        <rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/>
        <circle cx="12" cy="13" r="4.6"/>
        <circle cx="12" cy="13" r="1.6" fill="#2f80ed" stroke="none"/>
        <circle cx="7"  cy="6.2" r="1.05" fill="#2f80ed" stroke="none"/>
      </svg>`;
    }

    _machineSvg() {
        const type = this._applianceType;
        const u = this._uid;
        if (type === "dryer")
            return this._svgDryer(u);
        if (type === "dishwasher")
            return this._svgDishwasher(u);
        if (type === "oven")
            return this._svgOven(u);
        if (type === "microwave")
            return this._svgMicrowave(u);
        return this._svgWasher(u);
    }

    _svgChassis(u, opts = {}) {
        const top = opts.topPanel || `
      <rect x="42" y="20" width="34" height="13" rx="4" fill="#cfd7e0"/>
      <rect x="42" y="20" width="34" height="6"  rx="3" fill="#dee5ec"/>
      <rect x="88" y="18" width="70" height="18" rx="9" fill="#0d1526"/>
      <text id="dispTime" x="116" y="31" text-anchor="middle"
            font-family="ui-monospace, 'SF Mono', Consolas, monospace"
            font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
      <circle id="dispDot" cx="149" cy="27" r="2.4" fill="#22b263"/>
      <circle cx="176" cy="27" r="10" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1.3"/>
      <circle cx="176" cy="27" r="3.2" fill="#31415a"/>
      <rect x="175.1" y="18.5" width="1.8" height="6.5" rx=".9" fill="#31415a"/>`;
        return `
      <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>
      <rect x="30" y="8" width="160" height="204" rx="18" fill="url(#${u}-body)"/>
      <rect x="30" y="8" width="160" height="204" rx="18" fill="none" stroke="#c7cfda" stroke-width="1.4"/>
      <rect x="48"  y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
      <rect x="162" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
      ${top}`;
    }

    _svgWasher(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset=".55" stop-color="#f2f5f9"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-glass" cx=".38" cy=".32" r=".95">
            <stop offset="0" stop-color="#31456e"/>
            <stop offset=".6" stop-color="#1e2c4d"/>
            <stop offset="1" stop-color="#131d36"/>
          </radialGradient>
          <linearGradient id="${u}-ring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d5dce5"/>
          </linearGradient>
        </defs>
        ${this._svgChassis(u)}
        <circle cx="110" cy="128" r="58" fill="url(#${u}-ring)"/>
        <circle cx="110" cy="128" r="58" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
        <circle cx="110" cy="128" r="47" fill="#e3e9f0"/>
        <circle cx="110" cy="128" r="42" fill="url(#${u}-glass)"/>
        <g class="laundry">
          <circle cx="100" cy="124" r="14"   fill="#ea4335"/>
          <circle cx="119" cy="131" r="13.2" fill="#4285f4"/>
          <circle cx="110" cy="115" r="11"   fill="#fbbc05"/>
          <circle cx="103" cy="135" r="8"    fill="#f28b82" opacity=".9"/>
        </g>
        <ellipse cx="94" cy="106" rx="22" ry="13" fill="#ffffff" opacity=".14"
                 transform="rotate(-24 94 106)"/>
        <circle cx="110" cy="128" r="42" fill="none" stroke="#0d1526" stroke-width="2" opacity=".35"/>
        <g class="arcs">
          <circle cx="110" cy="128" r="53" fill="none" stroke="#2f80ed" stroke-width="5.5"
                  stroke-linecap="round" stroke-dasharray="104 62.5" opacity=".95"/>
        </g>
      </svg>`;
    }

    _svgDryer(u) {
        const top = `
      <rect x="42" y="20" width="34" height="13" rx="4" fill="#cfd7e0"/>
      <rect x="46" y="23" width="26" height="3.2" rx="1.4" fill="#9aa6b4"/>
      <rect x="46" y="28" width="18" height="2.4" rx="1.1" fill="#b7c0cb"/>
      <rect x="88" y="18" width="70" height="18" rx="9" fill="#0d1526"/>
      <text id="dispTime" x="116" y="31" text-anchor="middle"
            font-family="ui-monospace, 'SF Mono', Consolas, monospace"
            font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
      <circle id="dispDot" cx="149" cy="27" r="2.4" fill="#22b263"/>
      <circle cx="176" cy="27" r="10" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1.3"/>
      <circle cx="176" cy="27" r="3.2" fill="#31415a"/>
      <rect x="175.1" y="18.5" width="1.8" height="6.5" rx=".9" fill="#31415a"/>`;
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset=".55" stop-color="#f2f5f9"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-glass" cx=".38" cy=".32" r=".95">
            <stop offset="0" stop-color="#4a3a2e"/>
            <stop offset=".55" stop-color="#2a211c"/>
            <stop offset="1" stop-color="#16110e"/>
          </radialGradient>
          <linearGradient id="${u}-ring" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d5dce5"/>
          </linearGradient>
          <radialGradient id="${u}-heat" cx=".5" cy=".55" r=".7">
            <stop offset="0" stop-color="#ffb347" stop-opacity=".55"/>
            <stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
          </radialGradient>
        </defs>
        ${this._svgChassis(u, {
            topPanel: top
        })}
        <circle cx="110" cy="128" r="58" fill="url(#${u}-ring)"/>
        <circle cx="110" cy="128" r="58" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
        <circle cx="110" cy="128" r="47" fill="#e3e9f0"/>
        <circle cx="110" cy="128" r="42" fill="url(#${u}-glass)"/>
        <circle class="heat" cx="110" cy="128" r="40" fill="url(#${u}-heat)" opacity=".35"/>
        <g class="drum">
          <circle cx="110" cy="128" r="36" fill="none" stroke="#8a7a6a" stroke-width="1.2" opacity=".55"/>
          <g fill="#c4b5a5" opacity=".55">
            <circle cx="92" cy="112" r="1.6"/><circle cx="104" cy="108" r="1.6"/>
            <circle cx="116" cy="108" r="1.6"/><circle cx="128" cy="112" r="1.6"/>
            <circle cx="88" cy="124" r="1.6"/><circle cx="132" cy="124" r="1.6"/>
            <circle cx="90" cy="138" r="1.6"/><circle cx="130" cy="138" r="1.6"/>
            <circle cx="100" cy="146" r="1.6"/><circle cx="120" cy="146" r="1.6"/>
            <circle cx="110" cy="150" r="1.6"/>
          </g>
          <ellipse cx="102" cy="126" rx="15" ry="10" fill="#7aa2e3" transform="rotate(-18 102 126)"/>
          <ellipse cx="120" cy="134" rx="13" ry="9" fill="#e8e0d4" transform="rotate(22 120 134)"/>
          <ellipse cx="112" cy="118" rx="10" ry="7" fill="#d4a574" transform="rotate(-8 112 118)"/>
        </g>
        <ellipse cx="94" cy="106" rx="22" ry="13" fill="#ffffff" opacity=".12" transform="rotate(-24 94 106)"/>
        <circle cx="110" cy="128" r="42" fill="none" stroke="#0d1526" stroke-width="2" opacity=".35"/>
        <g class="arcs">
          <circle cx="110" cy="128" r="53" fill="none" stroke="#f0a04b" stroke-width="5.5"
                  stroke-linecap="round" stroke-dasharray="104 62.5" opacity=".95"/>
        </g>
        <rect x="72" y="194" width="76" height="12" rx="4" fill="#dfe5ec" stroke="#c2cbd6" stroke-width="1"/>
        <g stroke="#b0bac6" stroke-width="1.3" stroke-linecap="round">
          <line x1="80" y1="198" x2="140" y2="198"/>
          <line x1="80" y1="202" x2="140" y2="202"/>
          <line x1="80" y1="206" x2="140" y2="206"/>
        </g>
      </svg>`;
    }

    _svgDishwasher(u) {
        const top = `
      <rect x="42" y="18" width="136" height="22" rx="8" fill="#0d1526"/>
      <text id="dispTime" x="100" y="33" text-anchor="middle"
            font-family="ui-monospace, 'SF Mono', Consolas, monospace"
            font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
      <circle id="dispDot" cx="148" cy="29" r="2.4" fill="#22b263"/>
      <circle cx="162" cy="29" r="5.5" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1"/>
      <circle cx="162" cy="29" r="1.8" fill="#31415a"/>`;
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset=".55" stop-color="#f2f5f9"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-glass" cx=".4" cy=".28" r="1">
            <stop offset="0" stop-color="#2f4a6e"/>
            <stop offset=".6" stop-color="#1a2d4a"/>
            <stop offset="1" stop-color="#101b2e"/>
          </radialGradient>
          <linearGradient id="${u}-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d5dce5"/>
          </linearGradient>
          <linearGradient id="${u}-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7eb6ff" stop-opacity="0"/>
            <stop offset=".45" stop-color="#7eb6ff" stop-opacity=".55"/>
            <stop offset="1" stop-color="#7eb6ff" stop-opacity=".15"/>
          </linearGradient>
          <clipPath id="${u}-clip">
            <rect x="56" y="60" width="108" height="120" rx="8"/>
          </clipPath>
        </defs>
        ${this._svgChassis(u, {
            topPanel: top
        })}
        <rect x="48" y="52" width="124" height="148" rx="12" fill="url(#${u}-frame)"/>
        <rect x="48" y="52" width="124" height="148" rx="12" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
        <rect x="56" y="60" width="108" height="120" rx="8" fill="url(#${u}-glass)"/>
        <g clip-path="url(#${u}-clip)">
          <g class="dw-dishes" opacity=".98">
            <line x1="64" y1="92" x2="156" y2="92" stroke="#8fa0b5" stroke-width="1.6" opacity=".75"/>
            <line x1="64" y1="92" x2="64" y2="86" stroke="#8fa0b5" stroke-width="1.4" opacity=".55"/>
            <line x1="156" y1="92" x2="156" y2="86" stroke="#8fa0b5" stroke-width="1.4" opacity=".55"/>
            <path d="M70 72 v14 c0 5 4 8 8 8 s8-3 8-8 V72 Z" fill="none" stroke="#e8f0fa" stroke-width="1.8"/>
            <line x1="70" y1="72" x2="86" y2="72" stroke="#e8f0fa" stroke-width="1.8"/>
            <path d="M90 70 v16 c0 5 3.5 7.5 7 7.5 s7-2.5 7-7.5 V70 Z" fill="none" stroke="#d7e3f4" stroke-width="1.8"/>
            <line x1="90" y1="70" x2="104" y2="70" stroke="#d7e3f4" stroke-width="1.8"/>
            <path d="M112 78 c0 8 5 12 12 12 s12-4 12-12" fill="none" stroke="#c9d7ea" stroke-width="2"/>
            <ellipse cx="124" cy="78" rx="12" ry="3.2" fill="none" stroke="#c9d7ea" stroke-width="1.7"/>
            <rect x="142" y="72" width="12" height="16" rx="2.5" fill="none" stroke="#e8f0fa" stroke-width="1.8"/>
            <path d="M154 76 c4 0 5 3 5 5 s-1 5-5 5" fill="none" stroke="#e8f0fa" stroke-width="1.7"/>
            <line x1="64" y1="138" x2="156" y2="138" stroke="#8fa0b5" stroke-width="1.6" opacity=".75"/>
            <ellipse cx="80" cy="124" rx="14" ry="5.5" fill="none" stroke="#e8f0fa" stroke-width="2"/>
            <ellipse cx="80" cy="128" rx="14" ry="5.5" fill="none" stroke="#d0dced" stroke-width="1.7" opacity=".85"/>
            <ellipse cx="80" cy="132" rx="14" ry="5.5" fill="none" stroke="#b9c8dc" stroke-width="1.5" opacity=".7"/>
            <ellipse cx="112" cy="126" rx="15" ry="5.8" fill="none" stroke="#e8f0fa" stroke-width="2"/>
            <ellipse cx="112" cy="130" rx="15" ry="5.8" fill="none" stroke="#d0dced" stroke-width="1.7" opacity=".85"/>
            <path d="M132 120 c0 10 6 15 14 15 s14-5 14-15" fill="none" stroke="#d7e3f4" stroke-width="2"/>
            <ellipse cx="146" cy="120" rx="14" ry="3.4" fill="none" stroke="#d7e3f4" stroke-width="1.7"/>
          </g>
          <rect class="dw-wash" x="56" y="60" width="108" height="120" fill="url(#${u}-mist)"/>
          <g stroke="#9fd0ff" stroke-width="1.6" stroke-linecap="round" opacity=".75">
            <line class="dw-stream" x1="74" y1="64" x2="74" y2="172"/>
            <line class="dw-stream" x1="92" y1="64" x2="92" y2="172"/>
            <line class="dw-stream" x1="110" y1="64" x2="110" y2="172"/>
            <line class="dw-stream" x1="128" y1="64" x2="128" y2="172"/>
            <line class="dw-stream" x1="146" y1="64" x2="146" y2="172"/>
          </g>
          <g class="dw-arm">
            <line x1="72" y1="166" x2="148" y2="166" stroke="#8ec2ff" stroke-width="3.2" stroke-linecap="round"/>
            <circle cx="110" cy="166" r="3.4" fill="#b7dbff"/>
            <g class="dw-jet" stroke="#a8d6ff" stroke-width="1.5" stroke-linecap="round">
              <line x1="86" y1="166" x2="82" y2="148"/>
              <line x1="86" y1="166" x2="90" y2="146"/>
            </g>
            <g class="dw-jet" stroke="#a8d6ff" stroke-width="1.5" stroke-linecap="round">
              <line x1="134" y1="166" x2="130" y2="146"/>
              <line x1="134" y1="166" x2="138" y2="148"/>
            </g>
          </g>
          <g fill="#9fd0ff">
            <circle class="dw-drop" cx="78" cy="96" r="1.8"/>
            <circle class="dw-drop" cx="118" cy="90" r="2"/>
            <circle class="dw-drop" cx="140" cy="102" r="1.6"/>
            <circle class="dw-drop" cx="98" cy="108" r="1.7"/>
          </g>
        </g>
        <rect x="62" y="66" width="36" height="18" rx="6" fill="#ffffff" opacity=".12"
              transform="rotate(-12 80 75)"/>
        <rect x="56" y="60" width="108" height="120" rx="8" fill="none" stroke="#0d1526" stroke-width="2" opacity=".3"/>
        <rect class="dw-frame" x="52" y="56" width="116" height="140" rx="10" fill="none"
              stroke="#2f80ed" stroke-width="4" stroke-linecap="round"
              stroke-dasharray="90 70" opacity=".9"/>
        <rect x="78" y="188" width="64" height="7" rx="3.5" fill="#cfd7e0" stroke="#b4bec9" stroke-width="1"/>
      </svg>`;
    }

    _svgOven(u) {
        const top = `
      <rect x="42" y="40" width="88" height="22" rx="8" fill="#0d1526"/>
      <text id="dispTime" x="78" y="55" text-anchor="middle"
            font-family="ui-monospace, 'SF Mono', Consolas, monospace"
            font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
      <circle id="dispDot" cx="148" cy="51" r="2.4" fill="#22b263"/>
      <circle cx="172" cy="51" r="11" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1.3"/>
      <circle cx="172" cy="51" r="3.4" fill="#31415a"/>
      <rect x="171" y="41.5" width="2" height="7" rx="1" fill="#f0a04b"/>`;
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset=".55" stop-color="#f2f5f9"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-glass" cx=".4" cy=".28" r="1">
            <stop offset="0" stop-color="#4a3428"/>
            <stop offset=".55" stop-color="#2a1c16"/>
            <stop offset="1" stop-color="#140e0b"/>
          </radialGradient>
          <linearGradient id="${u}-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d5dce5"/>
          </linearGradient>
          <radialGradient id="${u}-heat" cx=".5" cy=".75" r=".85">
            <stop offset="0" stop-color="#ff8a3d" stop-opacity=".7"/>
            <stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/>
          </radialGradient>
          <clipPath id="${u}-clip">
            <rect x="52" y="80" width="116" height="102" rx="8"/>
          </clipPath>
        </defs>
        <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>
        <rect x="30" y="30" width="160" height="182" rx="18" fill="url(#${u}-body)"/>
        <rect x="30" y="30" width="160" height="182" rx="18" fill="none" stroke="#c7cfda" stroke-width="1.4"/>
        <rect x="48" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
        <rect x="162" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
        ${top}
        <rect x="44" y="72" width="132" height="128" rx="12" fill="url(#${u}-frame)"/>
        <rect x="44" y="72" width="132" height="128" rx="12" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
        <rect x="52" y="80" width="116" height="102" rx="8" fill="url(#${u}-glass)"/>
        <g clip-path="url(#${u}-clip)">
          <g opacity=".7" stroke="#8a7a6a" stroke-width="1.5">
            <line x1="60" y1="104" x2="160" y2="104"/>
            <line x1="60" y1="138" x2="160" y2="138"/>
            <line x1="60" y1="164" x2="160" y2="164"/>
          </g>
          <g class="ov-food">
            <ellipse cx="110" cy="134" rx="28" ry="7" fill="#c4783a"/>
            <ellipse cx="110" cy="131" rx="28" ry="7" fill="#e8a45a"/>
            <circle cx="98" cy="129" r="3.2" fill="#d4552a" opacity=".85"/>
            <circle cx="116" cy="127" r="2.6" fill="#d4552a" opacity=".75"/>
            <circle cx="124" cy="131" r="2.2" fill="#b83f1c" opacity=".7"/>
            <ellipse cx="110" cy="131" rx="10" ry="3" fill="#f2c48a" opacity=".55"/>
          </g>
          <rect class="ov-glow" x="52" y="80" width="116" height="102" fill="url(#${u}-heat)"/>
          <g stroke="#ffb070" stroke-width="1.4" stroke-linecap="round">
            <line class="ov-shimmer" x1="70" y1="84" x2="70" y2="174"/>
            <line class="ov-shimmer" x1="110" y1="84" x2="110" y2="174"/>
            <line class="ov-shimmer" x1="150" y1="84" x2="150" y2="174"/>
          </g>
          <g class="ov-flame" fill="#ff8a3d">
            <ellipse cx="88" cy="174" rx="10" ry="4" opacity=".5"/>
            <ellipse cx="110" cy="175" rx="14" ry="5" opacity=".55"/>
            <ellipse cx="132" cy="174" rx="10" ry="4" opacity=".5"/>
          </g>
        </g>
        <rect x="58" y="86" width="34" height="16" rx="5" fill="#ffffff" opacity=".1"
              transform="rotate(-10 75 94)"/>
        <rect x="52" y="80" width="116" height="102" rx="8" fill="none" stroke="#0d1526" stroke-width="2" opacity=".3"/>
        <rect class="ov-frame" x="48" y="76" width="124" height="120" rx="10" fill="none"
              stroke="#f0a04b" stroke-width="4" stroke-linecap="round"
              stroke-dasharray="90 70" opacity=".9"/>
        <rect x="78" y="188" width="64" height="8" rx="4" fill="#cfd7e0" stroke="#b4bec9" stroke-width="1"/>
      </svg>`;
    }

    _svgMicrowave(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset=".55" stop-color="#f2f5f9"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-glass" cx=".38" cy=".3" r="1">
            <stop offset="0" stop-color="#2a3a52"/>
            <stop offset=".55" stop-color="#172233"/>
            <stop offset="1" stop-color="#0c121c"/>
          </radialGradient>
          <linearGradient id="${u}-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d5dce5"/>
          </linearGradient>
          <radialGradient id="${u}-heat" cx=".45" cy=".55" r=".75">
            <stop offset="0" stop-color="#ff8a3d" stop-opacity=".55"/>
            <stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/>
          </radialGradient>
          <clipPath id="${u}-clip">
            <rect x="46" y="110" width="100" height="78" rx="8"/>
          </clipPath>
        </defs>
        <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>
        <rect x="30" y="70" width="160" height="142" rx="16" fill="url(#${u}-body)"/>
        <rect x="30" y="70" width="160" height="142" rx="16" fill="none" stroke="#c7cfda" stroke-width="1.4"/>
        <rect x="48" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
        <rect x="162" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
        <rect x="42" y="80" width="100" height="18" rx="9" fill="#0d1526"/>
        <text id="dispTime" x="84" y="93" text-anchor="middle"
              font-family="ui-monospace, 'SF Mono', Consolas, monospace"
              font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
        <circle id="dispDot" cx="128" cy="89" r="2.4" fill="#22b263"/>
        <rect x="156" y="80" width="28" height="120" rx="8" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1.2"/>
        <circle cx="170" cy="98" r="8" fill="#fff" stroke="#c2cbd6" stroke-width="1.2"/>
        <circle cx="170" cy="98" r="2.6" fill="#31415a"/>
        <rect x="170" y="91" width="1.6" height="5" rx=".8" fill="#f0a04b"/>
        <g class="mw-dots" fill="#9aa6b4">
          <circle cx="163" cy="120" r="2.2"/><circle cx="170" cy="120" r="2.2"/><circle cx="177" cy="120" r="2.2"/>
          <circle cx="163" cy="132" r="2.2"/><circle cx="170" cy="132" r="2.2"/><circle cx="177" cy="132" r="2.2"/>
          <circle cx="163" cy="144" r="2.2"/><circle cx="170" cy="144" r="2.2"/><circle cx="177" cy="144" r="2.2"/>
        </g>
        <rect x="160" y="160" width="20" height="10" rx="3" fill="#dfe5ec" stroke="#c2cbd6" stroke-width="1"/>
        <rect x="160" y="174" width="20" height="10" rx="3" fill="#dfe5ec" stroke="#c2cbd6" stroke-width="1"/>
        <rect x="160" y="188" width="20" height="10" rx="3" fill="#f0a04b" opacity=".9"/>
        <rect x="38" y="102" width="112" height="98" rx="12" fill="url(#${u}-frame)"/>
        <rect x="38" y="102" width="112" height="98" rx="12" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
        <rect x="46" y="110" width="100" height="78" rx="8" fill="url(#${u}-glass)"/>
        <g clip-path="url(#${u}-clip)">
          <rect class="mw-glow" x="46" y="110" width="100" height="78" fill="url(#${u}-heat)"/>
          <g fill="none" stroke="#ffb070" stroke-width="1.5" stroke-linecap="round" opacity=".7">
            <path class="mw-wave" d="M58 122 Q96 116 134 124"/>
            <path class="mw-wave" d="M56 138 Q96 130 136 140"/>
            <path class="mw-wave" d="M58 154 Q96 146 134 156"/>
          </g>
          <ellipse cx="100" cy="178" rx="34" ry="8" fill="#3a4a60" opacity=".5"/>
          <ellipse cx="100" cy="170" rx="28" ry="8" fill="#e8eef6" opacity=".95"/>
          <ellipse class="mw-rim" cx="100" cy="170" rx="28" ry="8" fill="none"
                  stroke="#f0a04b" stroke-width="2.2"/>
          <ellipse cx="100" cy="169" rx="14" ry="3.5" fill="#d5dde8" opacity=".65"/>
          <g class="mw-mug">
            <ellipse cx="108" cy="171" rx="2.4" ry="1.5" fill="#e25b2a" opacity=".9"/>
            <ellipse cx="100" cy="170" rx="7" ry="2" fill="#2a3648" opacity=".3"/>
            <rect x="93" y="152" width="14" height="16" rx="2.5" fill="#1a2433" opacity=".35"/>
            <rect x="93" y="152" width="14" height="16" rx="2.5" fill="none" stroke="#f5ebe0" stroke-width="1.9"/>
            <path d="M107 156 c4.5 0 5.5 2.6 5.5 5 s-1 5-5.5 5" fill="none" stroke="#f5ebe0" stroke-width="1.7"/>
            <ellipse cx="100" cy="152" rx="7" ry="2" fill="none" stroke="#f5ebe0" stroke-width="1.5"/>
            <ellipse cx="100" cy="159" rx="4.5" ry="1.4" fill="#ffb070" opacity=".4"/>
          </g>
        </g>
        <rect x="52" y="116" width="28" height="14" rx="5" fill="#ffffff" opacity=".1"
              transform="rotate(-12 66 123)"/>
        <rect x="46" y="110" width="100" height="78" rx="8" fill="none" stroke="#0d1526" stroke-width="2" opacity=".3"/>
        <rect class="mw-frame" x="42" y="106" width="108" height="86" rx="10" fill="none"
              stroke="#f0a04b" stroke-width="4" stroke-linecap="round"
              stroke-dasharray="70 55" opacity=".9"/>
        <rect x="42" y="130" width="6" height="36" rx="3" fill="#cfd7e0" stroke="#b4bec9" stroke-width="1"/>
      </svg>`;
    }

    _build() {
        const c = this._config;
        const root = this.shadowRoot || this.attachShadow({
            mode: "open"
        });
        root.innerHTML = `
      <style>
        :host {
          display: block;
          --wm-grad: linear-gradient(180deg, #edf3fb 0%, #e4edf8 55%, #dfe9f6 100%);
          --wm-text: #1c2733;
          --wm-muted: #7d8894;
          --wm-label: #8a95a3;
          --wm-accent: #2f80ed;
          --wm-icon-bg: #ffffff;
          --wm-icon-shadow: 0 3px 10px rgba(47,128,237,.18);
          --wm-icon-border: transparent;
          --wm-badge-bg: #e3e8ee;
          --wm-badge-fg: #6b7684;
          --wm-badge-dot: #9aa5b1;
          --wm-badge-run-bg: #d9f2e2;
          --wm-badge-run-fg: #1c9a55;
          --wm-badge-idle-bg: #fbf1d3;
          --wm-badge-idle-fg: #b8923a;
          --wm-btn-bg: rgba(255,255,255,.75);
          --wm-btn-border: #d8e0ea;
          --wm-btn-on-bg: #eaf3fe;
          --wm-btn-on-border: #b9d4f6;
          --wm-panel-bg: rgba(255,255,255,.72);
          --wm-panel-border: rgba(255,255,255,.9);
          --wm-panel-shadow: 0 2px 10px rgba(38,63,97,.05);
          --wm-card-shadow: 0 6px 20px rgba(38,63,97,.10);
          --wm-ring-track: #dde5ee;
          --wm-bar-bg: #e2e9f1;
          --wm-bar-idle: #c4cdd8;
          --wm-divider: #e2e8f0;
          --wm-appliance-dim: 1;
        }
        :host(.wm-dark) {
          --wm-grad: linear-gradient(180deg, #1d2634 0%, #18212f 55%, #141c29 100%);
          --wm-text: #e8eef7;
          --wm-muted: #9aa7b8;
          --wm-label: #8593a6;
          --wm-accent: #6fb0ff;
          --wm-icon-bg: #232e3f;
          --wm-icon-shadow: 0 3px 10px rgba(0,0,0,.38);
          --wm-icon-border: transparent;
          --wm-badge-bg: #2a3547;
          --wm-badge-fg: #a5b2c4;
          --wm-badge-dot: #6b7a8d;
          --wm-badge-run-bg: rgba(34,178,99,.20);
          --wm-badge-run-fg: #4ad489;
          --wm-badge-idle-bg: rgba(240,192,72,.16);
          --wm-badge-idle-fg: #e0b559;
          --wm-btn-bg: rgba(255,255,255,.06);
          --wm-btn-border: rgba(255,255,255,.13);
          --wm-btn-on-bg: rgba(47,128,237,.20);
          --wm-btn-on-border: rgba(111,176,255,.45);
          --wm-panel-bg: rgba(255,255,255,.05);
          --wm-panel-border: rgba(255,255,255,.08);
          --wm-panel-shadow: 0 2px 10px rgba(0,0,0,.28);
          --wm-card-shadow: 0 6px 20px rgba(0,0,0,.38);
          --wm-ring-track: #313e52;
          --wm-bar-bg: #2c3849;
          --wm-bar-idle: #4a5769;
          --wm-divider: rgba(255,255,255,.09);
          --wm-appliance-dim: .93;
        }
        :host(.wm-native) {
          --wm-grad: var(--ha-card-background, var(--card-background-color, #fff));
          --wm-text: var(--primary-text-color, #1c2733);
          --wm-muted: var(--secondary-text-color, #727272);
          --wm-label: var(--secondary-text-color, #727272);
          --wm-accent: var(--primary-color, #2f80ed);
          --wm-icon-bg: var(--secondary-background-color, rgba(0,0,0,.04));
          --wm-icon-shadow: 0 1px 3px rgba(0,0,0,.12);
          --wm-icon-border: var(--divider-color, rgba(0,0,0,.12));
          --wm-badge-bg: var(--secondary-background-color, rgba(0,0,0,.06));
          --wm-badge-fg: var(--secondary-text-color, #727272);
          --wm-badge-dot: var(--disabled-text-color, #bdbdbd);
          --wm-badge-run-bg: rgba(var(--rgb-success-color, 76,175,80), .16);
          --wm-badge-run-fg: var(--success-color, #21c15e);
          --wm-badge-idle-bg: rgba(var(--rgb-warning-color, 255,193,7), .16);
          --wm-badge-idle-fg: var(--warning-color, #c79100);
          --wm-btn-bg: var(--secondary-background-color, rgba(0,0,0,.04));
          --wm-btn-border: var(--divider-color, #e0e0e0);
          --wm-btn-on-bg: rgba(var(--rgb-primary-color, 47,128,237), .12);
          --wm-btn-on-border: var(--primary-color, #2f80ed);
          --wm-panel-bg: var(--secondary-background-color, rgba(0,0,0,.03));
          --wm-panel-border: var(--divider-color, #e0e0e0);
          --wm-panel-shadow: none;
          --wm-card-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.1));
          --wm-ring-track: var(--divider-color, #e0e0e0);
          --wm-bar-bg: var(--divider-color, #e0e0e0);
          --wm-bar-idle: var(--disabled-text-color, #bdbdbd);
          --wm-divider: var(--divider-color, #e0e0e0);
          --wm-appliance-dim: 1;
        }
        :host(.wm-native:not(.wm-native-dark)) {
          --wm-icon-bg: #f4f6f8;
          --wm-badge-bg: #eef1f4;
          --wm-btn-bg: #f4f6f8;
          --wm-panel-bg: #f6f8fa;
        }
        :host(.wm-native-dark) {
          --wm-icon-shadow: 0 2px 6px rgba(0,0,0,.45);
        }
        :host(.wm-native) ha-card::before {
          display: none;
        }
        :host(.wm-native) ha-card {
          box-shadow: none;
        }
        ha-card {
          display: block;
          border-radius: 24px;
          padding: 16px 16px 14px;
          overflow: hidden;
          position: relative;
          background: var(--wm-grad);
          color: var(--wm-text);
          font-family: var(--paper-font-body1_-_font-family, inherit);
          box-shadow: var(--ha-card-box-shadow, var(--wm-card-shadow));
        }
        ha-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, #2f80ed, #56a8ff);
        }
        .header { display: flex; align-items: center; gap: 10px; }
        .h-icon {
          width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
          background: var(--wm-icon-bg); box-shadow: var(--wm-icon-shadow);
          border: 1px solid var(--wm-icon-border, transparent);
          display: flex; align-items: center; justify-content: center;
        }
        .h-icon svg { width: 27px; height: 27px; }
        .h-title {
          font-size: 17.5px; font-weight: 700; letter-spacing: .2px;
          flex: 0 1 auto; min-width: 56px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .badge {
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
          font-size: 11px; font-weight: 700; letter-spacing: .7px;
          padding: 6px 11px; border-radius: 999px;
          background: var(--wm-badge-bg); color: var(--wm-badge-fg); white-space: nowrap;
        }
        .wrap.narrow #badgeText { display: none; }
        .wrap.narrow .badge { padding: 6px 8px; }
        .wrap.narrow .header { gap: 8px; }
        .wrap.narrow .h-title { font-size: 15.5px; }
        .badge .b-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wm-badge-dot); }
        .running .badge { background: var(--wm-badge-run-bg); color: var(--wm-badge-run-fg); }
        .state-idle .badge { background: var(--wm-badge-idle-bg); color: var(--wm-badge-idle-fg); }
        .state-idle .badge .b-dot { background: var(--wm-badge-idle-fg); }
        .running .badge .b-dot { background: #22b263; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,178,99,.45); }
          50%      { box-shadow: 0 0 0 5px rgba(34,178,99,0); }
        }
        .h-spacer { flex: 1; }
        .h-btn {
          width: 35px; height: 35px; border-radius: 12px; flex-shrink: 0;
          background: var(--wm-btn-bg); border: 1px solid var(--wm-btn-border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--wm-muted); transition: transform .12s ease;
        }
        .h-btn:active { transform: scale(.94); }
        .h-btn ha-icon { --mdc-icon-size: 19px; }
        .h-btn.on { color: var(--wm-accent); border-color: var(--wm-btn-on-border); background: var(--wm-btn-on-bg); }

        .hero { display: flex; justify-content: center; padding: 14px 0 6px; }
        .machine { width: 210px; max-width: 62%; filter: brightness(var(--wm-appliance-dim)); }

        .laundry, .drum, .arcs {
          transform-box: view-box;
          transform-origin: 110px 128px;
        }
        .running .arcs    { animation: spin 3s linear infinite; }
        .running .laundry { animation: tumble 3s ease-in-out infinite; }
        .running .drum    { animation: spin 2.4s linear infinite; }
        .running .heat    { animation: heatPulse 2s ease-in-out infinite; }

        .dw-stream, .dw-wash, .dw-drop, .dw-jet { opacity: 0; }
        .dw-dishes { opacity: .98; }
        .running .dw-wash { animation: washPulse 2.4s ease-in-out infinite; }
        .running .dw-stream {
          opacity: .75;
          stroke-dasharray: 6 18;
          animation: streamFall 1.1s linear infinite;
        }
        .running .dw-stream:nth-child(2) { animation-delay: .15s; }
        .running .dw-stream:nth-child(3) { animation-delay: .35s; }
        .running .dw-stream:nth-child(4) { animation-delay: .55s; }
        .running .dw-stream:nth-child(5) { animation-delay: .25s; }
        .running .dw-jet {
          transform-box: view-box;
          transform-origin: 110px 166px;
          animation: jetPulse 1.6s ease-in-out infinite;
        }
        .running .dw-jet:nth-child(2) { animation-delay: .4s; }
        .running .dw-drop { animation: dropFall 1.8s ease-in infinite; }
        .running .dw-drop:nth-child(2) { animation-delay: .4s; }
        .running .dw-drop:nth-child(3) { animation-delay: .9s; }
        .running .dw-drop:nth-child(4) { animation-delay: 1.3s; }
        .running .dw-arm {
          transform-box: view-box;
          transform-origin: 110px 166px;
          animation: armSweep 3.2s ease-in-out infinite;
        }
        .running .dw-frame { animation: dash-crawl 2.4s linear infinite; }

        .ov-glow, .ov-shimmer, .ov-flame, .ov-food { opacity: 0; }
        .running .ov-food {
          opacity: .95;
          transform-box: view-box;
          transform-origin: 110px 134px;
          animation: foodSway 3.6s ease-in-out infinite;
        }
        .running .ov-glow { animation: heatPulse 2s ease-in-out infinite; }
        .running .ov-shimmer {
          opacity: .55;
          stroke-dasharray: 8 14;
          animation: streamFall 1.4s linear infinite;
        }
        .running .ov-flame { animation: flameFlicker 1.1s ease-in-out infinite; }
        .running .ov-frame { animation: dash-crawl 2.4s linear infinite; }

        .mw-wave, .mw-glow { opacity: 0; }
        .running .mw-glow { animation: heatPulse 2.2s ease-in-out infinite; }
        .running .mw-wave {
          opacity: .55;
          stroke-dasharray: 6 12;
          animation: streamFall 2.2s linear infinite;
        }
        .running .mw-wave:nth-child(2) { animation-delay: .35s; }
        .running .mw-wave:nth-child(3) { animation-delay: .7s; }
        .running .mw-rim {
          stroke-dasharray: 7 6;
          animation: dash-crawl 12s linear infinite;
        }
        .running .mw-mug {
          transform-box: view-box;
          transform-origin: 100px 170px;
          animation: mugOrbit 12s linear infinite;
        }
        .running .mw-frame { animation: dash-crawl 3.2s linear infinite; }
        .running .mw-dots { animation: heatPulse 1.4s ease-in-out infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tumble {
          0%, 100% { transform: rotate(-14deg); }
          50%      { transform: rotate(16deg); }
        }
        @keyframes heatPulse {
          0%, 100% { opacity: .2; }
          50% { opacity: .55; }
        }
        @keyframes washPulse {
          0%, 100% { opacity: .12; }
          50% { opacity: .34; }
        }
        @keyframes streamFall { to { stroke-dashoffset: -24; } }
        @keyframes jetPulse {
          0%, 100% { opacity: .25; }
          50% { opacity: .9; }
        }
        @keyframes dropFall {
          0%   { opacity: 0; transform: translateY(0); }
          15%  { opacity: .9; }
          85%  { opacity: .55; }
          100% { opacity: 0; transform: translateY(28px); }
        }
        @keyframes armSweep {
          0%, 100% { transform: rotate(-18deg); }
          50%      { transform: rotate(18deg); }
        }
        @keyframes dash-crawl { to { stroke-dashoffset: -160; } }
        @keyframes flameFlicker {
          0%, 100% { opacity: .25; transform: scaleY(1); }
          40% { opacity: .7; transform: scaleY(1.08); }
          70% { opacity: .4; transform: scaleY(.96); }
        }
        @keyframes foodSway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes mugOrbit {
          0%   { transform: translate(14px, 0px); }
          12.5%{ transform: translate(10px, 4px); }
          25%  { transform: translate(0px, 5.5px); }
          37.5%{ transform: translate(-10px, 4px); }
          50%  { transform: translate(-14px, 0px); }
          62.5%{ transform: translate(-10px, -3.5px); }
          75%  { transform: translate(0px, -5px); }
          87.5%{ transform: translate(10px, -3.5px); }
          100% { transform: translate(14px, 0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .running .arcs, .running .laundry, .running .drum, .running .heat,
          .running .dw-wash, .running .dw-stream, .running .dw-jet,
          .running .dw-drop, .running .dw-arm, .running .dw-frame,
          .running .ov-glow, .running .ov-shimmer, .running .ov-flame,
          .running .ov-frame, .running .ov-food,
          .running .mw-glow, .running .mw-wave, .running .mw-rim,
          .running .mw-mug, .running .mw-frame, .running .mw-dots,
          .running .badge .b-dot, .running .ring-anim { animation: none; }
        }

        .panel {
          background: var(--wm-panel-bg);
          border: 1px solid var(--wm-panel-border);
          border-radius: 18px; padding: 14px 16px; margin-top: 12px;
          box-shadow: var(--wm-panel-shadow);
        }
        .status-panel { display: flex; align-items: center; gap: 16px; }
        .ring-box { position: relative; width: 96px; height: 96px; flex-shrink: 0; }
        .ring-box svg { width: 100%; height: 100%; }
        .ring-track { stroke: var(--wm-ring-track); }
        .ring-arc   { stroke: var(--wm-accent); stroke-linecap: round; }
        .ring-anim  { transform-origin: 48px 48px; }
        .running .ring-anim { animation: spin 1.8s linear infinite; }
        .ring-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .ring-time { font-size: 19px; font-weight: 800; line-height: 1; }
        .ring-label {
          font-size: 8px; font-weight: 700; letter-spacing: .8px; color: var(--wm-label);
          margin-top: 3px; max-width: 58px; overflow: hidden; white-space: nowrap;
        }
        .st-col { flex: 1; min-width: 0; }
        .st-state { font-size: 16.5px; font-weight: 700; }
        .st-row {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-top: 9px; gap: 8px;
        }
        .st-power-label { font-size: 13px; color: var(--wm-muted); }
        .st-power { font-size: 18px; font-weight: 800; white-space: nowrap; cursor: pointer; }
        .bar {
          height: 10px; border-radius: 6px; background: var(--wm-bar-bg);
          margin-top: 8px; overflow: hidden;
        }
        .bar-fill {
          height: 100%; border-radius: 6px; width: 0%;
          min-width: 3px;
          background: linear-gradient(90deg, #ff6a5e, #d93025);
          transition: width .6s ease;
        }
        .idle .bar-fill { background: var(--wm-bar-idle); }
        .lc-title {
          font-size: 11px; font-weight: 800; letter-spacing: 1.4px; color: var(--wm-label);
          margin-bottom: 10px;
        }
        .lc-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .lc-item { padding: 0 12px 0 0; min-width: 0; cursor: pointer; }
        .lc-item:not(.hidden) ~ .lc-item:not(.hidden) {
          border-left: 1px solid var(--wm-divider);
          padding-left: 12px;
        }
        .lc-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; color: var(--wm-label); }
        .lc-value { font-size: 14.5px; font-weight: 800; margin-top: 5px; overflow-wrap: break-word; }
        .lc-unit { font-size: 11px; font-weight: 700; color: var(--wm-accent); }
        .hidden { display: none !important; }
      </style>

      <ha-card>
        <div class="wrap idle" id="wrap">
          <div class="header">
            <div class="h-icon" id="hIcon">${this._headerIcon()}</div>
            <div class="h-title" id="name"></div>
            <div class="badge"><span class="b-dot"></span><span id="badgeText"></span></div>
            <div class="h-spacer"></div>
            <div class="h-btn hidden" id="notifyBtn">
              <ha-icon icon="mdi:bell-ring-outline"></ha-icon>
            </div>
            <div class="h-btn hidden" id="plugBtn">
              <ha-icon icon="mdi:power-socket-eu"></ha-icon>
            </div>
            <div class="h-btn" id="chartBtn">
              <ha-icon icon="mdi:chart-bar"></ha-icon>
            </div>
          </div>

          <div class="hero" id="hero">${this._machineSvg()}</div>

          <div class="panel status-panel" id="statusPanel">
            <div class="ring-box" id="ringBox">
              <svg viewBox="0 0 96 96">
                <circle class="ring-track" cx="48" cy="48" r="39" fill="none" stroke-width="8"/>
                <g class="ring-anim" id="ringAnim">
                  <circle class="ring-arc" id="ringArc" cx="48" cy="48" r="39" fill="none"
                          stroke-width="8" stroke-dasharray="160 85" transform="rotate(-90 48 48)"/>
                </g>
              </svg>
              <div class="ring-center">
                <div class="ring-time" id="ringTime">—</div>
                <div class="ring-label" id="ringLabel"></div>
              </div>
            </div>
            <div class="st-col">
              <div class="st-state" id="stState"></div>
              <div class="st-row hidden" id="powerRow">
                <span class="st-power-label" id="powerLabel"></span>
                <span class="st-power" id="powerValue">—</span>
              </div>
              <div class="bar hidden" id="bar"><div class="bar-fill" id="barFill"></div></div>
            </div>
          </div>

          <div class="panel hidden" id="lastCycle">
            <div class="lc-title" id="lcTitle"></div>
            <div class="lc-grid">
              <div class="lc-item hidden" id="lcStart">
                <div class="lc-label" id="lcStartLabel"></div>
                <div class="lc-value" id="lcStartV">—</div>
              </div>
              <div class="lc-item hidden" id="lcDuration">
                <div class="lc-label" id="lcDurationLabel"></div>
                <div class="lc-value" id="lcDurationV">—</div>
              </div>
              <div class="lc-item hidden" id="lcEnergy">
                <div class="lc-label" id="lcEnergyLabel"></div>
                <div class="lc-value" id="lcEnergyV">—</div>
              </div>
              <div class="lc-item hidden" id="lcCost">
                <div class="lc-label" id="lcCostLabel"></div>
                <div class="lc-value" id="lcCostV">—</div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;

        this._el = (id) => root.getElementById(id);

        const mi = (ent) => () => this._moreInfo(ent);
        this._el("chartBtn").addEventListener("click", mi(c.power_entity || c.status_entity));
        if (c.power_entity)
            this._el("powerValue").addEventListener("click", mi(c.power_entity));
        if (c.notify_entity)
            this._el("notifyBtn").addEventListener("click", () => this._toggle(c.notify_entity));
        if (c.plug_entity)
            this._el("plugBtn").addEventListener("click", () => this._confirmTogglePlug());
        if (c.last_wash_entity)
            this._el("lcStart").addEventListener("click", mi(c.last_wash_entity));
        if (c.duration_entity)
            this._el("lcDuration").addEventListener("click", mi(c.duration_entity));
        if (c.energy_entity)
            this._el("lcEnergy").addEventListener("click", mi(c.energy_entity));
        if (c.cost_entity)
            this._el("lcCost").addEventListener("click", mi(c.cost_entity));

        this._built = true;
        this._observeWidth();
        const w0 = this.getBoundingClientRect().width;
        if (w0) {
            const wrap = this._el("wrap");
            wrap.classList.toggle("narrow", w0 <= 430);
            wrap.classList.toggle("xnarrow", w0 <= 320);
        }
    }

    _update() {
        const c = this._config;
        const t = this._t;
        const wrap = this._el("wrap");
        const themeCfg = String(c.theme || "auto").toLowerCase();
        const isNative = themeCfg === "ha";
        const haIsDark = !!this._hass?.themes?.darkMode;
        this.classList.toggle("wm-native", isNative);
        this.classList.toggle("wm-native-dark", isNative && haIsDark);
        const dark = !isNative && (themeCfg === "dark" || (themeCfg !== "light" && haIsDark));
        this.classList.toggle("wm-dark", dark);
        const running = this._isRunning();
        wrap.classList.toggle("running", running);
        this._el("name").textContent = c.name || t.name;
        const status = this._st(c.status_entity);
        const noData = !status || ["unknown", "unavailable"].includes(status.state);
        const applianceState = noData ? "nodata" : this._applianceState();
        const displayState = (applianceState === "off" && !c.power_entity) ? "idle" : applianceState;
        this._el("badgeText").textContent = t[`badge_${displayState}`];
        const paused = applianceState === "paused";
        wrap.classList.toggle("state-idle", applianceState === "idle" || paused);
        const active = applianceState === "running" || applianceState === "idle" || paused;
        wrap.classList.toggle("idle", !active);
        const start = active ? this._startDate() : null;
        const clock = start ? this._fmtClock(start) : null;
        this._el("dispTime").textContent = active ? (clock || "0:00") : "--:--";
        this._el("dispDot").setAttribute("fill", running ? "#22b263" : "#4a5871");
        this._el("ringTime").textContent = active ? (clock || "…") : "—";
        const ringState = ["running", "idle", "paused"].includes(displayState) ? displayState : "off";
        this._el("ringLabel").textContent = t[`ring_${ringState}`];
        this._el("ringArc").style.display = active ? "" : "none";
        if (c.show_raw_status && !WashingMachineCard.isBooleanStatusEntity(c.status_entity)) {
            const rawState = status ? String(status.state) : "";
            const capitalizedRaw = WashingMachineCard.capitalize(rawState, t.locale);
            this._el("stState").textContent = noData ? t.state_nodata : capitalizedRaw;
        } else {
            this._el("stState").textContent = t[`state_${displayState}`];
        }
        const hideStatus = !!c.hide_status_panel && !active;
        this._el("statusPanel").classList.toggle("hidden", hideStatus);
        this._el("notifyBtn").title = t.tip_notify;
        this._el("plugBtn").title = t.tip_plug;
        this._el("chartBtn").title = t.tip_history;
        this._el("lcTitle").textContent = t.last_cycle;
        this._el("lcStartLabel").textContent = t.start;
        this._el("lcDurationLabel").textContent = t.duration;
        this._el("lcEnergyLabel").textContent = t.energy;
        this._el("lcCostLabel").textContent = t.cost;

        if (c.power_entity) {
            const ps = this._st(c.power_entity);
            const p = parseFloat(ps?.state);
            const unit = ps?.attributes?.unit_of_measurement || "W";
            this._el("powerRow").classList.remove("hidden");
            this._el("bar").classList.remove("hidden");
            const unitL = String(unit).toLowerCase();
            this._el("powerLabel").textContent =
                ["a", "а"].includes(unitL) ? t.current : t.power;
            let disp;
            if (isNaN(p))
                disp = "—";
            else if (["w", "вт"].includes(unitL) && Math.abs(p) >= 1000)
                disp = `${this._fmtNum(p / 1000, 2)} ${t.kw}`;
            else
                disp = `${Math.abs(p) >= 10 ? Math.round(p) : this._fmtNum(p, 2)} ${unit}`;
            this._el("powerValue").textContent = disp;
            const frac = isNaN(p) ? 0 : Math.min(1, Math.max(0, p / (c.power_max || 1)));
            this._el("barFill").style.width = `${frac * 100}%`;
        }

        let anyLc = false;
        if (c.last_wash_entity) {
            const s = this._st(c.last_wash_entity);
            this._el("lcStart").classList.remove("hidden");
            this._el("lcStartV").textContent = s ? this._fmtDateTime(s.state) : "—";
            anyLc = true;
        }
        if (c.duration_entity) {
            const s = this._st(c.duration_entity);
            const d = this._fmtDuration(s?.state);
            this._el("lcDuration").classList.remove("hidden");
            this._el("lcDurationV").innerHTML = d
                 ? (d.unit ? `${d.value} <span class="lc-unit">${d.unit}</span>` : d.value)
                 : "—";
            anyLc = true;
        }
        if (c.energy_entity) {
            const s = this._st(c.energy_entity);
            const v = this._fmtNum(s?.state, 2);
            this._el("lcEnergy").classList.remove("hidden");
            this._el("lcEnergyV").innerHTML =
                v !== null ? `${v} <span class="lc-unit">${t.kwh}</span>` : "—";
            anyLc = true;
        }
        if (c.cost_entity) {
            const s = this._st(c.cost_entity);
            const v = this._fmtNum(s?.state, 2);
            this._el("lcCost").classList.remove("hidden");
            this._el("lcCostV").innerHTML =
                v !== null ? `${v} <span class="lc-unit">${c.currency}</span>` : "—";
            anyLc = true;
        }
        if (anyLc)
            this._el("lastCycle").classList.remove("hidden");

        if (c.notify_entity) {
            const on = this._st(c.notify_entity)?.state === "on";
            this._el("notifyBtn").classList.remove("hidden");
            this._el("notifyBtn").classList.toggle("on", on);
        }
        if (c.plug_entity) {
            const on = this._st(c.plug_entity)?.state === "on";
            this._el("plugBtn").classList.remove("hidden");
            this._el("plugBtn").classList.toggle("on", on);
        }
    }
}

if (!customElements.get("washing-machine-card")) {
    customElements.define("washing-machine-card", WashingMachineCard);
}

/**
 * Custom visual editor
 */

class KeywordsLangCache {
    constructor() {
        this._prefix = "wm-card-running-states-lang:";
        this._memory = new Map();
        this._storage = null;
        try {
            const probeKey = "__wm_card_storage_probe__";
            window.localStorage.setItem(probeKey, "1");
            window.localStorage.removeItem(probeKey);
            this._storage = window.localStorage;
        } catch (e) {
            this._storage = null;
        }
    }
    has(key) {
        if (this._storage) {
            try {
                return this._storage.getItem(this._prefix + key) !== null;
            } catch (e) {
                // fall through to memory
            }
        }
        return this._memory.has(key);
    }
    get(key) {
        if (this._storage) {
            try {
                const v = this._storage.getItem(this._prefix + key);
                return v === null ? undefined : v;
            } catch (e) {
                // fall through to memory
            }
        }
        return this._memory.get(key);
    }
    set(key, value) {
        if (this._storage) {
            try {
                this._storage.setItem(this._prefix + key, value);
                return;
            } catch (e) {
                // fall through to memory
            }
        }
        this._memory.set(key, value);
    }
    delete(key) {
        if (this._storage) {
            try {
                this._storage.removeItem(this._prefix + key);
                return;
            } catch (e) {
                // fall through to memory
            }
        }
        this._memory.delete(key);
    }
    rename(oldKey, newKey) {
        if (oldKey === newKey)
            return;
        if (!this.has(oldKey))
            return;
        const value = this.get(oldKey);
        this.delete(oldKey);
        if (!this.has(newKey))
            this.set(newKey, value);
    }
}

class WashingMachineCardEditor extends HTMLElement {
    static AUTO_LANGUAGE = "auto";
    static _keywordsLangCache = new KeywordsLangCache();
    static _keywordsCacheKey(config) {
        return config?.status_entity || "";
    }

    static _resolveLanguage(config, hass) {
        const S = WashingMachineCard.STRINGS;
        const cfgLang = config?.language;
        const isAuto = !cfgLang || cfgLang === WashingMachineCardEditor.AUTO_LANGUAGE;
        return (!isAuto && S[cfgLang]) ? cfgLang : WashingMachineCard.detectLanguage(hass);
    }

    static _defaultName(config, hass) {
        const S = WashingMachineCard.STRINGS;
        const lang = WashingMachineCardEditor._resolveLanguage(config, hass);
        const type = WashingMachineCard.normalizeType(config?.appliance_type);
        const base = S[lang] || S.en;
        return base.types?.[type]?.name || base.name;
    }

    static _defaultRunningStates(config, hass) {
        const lang = WashingMachineCardEditor._resolveLanguage(config, hass);
        return WashingMachineCardEditor._runningStatesForLang(lang);
    }

    static _runningStatesForLang(lang) {
        const S = WashingMachineCard.STRINGS;
        return (S[lang] || S.en).running_states || [];
    }

    constructor() {
        super();
        this._config = {};
        this._built = false;
        this._fieldEls = {};
        this._fieldWraps = {};
        this._focusedElements = new Set();
        this._lastKnownLang = undefined;
    }

    _hasConfidentLanguageReading() {
        const cfgLang = this._config?.language;
        const isAuto = !cfgLang || cfgLang === WashingMachineCardEditor.AUTO_LANGUAGE;
        if (!isAuto)
            return true;
        return !!(this._hass?.locale?.language || this._hass?.language);
    }

    setConfig(config) {
        this._config = {
            ...config
        };
        if (this._built)
            this._syncValues();
    }

    set hass(hass) {
        this._hass = hass;
        if (!this._built)
            this._build();
        else
            this._syncValues();
    }

    get hass() {
        return this._hass;
    }

    static get _sections() {
        const D = WashingMachineCard.DEFAULTS;
        return [{
                title: "General",
                icon: "mdi:cog-outline",
                expanded: true,
                fields: [{
                        key: "name",
                        kind: "text",
                        title: "Card name",
                        dynamicDefault: true,
                    }, {
                        key: "appliance_type",
                        kind: "select",
                        title: "Appliance type",
                        required: true,
                    default:
                        D.appliance_type,
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [{
                                        value: "washer",
                                        label: "Washer"
                                    }, {
                                        value: "dryer",
                                        label: "Dryer / Tumbler"
                                    }, {
                                        value: "dishwasher",
                                        label: "Dishwasher"
                                    }, {
                                        value: "oven",
                                        label: "Oven"
                                    }, {
                                        value: "microwave",
                                        label: "Microwave"
                                    },
                                ],
                            },
                        },
                    }, {
                        key: "status_entity",
                        kind: "entity",
                        title: "Status entity (required)",
                        required: true,
                        selector: {
                            entity: {}
                        },
                    },
                ],
            }, {
                title: "Appearance & language",
                icon: "mdi:palette-outline",
                fields: [{
                        key: "language",
                        kind: "select",
                        title: "Language",
                        required: true,
                    default:
                        WashingMachineCardEditor.AUTO_LANGUAGE,
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: WashingMachineCardEditor._languageOptions(),
                            },
                        },
                    }, {
                        key: "theme",
                        kind: "select",
                        title: "Theme",
                        required: true,
                    default:
                        D.theme,
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [{
                                        value: "auto",
                                        label: "Auto (follow Home Assistant)"
                                    }, {
                                        value: "light",
                                        label: "Light"
                                    }, {
                                        value: "dark",
                                        label: "Dark"
                                    }, {
                                        value: "ha",
                                        label: "Home Assistant (native colours)"
                                    },
                                ],
                            },
                        },
                    }, {
                        key: "duration_format",
                        kind: "select",
                        title: "Duration time format",
                        required: true,
                    default:
                        D.duration_format,
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [{
                                        value: "minutes",
                                        label: "Raw minutes"
                                    }, {
                                        value: "hhmm",
                                        label: "Human-readable"
                                    },
                                ],
                            },
                        },
                    }, {
                        key: "hide_status_panel",
                        kind: "boolean",
                        title: "Hide status panel",
                        description: "Hide status panel only when appliance is off.",
                    default:
                        D.hide_status_panel,
                        selector: {
                            boolean: {}
                        },
                    }, {
                        key: "show_raw_status",
                        kind: "boolean",
                        title: "Show raw status value",
                        description: "Display the raw value of the status entity in the card's status panel.",
                    default:
                        D.show_raw_status,
                        selector: {
                            boolean: {}
                        },
                        visibleIf: (config) => {
                            const entity = config?.status_entity;
                            return !!entity && !WashingMachineCard.isBooleanStatusEntity(entity);
                        },
                    }, {
                        key: "running_states",
                        kind: "keywords",
                        title: "Running State keywords",
                        description: "Running State keywords determine when the card considers the appliance to be running. Built-in keywords for the selected language appear in blue. Add or remove keywords as needed.",
                    },
                ],
            }, {
                title: "Power monitoring",
                icon: "mdi:flash-outline",
                fields: [{
                        key: "power_entity",
                        kind: "entity",
                        title: "Power sensor",
                        selector: {
                            entity: {
                                domain: "sensor"
                            }
                        },
                    }, {
                        key: "power_threshold",
                        kind: "number",
                        title: "Running threshold (W)",
                    default:
                        D.power_threshold,
                        min: 0,
                    }, {
                        key: "power_max",
                        kind: "number",
                        title: "Gauge max (W)",
                    default:
                        D.power_max,
                        min: 1,
                    },
                ],
            }, {
                title: "Controls & notifications",
                icon: "mdi:tune-variant",
                fields: [{
                        key: "plug_entity",
                        kind: "entity",
                        title: "Plug / switch entity",
                        selector: {
                            entity: {
                                domain: ["switch", "input_boolean"]
                            }
                        },
                    }, {
                        key: "confirm_plug_off",
                        kind: "boolean",
                        title: "Confirm before turning off plug",
                        description: "Show a confirmation popup when turning off the plug entity.",
                    default:
                        D.confirm_plug_off,
                        selector: {
                            boolean: {}
                        },
                    }, {
                        key: "notify_entity",
                        kind: "entity",
                        title: "Notification entity",
                        selector: {
                            entity: {}
                        },
                    },
                ],
            }, {
                title: "Last cycle stats",
                icon: "mdi:history",
                fields: [{
                        key: "last_wash_entity",
                        kind: "entity",
                        title: "Last start time entity",
                        selector: {
                            entity: {
                                domain: "input_datetime"
                            }
                        },
                    }, {
                        key: "duration_entity",
                        kind: "entity",
                        title: "Duration entity",
                        selector: {
                            entity: {
                                domain: "input_number"
                            }
                        },
                    }, {
                        key: "energy_entity",
                        kind: "entity",
                        title: "Energy entity",
                        selector: {
                            entity: {
                                domain: ["input_number", "sensor"]
                            }
                        },
                    }, {
                        key: "cost_entity",
                        kind: "entity",
                        title: "Cost entity",
                        selector: {
                            entity: {
                                domain: ["input_number", "sensor"]
                            }
                        },
                    }, {
                        key: "currency",
                        kind: "text",
                        title: "Currency symbol",
                    default:
                        D.currency,
                    },
                ],
            },
        ];
    }

    static _languageOptions() {
        const codes = Object.keys(WashingMachineCard.STRINGS);
        return [{
                value: WashingMachineCardEditor.AUTO_LANGUAGE,
                label: "Auto (Home Assistant language)"
            },
            ...codes.map((code) => ({
                    value: code,
                    label: WashingMachineCard.languageDisplayName(code),
                })),
        ];
    }

    _build() {
        const root = this.shadowRoot || this.attachShadow({
            mode: "open"
        });
        root.innerHTML = `
      <style>
        :host { display: block; }
        .wm-editor { display: flex; flex-direction: column; gap: 16px; padding: 4px 0 8px; }
        .wm-field { display: flex; flex-direction: column; gap: 6px; }
        .wm-field.hidden { display: none !important; }
        .wm-field-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--secondary-text-color, #6b7684);
          padding: 0 2px;
        }
        .wm-field-title--primary {
          color: var(--primary-text-color, #1c2733);
        }
        .wm-native-input {
          box-sizing: border-box;
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
          color: var(--primary-text-color, #1c2733);
          background: var(--card-background-color, #fff);
          border: 1px solid var(--divider-color, #c2cbd6);
          border-radius: 4px;
          outline: none;
        }
        .wm-native-input:focus {
          border-color: var(--primary-color, #2f80ed);
          box-shadow: 0 0 0 1px var(--primary-color, #2f80ed);
        }
        .wm-native-input::placeholder {
          color: var(--secondary-text-color, #8a95a3);
          opacity: .75;
        }
        .wm-field--row {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .wm-field--row .wm-field-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .wm-field--row .wm-field-title { padding: 0; }
        .wm-field-desc {
          font-size: 11px;
          color: var(--secondary-text-color, #8a95a3);
        }
        .wm-field--row ha-selector { flex-shrink: 0; }
        .wm-chips-box { display: flex; flex-direction: column; gap: 8px; }
        .wm-chips {
          display: flex; flex-wrap: wrap; gap: 6px;
          min-height: 20px;
        }
        .wm-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 6px 5px 11px; border-radius: 999px;
          font-size: 12.5px; font-weight: 600; line-height: 1.3;
          background: var(--secondary-background-color, #eef1f4);
          color: var(--primary-text-color, #1c2733);
          border: 1px solid var(--divider-color, #d8e0ea);
        }
        .wm-chip--default {
          background: rgba(var(--rgb-primary-color, 47,128,237), .14);
          border-color: rgba(var(--rgb-primary-color, 47,128,237), .35);
          color: var(--primary-color, #2f80ed);
        }
        .wm-chip-remove {
          display: flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; padding: 0; border: none; border-radius: 50%;
          background: transparent; color: inherit; opacity: .65;
          font-size: 13px; line-height: 1; cursor: pointer;
        }
        .wm-chip-remove:hover { opacity: 1; background: rgba(0,0,0,.08); }
        ha-expansion-panel { border-radius: 8px; }
        .wm-section-body { display: flex; flex-direction: column; gap: 16px; padding: 12px; }
        .wm-section-header { display: flex; align-items: center; gap: 8px; }
        .wm-section-header ha-icon {
          color: var(--secondary-text-color, #6b7684);
          --mdc-icon-size: 20px;
        }
      </style>
      <div class="wm-editor" id="editor"></div>
    `;

        const editor = root.getElementById("editor");
        const sections = WashingMachineCardEditor._sections;

        sections.forEach((section) => {
            const panel = document.createElement("ha-expansion-panel");
            panel.outlined = true;
            if (section.expanded)
                panel.expanded = true;

            const header = document.createElement("div");
            header.slot = "header";
            header.className = "wm-section-header";
            const icon = document.createElement("ha-icon");
            icon.icon = section.icon;
            header.appendChild(icon);
            const span = document.createElement("span");
            span.textContent = section.title;
            header.appendChild(span);
            panel.appendChild(header);

            const body = document.createElement("div");
            body.className = "wm-section-body";
            section.fields.forEach((f) => body.appendChild(this._buildField(f)));
            panel.appendChild(body);

            editor.appendChild(panel);
        });

        this._built = true;
        this._syncValues();
    }

    _isChoiceField(field) {
        return field.kind === "select" || field.kind === "boolean";
    }

    _buildField(field) {
        const wrap = document.createElement("div");
        wrap.className = "wm-field" + (field.kind === "boolean" ? " wm-field--row" : "");
        this._fieldWraps[field.key] = wrap;

        if (field.kind === "boolean") {
            const textCol = document.createElement("div");
            textCol.className = "wm-field-text";
            const title = document.createElement("div");
            title.className = "wm-field-title wm-field-title--primary";
            title.textContent = field.title;
            textCol.appendChild(title);
            if (field.description) {
                const desc = document.createElement("div");
                desc.className = "wm-field-desc";
                desc.textContent = field.description;
                textCol.appendChild(desc);
            }
            wrap.appendChild(textCol);

            const sel = document.createElement("ha-selector");
            sel.label = "";
            sel.selector = field.selector;
            if (this._hass)
                sel.hass = this._hass;
            sel.addEventListener("value-changed", (ev) => {
                ev.stopPropagation();
                this._valueChanged(field, ev.detail.value);
            });
            wrap.appendChild(sel);
            this._fieldEls[field.key] = sel;
            return wrap;
        }

        const title = document.createElement("div");
        title.className = "wm-field-title" + (field.kind === "keywords" ? " wm-field-title--primary" : "");
        title.textContent = field.title;
        wrap.appendChild(title);

        if (field.description) {
            const desc = document.createElement("div");
            desc.className = "wm-field-desc";
            desc.textContent = field.description;
            wrap.appendChild(desc);
        }

        if (field.kind === "keywords") {
            const box = document.createElement("div");
            box.className = "wm-chips-box";
            const chipsRow = document.createElement("div");
            chipsRow.className = "wm-chips";
            box.appendChild(chipsRow);
            const input = document.createElement("input");
            input.className = "wm-native-input";
            input.type = "text";
            input.placeholder = "Type a keyword and press Enter";
            input.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    this._addKeyword(field, input.value);
                    input.value = "";
                }
            });
            input.addEventListener("focus", () => this._focusedElements.add(input));
            input.addEventListener("blur", () => this._focusedElements.delete(input));
            box.appendChild(input);
            wrap.appendChild(box);
            this._fieldEls[field.key] = {
                chipsRow,
                input
            };
            return wrap;
        }

        if (field.kind === "text" || field.kind === "number") {
            const input = document.createElement("input");
            input.className = "wm-native-input";
            input.type = field.kind === "number" ? "number" : "text";
            if (field.kind === "number" && field.min !== undefined)
                input.min = String(field.min);
            input.addEventListener("input", () => {
                this._nativeValueChanged(field, input.value);
            });
            wrap.appendChild(input);
            this._fieldEls[field.key] = input;
            return wrap;
        }

        const sel = document.createElement("ha-selector");
        sel.label = "";
        sel.selector = field.selector;
        sel.required = !!field.required;
        if (this._hass)
            sel.hass = this._hass;
        sel.addEventListener("value-changed", (ev) => {
            ev.stopPropagation();
            this._valueChanged(field, ev.detail.value);
        });
        wrap.appendChild(sel);
        this._fieldEls[field.key] = sel;
        return wrap;
    }

    _syncValues() {
        if (!this._built)
            return;
        for (const section of WashingMachineCardEditor._sections) {
            for (const field of section.fields) {
                const el = this._fieldEls[field.key];
                if (!el)
                    continue;

                const wrap = this._fieldWraps[field.key];
                if (wrap && typeof field.visibleIf === "function") {
                    wrap.classList.toggle("hidden", !field.visibleIf(this._config));
                }

                if (field.kind === "keywords") {
                    if (!this._focusedElements.has(el.input)) {
                        if (this._hasConfidentLanguageReading()) {
                            const lang = WashingMachineCardEditor._resolveLanguage(this._config, this._hass);
                            this._migrateKeywordsOnLanguageChange(field, this._lastKnownLang);
                            this._lastKnownLang = lang;
                        }
                        const raw = this._config[field.key];
                        const words = Array.isArray(raw)
                             ? raw
                             : WashingMachineCardEditor._defaultRunningStates(this._config, this._hass);
                        this._renderKeywordChips(field, el, words);
                    }
                    continue;
                }

                const isNative = field.kind === "text" || field.kind === "number";
                if (!isNative)
                    el.hass = this._hass;

                const raw = this._config[field.key];
                const hasValue = raw !== undefined && raw !== "";

                if (this._isChoiceField(field)) {
                    let v = hasValue ? raw : field.default;
                    if (field.key === "appliance_type")
                        v = WashingMachineCard.normalizeType(v);
                    el.value = v;
                } else {
                    el.value = hasValue ? raw : "";
                    const def = field.dynamicDefault
                        ? WashingMachineCardEditor._defaultName(this._config, this._hass)
                        : field.default;
                    if (def !== undefined)
                        el.placeholder = String(def);
                }
            }
        }
    }

    _valueChanged(field, value) {
        if (!this._hass)
            return;
        let v = value;
        if (this._isChoiceField(field) && (v === undefined || v === "") && field.default !== undefined) {
            v = field.default;
        }
        if (field.key === "appliance_type")
            v = WashingMachineCard.normalizeType(v);
        const oldCacheKey = field.key === "status_entity"
            ? WashingMachineCardEditor._keywordsCacheKey(this._config)
            : null;
        this._commit(field, v);
        if (oldCacheKey !== null) {
            const newCacheKey = WashingMachineCardEditor._keywordsCacheKey(this._config);
            WashingMachineCardEditor._keywordsLangCache.rename(oldCacheKey, newCacheKey);
        }
        this._syncValues();
    }

    // When the selected language changes, a previously-saved custom list is
    // still anchored to the *old* language's defaults. Swap those out for the
    // new language's defaults while keeping any keywords the user added that
    // aren't part of the old language's built-in list.
    _migrateKeywordsOnLanguageChange(field, oldLang) {
        const lang = WashingMachineCardEditor._resolveLanguage(this._config, this._hass);
        const raw = this._config[field.key];
        const cache = WashingMachineCardEditor._keywordsLangCache;
        const cacheKey = WashingMachineCardEditor._keywordsCacheKey(this._config);
        if (!Array.isArray(raw)) {
            cache.delete(cacheKey);
            return;
        }
        const referenceLang = cache.has(cacheKey) ? cache.get(cacheKey) : oldLang;
        if (!referenceLang || referenceLang === lang)
            return;
        const oldDefaults = WashingMachineCardEditor._runningStatesForLang(referenceLang);
        const newDefaults = WashingMachineCardEditor._runningStatesForLang(lang);
        const customExtras = raw.filter((word) => !oldDefaults.includes(word));
        const merged = Array.from(new Set([...newDefaults, ...customExtras]));
        const sameAsNewDefault = merged.length === newDefaults.length &&
            newDefaults.every((word) => merged.includes(word));
        this._commit(field, sameAsNewDefault ? undefined : merged);
        cache.set(cacheKey, lang);
    }

    _renderKeywordChips(field, els, words) {
        const defaults = WashingMachineCardEditor._defaultRunningStates(this._config, this._hass);
        const sorted = [...words].sort((a, b) => a.localeCompare(b, undefined, {
                sensitivity: "base"
            }));
        els.chipsRow.innerHTML = "";
        sorted.forEach((word) => {
            const chip = document.createElement("span");
            chip.className = "wm-chip" + (defaults.includes(word) ? " wm-chip--default" : "");
            const text = document.createElement("span");
            text.textContent = word;
            chip.appendChild(text);
            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "wm-chip-remove";
            removeBtn.setAttribute("aria-label", `Remove ${word}`);
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", () => this._removeKeyword(field, word));
            chip.appendChild(removeBtn);
            els.chipsRow.appendChild(chip);
        });
    }

    _currentKeywords(field) {
        const raw = this._config[field.key];
        return Array.isArray(raw)
             ? [...raw]
             : WashingMachineCardEditor._defaultRunningStates(this._config, this._hass);
    }

    _addKeyword(field, value) {
        const word = String(value ?? "").trim();
        if (!word)
            return;
        const current = this._currentKeywords(field);
        if (current.includes(word))
            return;
        this._applyKeywords(field, [...current, word]);
    }

    _removeKeyword(field, word) {
        const current = this._currentKeywords(field);
        this._applyKeywords(field, current.filter((w) => w !== word));
    }

    _applyKeywords(field, words) {
        const defaults = WashingMachineCardEditor._defaultRunningStates(this._config, this._hass);
        const sameAsDefault = words.length === defaults.length &&
            defaults.every((word) => words.includes(word));
        const isDefault = words.length === 0 || sameAsDefault;
        const lang = WashingMachineCardEditor._resolveLanguage(this._config, this._hass);
        const cache = WashingMachineCardEditor._keywordsLangCache;
        const cacheKey = WashingMachineCardEditor._keywordsCacheKey(this._config);
        if (isDefault)
            cache.delete(cacheKey);
        else
            cache.set(cacheKey, lang);
        this._commit(field, isDefault ? undefined : words);
        this._renderKeywordChips(field, this._fieldEls[field.key], words.length === 0 ? defaults : words);
    }

    _nativeValueChanged(field, rawValue) {
        const trimmed = String(rawValue ?? "").trim();
        let v;
        if (trimmed === "") {
            v = undefined;
        } else if (field.kind === "number") {
            const n = parseFloat(trimmed);
            v = isNaN(n) ? undefined : n;
        } else {
            v = trimmed;
        }
        this._commit(field, v);
    }

    _commit(field, v) {
        const newConfig = {
            ...this._config
        };
        if (v === undefined || v === "") {
            delete newConfig[field.key];
        } else {
            newConfig[field.key] = v;
        }
        this._config = newConfig;

        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: {
                    config: this._config
                },
                bubbles: true,
                composed: true,
            }));
    }
}

if (!customElements.get("washing-machine-card-editor")) {
    customElements.define("washing-machine-card-editor", WashingMachineCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "washing-machine-card",
    name: "Washing Machine Animated Card",
    description:
    "Oikos-style animated appliance card (washer / dryer / dishwasher / oven / microwave): live status, power gauge, last-cycle stats, light and dark theme",
	preview: true,
	documentationURL: "https://github.com/sionetta/wm_animated_ha_card",
});

/* ============================================================
Example configuration:

type: custom:washing-machine-card
appliance_type: washer                      # washer | dryer | dishwasher | oven | microwave
name: Washing machine
status_entity: binary_sensor.washing_in_progress
plug_entity: switch.washing_machine_plug
notify_entity: automation.washing_finished
power_entity: sensor.washing_machine_power
power_threshold: 10
power_max: 2500
last_wash_entity: input_datetime.wm_last_start
duration_entity: input_number.wm_last_duration
duration_format: minutes                    # minutes | hhmm (e.g. "1h05" once it reaches 60 min)
energy_entity: input_number.wm_last_energy
cost_entity: input_number.wm_last_cost
currency: "€"
language: auto                              # auto | en | ru | de | fr (auto = match Home Assistant's language)
theme: auto                                 # auto | light | dark | ha (ha = native Home Assistant colours)
hide_status_panel: false                    # true hides the status panel while idle
show_raw_status: false                      # true shows the raw value of the status entity in the card's status panel (hidden in the editor when status_entity is an input_boolean)
confirm_plug_off: true                      # true displays a confirmation popup before turning off the `plug_entity`.

# Other appliances — same config, one line changed:
# appliance_type: dryer        (alias: tumbler)
# appliance_type: dishwasher
# appliance_type: oven
# appliance_type: microwave
============================================================ */
