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

    const tropeData = {
        "Romantic Dialogue": {
            shots: ["Medium Close-up", "Extreme Close-up on lips", "Soft over-the-shoulder"],
            atmos: ["Soft warm glow", "Golden backlighting", "Shallow depth of field"],
            movement: "slow and intimate",
            audio: "Soft orchestral strings with whispers"
        },
        "Found Footage": {
            shots: ["Handheld POV", "Low-angle shaky camera", "Erratic panning"],
            atmos: ["High-ISO grain", "Blown-out flashlight lighting", "Night vision green"],
            movement: "extremely shaky and raw",
            audio: "Heavy breathing and muffled footsteps"
        },
        "Slasher Chase": {
            shots: ["Whip-pan", "High-speed tracking behind subject", "Low-angle rapid handheld"],
            atmos: ["Flickering strobe lights", "Deep red shadows", "Heavy motion blur"],
            movement: "panicked and high-speed",
            audio: "Intense industrial percussion and screaming foley"
        },
        "Police Interrogation": {
            shots: ["Tight static close-up", "Extreme high-angle", "Profile side-shot"],
            atmos: ["Single overhead harsh light", "Cigarette smoke plumes", "Cold clinical monochrome"],
            movement: "static and oppressive",
            audio: "Ambient electrical hum and rhythmic tapping"
        },
        "Superhero Landing": {
            shots: ["Low-angle heroic tilt", "Ground-level macro on debris", "Wide establishing epic"],
            atmos: ["Volumetric god rays", "Particle debris flying", "Dramatic rim lighting"],
            movement: "slow-motion impact and fast recoil",
            audio: "Low-frequency cinematic boom and debris impact"
        },
        "High Noon Duel": {
            shots: ["Extreme wide establishing", "Macro on eyes", "Low-angle hand-on-holster"],
            atmos: ["Heat haze distortion", "Harsh high-noon sun", "Dust swirls"],
            movement: "tense stillness and sudden movement",
            audio: "Whistling wind and distant crow caw"
        },
        "Nature Doc": {
            shots: ["Slow orbital pan", "Extreme telephoto macro", "Static wide establishing"],
            atmos: ["Perfect natural sunlight", "Crisp high-resolution textures", "Golden hour flora"],
            movement: "smooth and observational",
            audio: "Binaural forest sounds and distant wildlife"
        },
        "Vintage Memory": {
            shots: ["Medium handheld with slight jitter", "Out-of-focus soft wide", "Close-up with light leaks"],
            atmos: ["8mm film grain", "Sepia-tinted highlights", "Heavy vignetting"],
            movement: "nostalgic and dreamlike",
            audio: "Analog crackle and soft piano melody"
        },
        "CCTV Security": {
            shots: ["Fixed high-angle wide", "Grainy digital zoom", "Static corner mount"],
            atmos: ["Desaturated digital noise", "Over-sharpened contrast", "Timestamp overlay"],
            movement: "stuttering and low-framerate",
            audio: "Static hiss and mechanical hum"
        }
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const generatePrompt = () => {
        const genre = document.getElementById('genrePreset').value;
        const trope = document.getElementById('sceneTrope').value;
        const camMode = document.getElementById('cameraMovement').value;
        const inf = parseInt(els.genreInfluence.value);
        const mot = parseInt(els.motionSlider.value);
        const duration = els.sequenceDuration.value;
        const totalCuts = parseInt(els.cutCount.value);
        const audioInput = document.getElementById('audioStyle').value;
        const subject = document.getElementById('subjectInput').value.trim() || "the main subject";
        const dialogue = document.getElementById('dialogueInput').value.split('\n').filter(l => l.trim());

        const genreInfo = genreData[genre];
        const tropeInfo = trope !== "None" ? tropeData[trope] : null;
        
        const motionDesc = mot > 7 ? "HIGH KINETIC ENERGY: rapid movement, fast-paced displacement" : mot < 4 ? "LOW MOTION INTENSITY: subtle micro-movements, atmospheric stillness" : "MODERATE MOTION: natural cinematic flow and movement";

        let out = `PRO-DIRECTOR SEQUENCE DIRECTIVE | STYLE: ${genre} ${trope !== "None" ? "| TROPE: " + trope : ""}\n`;
        out += `TOTAL SEQUENCE DURATION: ${duration}s\n`;
        out += `MOTION INTENSITY: ${mot}/10 (${motionDesc})\n`;
        out += `GLOBAL AUDIO DESIGN: ${tropeInfo ? tropeInfo.audio + " (Overlay: " + audioInput + ")" : audioInput}\n`;
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
            let shotType;
            if (tropeInfo) {
                shotType = getRandom(tropeInfo.shots);
            } else {
                shotType = camMode === "Genre Default" ? getRandom(genreInfo.shots) : camMode;
            }
            
            let currentFocus = getRandom(focusStyles);
            
            if (i > 1 && i % 3 === 0) {
                currentFocus = `environmental context emphasizing the atmosphere surrounding ${subject}`;
            }

            let movement = tropeInfo ? tropeInfo.movement : genreInfo.movement;

            let shotPrompt = `[SHOT ${i}/${totalCuts}]: ${shotType} with ${currentFocus}. `;
            shotPrompt += `Movement: ${movement} with ${motionDesc}. `;
            
            if (inf > 3) {
                const atmosSource = tropeInfo ? tropeInfo.atmos : genreInfo.atmos;
                shotPrompt += `Atmosphere: ${getRandom(atmosSource)}. `;
            }
            if (inf > 7) {
                shotPrompt += `Style reinforcement: Accurate ${genre} ${trope !== "None" ? trope : ""} aesthetic and texture consistency. `;
            }

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
