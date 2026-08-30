# 🧺 Geanimeerde wasmachinekaart voor Home Assistant

[English](README.md) | [Русский](README_RU.md) | [Deutsch](README_DE.md) | [Français](README_FR.md) | **Nederlands**

Een op Oikos geïnspireerde Lovelace-kaart die van een *niet-slimme* wasmachine op een schakelbaar stopcontact een mooi, geanimeerd dashboardwidget maakt — zonder dat er een slimme wasmachine aan te pas komt.

![Demo](media/demo_nl.gif)

<sub>Demo in andere interfacetalen: [English](media/demo_en.gif) · [Русский](media/demo.gif) · [Deutsch](media/demo_de.gif) · [Français](media/demo_fr.gif)</sub>

## ✨ Functies

- **Geanimeerde machine** – tijdens een wasbeurt draait de was achter het patrijspoortje rond, cirkelen er blauwe bogen om de deur (één omwenteling per 3 s) en toont het display op de machine de verstreken tijd. De volledige animatie is puur CSS en SVG, zonder externe bestanden, en houdt rekening met `prefers-reduced-motion`.
- **Live status** – een pulserend "BEZIG / KLAAR"-badge, een ring met de verstreken tijd en een vermogensindicator die zelf de eenheid kiest (`1950 W` wordt weergegeven als `1,95 kW`; is er een stroomsensor gekoppeld, dan heet het label automatisch "Stroomverbruik").
- **Laatste wasbeurt** – starttijd ("Vandaag, 09:55"), duur, verbruik en kosten. Elke kolom opent bij een tik het more-info-dialoogvenster.
- **Snelknoppen** – de knoppen in de koptekst schakelen het stopcontact en de meldingsautomatisering, en openen de vermogensgeschiedenis.
- **Vier talen** – Duits, Engels, Russisch en Frans standaard aanwezig (en nu ook Nederlands). De taal volgt je Home Assistant-profiel, of wordt vast ingesteld met `language: de | en | ru | fr | nl`.
- **Geen afhankelijkheden** – één enkel vanilla-JS-bestand met Shadow DOM. Alle entity-opties behalve `status_entity` zijn optioneel; blokken zonder entity worden gewoon verborgen. Responsief via CSS Container Queries.

## 📦 Installatie

### Handmatig

1. Kopieer [`washing-machine-card.js`](washing-machine-card.js) naar `/config/www/`.
2. Voeg een dashboardbron toe (Instellingen → Dashboards → Bronnen, of `lovelace: resources:` in YAML-modus):

   ```yaml
   url: /local/washing-machine-card.js?v=1
   type: module
   ```

   Verhoog `?v=` na elke update, zodat de browser het nieuwe bestand laadt in plaats van de oude versie uit de cache.

### HACS

Voeg `https://github.com/sionetta/wm_animated_ha_card` toe als **aangepaste repository** (type: Dashboard) en installeer *Washing Machine Animated Card*.

## ⚙️ Configuratie

```yaml
type: custom:washing-machine-card
name: Wasmachine
status_entity: binary_sensor.washing_in_progress   # VERPLICHT
plug_entity: switch.washing_machine_plug           # Stopcontact-knop, tik om te schakelen
notify_entity: automation.washing_finished         # Meldingsknop, tik om te schakelen
power_entity: sensor.washing_machine_power         # Schaal en detectie of de machine draait
power_threshold: 10                                # daarboven geldt de machine als draaiend
power_max: 2500                                    # bovengrens van de schaal
last_wash_entity: input_datetime.wm_last_start     # starttijdstip van de wasbeurt
duration_entity: input_number.wm_last_duration     # duur van de wasbeurt in minuten
energy_entity: input_number.wm_last_energy         # kWh per wasbeurt
cost_entity: input_number.wm_last_cost             # kosten per wasbeurt
currency: "€"
language: nl                                       # de / en / ru / fr / nl (standaard: HA-taal)
```

| Optie | Verplicht | Standaard | Beschrijving |
|---|---|---|---|
| `status_entity` | **ja** | – | Entity waarvan de status een lopende wasbeurt aangeeft. Een template-`binary_sensor` op basis van het vermogen of de stroom van het stopcontact werkt het best. Tekststatussen (`washing`, `schleudern`, …) worden herkend via `running_states`. |
| `name` | nee | vertaald | Titel van de kaart. |
| `plug_entity` | nee | – | Schakelaar van het stopcontact. Verschijnt als knop in de koptekst, tik om te schakelen. |
| `notify_entity` | nee | – | Automatisering, `switch` of `input_boolean` voor de melding "wasbeurt klaar". Tik om te schakelen. |
| `power_entity` | nee | – | Sensor voor vermogen (W) of stroom (A): rode schaal, waardeweergave, en detecteert bovendien of de machine draait. |
| `power_threshold` | nee | `10` | Boven deze waarde geldt de machine als draaiend. |
| `power_max` | nee | `2500` | Bovengrens van de schaal, in de eenheid van `power_entity`. |
| `last_wash_entity` | nee | – | `input_datetime` met de starttijd van de wasbeurt. Hieruit wordt ook de verstreken tijd berekend. |
| `duration_entity` | nee | – | Duur van de laatste wasbeurt in minuten. |
| `energy_entity` | nee | – | Verbruik per wasbeurt in kWh. |
| `cost_entity` | nee | – | Kosten per wasbeurt. |
| `currency` | nee | `€` | Valutateken voor de kostenkolom. |
| `running_states` | nee | on, washing, waschen, run, schleudern, … | Statussen van `status_entity` die als "draaiend" gelden (Duitse, Engelse, Russische en Franse statussen worden herkend). |
| `language` | nee | HA-taal | `de`, `en`, `ru`, `fr` of `nl`. |

## 🧠 Zo werkt het met een niet-slimme machine

De machine zelf meldt helemaal niets. Alles wordt afgeleid van een stopcontact met vermogensmeting:

- een template-`binary_sensor` levert de status. Die schakelt aan zodra het vermogen boven een drempelwaarde komt, en blijft met `delay_off` nog een paar minuten aan staan, zodat pauzes midden in een wasbeurt niet meteen als "klaar" tellen.
- een kleine automatisering onthoudt de starttijd in een `input_datetime` en schrijft aan het einde duur, verbruik en kosten weg naar `input_number`-helpers. Precies die toont de kaart in het gedeelte "Laatste wasbeurt".

Een kant-en-klaar Home Assistant-package met deze sensoren, helpers en automatiseringen staat in [`examples/washing_machine_package.yaml`](examples/washing_machine_package.yaml).

## 🔌 Gebruik met een slimme machine

Als je wasmachine of droger de eigen status al zelf meldt, heb je het stopcontact
en de helpers niet nodig. Home Connect (Bosch / Siemens / Neff / Gaggenau),
Miele@home, LG ThinQ en SmartHQ leveren allemaal een entity voor de bedrijfsstatus,
dus `status_entity` kan daar direct naar wijzen:

```yaml
type: custom:washing-machine-card
name: Wasmachine
status_entity: sensor.washer_operation_state
plug_entity: switch.washer_power
running_states: [run]
```

Voor een droger ziet de configuratie er precies zo uit, alleen met een ander
voorvoegsel. Beperk `running_states` tot die ene status die echt "draait"
betekent. Anders geldt een apparaat dat alleen maar gepauzeerd is of ingeschakeld
staat, al als draaiend.

In [`examples/smart_appliance.yaml`](examples/smart_appliance.yaml) staat de
uitgebreide variant: met voortgang, eindtijd en deurstatus, waarvoor de kaart
geen eigen opties heeft, plus aanwijzingen over welke gedeeltes in deze opzet
leeg blijven en waarom.

## 📄 Licentie

[MIT](LICENSE) © 2026 [sionetta](https://github.com/sionetta)
