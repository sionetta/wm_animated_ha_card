/**
 * Washing Machine Animated Card for Home Assistant
 * ================================================
 * An Oikos-style Lovelace card for a "dumb" washing machine on a smart plug:
 * animated machine illustration, live status, power gauge and last-cycle stats.
 *
 * Анимированная карточка стиральной машины в стиле Oikos для Home Assistant:
 * «глупая» машина на умной розетке — анимация, статус, шкала мощности
 * и итоги последнего цикла.
 *
 * https://github.com/sionetta/wm_animated_ha_card
 * License: MIT
 * Version: 1.0.0
 *
 * UI languages: en, ru, de, fr (auto-detected from Home Assistant, or set `language:`).
 *
 * Install / Установка:
 *   1. Copy to /config/www/washing-machine-card.js
 *   2. Add a dashboard resource / добавьте ресурс:
 *        url: /local/washing-machine-card.js?v=1
 *        type: module
 *      (bump ?v= after every update to bust the browser cache /
 *       при обновлении файла увеличивайте ?v=, чтобы сбросить кэш)
 *   3. Add the card — full example at the bottom of this file /
 *      пример конфигурации — в конце файла.
 *
 * Every entity option except status_entity is optional — blocks without
 * an entity are simply hidden. / Все entity-параметры кроме status_entity
 * необязательны: блоки без сущности не отображаются.
 */

class WashingMachineCard extends HTMLElement {
  static STRINGS = {
    en: {
      name: "Washing machine",
      badge_running: "RUNNING", badge_idle: "IDLE", badge_nodata: "NO DATA",
      state_running: "Washing", state_idle: "Idle", state_nodata: "No data",
      ring_running: "ELAPSED", ring_idle: "IDLE",
      power: "Current power", current: "Current draw",
      last_cycle: "LAST CYCLE", start: "START", duration: "DURATION",
      energy: "ENERGY", cost: "COST",
      min: "min", kwh: "kWh", kw: "kW",
      today: "Today", yesterday: "Yesterday",
      tip_notify: "Finish notification", tip_plug: "Machine plug", tip_history: "History",
      locale: "en-GB", decimal: ".",
    },
    ru: {
      name: "Стиральная машина",
      badge_running: "В РАБОТЕ", badge_idle: "ОЖИДАНИЕ", badge_nodata: "НЕТ ДАННЫХ",
      state_running: "Идёт стирка", state_idle: "Ожидание", state_nodata: "Нет данных",
      ring_running: "ПРОШЛО", ring_idle: "ОЖИДАНИЕ",
      power: "Текущая мощность", current: "Текущий ток",
      last_cycle: "ПОСЛЕДНИЙ ЦИКЛ", start: "СТАРТ", duration: "ДЛИТЕЛЬН.",
      energy: "РАСХОД", cost: "СТОИМОСТЬ",
      min: "мин", kwh: "кВт·ч", kw: "кВт",
      today: "Сегодня", yesterday: "Вчера",
      tip_notify: "Уведомление об окончании", tip_plug: "Розетка машины", tip_history: "История",
      locale: "ru-RU", decimal: ",",
    },
    de: {
      name: "Waschmaschine",
      badge_running: "LÄUFT", badge_idle: "BEREIT", badge_nodata: "KEINE DATEN",
      state_running: "Läuft", state_idle: "Bereit", state_nodata: "Keine Daten",
      ring_running: "VERGANGEN", ring_idle: "BEREIT",
      power: "Aktuelle Leistung", current: "Stromaufnahme",
      last_cycle: "LETZTER DURCHGANG", start: "START", duration: "DAUER",
      energy: "VERBRAUCH", cost: "KOSTEN",
      min: "Min", kwh: "kWh", kw: "kW",
      today: "Heute", yesterday: "Gestern",
      tip_notify: "Benachrichtigung bei Ende", tip_plug: "Steckdose der Maschine", tip_history: "Verlauf",
      locale: "de-DE", decimal: ",",
    },
    fr: {
      name: "Lave-linge",
      badge_running: "EN MARCHE", badge_idle: "INACTIF", badge_nodata: "PAS DE DONNÉES",
      state_running: "Lavage en cours", state_idle: "Inactif", state_nodata: "Pas de données",
      ring_running: "ÉCOULÉ", ring_idle: "INACTIF",
      power: "Puissance actuelle", current: "Courant instantané",
      last_cycle: "DERNIER CYCLE", start: "DÉPART", duration: "DURÉE",
      energy: "ÉNERGIE", cost: "COÛT",
      min: "min", kwh: "kWh", kw: "kW",
      today: "Aujourd'hui", yesterday: "Hier",
      tip_notify: "Notification de fin", tip_plug: "Prise machine", tip_history: "Historique",
      locale: "fr-FR", decimal: ",",
    },
    nl: {
      name: "Wasmachine",
      badge_running: "BEZIG", badge_idle: "INACTIEF", badge_nodata: "GEEN DATA",
      state_running: "Wassen", state_idle: "Inactief", state_nodata: "Geen data",
      ring_running: "VERSTREKEN", ring_idle: "INACTIEF",
      power: "Huidig vermogen", current: "Huidig verbruik",
      last_cycle: "LAATSTE CYCLUS", start: "START", duration: "DUUR",
      energy: "ENERGIE", cost: "KOSTEN",
      min: "min", kwh: "kWh", kw: "kW",
      today: "Vandaag", yesterday: "Gisteren",
      tip_notify: "Melding bij klaar", tip_plug: "Stekker wasmachine", tip_history: "Geschiedenis",
      locale: "nl-NL", decimal: ",",
    },
  };

  static DEFAULTS = {
    currency: "€",
    running_states: [
      "стирка", "washing", "running", "run", "wash", "on", "spin", "отжим", "полоскание", "rinse",
      "waschen", "läuft", "schleudern", "spülen", "trocknen",
      "lavage", "en cours", "essorage", "rincage", "rinçage",
      "wassen", "loopt", "centrifugeren", "spoelen", "drogen",
    ],
    power_threshold: 10,  // above this the machine counts as running (if power_entity is set)
    power_max: 2500,      // gauge maximum, in power_entity units
  };

  setConfig(config) {
    if (!config.status_entity) {
      throw new Error("washing-machine-card: status_entity is required");
    }
    this._config = { ...WashingMachineCard.DEFAULTS, ...config };
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

  // Tick every 30 s so the elapsed time stays fresh without state changes
  connectedCallback() {
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (this._hass && this._built && this._isRunning()) this._update();
    }, 30000);
  }

  disconnectedCallback() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  // ---------------------------------------------------------------- helpers

  get _t() {
    const S = WashingMachineCard.STRINGS;
    const cfg = this._config?.language;
    if (cfg && S[cfg]) return S[cfg];
    const haLang = (this._hass?.locale?.language || this._hass?.language || "en").toLowerCase();
    // Match the full tag first ("pt-br"), then the base language ("pt"),
    // so adding a new entry to STRINGS is all a new translation needs.
    return S[haLang] || S[haLang.split(/[-_]/)[0]] || S.en;
  }

  _st(entityId) {
    return entityId ? this._hass.states[entityId] : undefined;
  }

  _isRunning() {
    const c = this._config;
    const status = this._st(c.status_entity);
    const byStatus =
      status && c.running_states.includes(String(status.state).toLowerCase());
    let byPower = false;
    if (c.power_entity) {
      const p = parseFloat(this._st(c.power_entity)?.state);
      byPower = !isNaN(p) && p > c.power_threshold;
    }
    return byStatus || byPower;
  }

  _parseDate(state) {
    if (!state || ["unknown", "unavailable", "none"].includes(String(state).toLowerCase()))
      return null;
    // input_datetime returns "YYYY-MM-DD HH:MM:SS" — make it ISO
    const d = new Date(String(state).replace(" ", "T"));
    return isNaN(d) ? null : d;
  }

  _fmtDateTime(state) {
    const t = this._t;
    const d = this._parseDate(state);
    if (!d) return "—";
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    const time = d.toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `${t.today}, ${time}`;
    if (d.toDateString() === yest.toDateString()) return `${t.yesterday}, ${time}`;
    return d.toLocaleDateString(t.locale, { day: "numeric", month: "short" }) + `, ${time}`;
  }

  // "1:23" — hours:minutes since the start date
  _fmtClock(fromDate) {
    const s = Math.max(0, Math.floor((Date.now() - fromDate.getTime()) / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}:${String(m).padStart(2, "0")}`;
  }

  _fmtNum(value, digits = 2) {
    const n = parseFloat(value);
    if (isNaN(n)) return null;
    return n.toFixed(digits).replace(/\.?0+$/, "").replace(".", this._t.decimal);
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
    const svcDomain = ["switch", "light", "input_boolean", "fan", "automation"].includes(domain)
      ? domain
      : "homeassistant";
    this._hass.callService(svcDomain, "toggle", { entity_id: entityId });
  }

  // ---------------------------------------------------------------- build

  _build() {
    const c = this._config;
    const t = this._t;
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host { display: block; }
        ha-card {
          display: block;
          border-radius: 24px;
          padding: 16px 16px 14px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(180deg, #edf3fb 0%, #e4edf8 55%, #dfe9f6 100%);
          color: #1c2733;
          font-family: var(--paper-font-body1_-_font-family, inherit);
          box-shadow: var(--ha-card-box-shadow, 0 6px 20px rgba(38, 63, 97, .10));
        }
        /* blue accent bar along the top edge, Oikos-style */
        ha-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, #2f80ed, #56a8ff);
        }
        .wrap { container-type: inline-size; }

        /* -------- header -------- */
        .header { display: flex; align-items: center; gap: 10px; }
        .h-icon {
          width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
          background: #fff; box-shadow: 0 3px 10px rgba(47,128,237,.18);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
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
          background: #e3e8ee; color: #6b7684; white-space: nowrap;
        }
        /* in a narrow column the badge collapses to a dot so the title survives */
        @container (max-width: 430px) {
          #badgeText { display: none; }
          .badge { padding: 6px 8px; }
          .header { gap: 8px; }
          .h-title { font-size: 15.5px; }
        }
        .badge .b-dot { width: 7px; height: 7px; border-radius: 50%; background: #9aa5b1; }
        .running .badge { background: #d9f2e2; color: #1c9a55; }
        .running .badge .b-dot { background: #22b263; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,178,99,.45); }
          50%      { box-shadow: 0 0 0 5px rgba(34,178,99,0); }
        }
        .h-spacer { flex: 1; }
        .h-btn {
          width: 35px; height: 35px; border-radius: 12px; flex-shrink: 0;
          background: rgba(255,255,255,.75); border: 1px solid #d8e0ea;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #7d8894; transition: transform .12s ease;
        }
        .h-btn:active { transform: scale(.94); }
        .h-btn ha-icon { --mdc-icon-size: 19px; }
        .h-btn.on { color: #2f80ed; border-color: #b9d4f6; background: #eaf3fe; }

        /* -------- hero: the machine -------- */
        .hero { display: flex; justify-content: center; padding: 14px 0 6px; }
        .machine { width: 210px; max-width: 62%; cursor: pointer; }
        /* rotation center = door center (110, 128) — keep CSS and SVG in sync */
        .laundry { transform-origin: 110px 128px; }
        .arcs    { transform-origin: 110px 128px; }
        .running .arcs    { animation: spin 3s linear infinite; }        /* 1 turn per 3 s */
        .running .laundry { animation: tumble 3s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tumble {
          0%, 100% { transform: rotate(-14deg); }
          50%      { transform: rotate(16deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .running .arcs, .running .laundry, .running .badge .b-dot, .running .ring-anim { animation: none; }
        }

        /* -------- panels -------- */
        .panel {
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 18px; padding: 14px 16px; margin-top: 12px;
          box-shadow: 0 2px 10px rgba(38,63,97,.05);
        }

        /* status: progress ring + power gauge */
        .status-panel { display: flex; align-items: center; gap: 16px; }
        .ring-box { position: relative; width: 96px; height: 96px; flex-shrink: 0; cursor: pointer; }
        .ring-box svg { width: 100%; height: 100%; }
        .ring-track { stroke: #dde5ee; }
        .ring-arc   { stroke: #2f80ed; stroke-linecap: round; }
        .ring-anim  { transform-origin: 48px 48px; }
        .running .ring-anim { animation: spin 1.8s linear infinite; }
        .ring-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .ring-time { font-size: 19px; font-weight: 800; line-height: 1; }
        .ring-label {
          font-size: 8px; font-weight: 700; letter-spacing: .8px; color: #8a95a3;
          margin-top: 3px; max-width: 58px; overflow: hidden; white-space: nowrap;
        }
        .st-col { flex: 1; min-width: 0; }
        .st-state { font-size: 16.5px; font-weight: 700; }
        .st-row {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-top: 9px; gap: 8px;
        }
        .st-power-label { font-size: 13px; color: #7d8894; }
        .st-power { font-size: 18px; font-weight: 800; white-space: nowrap; cursor: pointer; }
        .bar {
          height: 10px; border-radius: 6px; background: #e2e9f1;
          margin-top: 8px; overflow: hidden;
        }
        .bar-fill {
          height: 100%; border-radius: 6px; width: 0%;
          background: linear-gradient(90deg, #ff6a5e, #d93025);
          transition: width .6s ease;
        }
        .idle .bar-fill { background: #c4cdd8; }

        /* last cycle */
        .lc-title {
          font-size: 11px; font-weight: 800; letter-spacing: 1.4px; color: #8a95a3;
          margin-bottom: 10px;
        }
        .lc-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
        .lc-item { padding: 0 12px; border-left: 1px solid #e2e8f0; min-width: 0; cursor: pointer; }
        .lc-item:first-child { border-left: none; padding-left: 0; }
        .lc-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; color: #8a95a3; }
        .lc-value { font-size: 14.5px; font-weight: 800; margin-top: 5px; overflow-wrap: break-word; }
        .lc-unit { font-size: 11px; font-weight: 700; color: #2f80ed; }
        .hidden { display: none !important; }
        @container (max-width: 320px) {
          .lc-grid { grid-template-columns: 1fr 1fr; row-gap: 12px; }
          .lc-item:nth-child(3) { border-left: none; padding-left: 0; }
        }
      </style>

      <ha-card>
        <div class="wrap idle" id="wrap">

          <div class="header">
            <div class="h-icon" id="hIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2f80ed" stroke-width="1.9"
                   stroke-linecap="round" stroke-linejoin="round">
                <rect x="3.2" y="2.8" width="17.6" height="18.4" rx="3.4"/>
                <circle cx="12" cy="13" r="4.6"/>
                <circle cx="12" cy="13" r="1.6" fill="#2f80ed" stroke="none"/>
                <circle cx="7"  cy="6.2" r="1.05" fill="#2f80ed" stroke="none"/>
              </svg>
            </div>
            <div class="h-title" id="name"></div>
            <div class="badge"><span class="b-dot"></span><span id="badgeText"></span></div>
            <div class="h-spacer"></div>
            <div class="h-btn hidden" id="notifyBtn" title="${t.tip_notify}">
              <ha-icon icon="mdi:bell-ring-outline"></ha-icon>
            </div>
            <div class="h-btn hidden" id="plugBtn" title="${t.tip_plug}">
              <ha-icon icon="mdi:power-socket-eu"></ha-icon>
            </div>
            <div class="h-btn" id="chartBtn" title="${t.tip_history}">
              <ha-icon icon="mdi:chart-bar"></ha-icon>
            </div>
          </div>

          <div class="hero">
            <svg class="machine" id="machine" viewBox="0 0 220 232" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wm-body" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#ffffff"/>
                  <stop offset=".55" stop-color="#f2f5f9"/>
                  <stop offset="1" stop-color="#d9e0e9"/>
                </linearGradient>
                <radialGradient id="wm-glass" cx=".38" cy=".32" r=".95">
                  <stop offset="0" stop-color="#31456e"/>
                  <stop offset=".6" stop-color="#1e2c4d"/>
                  <stop offset="1" stop-color="#131d36"/>
                </radialGradient>
                <linearGradient id="wm-ring" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#ffffff"/>
                  <stop offset="1" stop-color="#d5dce5"/>
                </linearGradient>
              </defs>

              <!-- floor shadow -->
              <ellipse cx="110" cy="222" rx="76" ry="8" fill="#20304a" opacity=".16"/>

              <!-- body -->
              <rect x="30" y="8" width="160" height="204" rx="18" fill="url(#wm-body)"/>
              <rect x="30" y="8" width="160" height="204" rx="18" fill="none" stroke="#c7cfda" stroke-width="1.4"/>
              <!-- feet -->
              <rect x="48"  y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>
              <rect x="162" y="210" width="10" height="7" rx="3" fill="#9aa6b4"/>

              <!-- top panel -->
              <rect x="42" y="20" width="34" height="13" rx="4" fill="#cfd7e0"/>
              <rect x="42" y="20" width="34" height="6"  rx="3" fill="#dee5ec"/>
              <rect x="88" y="18" width="70" height="18" rx="9" fill="#0d1526"/>
              <text id="dispTime" x="116" y="31" text-anchor="middle"
                    font-family="ui-monospace, 'SF Mono', Consolas, monospace"
                    font-size="11.5" font-weight="700" fill="#e8f1ff" letter-spacing="1">--:--</text>
              <circle id="dispDot" cx="149" cy="27" r="2.4" fill="#22b263"/>
              <!-- timer knob -->
              <circle cx="176" cy="27" r="10" fill="#e9edf3" stroke="#c2cbd6" stroke-width="1.3"/>
              <circle cx="176" cy="27" r="3.2" fill="#31415a"/>
              <rect x="175.1" y="18.5" width="1.8" height="6.5" rx=".9" fill="#31415a"/>

              <!-- door -->
              <circle cx="110" cy="128" r="58" fill="url(#wm-ring)"/>
              <circle cx="110" cy="128" r="58" fill="none" stroke="#c2cbd6" stroke-width="1.4"/>
              <circle cx="110" cy="128" r="47" fill="#e3e9f0"/>
              <circle cx="110" cy="128" r="42" fill="url(#wm-glass)"/>

              <!-- laundry (tumbles while washing) -->
              <g class="laundry">
                <circle cx="100" cy="124" r="14"   fill="#ea4335"/>
                <circle cx="119" cy="131" r="13.2" fill="#4285f4"/>
                <circle cx="110" cy="115" r="11"   fill="#fbbc05"/>
                <circle cx="103" cy="135" r="8"    fill="#f28b82" opacity=".9"/>
              </g>
              <!-- glass highlight -->
              <ellipse cx="94" cy="106" rx="22" ry="13" fill="#ffffff" opacity=".14"
                       transform="rotate(-24 94 106)"/>
              <circle cx="110" cy="128" r="42" fill="none" stroke="#0d1526" stroke-width="2" opacity=".35"/>

              <!-- blue arcs around the door (spin while washing) -->
              <g class="arcs" transform-origin="110 128">
                <circle cx="110" cy="128" r="53" fill="none" stroke="#2f80ed" stroke-width="5.5"
                        stroke-linecap="round" stroke-dasharray="104 62.5" opacity=".95"/>
              </g>
            </svg>
          </div>

          <!-- status -->
          <div class="panel status-panel">
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

          <!-- last cycle -->
          <div class="panel hidden" id="lastCycle">
            <div class="lc-title">${t.last_cycle}</div>
            <div class="lc-grid">
              <div class="lc-item hidden" id="lcStart">
                <div class="lc-label">${t.start}</div>
                <div class="lc-value" id="lcStartV">—</div>
              </div>
              <div class="lc-item hidden" id="lcDuration">
                <div class="lc-label">${t.duration}</div>
                <div class="lc-value" id="lcDurationV">—</div>
              </div>
              <div class="lc-item hidden" id="lcEnergy">
                <div class="lc-label">${t.energy}</div>
                <div class="lc-value" id="lcEnergyV">—</div>
              </div>
              <div class="lc-item hidden" id="lcCost">
                <div class="lc-label">${t.cost}</div>
                <div class="lc-value" id="lcCostV">—</div>
              </div>
            </div>
          </div>

        </div>
      </ha-card>
    `;

    this._el = (id) => root.getElementById(id);

    // handlers
    const mi = (ent) => () => this._moreInfo(ent);
    this._el("machine").addEventListener("click", mi(c.status_entity));
    this._el("hIcon").addEventListener("click", mi(c.status_entity));
    this._el("chartBtn").addEventListener("click", mi(c.power_entity || c.status_entity));
    this._el("ringBox").addEventListener("click", mi(c.last_wash_entity || c.status_entity));
    if (c.power_entity)
      this._el("powerValue").addEventListener("click", mi(c.power_entity));
    if (c.notify_entity)
      this._el("notifyBtn").addEventListener("click", () => this._toggle(c.notify_entity));
    if (c.plug_entity)
      this._el("plugBtn").addEventListener("click", () => this._toggle(c.plug_entity));
    if (c.last_wash_entity)
      this._el("lcStart").addEventListener("click", mi(c.last_wash_entity));
    if (c.duration_entity)
      this._el("lcDuration").addEventListener("click", mi(c.duration_entity));
    if (c.energy_entity)
      this._el("lcEnergy").addEventListener("click", mi(c.energy_entity));
    if (c.cost_entity)
      this._el("lcCost").addEventListener("click", mi(c.cost_entity));

    this._built = true;
  }

  // ---------------------------------------------------------------- update

  _update() {
    const c = this._config;
    const t = this._t;
    const wrap = this._el("wrap");

    const running = this._isRunning();
    wrap.classList.toggle("running", running);
    wrap.classList.toggle("idle", !running);

    // header
    this._el("name").textContent = c.name || t.name;
    const status = this._st(c.status_entity);
    const noData = !status || ["unknown", "unavailable"].includes(status.state);
    this._el("badgeText").textContent = noData
      ? t.badge_nodata
      : running ? t.badge_running : t.badge_idle;

    // machine display + progress ring: elapsed washing time
    const start = running ? this._startDate() : null;
    const clock = start ? this._fmtClock(start) : null;
    this._el("dispTime").textContent = running ? (clock || "0:00") : "--:--";
    this._el("dispDot").setAttribute("fill", running ? "#22b263" : "#4a5871");
    this._el("ringTime").textContent = running ? (clock || "…") : "—";
    this._el("ringLabel").textContent = running ? t.ring_running : t.ring_idle;
    this._el("ringArc").style.display = running ? "" : "none";

    // status text
    this._el("stState").textContent = noData
      ? t.state_nodata
      : running ? t.state_running : t.state_idle;

    // power / current + gauge
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
      if (isNaN(p)) disp = "—";
      else if (["w", "вт"].includes(unitL) && Math.abs(p) >= 1000)
        disp = `${this._fmtNum(p / 1000, 2)} ${t.kw}`;   // 1950 W → "1.95 kW"
      else disp = `${Math.abs(p) >= 10 ? Math.round(p) : this._fmtNum(p, 2)} ${unit}`;
      this._el("powerValue").textContent = disp;
      const frac = isNaN(p) ? 0 : Math.min(1, Math.max(0, p / (c.power_max || 1)));
      this._el("barFill").style.width = `${Math.max(running ? 4 : 2, frac * 100)}%`;
    }

    // last cycle
    let anyLc = false;
    if (c.last_wash_entity) {
      const s = this._st(c.last_wash_entity);
      this._el("lcStart").classList.remove("hidden");
      this._el("lcStartV").textContent = s ? this._fmtDateTime(s.state) : "—";
      anyLc = true;
    }
    if (c.duration_entity) {
      const s = this._st(c.duration_entity);
      const v = this._fmtNum(s?.state, 0);
      this._el("lcDuration").classList.remove("hidden");
      this._el("lcDurationV").innerHTML =
        v !== null ? `${v} <span class="lc-unit">${t.min}</span>` : "—";
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
    if (anyLc) this._el("lastCycle").classList.remove("hidden");

    // toggle buttons
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

customElements.define("washing-machine-card", WashingMachineCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "washing-machine-card",
  name: "Washing Machine Animated Card",
  description: "Oikos-style animated washing machine card: live status, power gauge and last-cycle stats",
});

/* ============================================================
   Example configuration / Пример конфигурации:

type: custom:washing-machine-card
name: Washing machine                       # card title / название
status_entity: binary_sensor.washing_in_progress  # REQUIRED / обязательный
plug_entity: switch.washing_machine_plug    # plug button, tap = toggle
notify_entity: automation.washing_finished  # notification button, tap = toggle
power_entity: sensor.washing_machine_power  # gauge + running detection
power_threshold: 10                         # running above this value
power_max: 2500                             # gauge maximum
last_wash_entity: input_datetime.wm_last_start   # cycle start timestamp
duration_entity: input_number.wm_last_duration   # cycle duration, minutes
energy_entity: input_number.wm_last_energy  # kWh per cycle
cost_entity: input_number.wm_last_cost      # cost per cycle
currency: "€"
language: en                                # en / ru / de / fr (default: HA language)
============================================================ */
