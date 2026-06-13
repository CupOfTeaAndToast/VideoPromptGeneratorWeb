document.addEventListener('DOMContentLoaded', () => {
    const toneMap = {
        "Spoken": ["Whispered", "Seductive", "Terrified", "Angry", "Warm", "Monotone", "Shouted", "Breathless"],
        "Singing": ["Operatic", "Soulful", "Gritty", "Melodic", "Deep Baritone", "High Soprano"],
        "Narrator": ["Solemn", "Mysterious", "Whispered", "Seductive", "Documentary", "Enthusiastic", "Newsreader"]
    };

    const ids = ['motionSlider', 'motionVal', 'sequenceDuration', 'durVal', 'cutCount', 'cutVal', 'genreInfluence', 'infVal'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        el.oninput = (e) => {
            const valId = id.includes('Duration') ? 'durVal' : id.includes('Count') ? 'cutVal' : id.includes('Influence') ? 'infVal' : 'motionVal';
            document.getElementById(valId).textContent = e.target.value;
        };
    });

    const diagContainer = document.getElementById('dialogueContainer');
    const addLine = () => {
        const row = document.createElement('div');
        row.className = 'dialogue-row';
        row.innerHTML = `
            <input type="text" placeholder="Dialogue..." class="d-text">
            <select class="d-gend"><option>Male</option><option>Female</option><option>Group</option></select>
            <select class="d-styl"><option>Spoken</option><option>Singing</option><option>Narrator</option></select>
            <select class="d-tone"></select>
            <button class="btn-small" onclick="this.parentElement.remove()">X</button>
        `;
        diagContainer.appendChild(row);
        const s = row.querySelector('.d-styl');
        const t = row.querySelector('.d-tone');
        s.onchange = () => t.innerHTML = toneMap[s.value].map(x => `<option>${x}</option>`).join('');
        s.onchange();
    };
    document.getElementById('addLineBtn').onclick = addLine;
    addLine();

    const genreData = {
        "Cinematic": { shots: ["Slow Push-in Dolly", "Low Angle Heroic Tilt", "Steady Tracking Wide", "Subtle Lens Flare Detail"], mv: "fluid" },
        "Horror": { shots: ["POV Creeping Handheld", "Dutch Tilt Medium", "Extreme High-angle Ominous", "Macro eye-widening"], mv: "erratic" },
        "Street Style": { shots: ["Gritty Handheld Shaky", "ECU Texture Focus", "Whip-pan Transition", "Candid eye-level Close-up"], mv: "raw" },
        "Action": { shots: ["Dynamic Orbital Speed", "Whip-pan Kinetic", "Ground-level Tracking", "Wide Dynamic Action Shot"], mv: "kinetic" },
        "Noir": { shots: ["Chiaroscuro Profile", "Low-angle Silhouette", "Macro Smoke Swirl", "Static High-contrast Wide"], mv: "static" },
        "Western": { shots: ["Extreme Wide Vista", "Macro Holster-hand", "Low-angle Squint", "Medium Dust-trail Tracking"], mv: "tense" },
        "SciFi": { shots: ["Clinical Wide Shot", "Slow Technical Zoom", "Fixed Macro Detail", "Top-down Sterile Wide"], mv: "precise" },
        "Fantasy": { shots: ["Sweeping Aerial Vista", "Slow Magic Orbit", "Whimsical Tracking", "Low-angle Ethereal Wide"], mv: "ethereal" }
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    document.getElementById('generateBtn').onclick = () => {
        const genre = document.getElementById('genrePreset').value;
        const sub = document.getElementById('subjectInput').value.trim() || "the main subject";
        const cuts = parseInt(document.getElementById('cutCount').value);
        const mot = document.getElementById('motionSlider').value;
        const music = document.getElementById('musicStyle').value;
        const mood = document.getElementById('musicMood').value;
        const dur = document.getElementById('sequenceDuration').value;
        
        let out = `PRO-DIRECTOR SEQUENCE DIRECTIVE | STYLE: ${genre}\n`;
        out += `TOTAL DURATION: ${dur}s | MOTION INTENSITY: ${mot}/10\n`;
        out += `AUDIO SCORE: ${music} [Mood: ${mood}]\n`;
        out += `QUALITY DIRECTIVE: Consistency, 8k resolution, photorealistic, depth-of-field, raytrace shadows.\n\n`;

        const focusSet = [`primary hero ${sub}`, `ECU textures on ${sub}`, `wide framing ${sub}`, `over-the-shoulder framing ${sub}`, `low-angle silhouette of ${sub}`];
        const dialogueRows = document.querySelectorAll('.dialogue-row');

        for (let i = 1; i <= cuts; i++) {
            let sType = getRandom(genreData[genre] ? genreData[genre].shots : genreData["Cinematic"].shots);
            let sFocus = i % 3 === 0 ? "environmental context" : getRandom(focusSet);
            let shotPrompt = `Shot ${i}/${cuts}: ${sType}, ${sFocus}. `;

            if (dialogueRows.length > 0) {
                const dist = cuts / dialogueRows.length;
                const dIdx = Math.floor((i - 1) / dist);
                const prevDIdx = Math.floor((i - 2) / dist);
                if (i === 1 || dIdx > prevDIdx) {
                    const row = dialogueRows[dIdx];
                    const text = row.querySelector('.d-text').value;
                    if(text) shotPrompt += `\nVOCAL [${row.querySelector('.d-gend').value}, ${row.querySelector('.d-styl').value}, ${row.querySelector('.d-tone').value}]: "${text}"`;
                }
            }
            if ((out + shotPrompt).length > 1950) { out += `\n[TRUNCATED]`; break; }
            out += shotPrompt + `\n\n`;
        }
        document.getElementById('outputPrompt').value = out;
    };

    document.getElementById('copyBtn').onclick = () => {
        const out = document.getElementById('outputPrompt');
        if (!out.value) return;
        out.select();
        document.execCommand('copy');
        document.getElementById('copyBtn').textContent = "COPIED!";
        setTimeout(() => document.getElementById('copyBtn').textContent = "COPY TO CLIPBOARD", 2000);
    };
});
