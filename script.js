// Simple motivational quotes app (local-only)
const defaultQuotes = [
    { text: "Mehnat — muvaffaqiyat kalitidir.", author: "Otabek" },
    { text: "Har kuni ozgina yaxshiroq bo‘l.", author: "Unknown" },
    { text: "Sabr — eng yaxshi ustoz.", author: "Unknown" },
    { text: "Xato qilish — o‘sishning bir qismi.", author: "Unknown" }
];

const LS_KEY = "otabek_motiv_quotes_v1";

function loadQuotes() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return defaultQuotes.slice();
        return JSON.parse(raw);
    } catch (e) {
        console.warn("localStorage read error", e);
        return defaultQuotes.slice();
    }
}

function saveQuotes(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { console.warn("save failed", e) }
}

function randomIndex(max) { return Math.floor(Math.random() * max) }

const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newBtn = document.getElementById("newBtn");
const copyBtn = document.getElementById("copyBtn");

const newQuoteInput = document.getElementById("newQuote");
const newAuthorInput = document.getElementById("newAuthor");
const addBtn = document.getElementById("addBtn");
const quotesList = document.getElementById("quotesList");

let quotes = loadQuotes();

function showRandom() {
    if (quotes.length === 0) {
        quoteText.textContent = "Hozircha so‘zlar yo‘q. Iltimos so‘z qo‘shing.";
        quoteAuthor.textContent = "";
        return;
    }
    const i = randomIndex(quotes.length);
    const q = quotes[i];
    quoteText.textContent = q.text;
    quoteAuthor.textContent = q.author ? — ${ q.author } : "";
}

function renderList() {
    quotesList.innerHTML = "";
    quotes.forEach((q, idx) => {
        const li = document.createElement("li");
        const left = document.createElement("div");
        left.innerHTML = <div class="li-text">${escapeHtml(q.text)}</div><div class="li-author">${escapeHtml(q.author||"")}</div>;
        const del = document.createElement("button");
        del.className = "delete-btn";
        del.textContent = "O'chirish";
        del.onclick = () => {
            if (!confirm("Rostdan o'chirmoqchimisiz?")) return;
            quotes.splice(idx, 1);
            saveQuotes(quotes);
            renderList();
            showRandom();
        };
        li.appendChild(left);
        li.appendChild(del);
        quotesList.appendChild(li);
    });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]));
}

newBtn.addEventListener("click", showRandom);

copyBtn.addEventListener("click", async () => {
    const url = location.href;
    try {
        await navigator.clipboard.writeText(url);
        alert("Sayt havolasi nusxalandi — paste qiling va boshqalarga yuboring!");
    } catch (e) {
        prompt("Havolani qo'lda nusxalang:", url);
    }
});

addBtn.addEventListener("click", () => {
    const t = newQuoteInput.value.trim();
    const a = newAuthorInput.value.trim();
    if (!t) { alert("Iltimos so‘z kiriting."); return; }
    quotes.unshift({ text: t, author: a });
    saveQuotes(quotes);
    newQuoteInput.value = "";
    newAuthorInput.value = "";
    renderList();
    showRandom();
});

// initial render
renderList();
showRandom();