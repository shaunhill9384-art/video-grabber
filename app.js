const SUPABASE_FUNCTION_URL = "https://jrfimgyotdexqquwommk.supabase.co/functions/v1/bright-processor";
const SUPABASE_ANON_KEY = "sb_publishable_ZO9X_URWINBXHwOAyUj2Pw_9kekTlQh";

const form = document.getElementById("form");
const linkInput = document.getElementById("link");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const videoEl = document.getElementById("video");
const titleEl = document.getElementById("title");
const authorEl = document.getElementById("author");
const dlHD = document.getElementById("downloadHD");
const dlSD = document.getElementById("downloadSD");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = linkInput.value.trim();
  if (!url) return;

  setStatus("እያመጣሁ ነው...", false);
  resultEl.hidden = true;
  submitBtn.disabled = true;

  try {
    const res = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "ያልታወቀ ስህተት ተፈጥሯል።");
    }

    showResult(data);
    setStatus("", false);
    statusEl.hidden = true;
  } catch (err) {
    setStatus(err.message || "ማምጣት አልተቻለም። ሊንኩን አረጋግጥ።", true);
  } finally {
    submitBtn.disabled = false;
  }
});

function showResult(data) {
  videoEl.src = data.video_url;
  titleEl.textContent = data.title || (data.platform === "tiktok" ? "TikTok Video" : "Facebook Video");
  authorEl.textContent = data.author ? `@${data.author}` : "";

  dlHD.href = data.video_url;
  dlHD.setAttribute("download", `${data.platform}-video.mp4`);

  if (data.video_url_sd) {
    dlSD.hidden = false;
    dlSD.href = data.video_url_sd;
    dlSD.setAttribute("download", `${data.platform}-video-sd.mp4`);
  } else {
    dlSD.hidden = true;
  }

  resultEl.hidden = false;
}

function setStatus(msg, isError) {
  statusEl.hidden = !msg;
  statusEl.textContent = msg;
  statusEl.className = "status" + (isError ? " error" : "");
}
