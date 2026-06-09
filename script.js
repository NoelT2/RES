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

    // Ubah teks tombol dan tampilkan loading
    const btn = document.querySelector("button");
    btn.disabled = true;
    btn.style.opacity = "0.7";
    
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
        btn.disabled = false;
        btn.style.opacity = "1";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-item";

            const riskClass = item.risk.toLowerCase();
            const avatarFallback = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

            div.innerHTML = `
                <div class="result-avatar">
                    <img src="${item.avatar}" onerror="this.src='${avatarFallback}'" alt="Avatar">
                </div>
                <div class="result-info">
                    <strong>${item.email}</strong>
                    <div class="info-grid">
                        <span class="label">Domain:</span> 
                        <span>${item.domain || "-"}</span>
                        
                        <span class="label">Status:</span> 
                        <span>${item.valid ? "✅ Valid" : "❌ Invalid"}</span>
                        
                        <span class="label">Breach:</span> 
                        <span>${item.breach ? "⚠️ Yes" : "🛡️ No"}</span>
                        
                        <span class="label">Risk:</span> 
                        <span><span class="badge ${riskClass}">${item.risk}</span></span>
                    </div>
                </div>
            `;

            resultList.appendChild(div);
        });
    })
    .catch(err => {
        loading.classList.add("hidden");
        btn.disabled = false;
        btn.style.opacity = "1";
        alert("Error connecting to backend");
        console.error(err);
    });
}
