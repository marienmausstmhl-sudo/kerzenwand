console.log("Kerzenwand JS geladen");

document.addEventListener('DOMContentLoaded', (event) => {

    const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTy5sQ05tYpxXhVsDSeKNem3BQYwYCHzu-93mNh_L_pD-MP2op9ITB6MA6nhk1hubHAK2637YNteIhw/pub?gid=50546960&single=true&output=csv";

    const KERZE_LEBENSDAUER_TAGE = 5;
    const KERZEN_PRO_REIHE = 5;

    const VERSES = [
        "„Dein Wort ist meines Fußes Leuchte und ein Licht auf meinem Wege.“ – Psalm 119,105",
        "„Der HERR ist mein Licht und mein Heil.“ – Psalm 27,1",
        "„Ich bin das Licht der Welt.“ – Johannes 8,12",
        "„Lasst euer Licht leuchten vor den Menschen.“ – Matthaeus 5,14–16",
        "„Der HERR macht meine Finsternis hell.“ – Psalm 18,29",
        "„Fuerchte dich nicht, denn ich bin mit dir.“ – Jesaja 41,10",
        "„Der HERR segne dich und behuete dich.“ – 4. Mose 6,24–26",
        "„Die Finsternis vergeht, und das wahre Licht scheint schon.“ – 1. Johannes 2,8",
        "„Denn bei dir ist die Quelle des Lebens.“ – Psalm 36,10"
    ];

    const BILDER = {
        "Marienkirche":
            "https://8wctp6.sandbox.churchdesk.site/uploads/xXxagT9d/MarienKerze__msi___png.png",

        "Ichthys":
            "https://8wctp6.sandbox.churchdesk.site/uploads/eOk1g2Ro/IchthysKerze__msi___png.png",

        "Heiliger Geist":
            "https://8wctp6.sandbox.churchdesk.site/uploads/NGShEax0/HeiligerGeist__msi___png.png",

        "Alpha und Omega":
            "https://8wctp6.sandbox.churchdesk.site/uploads/TYcQ2OjH/AlphaOmegaKerze__msi___png.png",

        "Christusmonogramm": "https://8wctp6.sandbox.churchdesk.site/uploads/ATTLgnl7/ChristusmonogrammKerze__msi___png.png",

        "Kleeblatt": "https://8wctp6.sandbox.churchdesk.site/uploads/nByD5i5x/KleeblattKerze__msi___png.png",

        "Herz": "https://8wctp6.sandbox.churchdesk.site/uploads/VvPrZohd/HerzKerze__msi___png.png"
    };

    function parseCSVLine(line, sep) {
        const result = [];
        let cur = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];

            if (ch === '"') {
                if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                    cur += '"'; i++;
                } else inQuotes = !inQuotes;
            } else if (ch === sep && !inQuotes) {
                result.push(cur.trim()); cur = "";
            } else cur += ch;
        }
        result.push(cur.trim());
        return result.map(v => v.replace(/^"|"$/g, ""));
    }

    function parseGermanDate(d) {
        const parts = d.split(" ");
        const date = parts[0].split(".");
        const time = (parts[1] || "00:00:00").split(":");
        return new Date(
            Number(date[2]),
            Number(date[1]) - 1,
            Number(date[0]),
            Number(time[0]),
            Number(time[1]),
            Number(time[2] || 0)
        );
    }

    function createCandle(entry) {
        let verse = entry.text && entry.text.length
            ? entry.text
            : VERSES[Math.floor(Math.random() * VERSES.length)];

        const bildURL =
            BILDER[entry.bildname] ||
            "https://8wctp6.sandbox.churchdesk.site/uploads/WzxjldSf/KerzenLogoMarien3__msi___png.png";

        const hueShift   = (Math.random() * 10 - 5).toFixed(1);
        const brightness = (1.00 + Math.random() * 0.10).toFixed(2);

        const moveSpeed   = (2.5 + Math.random() * 2.0).toFixed(2);
        const driftSpeed  = (2.5 + Math.random() * 2.0).toFixed(2);
        const flickerSpd  = (0.08 + Math.random() * 0.25).toFixed(3);

        const moveDelay   = (-Math.random() * parseFloat(moveSpeed)).toFixed(2);
        const driftDelay  = (-Math.random() * parseFloat(driftSpeed)).toFixed(2);
        const blinkDelay  = (-Math.random() * 0.6).toFixed(2);

        const flameUpSpeed = (3.0 + Math.random() * 2.0).toFixed(2);
        const flameUpDelay = (Math.random() * 50 + 90).toFixed(2);

        const ampVariant = Math.floor(Math.random() * 3);

        let moveKey = "move";
        let moveLeftKey = "move-left";
        let flameUpKey = "candleFlameUp";

        if (ampVariant === 0) {
            moveKey = "moveSoft";
            moveLeftKey = "move-left-soft";
            flameUpKey = "candleFlameUpSoft";
        } else if (ampVariant === 2) {
            moveKey = "moveStrong";
            moveLeftKey = "move-left-strong";
            flameUpKey = "candleFlameUpStrong";
        }

        const kerze = document.createElement("div");
        kerze.style.cssText = `
    position:relative;
    width:200px;
    height:450px;
    background:linear-gradient(to bottom, #fffefb, #e6dcc7);
    border-radius:100px/40px;
    box-shadow:inset 0 0 30px rgba(255,255,255,0.3);
  `;

        kerze.innerHTML = `
    <!-- Oberes Oval -->
    <div style="
      position:absolute; top:0; left:50%;
      width:120px; height:20px;
      background:linear-gradient(to bottom,#fffefb,#e6dcc7);
      border-radius:60px/10px;
      transform:translateX(-50%);
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
    "></div>

    <!-- Docht -->
    <div style="
      position:absolute; top:-12px; left:50%;
      width:4px; height:20px;
      background:#1a0d00; border-radius:2px;
      transform:translateX(-50%);
    "></div>

    <!-- FLAMME -->
    <div class="flame-wrapper" style="
      filter:hue-rotate(${hueShift}deg) brightness(${brightness});
    ">
      <div class="flame-body" style="
        animation:
          ${moveKey} ${moveSpeed}s infinite ease-in-out ${moveDelay}s,
          ${moveLeftKey} ${driftSpeed}s infinite ease-in-out ${driftDelay}s,
          candleBlink ${flickerSpd}s infinite ${blinkDelay}s;
      ">
        <div class="flame-shadows"></div>
        <div class="flame-top" style="
          animation: ${flameUpKey} ${flameUpSpeed}s infinite ease-in-out ${flameUpDelay}s;
        "></div>
        <div class="flame-bottom"></div>
      </div>
    </div>

    <!-- Textbereich -->
    <div style="
      position:absolute; top:60px; width:100%;
      text-align:center; color:#5c3a1d; font-size:16px;
    ">
      <img src="${bildURL}"
     style="
        width:215px;
        position:relative;
        left:50%;
        transform:translateX(-50%);
        margin-bottom:10px;
     ">

      <div style="font-style:italic; margin:10px 0;">${verse}</div>

      <div style="font-style:italic; font-size:15px;">
        Fuer ${entry.fuer}<br>-<br>Von ${entry.von}
      </div>
    </div>
  `;

        return kerze;
    }

    function createShelf() {
        const ablage = document.createElement("div");
        ablage.style.cssText = `
    position:relative;
    width:100%;
    max-width:1500px;
    height:22px;
    margin-top:36px;
    background:linear-gradient(to bottom,#8b5a2b,#5a3a1b);
    border-radius:4px;
    box-shadow:
      0 6px 12px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.3);
  `;
        return ablage;
    }

    async function ladeKerzen() {
        try {
            const res = await fetch(SHEET_URL);
            const csv = await res.text();

            const sep = csv.includes(";") ? ";" : ",";
            const lines = csv.trim().split("\n");
            const daten = [];

            for (let i = 1; i < lines.length; i++) {
                const row = parseCSVLine(lines[i], sep);

                const zeit = row[0];
                const von  = row[1];
                const fuer = row[2];
                const text = row[3];
                const bildname = row[4];

                if (!zeit) continue;

                const timestamp = parseGermanDate(zeit);
                if (isNaN(timestamp.getTime())) continue;

                const alterTage = (Date.now() - timestamp.getTime())/(1000*60*60*24);

                if (alterTage <= KERZE_LEBENSDAUER_TAGE) {
                    daten.push({ timestamp, von, fuer, text, bildname });
                }
            }

            daten.sort((a,b) => b.timestamp - a.timestamp);

            const wand  = document.getElementById("kerzenwand");
            const debug = document.getElementById("kerzen-debug");
            const ts    = document.getElementById("kerzen-timestamp");

            wand.innerHTML = "";

            if (daten.length === 0) {
                debug.textContent = "Keine aktiven Kerzen.";
                ts.textContent = "";
                return;
            }

            debug.textContent = "Aktive Kerzen: " + daten.length;
            ts.textContent = "Datenstand: " +
                new Date().toLocaleTimeString("de-DE",{hour12:false});

            for (let i=0; i<daten.length; i+=KERZEN_PRO_REIHE) {
                const chunk = daten.slice(i,i+KERZEN_PRO_REIHE);

                const row = document.createElement("div");
                row.style.cssText = `
  /* KORREKTUR: Wechsel zu Flexbox für zuverlässige horizontale Zentrierung unvollständiger Reihen */
  display: flex;
  flex-wrap: wrap; /* Ermöglicht das Umbrechen der Kerzen */
  justify-content: center; /* ZENTRIERT die gesamte Reihe (die Kerzengruppe) */

  /* NEU: Flexbox benötigt margin für den Abstand, da 'gap' in Flexbox weniger universell ist */
  gap: 140px 50px; /* Moderne Flexbox unterstützt 'gap', wir behalten es bei */

  /* Wenn 'gap' nicht funktioniert, müssten wir margin-bottom/right auf die Kerzen anwenden,
     aber wir probieren es zuerst mit gap, da es die einfachste Lösung ist. */

  width: 100%;
  position: relative;
  padding-top: 50px;
  margin-bottom: 20px;
`;
                chunk.forEach(e => row.appendChild(createCandle(e)));

                wand.appendChild(row);
                wand.appendChild(createShelf());
            }

        } catch (err) {
            console.error(err);
            document.getElementById("kerzen-debug").textContent =
                "Fehler beim Laden der Kerzen.";
        }
    }

    ladeKerzen();
    setInterval(ladeKerzen, 120000);
});