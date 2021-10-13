var tableRowClass = [
  "table-primary",
  "table-secondary",
  "table-success",
  "table-warning",
  "table-info",
  "table-primary",
  "table-secondary",
  "table-success",
  "table-warning",
  "table-info",
];
var sampleCovidData = null;
var prevPage = null;
var nextPage = null;
var currentPage = null;
var totalPages = null;
var pageSize = 10;
var startIndex = null;
var endIndex = null;
var pages = null;

var tableBody = document.getElementById("t-body");
var searchInput = document.getElementById("searchInput");
var previousButton = document.getElementById("previous");
var currentButton = document.getElementById("current");
var nextButton = document.getElementById("next");

var country = document.getElementById("country");
var newConfirmed = document.getElementById("NewConfirmed");
var totalConfirmed = document.getElementById("TotalConfirmed");
var newDeaths = document.getElementById("NewDeaths");
var totalDeaths = document.getElementById("TotalDeaths");
var newRecovered = document.getElementById("NewRecovered");
var totalRecovered = document.getElementById("TotalRecovered");

function getCountryStatus(region) {
  country.innerText = region.Country;
  newConfirmed.innerText = region.NewConfirmed;
  totalConfirmed.innerText = region.TotalConfirmed;
  newDeaths.innerText = region.NewDeaths;
  totalDeaths.innerText = region.TotalDeaths;
  newRecovered.innerText = region.NewRecovered;
  totalRecovered.innerText = region.TotalRecovered;
  country.removeAttribute("hidden");
}

function onChangeSearch() {
  let value = searchInput.value;
  if (value.length > 2) {
    let list = sampleCovidData.Countries.map((data) => {
      if (data.Country.toUpperCase() === value.toUpperCase()) {
        getCountryStatus(data);
      }
    });
  } else {
    country.innerText = "";
    country.setAttribute("hidden", true);
    newConfirmed.innerText = 0;
    totalConfirmed.innerText = 0;
    newDeaths.innerText = 0;
    totalDeaths.innerText = 0;
    newRecovered.innerText = 0;
    totalRecovered.innerText = 0;
  }
}

function top10MostCountriesByNewCaseConfirmed() {
  let topCountriesByCaseConfirmed = sampleCovidData.Countries;
  topCountriesByCaseConfirmed.sort((a, b) =>
    a.NewConfirmed < b.NewConfirmed
      ? 1
      : b.NewConfirmed < a.NewConfirmed
      ? -1
      : 0
  );

  var chart2 = new ApexCharts(
    document.querySelector("#myChart2"),
    getChartOptions(
      topCountriesByCaseConfirmed.slice(0, 10),
      "Top most 10 countries by new case confirmed"
    )
  );

  chart2.render();
}

function top5MostCountriesByDeath() {
  let topCountriesByDeath = sampleCovidData.Countries;
  topCountriesByDeath.sort((a, b) =>
    a.TotalDeaths < b.TotalDeaths ? 1 : b.TotalDeaths < a.TotalDeaths ? -1 : 0
  );

  var chart1 = new ApexCharts(
    document.querySelector("#myChart1"),
    getChartOptions(
      topCountriesByDeath.slice(0, 5),
      "Top most 5 countries by deaths confirmed"
    )
  );

  chart1.render();
}

function getChartOptions(data, barTitle) {
  let countries = [];
  let numberOfDeaths = [];
  for (const country of data) {
    countries.push(country.CountryCode);
    numberOfDeaths.push(country.TotalDeaths);
  }
  var options = {
    chart: {
      type: "bar",
    },
    series: [
      {
        name: "sales",
        data: numberOfDeaths,
      },
    ],
    xaxis: {
      categories: countries,
    },
    title: {
      text: barTitle,
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#263238",
      },
    },
  };
  return options;
}

function paginate(data) {
  if (data.length > 0) {
    pages = [];
    let count = pageSize;
    do {
      pages.push(count / pageSize);
      count += pageSize;
    } while (count < data.length);
    if (count - pageSize < data.length) {
      pages.push(count / pageSize);
    }
    prevPage = null;
    currentPage = pages[0];
    nextPage = data.length > pageSize ? 2 : null;
    startIndex = 0;
    endIndex = data.length > pageSize ? pageSize : data.length;

    tableDataPopulation(data.slice(startIndex, endIndex));
    currentButton.innerHTML = currentPage;
    previousButton.classList.add("disabled");
    previousButton.style.cursor = "not-allowed";
  }
}

function tableDataPopulation(data) {
  let tBody = "";
  data.map((row, index) => {
    let date = new Date(row.Date).toString().split("GMT")[0];
    let tr =
      `<tr class="` +
      tableRowClass[index] +
      `"><td>` +
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
      date +
      `</td></tr>`;
    tBody += tr;
  });
  // Setting table body by table ID
  tableBody.innerHTML = "";
  tableBody.innerHTML = tBody;
}

function onClickPrevious() {
  searchInput.value = "";
  if (currentPage > 1) {
    --currentPage;
    startIndex = (currentPage - 1) * pageSize;
    endIndex = (currentPage - 1) * pageSize + pageSize;
    tableDataPopulation(sampleCovidData.Countries.slice(startIndex, endIndex));
  }
  if (currentPage > 1) {
    previousButton.classList.remove("disabled");
    previousButton.style.cursor = "pointer";
  } else {
    previousButton.classList.add("disabled");
    previousButton.style.cursor = "not-allowed";
  }
  currentButton.innerHTML = currentPage;
  if (currentPage < pages.length) {
    nextButton.classList.remove("disabled");
    nextButton.style.cursor = "pointer";
  } else {
    nextButton.classList.add("disabled");
    nextButton.style.cursor = "not-allowed";
  }
}

function onClickNext() {
  searchInput.value = "";
  if (currentPage < pages.length) {
    ++currentPage;
    startIndex = (currentPage - 1) * pageSize;
    endIndex =
      (currentPage - 1) * pageSize + pageSize > sampleCovidData.Countries.length
        ? sampleCovidData.Countries.length
        : (currentPage - 1) * pageSize + pageSize;
    tableDataPopulation(sampleCovidData.Countries.slice(startIndex, endIndex));
  }
  if (currentPage < pages.length) {
    nextButton.classList.remove("disabled");
    nextButton.style.cursor = "pointer";
  } else {
    nextButton.classList.add("disabled");
    nextButton.style.cursor = "not-allowed";
  }
  currentButton.innerHTML = currentPage;
  if (currentPage - 1 > 0) {
    previousButton.classList.remove("disabled");
    previousButton.style.cursor = "pointer";
  } else {
    previousButton.classList.add("disabled");
    previousButton.style.cursor = "not-allowed";
  }
}

// Adding event handler
searchInput.addEventListener("keyup", onChangeSearch);
previousButton.addEventListener("click", onClickPrevious);
nextButton.addEventListener("click", onClickNext);

// Immediately invoked function expression
(function () {
  // Calling API using async promise
  fetch("https://api.covid19api.com/summary")
    .then((response) => response.json())
    .then((data) => {
      sampleCovidData = data;
      searchInput.value = "";
      country.setAttribute("hidden", true);
      // Getting ready all table row with pagination
      paginate(data.Countries);
      top5MostCountriesByDeath();
      top10MostCountriesByNewCaseConfirmed();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
})();
