(() => {
  const STORAGE_KEY = "dengue-care-tracker-v1";
  const $ = (selector) => document.querySelector(selector);
  const dateInput = $("#view-date");
  const today = new Date();
  const localDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  let entries = loadEntries();
  let toastTimer;

  function loadEntries() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(item => item && typeof item.id === "string" && ["water","output","medicine"].includes(item.type)) : [];
    } catch { return []; }
  }
  function saveEntries() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch {
      showToast("Could not save. Check your browser storage space.");
      return false;
    }
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function selectedEntries() {
    return entries.filter(entry => entry.date === dateInput.value).sort((a,b) => b.time.localeCompare(a.time) || b.createdAt - a.createdAt);
  }
  function render() {
    const date = dateInput.value;
    const list = selectedEntries();
    const water = list.filter(x => x.type === "water");
    const output = list.filter(x => x.type === "output");
    const meds = list.filter(x => x.type === "medicine");
    const sum = rows => rows.reduce((total, row) => total + (Number(row.amount) || 0), 0);
    $("#today-label").textContent = date === localDate(today) ? "Today" : new Date(date + "T12:00:00").toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric",year:"numeric"});
    $("#water-total").innerHTML = `${sum(water).toLocaleString()} <small>mL</small>`;
    $("#output-total").innerHTML = `${sum(output).toLocaleString()} <small>mL</small>`;
    $("#medicine-total").textContent = meds.length;
    $("#water-count").textContent = `${water.length} entr${water.length === 1 ? "y" : "ies"} recorded`;
    $("#output-count").textContent = `${output.length} entr${output.length === 1 ? "y" : "ies"} recorded`;
    $("#medicine-count").textContent = `${meds.length} entr${meds.length === 1 ? "y" : "ies"} recorded`;
    $("#history-list").innerHTML = list.map(entry => {
      const symbol = entry.type === "water" ? "💧" : entry.type === "output" ? "◒" : "✚";
      const typeLabel = entry.type === "water" ? "Fluid intake" : entry.type === "output" ? "Urine output" : "Medicine";
      const amount = entry.type === "medicine" ? escapeHtml(entry.dose || "Dose not entered") : `${Number(entry.amount).toLocaleString()} mL`;
      const detail = entry.type === "medicine" ? typeLabel : typeLabel + (entry.item ? " · " + escapeHtml(entry.item) : "");
      return `<article class="history-item"><span class="history-symbol ${entry.type}">${symbol}</span><div class="history-main"><div class="history-title">${escapeHtml(entry.item || typeLabel)}</div><div class="history-sub">${detail} · ${escapeHtml(entry.time)}</div></div><span class="history-amount">${amount}</span><button class="delete-entry" type="button" data-delete="${escapeHtml(entry.id)}" aria-label="Delete entry">×</button></article>`;
    }).join("");
    $("#empty-state").hidden = list.length > 0;
  }
  function addEntry(form, type) {
    const data = new FormData(form);
    const item = String(data.get("item") || "").trim();
    const time = String(data.get("time") || "");
    const amount = Number(data.get("amount"));
    const dose = String(data.get("dose") || "").trim();
    if (!item && type !== "output") return showToast("Please enter a name.");
    if (!time) return showToast("Please select a time.");
    if (type !== "medicine" && (!Number.isFinite(amount) || amount <= 0 || amount > 10000)) return showToast("Enter a valid amount in mL.");
    const entry = {id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()),type,date:dateInput.value,time,item,createdAt:Date.now()};
    if (type !== "medicine") entry.amount = amount;
    if (type === "medicine") entry.dose = dose;
    entries.push(entry);
    if (saveEntries()) {
      form.reset();
      form.querySelector('[name="time"]').value = currentTime();
      render();
      showToast("Entry saved on this device.");
    }
  }
  function currentTime() {
    const now = new Date();
    return String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
  }
  function csvCell(value) {
    let text = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g,'""') + '"';
  }
  function exportCsv() {
    const rows = selectedEntries();
    if (!rows.length) return showToast("There are no entries to export for this date.");
    const data = [["Date","Time","Record type","Name / notes","Amount (mL)","Prescribed dose / note"]];
    rows.forEach(row => data.push([row.date,row.time,row.type,row.item || "",row.amount ?? "",row.dose || ""]));
    const csv = data.map(row => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `dengue-care-record-${dateInput.value}.csv`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    showToast("CSV report exported. Share it only with someone you trust.");
  }

  dateInput.value = localDate(today);
  dateInput.addEventListener("change", render);
  $("#water-form").addEventListener("submit", event => {event.preventDefault();addEntry(event.currentTarget,"water");});
  $("#output-form").addEventListener("submit", event => {event.preventDefault();addEntry(event.currentTarget,"output");});
  $("#medicine-form").addEventListener("submit", event => {event.preventDefault();addEntry(event.currentTarget,"medicine");});
  document.querySelectorAll('input[type="time"]').forEach(input => input.value = currentTime());
  $("#history-list").addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const id = button.dataset.delete;
    if (!confirm("Delete this record from this browser?")) return;
    entries = entries.filter(entry => entry.id !== id);
    if (saveEntries()) {render();showToast("Record deleted.");}
  });
  $("#export-btn").addEventListener("click",exportCsv);
  $("#print-btn").addEventListener("click",() => {
    if (!selectedEntries().length) return showToast("There are no entries to print for this date.");
    window.print();
  });
  render();
})();