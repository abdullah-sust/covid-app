// Immediately invoked function expression
(function () {
  // Calling API using async promise
  fetch("https://api.covid19api.com/summary")
    // 1st then function
    .then((response) => response.json())
    // 2nd then function
    .then((data) => {
      // Getting ready all table row
      let tBody = "";
      data.Countries.map((row) => {
        let tr =
          `<tr><td>` +
          row.Country +
          `</td>` +
          `<td>` +
          row.NewConfirmed +
          `</td>` +
          `<td>` +
          row.TotalConfirmed +
          `</td>` +
          `<td>` +
          row.NewDeaths +
          `</td>` +
          `<td>` +
          row.TotalDeaths +
          `</td>` +
          `<td>` +
          row.NewRecovered +
          `</td>` +
          `<td>` +
          row.TotalRecovered +
          `</td>` +
          `<td>` +
          new Date(row.Date) +
          `</td></tr>`;
        tBody += tr;
      });
      // Setting table body by table ID
      document.getElementById("t-body").innerHTML = tBody;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
})();
