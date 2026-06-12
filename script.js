document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const ids = ['motionSlider', 'motionVal', 'sequenceDuration', 'durVal', 'cutCount', 'cutVal', 'genreInfluence', 'infVal'];
    const els = {};
    ids.forEach(id => els[id] = document.getElementById(id));

    // Slider Updates
    els.motionSlider.oninput = () => els.motionVal.textContent = els.motionSlider.value;
    els.sequenceDuration.oninput = () => els.durVal.textContent = els.sequenceDuration.value;
    els.cutCount.oninput = () => els.cutVal.textContent = els.cutCount.value;
    els.genreInfluence.oninput = () => els.infVal.textContent = els.genreInfluence.value;

    const genreData = {
        "Cinematic": {
            shots: ["Medium Tracking", "Steady Cam Wide", "Slow Push-in", "Low Angle Heroic"],
            atmos: ["Subtle global illumination", "Soft natural light", "Professional color grading"],
            movement: "fluid and balanced"
        },
        "Horror": {
            shots: ["POV Creeping", "Dutch Tilt", "Extreme Low-angle", "Extreme High-angle", "Handheld Shaky POV"],
            atmos: ["Chiaroscuro shadows", "Flickering lights", "Atmospheric dread"],
            movement: "tense and erratic"
        },
        "Street Style": {
            shots: ["Extreme Close-up on eyes", "Handheld Shaky cam", "Rapid focus racking", "Candid eye-level", "Low angle gritty"],
            atmos: ["Natural urban light", "Film grain", "High contrast street vibes"],
            movement: "raw and spontaneous"
        },
        "Interview": {
            shots: ["Static Medium Shot", "Tight Portrait", "Fixed Rule-of-thirds", "Profile side-angle"],
            atmos: ["Soft three-point lighting", "Clean shallow depth of field", "Formal setting"],
            movement: "minimal and locked"
        },
        "Action": {
            shots: ["Dynamic Orbital", "Whip-pan", "High-velocity tracking", "Low angle kinetic"],
            atmos: ["Hard directional highlights", "Motion blur", "High-energy sparks"],
            movement: "explosive and rapid"
        },
        "Cyberpunk": {
            shots: ["Anamorphic wide", "Low-angle neon tilt", "Macro detail on circuitry"],
            atmos: ["Magenta and Cyan volumetric fog", "Synthetic reflections"],
            movement: "moody and atmospheric"
        },
        "SciFi": {
            shots: ["Top-down clinical wide", "Slow technical zoom", "Precise static macro"],
            atmos: ["Cool blue tones", "Bioluminescent glow", "Sterile environment"],
            movement: "precise and smooth"
        },
        "Fantasy": {
            shots: ["Sweeping aerial vista", "Whimsical orbital", "Medium mystical tracking"],
            atmos: ["Soft bloom", "Enchanted particles", "Golden hour magic"],
            movement: "ethereal and graceful"
        }
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const generatePrompt = () => {
        const genre = document.getElementById('genrePreset').value;
        const camMode = document.getElementById('cameraMovement').value;
        const inf = parseInt(els.genreInfluence.value);
        const mot = parseInt(els.motionSlider.value);
        const duration = els.sequenceDuration.value;
        const totalCuts = parseInt(els.cutCount.value);
        const audio = document.getElementById('audioStyle').value;
        const subject = document.getElementById('subjectInput').value.trim() || "the main subject";
        const dialogue = document.getElementById('dialogueInput').value.split('\n').filter(l => l.trim());

        const genreInfo = genreData[genre];
        
        const motionDesc = mot > 7 ? "HIGH KINETIC ENERGY: rapid movement, fast-paced displacement" : mot < 4 ? "LOW MOTION INTENSITY: subtle micro-movements, atmospheric stillness" : "MODERATE MOTION: natural cinematic flow and movement";

        let out = `PRO-DIRECTOR SEQUENCE DIRECTIVE | STYLE: ${genre}\n`;
        out += `TOTAL SEQUENCE DURATION: ${duration}s\n`;
        out += `MOTION INTENSITY: ${mot}/10 (${motionDesc})\n`;
        out += `GLOBAL AUDIO DESIGN: ${audio}\n`;
        out += `--------------------------------------------------\n\n`;

        const focusStyles = [
            `primary focus on ${subject}`,
            `extreme close-up on specific textures of ${subject}`,
            `wide shot positioning ${subject} in the environment`,
            `low-angle heroic profile of ${subject}`,
            `over-the-shoulder perspective framing ${subject}`,
            `abstract geometric composition involving ${subject}`,
            `dynamic tracking following the movement of ${subject}`,
            `selective focus pulling away from ${subject} to the background`
        ];

        for (let i = 1; i <= totalCuts; i++) {
            let shotType = camMode === "Genre Default" ? getRandom(genreInfo.shots) : camMode;
            let currentFocus = getRandom(focusStyles);
            
            if (i > 1 && i % 3 === 0) {
                currentFocus = `environmental context emphasizing the atmosphere surrounding ${subject}`;
            }

            let shotPrompt = `[SHOT ${i}/${totalCuts}]: ${shotType} with ${currentFocus}. `;
            shotPrompt += `Movement: ${genreInfo.movement} with ${motionDesc}. `;
            
            if (inf > 3) shotPrompt += `Atmosphere: ${getRandom(genreInfo.atmos)}. `;
            if (inf > 7) shotPrompt += `Texture: High-fidelity ${genre} aesthetic integration. `;

            if (dialogue.length > 0) {
                const dIdx = Math.floor(((i - 1) / totalCuts) * dialogue.length);
                if (i === 1 || dIdx > Math.floor(((i - 2) / totalCuts) * dialogue.length)) {
                    shotPrompt += `\n>> AUDIO/DIALOGUE: ${dialogue[dIdx]}`;
                }
            }
            out += shotPrompt + `\n\n`;
        }

        out += `[TECHNICAL ARTIFACT CONTROL: Maintain high-fidelity reference image consistency, 8k resolution, photorealistic ray-tracing, cinematic depth of field]`;
        document.getElementById('outputPrompt').value = out;
    };

    document.getElementById('generateBtn').addEventListener('click', generatePrompt);

    document.getElementById('copyBtn').addEventListener('click', () => {
        const out = document.getElementById('outputPrompt');
        if (!out.value) return;
        
        out.select();
        navigator.clipboard.writeText(out.value).then(() => {
            const originalText = document.getElementById('copyBtn').textContent;
            document.getElementById('copyBtn').textContent = "COPIED TO CLIPBOARD!";
            setTimeout(() => {
                document.getElementById('copyBtn').textContent = originalText;
            }, 2000);
        });
    });
});
