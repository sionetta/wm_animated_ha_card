# 🏠 Animierte Gerätekarte für Home Assistant

[English](README.md) | [Русский](README_RU.md) | **Deutsch** | [Français](README_FR.md) | [Nederlands](README_NL.md)

Eine Oikos-inspirierte Lovelace-Karte, die aus einer *nicht smarten* Waschmaschine, einem Trockner, Geschirrspüler, Backofen oder einer Mikrowelle an einer schaltbaren Steckdose ein schönes, animiertes Dashboard-Widget macht — ganz ohne smartes Gerät.

![Demo](media/demo_de.gif)

<sub>Dieselbe Karte in anderen Oberflächensprachen: [English](media/demo_en.gif) · [Русский](media/demo_ru.gif) · [Français](media/demo_fr.gif) · [Nederlands](media/demo_nl.gif) · [Português](media/demo_pt.gif)</sub>

## ✨ Funktionen

- **Fünf Geräte, eine Karte** – `washer`, `dryer`, `dishwasher`, `oven` und `microwave`, jedes mit eigener Illustration, eigenem Icon und eigenen Texten. Umschalten mit einer Zeile: `appliance_type: dryer`.
- **Animation im Betrieb** – die Wäsche dreht sich hinter dem Bullauge, im Geschirrspüler schwenkt der Sprüharm, der Backofen glüht, in der Mikrowelle dreht sich der Teller. Alles reines CSS und SVG, ohne externe Dateien, und `prefers-reduced-motion` wird berücksichtigt.
- **Helles und dunkles Design** – die Karte folgt automatisch dem Home-Assistant-Theme oder wird mit `theme: light | dark` festgelegt. Ein vierter Wert, `theme: ha`, verzichtet auf die eigene Palette der Karte und übernimmt die Farben deines aktiven Home-Assistant-Themes.
- **Live-Status** – ein pulsierendes „LÄUFT / BEREIT“-Badge, ein Ring mit der verstrichenen Zeit und eine Leistungsanzeige, die die Einheit selbst wählt (`1950 W` erscheint als `1,95 kW`; hängt ein Stromsensor dran, heißt die Beschriftung automatisch „Stromaufnahme“).
- **Letzter Durchgang** – Startzeit („Heute, 09:55“), Dauer, Verbrauch und Kosten. Jede Spalte öffnet per Tippen den More-Info-Dialog.
- **Schnellzugriffe** – Buttons in der Kopfzeile schalten die Steckdose und die Benachrichtigungs-Automatisierung und öffnen den Leistungsverlauf.
- **Sechs Sprachen** – Deutsch, Englisch, Russisch, Französisch, Niederländisch und Portugiesisch von Haus aus. Die Sprache folgt deinem Home-Assistant-Profil oder wird mit `language: de | en | ru | fr | nl | pt` fest gesetzt.
- **Visueller Editor** – die Karte liefert ein Konfigurationsformular mit, lässt sich also ohne YAML über die Oberfläche einrichten.
- **Keine Abhängigkeiten** – eine einzige Vanilla-JS-Datei mit Shadow DOM. Alle Entity-Optionen außer `status_entity` sind optional, Blöcke ohne Entity werden einfach ausgeblendet. Passt sich der Breite an – von der vollen Dashboard-Spalte bis zum schmalen Handy-Layout.

## 🌗 Hell und dunkel

![Helles und dunkles Design](media/themes_de.jpg)

`theme: auto` (Standard) folgt Home Assistant: Stellst du dein Dashboard auf ein dunkles Theme um, zieht die Karte beim nächsten Rendern nach. `light` und `dark` legen das Aussehen unabhängig vom Dashboard fest. `theme: ha` funktioniert anders: Statt der eigenen Palette übernimmt die Karte die Farben des aktiven Home-Assistant-Themes und fügt sich so in ein eigenes Theme ein.

## 📦 Installation

Zwei Schritte: zuerst die Karte selbst, dann die Entitäten, die sie anzeigt.

### Schritt 1 — die Karte

**Manuell**

1. Kopiere [`washing-machine-card.js`](washing-machine-card.js) nach `/config/www/`.
2. Füge eine Dashboard-Ressource hinzu (Einstellungen → Dashboards → Ressourcen oder `lovelace: resources:` im YAML-Modus):

   ```yaml
   url: /local/washing-machine-card.js?v=6
   type: module
   ```

   Zähle `?v=` nach jedem Update hoch, damit der Browser die neue Datei lädt und nicht die alte aus dem Cache.

**HACS**

Füge `https://github.com/sionetta/wm_animated_ha_card` als **benutzerdefiniertes Repository** hinzu (Typ: Dashboard) und installiere *Washing Machine Animated Card*.

### Schritt 2 — die Entitäten des Geräts

Die Karte zeigt nur an, und `status_entity` ist Pflicht — dieser Schritt lässt sich nicht überspringen.

**Ein smartes Gerät** (Home Connect, Miele@home, LG ThinQ, SmartHQ) meldet seinen Zustand bereits selbst — weiter zum Abschnitt „Verwendung mit einem smarten Gerät“ weiter unten.

**Ein normales Gerät an einer smarten Steckdose** — das fertige Package legt alles an:

1. Finde die Sensoren deiner Steckdose unter Entwicklerwerkzeuge → Zustände: Leistung (W) und Gesamtenergie (kWh), z. B. `sensor.washer_plug_power` und `sensor.washer_plug_energy`.

2. Aktiviere Packages in der `configuration.yaml` (falls es den Block `homeassistant:` schon gibt, ergänze die Zeile dort):

   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

3. Kopiere [`examples/washing_machine_package.yaml`](examples/washing_machine_package.yaml) nach `/config/packages/washing_machine.yaml`.

4. Ersetze darin `sensor.YOUR_PLUG_power` und `sensor.YOUR_PLUG_energy` durch deine eigenen.

5. Starte Home Assistant neu.

6. Trage deinen Strompreis in `input_number.el_tarif` ein — er steht standardmäßig auf null, und ohne Tarif bleiben die Kosten pro Zyklus immer `0.00`.

7. Prüfe, dass die Entitäten angelegt wurden:

   | Entität | Zweck |
   |---|---|
   | `binary_sensor.washing_in_progress` | für `status_entity` |
   | `input_datetime.wm_last_start` | Start des Zyklus |
   | `input_number.wm_last_duration` | Dauer |
   | `input_number.wm_last_energy` | Verbrauch |
   | `input_number.wm_last_cost` | Kosten |
   | `input_number.el_tarif` | dein Tarif (Schritt 6) |
   | `input_number.wm_energy_start` | intern |

8. Füge die Karte zum Dashboard hinzu — siehe Abschnitt „Konfiguration“ weiter unten.

> Die Benachrichtigung kommt als `persistent_notification`. Für dein Handy ersetze den letzten Block der Automatisierung durch dein eigenes `notify.mobile_app_...`.
>
> Für Trockner, Geschirrspüler, Backofen oder Mikrowelle kopiere das Package unter anderem Namen mit anderen Entitäts-Präfixen und setze auf der Karte den passenden `appliance_type`.
>
> Ohne Packages: dieselben Helfer lassen sich in der Home-Assistant-Oberfläche anlegen und die Automatisierungen im Automatisierungs-Editor einfügen (⋮ → In YAML bearbeiten).

## ⚙️ Konfiguration

```yaml
type: custom:washing-machine-card
appliance_type: washer                             # washer | dryer | dishwasher | oven | microwave
name: Waschmaschine
status_entity: binary_sensor.washing_in_progress   # PFLICHT
plug_entity: switch.washing_machine_plug           # Steckdosen-Button, Tippen schaltet um
notify_entity: automation.washing_finished         # Benachrichtigungs-Button, Tippen schaltet um
image_tap_action:                                  # Tippen auf die Illustration (optional)
  action: navigate
  navigation_path: /lovelace/laundry
power_entity: sensor.washing_machine_power         # Anzeige + Laufterkennung
power_threshold: 10                                # darüber gilt das Gerät als laufend
standby_threshold: 1                               # optional: Gerät an, kein Durchgang → STANDBY
power_max: 2500                                    # Maximum der Anzeige
last_wash_entity: input_datetime.wm_last_start     # Startzeitpunkt des Durchgangs
duration_entity: input_number.wm_last_duration     # Dauer des Durchgangs, Minuten
energy_entity: input_number.wm_last_energy         # kWh pro Durchgang
cost_entity: input_number.wm_last_cost             # Kosten pro Durchgang
hide_status_panel: true                            # Statusanzeige nur ausblenden, wenn inaktiv (Standard: false)
show_raw_status: false                             # Zeigt den Rohwert der Statusentität im Statusbereich der Karte an (Standard: false)
duration_format: minutes                           # minutes / hhmm
confirm_plug_off: true                             # Zeigt ein Bestätigungs-Popup an, bevor die `plug_entity` ausgeschaltet wird
currency: "€"
language: de                                       # auto / de / en / ru / fr / nl / pt (auto = HA-Sprache folgen)
theme: auto                                        # auto / light / dark / ha
```

| Option | Pflicht | Standard | Beschreibung |
|---|---|---|---|
| `status_entity` | **ja** | – | Entity, deren Zustand einen laufenden Durchgang kennzeichnet. Ein Template-`binary_sensor` auf Leistung oder Strom der Steckdose eignet sich am besten. Textzustände (`washing`, `schleudern`, …) werden über `running_states` erkannt. |
| `appliance_type` | nein | `washer` | Optik + Texte: `washer`, `dryer` (Alias `tumbler`), `dishwasher`, `oven` oder `microwave`. |
| `name` | nein | übersetzt | Titel der Karte (Default hängt von `appliance_type` ab). |
| `plug_entity` | nein | – | Schalter der Steckdose. Erscheint als Button in der Kopfzeile, Tippen schaltet um. |
| `notify_entity` | nein | – | Automatisierung, `switch` oder `input_boolean` für die Benachrichtigung „Durchgang beendet“. Tippen schaltet um. |
| `image_tap_action` | nein | – | Was ein Tippen auf die Geräte-Illustration auslöst – mit den Standard-[Aktionen](https://www.home-assistant.io/dashboards/actions/) von Home Assistant: `navigate`, `url`, `more-info`, `perform-action` usw. Nicht gesetzt: Tippen bewirkt nichts. |
| `power_entity` | nein | – | Sensor für Leistung (W) oder Strom (A): rote Skala, Wertanzeige, und er unterscheidet einen laufenden Durchgang von einer Pause – siehe `power_threshold`. |
| `power_threshold` | nein | `10` | Mit einem `power_entity` wird ein laufender Durchgang, der weniger als diesen Wert zieht, als **Pause** angezeigt statt als laufend. Ohne den Sensor kann die Karte beides nicht unterscheiden, und allein `status_entity` entscheidet. |
| `standby_threshold` | nein | – | Mit einem `power_entity`: läuft kein Durchgang, zieht das Gerät aber noch mehr als diesen Wert (W), zeigt die Karte **Standby** statt Aus – praktisch, wenn die Steckdose immer an ist und das Gerät nach dem Durchgang nicht ausgeschaltet wurde. Knapp über dem Wert wählen, den die Steckdose bei ausgeschaltetem Gerät meldet (meist `0`–`1`). Nicht gesetzt: kein Standby-Zustand. |
| `power_max` | nein | `2500` | Maximum der Skala, in Einheiten von `power_entity`. |
| `last_wash_entity` | nein | – | `input_datetime` mit dem Start des Durchgangs; daraus wird auch die verstrichene Zeit berechnet. |
| `duration_entity` | nein | – | Dauer des letzten Durchgangs in Minuten. |
| `energy_entity` | nein | – | Energie pro Durchgang, kWh. |
| `cost_entity` | nein | – | Kosten pro Durchgang. |
| `currency` | nein | `€` | Währungssymbol für die Kostenspalte. |
| `running_states` | nein | on, washing, waschen, run, schleudern, … | Zustände von `status_entity`, die als „laufend“ gelten (deutsche, englische, russische, französische, niederländische und portugiesische Zustände werden erkannt). |
| `hide_status_panel` | nein | false | Statusanzeige nur ausblenden, wenn inaktiv. |
| `show_raw_status` | nein | false | Zeigt den Rohwert von `status_entity` im Statusbereich der Karte an. Dies ist nützlich, wenn ein Smart-Gerät seinen Status direkt übermittelt. Der Status muss weiterhin mit einem der in `running_states` definierten Werte übereinstimmen.|
| `duration_format` | nein | minutes | `minutes`, `hhmm`. Formatiert die Dauer des letzten Durchgangs. Ist `duration_format` auf `hhmm` gesetzt und dauert der Durchgang 60 Minuten oder länger, wird der Wert im Format HHhMM angezeigt (zum Beispiel 1h05). |
| `confirm_plug_off` | nein | true | Zeigt ein Bestätigungs-Popup an, bevor die `plug_entity` ausgeschaltet wird. |
| `language` | nein | `auto` | `auto`, `de`, `en`, `ru`, `fr`, `nl` oder `pt`. |
| `theme` | nein | `auto` | `auto`, `light` und `dark` verwenden das eigene Styling der Karte. `ha` übernimmt stattdessen die Farben deines Home Assistant-Themes. |

## 🧺 Gerätetypen

| `appliance_type` | Standardtitel | Text im Betrieb |
|---|---|---|
| `washer` | Waschmaschine | Wäsche läuft |
| `dryer` (Alias `tumbler`) | Tumbler | Trocknet |
| `dishwasher` | Geschirrspüler | Spült |
| `oven` | Backofen | Backt |
| `microwave` | Mikrowelle | Erwärmt |

Titel und Texte sind in alle sechs Sprachen übersetzt; `name` überschreibt den Titel.

## 🧠 So funktioniert es mit einem nicht smarten Gerät

Das Gerät selbst meldet nichts – alles wird aus einer Steckdose mit Leistungsmessung abgeleitet:

- ein Template-`binary_sensor` (Leistung über einem Schwellwert, mit `delay_off` von einigen Minuten, damit Pausen innerhalb des Durchgangs nicht als „beendet“ zählen) liefert den Status;
- eine kleine Automatisierung speichert den Start des Durchgangs in `input_datetime` und schreibt am Ende Dauer, Verbrauch und Kosten in `input_number`-Helfer, die die Karte im Bereich „Letzter Durchgang“ anzeigt.

Das fertige Package, das all das anlegt, wird oben in Schritt 2 installiert.

## 🔌 Verwendung mit einem smarten Gerät

Meldet dein Gerät seinen Zustand bereits selbst, brauchst du weder die Steckdose noch
die Helfer. Home Connect (Bosch / Siemens / Neff / Gaggenau), Miele@home, LG ThinQ und
SmartHQ stellen eine Entity für den Betriebszustand bereit, sodass `status_entity`
direkt darauf zeigen kann:

```yaml
type: custom:washing-machine-card
appliance_type: washer
status_entity: sensor.washer_operation_state
plug_entity: switch.washer_power
running_states: [run]
show_raw_status: true
```

Für Trockner, Geschirrspüler, Backofen oder Mikrowelle dieselbe Config – nur
`appliance_type` und der Entity-Präfix ändern sich. `running_states` eng halten auf den
einen Zustand, der wirklich „läuft“ bedeutet, sonst gilt ein pausiertes oder nur
eingeschaltetes Gerät schon als laufend.

In [`examples/smart_appliance.yaml`](examples/smart_appliance.yaml) steht die
ausführliche Variante: dazu Fortschritt, Endzeit und Türzustand, für die die Karte
keine eigenen Optionen hat, samt Hinweisen, was leer bleibt und warum.

## 📝 Änderungsverlauf

Die Release-Historie steht in [CHANGELOG.md](CHANGELOG.md).

## ☕ Projekt unterstützen

Die Karte ist kostenlos und Open Source. Wenn sie dein Zuhause ein wenig schöner macht und du Danke sagen möchtest, kannst du mir [auf Ko-fi einen Kaffee spendieren](https://ko-fi.com/sionetta). Ein Stern auf GitHub oder eine Empfehlung an andere Home-Assistant-Nutzer hilft genauso.

## 📄 Lizenz

[MIT](LICENSE) © 2026 [sionetta](https://github.com/sionetta)
