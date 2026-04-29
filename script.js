function checkEmails() {
const input = document.getElementById("emailInput").value;
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const resultList = document.getElementById("resultList");

const emails = input
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(e => e !== "");

if (emails.length === 0) {
    alert("Please enter at least one email");
    return;
}

loading.classList.remove("hidden");
result.classList.add("hidden");
resultList.innerHTML = "";

fetch('http://127.0.0.1:5000/check-multiple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails: emails })
})
.then(res => res.json())
.then(data => {
    loading.classList.add("hidden");
    result.classList.remove("hidden");

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";

        div.innerHTML = `
            <strong>${item.email}</strong><br>
            Domain: ${item.domain || "-"}<br>
            Status: ${item.valid ? "Valid" : "Invalid"}<br>
            Breach: ${item.breach ? "Yes" : "No"}<br>
            Risk: <span class="${item.risk.toLowerCase()}">${item.risk}</span>
            <br>
            <img src="${item.avatar}" width="40" onerror="this.style.display='none'">
        `;

        resultList.appendChild(div);
    });
})
.catch(err => {
    loading.classList.add("hidden");
    alert("Error connecting to backend");
    console.error(err);
});

}