const audio = document.getElementById("audio");
const toggleBtn = document.getElementById("toggleSound");
const exitFsBtn = document.getElementById("exitFs");

const app = document.getElementById("app");
const offScreen = document.getElementById("offScreen");

/* =========================
   ⚙️ PARAMÈTRES MODIFIABLES
========================= */
const NIGHT_START = 12;
const NIGHT_END = 6;
/* ========================= */

let isPlaying = false;

/* 🌙 CHECK TIME */
function isAllowedTime(hour) {
  if (NIGHT_START > NIGHT_END) {
    return hour >= NIGHT_START || hour < NIGHT_END;
  }
  return hour >= NIGHT_START && hour < NIGHT_END;
}

/* 🕒 UI SWITCH */
function updateUI() {
  const hour = new Date().getHours();

  if (isAllowedTime(hour)) {
    app.classList.remove("hidden");
    offScreen.classList.add("hidden");
  } else {
    app.classList.add("hidden");
    offScreen.classList.remove("hidden");

    audio.pause();
    isPlaying = false;
    toggleBtn.textContent = "UNMUTE";

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
}

updateUI();
setInterval(updateUI, 60000);

/* 🎵 SOUND + FULLSCREEN */
toggleBtn.addEventListener("click", async () => {
  const hour = new Date().getHours();
  if (!isAllowedTime(hour)) return;

  if (!isPlaying) {
    try {
      await audio.play();
      isPlaying = true;
      toggleBtn.textContent = "MUTE";

      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    audio.pause();
    isPlaying = false;
    toggleBtn.textContent = "UNMUTE";
  }
});

/* ❌ EXIT FULLSCREEN */
exitFsBtn.addEventListener("click", async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  }
});

/* 👀 FULLSCREEN STATE */
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    exitFsBtn.classList.remove("hidden");
  } else {
    exitFsBtn.classList.add("hidden");
  }
});
