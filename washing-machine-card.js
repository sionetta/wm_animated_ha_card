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
                drying_rack: { name: "Drying rack", state_running: "Drying" },
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
            running_states: [
                "стирка", "отжим", "полоскание",
            ],
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
                drying_rack: { name: "Wäscheständer", state_running: "Trocknet" },
            },
            running_states: [
                "waschen", "läuft", "schleudern", "spülen", "trocknen",
                "backen", "heizen", "erwärmen",
            ],
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
                drying_rack: { name: "Étendoir", state_running: "Séchage en cours" },
            },
            running_states: [
                "lavage", "en cours", "essorage", "rincage", "rinçage",
                "cuisson", "chauffage", "réchauffage", "rechauffage", "séchage", "sechage",
            ],
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
                "bakken", "verwarmen",
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
                drying_rack: { name: "Estendal de roupa", state_running: "Secando" },
            },
            running_states: [
                "lavando", "lavagem", "lavagem longa", "lavagem normal", "lavagem curta", "em andamento", "rodando",
                "centrifugação", "centrifugacao", "centrifugando", "enxágue", "enxague", "enxaguando", "enxaguar",
                "secando", "secagem", "secar",
                "assando", "assar", "cozinhando", "cozinhar", "aquecendo", "aquecer", "micro-ondas", "forno",
            ],
        },
        el: {
            name: "Πλυντήριο ρούχων
