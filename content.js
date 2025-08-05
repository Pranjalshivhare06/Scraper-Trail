(function () {
  const results = [];
  const seen = new Set();
  const containers = document.querySelectorAll('.entity-listing-container');

  if (!containers || containers.length === 0) {
    alert("❌ No result containers found.");
    return;
  }

  containers.forEach(container => {
    const cards = container.querySelectorAll("div");

    cards.forEach(card => {
      const addressEl = card.querySelector(".b_address");
      const allFactRows = card.querySelectorAll(".b_factrow");
      const nameTag = card.querySelector(".b_vPanel");
    // const nameTag = card.querySelector(".b_factrow");

      let name = "N/A";
      let address = "N/A";
      let phone = "N/A";
      let email = "N/A";

      if (addressEl) {
        address = addressEl.innerText.trim();
      }

      if (nameTag) {
        name = nameTag.innerText.trim();
      }

    // name = allFactRows.length > 0 ? allFactRows[0].innerText.trim() : "N/A";

     

    //   allFactRows.forEach(row => {
    //     const text = row.innerText.trim();
    //     const cleaned = text.replace(/[\s\-]/g, "");

    //     // Match 10-digit numbers (more reliable than 9)
    //     if (/\d{10}/.test(cleaned)) {
    //       phone = text;
    //     }

    //     if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/.test(text)) {
    //       email = text;
    //     }
    //   });

   

    allFactRows.forEach(row => {
        const text = row.innerText.trim();
        const cleaned = text.replace(/[\s\-]/g, "");

        // Match 10-digit numbers (more reliable than 9)
        if (/\d{10}/.test(cleaned)) {
            phone = text;
        }

        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/.test(text)) {
            email = text;
        }
    });



      const key = `${name}|${address}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ name, address, phone, email });
      }
    });
  });

  if (results.length === 0) {
    alert("⚠ No valid place cards found.");
  } else {
    alert(`✅ Scraped ${results.length} entries.`);
  }

  localStorage.setItem("bing_scraped_data", JSON.stringify(results));
  console.log("✅ Scraped Results:", results);

  // CSV Download Logic
  function downloadCSV(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    data.forEach(row => {
      const values = headers.map(field => {
        let value = row[field];
        if (typeof value === "string") {
          value = value.replace(/"/g, '""'); // escape quotes
          return `"${value}"`; // wrap in double quotes
        }
        return value;
      });
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "bing_places_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downloadCSV(results);
})();
