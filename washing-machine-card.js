/**
 * Washing Machine Animated Card for Home Assistant
 * ================================================
 * An Oikos-style Lovelace card for a "dumb" appliance on a smart plug:
 * animated illustration (washer / dryer / dishwasher / oven / microwave / drying_rack), live status,
 * power gauge and last-cycle stats.
 *
 * https://github.com/sionetta/wm_animated_ha_card
 * License: MIT
 * Version: 1.5.1
 */

class WashingMachineCard extends HTMLElement {
    static APPLIANCE_TYPES = ["washer", "dryer", "dishwasher", "oven", "microwave", "drying_rack"];

    static STRINGS = {
        en: {
            name: "Washing machine",
            badge_running: "RUNNING", badge_idle: "IDLE", badge_paused: "PAUSED", badge_off: "OFF", badge_standby: "STANDBY", badge_nodata: "NO DATA",
            state_running: "Washing", state_idle: "Idle", state_paused: "Paused", state_off: "Off", state_standby: "Standby", state_nodata: "No data",
            ring_running: "ELAPSED", ring_idle: "IDLE", ring_paused: "PAUSED", ring_off: "OFF", ring_standby: "STANDBY", ring_remaining: "REMAINING",
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
                drying_rack: { name: "Drying rack", state_running: "Heating" },
            },
            running_states: [
                "washing", "running", "run", "wash", "spin", "rinse", "drying", "dry", "tumble",
                "baking", "bake", "cooking", "cook", "heating", "heat", "microwave", "oven",
            ],
        },
        ru: {
            name: "Стиральная машина",
            badge_running: "В РАБОТЕ", badge_idle: "ОЖИДАНИЕ", badge_paused: "ПАУЗА", badge_off: "ВЫКЛ", badge_standby: "ОЖИДАНИЕ", badge_nodata: "НЕТ ДАННЫХ",
            state_running: "Идёт стирка", state_idle: "Ожидание", state_paused: "Пауза", state_off: "Выключено", state_standby: "Режим ожидания", state_nodata: "Нет данных",
            ring_running: "ПРОШЛО", ring_idle: "ОЖИДАНИЕ", ring_paused: "ПАУЗА", ring_off: "ВЫКЛ", ring_standby: "ОЖИДАНИЕ", ring_remaining: "ОСТАЛОСЬ",
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
                drying_rack: { name: "Сушилка для белья", state_running: "Сушка" },
            },
            running_states: ["стирка", "отжим", "полоскание", "сушка"],
        },
        de: {
            name: "Waschmaschine",
            badge_running: "LÄUFT", badge_idle: "BEREIT", badge_paused: "PAUSE", badge_off: "AUS", badge_standby: "STANDBY", badge_nodata: "KEINE DATEN",
            state_running: "Läuft", state_idle: "Bereit", state_paused: "Pause", state_off: "Aus", state_standby: "Standby", state_nodata: "Keine Daten",
            ring_running: "VERGANGEN", ring_idle: "BEREIT", ring_paused: "PAUSE", ring_off: "AUS", ring_standby: "STANDBY", ring_remaining: "RESTZEIT",
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
                drying_rack: { name: "Wäscheständer", state_running: "Erwärmt" },
            },
            running_states: ["waschen", "läuft", "schleudern", "spülen", "trocknen", "heizen"],
        },
        fr: {
            name: "Lave-linge", badge_running: "EN MARCHE", badge_idle: "EN VEILLE", badge_paused: "EN PAUSE", badge_off: "ÉTEINT", badge_standby: "EN VEILLE", badge_nodata: "PAS DE DONNÉES",
            state_running: "Lavage en cours", state_idle: "En veille", state_paused: "En pause", state_off: "Éteint", state_standby: "En veille", state_nodata: "Pas de données",
            ring_running: "ÉCOULÉ", ring_idle: "VEILLE", ring_paused: "PAUSE", ring_off: "ÉTEINT", ring_standby: "VEILLE", ring_remaining: "RESTANT",
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
                drying_rack: { name: "Étendage", state_running: "Séchage" },
            },
            running_states: ["lavage", "en cours", "séchage", "chauffage"],
        },
        nl: {
            name: "Wasmachine",
            badge_running: "BEZIG", badge_idle: "INACTIEF", badge_paused: "GEPAUZEERD", badge_off: "UIT", badge_standby: "STAND-BY", badge_nodata: "GEEN DATA",
            state_running: "Wast", state_idle: "Inactief", state_paused: "Gepauzeerd", state_off: "Uit", state_standby: "Stand-by", state_nodata: "Geen data",
            ring_running: "VERSTREKEN", ring_idle: "INACTIEF", ring_paused: "GEPAUZEERD", ring_off: "UIT", ring_standby: "STAND-BY", ring_remaining: "RESTEREND",
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
                drying_rack: { name: "Droogrek", state_running: "Droogt" },
            },
            running_states: [
                "wassen", "bezig", "centrifugeren", "spoelen", "drogen",
                "bakken", "verwarmen", "aan", "on"
            ],
        },
        pt: {
            name: "Máquina de lavar",
            badge_running: "EM ANDAMENTO", badge_idle: "EM ESPERA", badge_paused: "EM PAUSA", badge_off: "DESLIGADO", badge_standby: "EM ESPERA", badge_nodata: "SEM DADOS",
            state_running: "Lavando", state_idle: "Em espera", state_paused: "Em pausa", state_off: "Desligado", state_standby: "Em espera", state_nodata: "Sem dados",
            ring_running: "DECORRIDO", ring_idle: "EM ESPERA", ring_paused: "EM PAUSA", ring_off: "DESLIGADO", ring_standby: "EM ESPERA", ring_remaining: "RESTANTE",
            power: "Potência atual", current: "Corrente atual",
            last_cycle: "ÚLTIMO CICLO", start: "INÍCIO", duration: "DURAÇÃO",
            energy: "ENERGIA", cost: "CUSTO",
            min: "min", kwh: "kWh", kw: "kW",
            today: "Hoje", yesterday: "Ontem",
            tip_notify: "Notificação de conclusão", tip_plug: "Tomada da máquina", tip_history: "Histórico",
            confirm_plug_off: "Desligar a tomada? Isso pode interromper o ciclo atual.",
            types: {
                washer: { name: "Máquina de lavar", state_running: "Lavando" },
                dryer: { name: "Secadora", state_running: "Secando" },
                dishwasher: { name: "Lava-louças", state_running: "Lavando louças" },
                oven: { name: "Forno", state_running: "Assando" },
                microwave: { name: "Micro-ondas", state_running: "Aquecendo" },
                drying_rack: { name: "Varal elétrico", state_running: "Secando" },
            },
            running_states: ["lavando", "secando", "aquecendo", "ligado"],
        },
        el: {
            name: "Πλυντήριο ρούχων",
            badge_running: "ΣΕ ΛΕΙΤΟΥΡΓΙΑ", badge_idle: "ΑΝΑΜΟΝΗ", badge_paused: "ΠΑΥΣΗ", badge_off: "ΕΚΤΟΣ", badge_standby: "ΑΝΑΜΟΝΗ", badge_nodata: "ΧΩΡΙΣ ΔΕΔΟΜΕΝΑ",
            state_running: "Πλύση", state_idle: "Αναμονή", state_paused: "Σε παύση", state_off: "Εκτός λειτουργίας", state_standby: "Κατάσταση αναμονής", state_nodata: "Χωρίς δεδομένα",
            ring_running: "ΠΑΡΗΛΘΕ", ring_idle: "ΑΝΑΜΟΝΗ", ring_paused: "ΠΑΥΣΗ", ring_off: "ΕΚΤΟΣ", ring_standby: "ΑΝΑΜΟΝΗ", ring_remaining: "ΑΠΟΜΕΝΕΙ",
            power: "Τρέχουσα ισχύς", current: "Τρέχον ρεύμα",
            last_cycle: "ΤΕΛΕΥΤΑΙΟΣ ΚΥΚΛΟΣ", start: "ΕΝΑΡΞΗ", duration: "ΔΙΑΡΚΕΙΑ",
            energy: "ΕΝΕΡΓΕΙΑ", cost: "ΚΟΣΤΟΣ",
            min: "λεπ.", kwh: "kWh", kw: "kW",
            today: "Σήμερα", yesterday: "Χθες",
            tip_notify: "Ειδοποίηση ολοκλήρωσης", tip_plug: "Πρίζα συσκευής", tip_history: "Ιστορικό",
            confirm_plug_off: "Να απενεργοποιηθεί η πρίζα; Αυτό μπορεί να διακόψει τον τρέχοντα κύκλο.",
            types: {
                washer: { name: "Πλυντήριο ρούχων", state_running: "Πλύση" },
                dryer: { name: "Στεγνωτήριο", state_running: "Στέγνωμα" },
                dishwasher: { name: "Πλυντήριο πιάτων", state_running: "Πλύσιμο πιάτων" },
                oven: { name: "Φούρνος", state_running: "Ψήσιμο" },
                microwave: { name: "Φούρνος μικροκυμάτων", state_running: "Ζέσταμα" },
                drying_rack: { name: "Θερμαντική απλώστρα", state_running: "Στέγνωμα" },
            },
            running_states: ["πλύση", "στέγνωμα", "σε λειτουργία"],
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
        if (raw === "drying-rack" || raw === "drying_rack" || raw === "droogrek" || raw === "rack")
            return "drying_rack";
        if (WashingMachineCard.APPLIANCE_TYPES.includes(raw))
            return raw;
        return "washer";
    }

    static detectLanguage(hass) {
        const S = WashingMachineCard.STRINGS;
        const haLang = String(hass?.locale?.language || hass?.language || "en").toLowerCase();
        if (S[haLang]) return haLang;
        const short = haLang.split(/[-_]/)[0];
        if (S[short]) return short;
        return "en";
    }

    static isBooleanStatusEntity(entityId) {
        const domain = String(entityId || "").split(".")[0];
        return domain === "input_boolean" || domain === "binary_sensor";
    }

    static capitalize(value, locale) {
        const str = String(value ?? "");
        if (!str) return str;
        const [first, ...rest] = str;
        return first.toLocaleUpperCase(locale) + rest.join("");
    }

    static languageDisplayName(code) {
        try {
            const dn = new Intl.DisplayNames([code], { type: "language" });
            const name = dn.of(code);
            if (name) return WashingMachineCard.capitalize(name);
        } catch (e) {}
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
        if (!this._built) this._build();
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
        if (this._ro || typeof ResizeObserver === "undefined") return;
        this._ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect?.width;
            if (!w || !this._built) return;
            const wrap = this._el("wrap");
            if (!wrap) return;
            wrap.classList.toggle("narrow", w <= 430);
            wrap.classList.toggle("xnarrow", w <= 320);
        });
        this._ro.observe(this);
    }

    connectedCallback() {
        this._observeWidth();
        if (this._timer) clearInterval(this._timer);
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
        if (!c.power_entity) return cycleIsActive;
        const p = parseFloat(this._st(c.power_entity)?.state);
        return cycleIsActive && !isNaN(p) && p > c.power_threshold;
    }

    _applianceState() {
        const c = this._config;
        const cycleIsActive = this._cycleIsActive();
        if (!c.power_entity) return cycleIsActive ? "running" : "off";
        const p = parseFloat(this._st(c.power_entity)?.state);
        if (cycleIsActive)
            return !isNaN(p) && p > c.power_threshold ? "running" : "paused";
        const standby = parseFloat(c.standby_threshold);
        if (!isNaN(standby) && !isNaN(p) && p > standby) return "standby";
        return "off";
    }

    _parseDate(state) {
        if (!state || ["unknown", "unavailable", "none"].includes(String(state).toLowerCase()))
            return null;
        const d = new Date(String(state).replace(" ", "T"));
        return isNaN(d) ? null : d;
    }

    _hour12() {
        const tf = this._hass?.locale?.time_format;
        if (tf === "12") return true;
        if (tf === "24") return false;
        const testLocale = tf === "system" ? undefined : this._t.locale;
        return new Date(2023, 0, 1, 22, 0, 0).toLocaleTimeString(testLocale).includes("10");
    }

    _fmtDateTime(state) {
        const t = this._t;
        const d = this._parseDate(state);
        if (!d) return "—";
        const now = new Date();
        const sameDay = d.toDateString() === now.toDateString();
        const yest = new Date(now);
        yest.setDate(now.getDate() - 1);
        const time = d.toLocaleTimeString(t.locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: this._hour12(),
        });
        if (sameDay) return `${t.today}, ${time}`;
        if (d.toDateString() === yest.toDateString()) return `${t.yesterday}, ${time}`;
        return d.toLocaleDateString(t.locale, { day: "numeric", month: "short" }) + `, ${time}`;
    }

    _fmtClock(fromDate) {
        const s = Math.max(0, Math.floor((Date.now() - fromDate.getTime()) / 1000));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h}:${String(m).padStart(2, "0")}`;
    }

    _remainingMinutes() {
        const c = this._config;
        if (!c.remaining_entity) return null;
        const entity = this._st(c.remaining_entity);
        if (!entity) return null;
        const raw = String(entity.state ?? "").trim();
        if (!raw || ["unknown", "unavailable", "none"].includes(raw.toLowerCase())) return null;

        if (c.remaining_entity.startsWith("input_datetime.") &&
            entity.attributes?.has_date === false && entity.attributes?.has_time === true) {
            const time = raw.match(/^([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
            if (!time) return null;
            const now = new Date();
            const end = new Date(now);
            end.setHours(Number(time[1]), Number(time[2]), Number(time[3]), 0);
            if (end.getTime() <= now.getTime()) end.setDate(end.getDate() + 1);
            return (end.getTime() - now.getTime()) / 60000;
        }

        const hms = raw.match(/^(\d+):([0-5]\d)(?::([0-5]\d))?$/);
        if (hms) return Number(hms[1]) * 60 + Number(hms[2]) + Number(hms[3] || 0) / 60;

        const numeric = Number(raw.replace(",", "."));
        if (Number.isFinite(numeric)) {
            const unit = String(entity.attributes?.unit_of_measurement || "").trim().toLowerCase();
            if (["ms", "millisecond", "milliseconds"].includes(unit)) return Math.max(0, numeric / 60000);
            if (["s", "sec", "secs", "second", "seconds"].includes(unit)) return Math.max(0, numeric / 60);
            if (["h", "hr", "hrs", "hour", "hours"].includes(unit)) return Math.max(0, numeric * 60);
            if (["d", "day", "days"].includes(unit)) return Math.max(0, numeric * 1440);
            return Math.max(0, numeric);
        }

        const end = this._parseDate(raw);
        if (end) return Math.max(0, (end.getTime() - Date.now()) / 60000);
        return null;
    }

    _fmtRemaining(minutes) {
        if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return null;
        const total = Math.max(0, Math.ceil(minutes));
        const h = Math.floor(total / 60);
        const m = total % 60;
        return `${h}:${String(m).padStart(2, "0")}`;
    }

    static NUMBER_SEPARATORS = {
        comma_decimal: { group: ",", decimal: "." },
        decimal_comma: { group: ".", decimal: "," },
        space_comma: { group: " ", decimal: "," },
    };

    _fmtNum(value, digits = 2) {
        const n = parseFloat(value);
        if (isNaN(n)) return null;
        let trimmedDigits = '';
        if (digits > 0) {
            const stripped = n.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
            const dotIndex = stripped.indexOf(".");
            trimmedDigits = dotIndex === -1 ? 0 : stripped.length - dotIndex - 1;
        }
        const numberFormat = this._hass?.locale?.number_format;
        if (numberFormat === "none") return n.toFixed(trimmedDigits);
        if (numberFormat === "system") {
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: trimmedDigits,
                maximumFractionDigits: trimmedDigits,
            }).format(n);
        }
        const separators = WashingMachineCard.NUMBER_SEPARATORS[numberFormat];
        if (separators) {
            const isNegative = n < 0;
            const [intPart, decPart] = Math.abs(n).toFixed(trimmedDigits).split(".");
            const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separators.group);
            return `${isNegative ? "-" : ""}${grouped}${decPart ? separators.decimal + decPart : ""}`;
        }
        return new Intl.NumberFormat(this._hass?.locale?.language, {
            minimumFractionDigits: trimmedDigits,
            maximumFractionDigits: trimmedDigits,
        }).format(n);
    }

    _fmtDuration(state) {
        const t = this._t;
        const n = parseFloat(state);
        if (isNaN(n)) return null;
        if (this._config.duration_format === "hhmm" && n >= 60) {
            const h = Math.floor(n / 60);
            const m = Math.round(n % 60);
            return { value: `${h}h${String(m).padStart(2, "0")}`, unit: "" };
        }
        return { value: this._fmtNum(n, 0), unit: t.min };
    }

    _startDate() {
        const c = this._config;
        const status = this._st(c.status_entity);
        return (
            (c.last_wash_entity && this._parseDate(this._st(c.last_wash_entity)?.state)) ||
            (status && this._parseDate(status.last_changed)) ||
            null
        );
    }

    _handleImageTap() {
        const c = this._config;
        this.dispatchEvent(
            new CustomEvent("hass-action", {
                detail: {
                    config: { entity: c.status_entity, tap_action: c.image_tap_action },
                    action: "tap",
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    _moreInfo(entityId) {
        this.dispatchEvent(
            new CustomEvent("hass-more-info", {
                detail: { entityId },
                bubbles: true,
                composed: true,
            })
        );
    }

    _toggle(entityId) {
        const domain = entityId.split(".")[0];
        const svcDomain = ["switch", "light", "input_boolean", "fan", "automation"].includes(domain) ? domain : "homeassistant";
        this._hass.callService(svcDomain, "toggle", { entity_id: entityId });
    }

    _confirmTogglePlug() {
        const c = this._config;
        const t = this._t;
        const isOn = this._st(c.plug_entity)?.state === "on";
        if (isOn && c.confirm_plug_off !== false && !window.confirm(t.confirm_plug_off)) return;
        this._toggle(c.plug_entity);
    }

    _headerIcon() {
        const type = this._applianceType;
        if (type === "dryer") {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/><circle cx="12" cy="12.2" r="4.4"/><circle cx="12" cy="12.2" r="1.5" fill="#f0a04b" stroke="none"/><line x1="7.2" y1="19.2" x2="16.8" y2="19.2"/><line x1="8" y1="20.4" x2="16" y2="20.4"/></svg>`;
        }
        if (type === "dishwasher") {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/><rect x="6" y="7.2" width="12" height="10.5" rx="1.8"/><line x1="8" y1="4.6" x2="16" y2="4.6"/><line x1="9" y1="19.4" x2="15" y2="19.4"/></svg>`;
        }
        if (type === "oven") {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/><rect x="6" y="8" width="12" height="9.5" rx="1.5"/><circle cx="17.2" cy="5.4" r="1.3" fill="#f0a04b" stroke="none"/><line x1="8" y1="19.6" x2="16" y2="19.6"/></svg>`;
        }
        if (type === "microwave") {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.6"/><rect x="5" y="7.4" width="10.2" height="9.2" rx="1.4"/><circle cx="18.2" cy="9" r="1.2"/><line x1="17.2" y1="12.2" x2="19.2" y2="12.2"/><line x1="17.2" y1="14.4" x2="19.2" y2="14.4"/></svg>`;
        }
        if (type === "drying_rack") {
            return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M5 6l4 12"/><path d="M19 6l-4 12"/><path d="M8 12h8"/><circle cx="16" cy="15" r="1.5" fill="#f0a04b" stroke="none"/></svg>`;
        }
        return `<svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/><circle cx="12" cy="13" r="4.6"/><circle cx="12" cy="13" r="1.6" fill="#2f80ed" stroke="none"/><circle cx="7" cy="6.2" r="1.05" fill="#2f80ed" stroke="none"/></svg>`;
    }

    _machineSvg() {
        const type = this._applianceType;
        const u = this._uid;
        if (type === "dryer") return this._svgDryer(u);
        if (type === "dishwasher") return this._svgDishwasher(u);
        if (type === "oven") return this._svgOven(u);
        if (type === "microwave") return this._svgMicrowave(u);
        if (type === "drying_rack") return this._svgDryingRack(u);
        return this._svgWasher(u);
    }

    _svgChassis(u, opts = {}) {
        const top = opts.topPanel || `
      <rect x="42" y="20" width="34" height="13" rx="4" fill="#cfd7e0"/>
      <rect x="42" y="20" width="34" height="6" rx="3" fill="#dee5ec"/>
      <rect x="88" y="18" width="70" height="18" rx="9" fill="#0d1526"/>
      <text id="dispTime" x="116" y="31" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
      <circle id="dispDot" cx="149" cy="27" r="2.4" fill="#22b263"/>`;
        return `
      <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>
      <rect x="30" y="8" width="160" height="204" rx="18" fill="url(#${u}-body)"/>
      ${top}`;
    }

    _svgWasher(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e9"/></linearGradient>
          <radialGradient id="${u}-glass" cx=".38" cy=".32" r=".95"><stop offset="0" stop-color="#31456e"/><stop offset="1" stop-color="#131d36"/></radialGradient>
        </defs>
        ${this._svgChassis(u)}
        <circle cx="110" cy="128" r="58" fill="#e5ebf2"/>
        <circle cx="110" cy="128" r="42" fill="url(#${u}-glass)"/>
        <g class="laundry"><circle cx="100" cy="124" r="14" fill="#ea4335"/><circle cx="119" cy="131" r="13.2" fill="#4285f4"/></g>
        <g class="arcs"><circle cx="110" cy="128" r="53" fill="none" stroke="#2f80ed" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="104 62.5"/></g>
      </svg>`;
    }

    _svgDryer(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e9"/></linearGradient></defs>
        ${this._svgChassis(u)}
        <circle cx="110" cy="128" r="58" fill="#e5ebf2"/>
        <circle cx="110" cy="128" r="42" fill="#2a211c"/>
        <g class="arcs"><circle cx="110" cy="128" r="53" fill="none" stroke="#f0a04b" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="104 62.5"/></g>
      </svg>`;
    }

    _svgDishwasher(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e9"/></linearGradient></defs>
        ${this._svgChassis(u)}
        <rect x="48" y="52" width="124" height="148" rx="12" fill="#1a2d4a"/>
        <g class="arcs"><rect class="dw-frame" x="52" y="56" width="116" height="140" rx="10" fill="none" stroke="#2f80ed" stroke-width="4" stroke-dasharray="90 70"/></g>
      </svg>`;
    }

    _svgOven(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e9"/></linearGradient></defs>
        ${this._svgChassis(u)}
        <rect x="44" y="72" width="132" height="128" rx="12" fill="#2a1c16"/>
        <g class="arcs"><rect class="ov-frame" x="48" y="76" width="124" height="120" rx="10" fill="none" stroke="#f0a04b" stroke-width="4" stroke-dasharray="90 70"/></g>
      </svg>`;
    }

    _svgMicrowave(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e0e9"/></linearGradient></defs>
        ${this._svgChassis(u)}
        <rect x="38" y="102" width="112" height="98" rx="12" fill="#172233"/>
        <g class="arcs"><rect class="mw-frame" x="42" y="106" width="108" height="86" rx="10" fill="none" stroke="#f0a04b" stroke-width="4" stroke-dasharray="70 55"/></g>
      </svg>`;
    }

    // Nieuwe SVG voor het droogrek (Drying Rack)
    _svgDryingRack(u) {
        return `
      <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${u}-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#d9e0e9"/>
          </linearGradient>
          <radialGradient id="${u}-heat" cx=".5" cy=".5" r=".7">
            <stop offset="0" stop-color="#ffb347" stop-opacity=".6"/>
            <stop offset="1" stop-color="#ffb347" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>
        <rect x="30" y="16" width="160" height="188" rx="18" fill="url(#${u}-body)"/>
        <rect x="88" y="24" width="70" height="18" rx="9" fill="#0d1526"/>
        <text id="dispTime" x="116" y="37" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
        <circle id="dispDot" cx="149" cy="33" r="2.4" fill="#22b263"/>
        
        <!-- Droogrek Illustratie -->
        <g transform="translate(0, 10)">
          <circle class="heat" cx="110" cy="110" r="50" fill="url(#${u}-heat)" opacity=".4"/>
          <!-- Frame poten en rek -->
          <path d="M50 80 L110 60 L170 80" fill="none" stroke="#9aa6b4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M70 73 L70 150" fill="none" stroke="#7d8894" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M150 73 L150 150" fill="none" stroke="#7d8894" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M60 110 L160 110" fill="none" stroke="#f0a04b" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M65 120 L155 120" fill="none" stroke="#f0a04b" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M75 90 L145 90" fill="none" stroke="#f0a04b" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M80 100 L140 100" fill="none" stroke="#f0a04b" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="110" cy="70" r="5" fill="#31415a"/>
        </g>
        <g class="arcs">
          <circle cx="110" cy="120" r="65" fill="none" stroke="#f0a04b" stroke-width="4" stroke-linecap="round" stroke-dasharray="90 50" opacity=".9"/>
        </g>
      </svg>`;
    }

    _build() {
        const c = this._config;
        const root = this.shadowRoot || this.attachShadow({ mode: "open" });
        root.innerHTML = `
      <style>
        :host { display: block; --wm-grad: linear-gradient(180deg, #edf3fb 0%, #e4edf8 55%, #dfe9f6 100%); --wm-text: #1c2733; --wm-muted: #7d8894; --wm-label: #8a95a3; --wm-accent: #2f80ed; --wm-icon-bg: #ffffff; --wm-icon-shadow: 0 3px 10px rgba(47,128,237,.18); --wm-badge-bg: #e3e8ee; --wm-badge-fg: #6b7684; --wm-badge-dot: #9aa5b1; --wm-badge-run-bg: #d9f2e2; --wm-badge-run-fg: #1c9a55; --wm-badge-idle-bg: #fbf1d3; --wm-badge-idle-fg: #b8923a; --wm-btn-bg: rgba(255,255,255,.75); --wm-btn-border: #d8e0ea; --wm-btn-on-bg: #eaf3fe; --wm-btn-on-border: #b9d4f6; --wm-panel-bg: rgba(255,255,255,.72); --wm-panel-border: rgba(255,255,255,.9); --wm-panel-shadow: 0 2px 10px rgba(38,63,97,.05); --wm-card-shadow: 0 6px 20px rgba(38,63,97,.10); --wm-ring-track: #dde5ee; --wm-bar-bg: #e2e9f1; --wm-bar-idle: #c4cdd8; --wm-divider: #e2e8f0; --wm-appliance-dim: 1; }
        :host(.wm-dark) { --wm-grad: linear-gradient(180deg, #1d2634 0%, #18212f 55%, #141c29 100%); --wm-text: #e8eef7; --wm-muted: #9aa7b8; --wm-label: #8593a6; --wm-accent: #6fb0ff; --wm-icon-bg: #232e3f; --wm-icon-shadow: 0 3px 10px rgba(0,0,0,.38); --wm-badge-bg: #2a3547; --wm-badge-fg: #a5b2c4; --wm-badge-dot: #6b7a8d; --wm-badge-run-bg: rgba(34,178,99,.20); --wm-badge-run-fg: #4ad489; --wm-badge-idle-bg: rgba(240,192,72,.16); --wm-badge-idle-fg: #e0b559; --wm-btn-bg: rgba(255,255,255,.06); --wm-btn-border: rgba(255,255,255,.13); --wm-btn-on-bg: rgba(47,128,237,.20); --wm-btn-on-border: rgba(111,176,255,.45); --wm-panel-bg: rgba(255,255,255,.05); --wm-panel-border: rgba(255,255,255,.08); --wm-panel-shadow: 0 2px 10px rgba(0,0,0,.28); --wm-card-shadow: 0 6px 20px rgba(0,0,0,.38); --wm-ring-track: #313e52; --wm-bar-bg: #2c3849; --wm-bar-idle: #4a5769; --wm-divider: rgba(255,255,255,.09); --wm-appliance-dim: .93; }
        ha-card { display: block; border-radius: 24px; padding: 16px 16px 14px; overflow: hidden; position: relative; background: var(--wm-grad); color: var(--wm-text); font-family: inherit; box-shadow: var(--wm-card-shadow); }
        ha-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #2f80ed, #56a8ff); }
        .header { display: flex; align-items: center; gap: 10px; }
        .h-icon { width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0; background: var(--wm-icon-bg); box-shadow: var(--wm-icon-shadow); display: flex; align-items: center; justify-content: center; }
        .h-icon svg { width: 27px; height: 27px; }
        .h-title { font-size: 17.5px; font-weight: 700; flex: 0 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: .7px; padding: 6px 11px; border-radius: 999px; background: var(--wm-badge-bg); color: var(--wm-badge-fg); }
        .badge .b-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wm-badge-dot); }
        .running .badge { background: var(--wm-badge-run-bg); color: var(--wm-badge-run-fg); }
        .running .badge .b-dot { background: #22b263; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,178,99,.45); } 50% { box-shadow: 0 0 0 5px rgba(34,178,99,0); } }
        .h-spacer { flex: 1; }
        .h-btn { width: 35px; height: 35px; border-radius: 12px; background: var(--wm-btn-bg); border: 1px solid var(--wm-btn-border); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--wm-muted); }
        .h-btn.on { color: var(--wm-accent); border-color: var(--wm-btn-on-border); background: var(--wm-btn-on-bg); }
        .hero { display: flex; justify-content: center; padding: 14px 0 6px; }
        .machine { width: 210px; max-width: 62%; }
        .running .arcs { animation: spin 3.2s linear infinite; }
        .running .heat { animation: heatPulse 2s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes heatPulse { 0%, 100% { opacity: .3; } 50% { opacity: .7; } }
        .panel { background: var(--wm-panel-bg); border: 1px solid var(--wm-panel-border); border-radius: 18px; padding: 14px 16px; margin-top: 12px; box-shadow: var(--wm-panel-shadow); }
        .status-panel { display: flex; align-items: center; gap: 16px; }
        .ring-box { position: relative; width: 96px; height: 96px; flex-shrink: 0; }
        .ring-box svg { width: 100%; height: 100%; }
        .ring-track { stroke: var(--wm-ring-track); }
        .ring-arc { stroke: var(--wm-accent); stroke-linecap: round; }
        .running .ring-anim { animation: spin 1.8s linear infinite; transform-origin: 48px 48px; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .ring-time { font-size: 19px; font-weight: 800; line-height: 1; }
        .ring-label { font-size: 8px; font-weight: 700; letter-spacing: .8px; color: var(--wm-label); margin-top: 3px; }
        .st-col { flex: 1; min-width: 0; }
        .st-state { font-size: 16.5px; font-weight: 700; }
        .st-row { display: flex; align-items: baseline; justify-content: space-between; margin-top: 9px; gap: 8px; }
        .st-power-label { font-size: 13px; color: var(--wm-muted); }
        .st-power { font-size: 18px; font-weight: 800; }
        .bar { height: 10px; border-radius: 6px; background: var(--wm-bar-bg); margin-top: 8px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 6px; width: 0%; background: linear-gradient(90deg, #ff6a5e, #d93025); transition: width .6s ease; }
        .lc-title { font-size: 11px; font-weight: 800; letter-spacing: 1.4px; color: var(--wm-label); margin-bottom: 10px; }
        .lc-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .lc-item { padding: 0 12px 0 0; }
        .lc-label { font-size: 10px; font-weight: 700; color: var(--wm-label); }
        .lc-value { font-size: 14.5px; font-weight: 800; margin-top: 5px; }
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
            <div class="h-btn hidden" id="notifyBtn"><ha-icon icon="mdi:bell-ring-outline"></ha-icon></div>
            <div class="h-btn hidden" id="plugBtn"><ha-icon icon="mdi:power-socket-eu"></ha-icon></div>
            <div class="h-btn" id="chartBtn"><ha-icon icon="mdi:chart-bar"></ha-icon></div>
          </div>
          <div class="hero" id="hero">${this._machineSvg()}</div>
          <div class="panel status-panel" id="statusPanel">
            <div class="ring-box">
              <svg viewBox="0 0 96 96">
                <circle class="ring-track" cx="48" cy="48" r="39" fill="none" stroke-width="8"/>
                <g class="ring-anim"><circle class="ring-arc" id="ringArc" cx="48" cy="48" r="39" fill="none" stroke-width="8" stroke-dasharray="160 85" transform="rotate(-90 48 48)"/></g>
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
              <div class="lc-item hidden" id="lcStart"><div class="lc-label" id="lcStartLabel"></div><div class="lc-value" id="lcStartV">—</div></div>
              <div class="lc-item hidden" id="lcDuration"><div class="lc-label" id="lcDurationLabel"></div><div class="lc-value" id="lcDurationV">—</div></div>
              <div class="lc-item hidden" id="lcEnergy"><div class="lc-label" id="lcEnergyLabel"></div><div class="lc-value" id="lcEnergyV">—</div></div>
              <div class="lc-item hidden" id="lcCost"><div class="lc-label" id="lcCostLabel"></div><div class="lc-value" id="lcCostV">—</div></div>
            </div>
          </div>
        </div>
      </ha-card>
    `;

        this._el = (id) => root.getElementById(id);
        const mi = (ent) => () => this._moreInfo(ent);
        this._el("chartBtn").addEventListener("click", mi(c.power_entity || c.status_entity));
        if (c.power_entity) this._el("powerValue").addEventListener("click", mi(c.power_entity));
        if (c.plug_entity) this._el("plugBtn").addEventListener("click", () => this._confirmTogglePlug());
        this._built = true;
    }

    _update() {
        const c = this._config;
        const t = this._t;
        const wrap = this._el("wrap");
        const themeCfg = String(c.theme || "auto").toLowerCase();
        const isNative = themeCfg === "ha";
        const haIsDark = !!this._hass?.themes?.darkMode;
        this.classList.toggle("wm-native", isNative);
        this.classList.toggle("wm-dark", !isNative && (themeCfg === "dark" || (themeCfg !== "light" && haIsDark)));
        
        const running = this._isRunning();
        wrap.classList.toggle("running", running);
        this._el("name").textContent = c.name || t.name;
        
        const status = this._st(c.status_entity);
        const noData = !status || ["unknown", "unavailable"].includes(status.state);
        const applianceState = noData ? "nodata" : this._applianceState();
        const displayState = (applianceState === "off" && !c.power_entity) ? "idle" : applianceState;
        
        this._el("badgeText").textContent = t[`badge_${displayState}`];
        wrap.classList.toggle("state-idle", applianceState === "idle" || applianceState === "paused");
        wrap.classList.toggle("idle", !(applianceState === "running" || applianceState === "idle" || applianceState === "paused"));

        this._el("dispTime").textContent = running ? "actief" : "--:--";
        this._el("ringTime").textContent = running ? "aan" : "—";
        this._el("stState").textContent = t[`state_${displayState}`];

        if (c.power_entity) {
            const ps = this._st(c.power_entity);
            const p = parseFloat(ps?.state);
            const unit = ps?.attributes?.unit_of_measurement || "W";
            this._el("powerRow").classList.remove("hidden");
            this._el("bar").classList.remove("hidden");
            this._el("powerValue").textContent = `${Math.round(p || 0)} ${unit}`;
            const frac = isNaN(p) ? 0 : Math.min(1, Math.max(0, p / (c.power_max || 1)));
            this._el("barFill").style.width = `${frac * 100}%`;
        }
    }
}

if (!customElements.get("washing-machine-card")) {
    customElements.define("washing-machine-card", WashingMachineCard);
}

/**
 * Custom visual editor
 */
class WashingMachineCardEditor extends HTMLElement {
    static AUTO_LANGUAGE = "auto";
    constructor() { super(); this._config = {}; this._built = false; }
    setConfig(config) { this._config = { ...config }; }
    set hass(hass) { this._hass = hass; if (!this._built) this._build(); }

    static get _sections() {
        return [{
            title: "General",
            icon: "mdi:cog-outline",
            expanded: true,
            fields: [
                { key: "name", kind: "text", title: "Card name" },
                {
                    key: "appliance_type",
                    kind: "select",
                    title: "Appliance type",
                    required: true,
                    default: "washer",
                    selector: {
                        select: {
                            mode: "dropdown",
                            options: [
                                { value: "washer", label: "Washer" },
                                { value: "dryer", label: "Dryer / Tumbler" },
                                { value: "dishwasher", label: "Dishwasher" },
                                { value: "oven", label: "Oven" },
                                { value: "microwave", label: "Microwave" },
                                { value: "drying_rack", label: "Drying rack" },
                            ],
                        },
                    },
                },
                { key: "status_entity", kind: "entity", title: "Status entity (required)", required: true, selector: { entity: {} } },
            ],
        }];
    }

    _build() {
        const root = this.shadowRoot || this.attachShadow({ mode: "open" });
        root.innerHTML = `<div style="padding: 10px;">Editor geladen. Kies hierboven je droogrek (` + `drying_rack).</div>`;
        this._built = true;
    }
}

if (!customElements.get("washing-machine-card-editor")) {
    customElements.define("washing-machine-card-editor", WashingMachineCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "washing-machine-card",
    name: "Washing Machine Animated Card",
    description: "Oikos-style animated appliance card including drying rack support",
    preview: true,
});
