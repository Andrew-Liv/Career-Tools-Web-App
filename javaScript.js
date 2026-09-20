// TAKE HOME PAY CALCULATOR

function Calculator(event) {
    event.preventDefault();

    // Get values from the form
    const jobtitle = document.getElementById("jobTitle").value.trim();
    const hours = parseFloat(document.getElementById("hoursWorked").value);
    const grossPay = parseFloat(document.getElementById("grossPay").value);
    const time = document.getElementById("payTimeframe").value;
    const taxRate = parseFloat(document.getElementById("taxRate").value);
    const NI_Rate = parseFloat(document.getElementById("nationalInsurenceRate").value);

    const result = document.getElementById("resultText");

    // VALIDATION

    if (!jobtitle) {
        showCalculatorError("Please enter a job title.");
        return;
    }

    if (isNaN(grossPay) || grossPay <= 0) {
        showCalculatorError("Gross pay must be greater than £0.");
        return;
    }

    if (isNaN(hours) || hours <= 0 || hours > 168) {
        showCalculatorError("Hours per week must be between 1 and 168.");
        return;
    }

    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        showCalculatorError("Tax rate must be between 0% and 100%.");
        return;
    }

    if (isNaN(NI_Rate) || NI_Rate < 0 || NI_Rate > 100) {
        showCalculatorError("National Insurance rate must be between 0% and 100%.");
        return;
    }

    // CALCULATIONS

    let annualGrossPay;

    if (time === "year") {
        annualGrossPay = grossPay;
    } else if (time === "month") {
        annualGrossPay = grossPay * 12;
    } else if (time === "week") {
        annualGrossPay = grossPay * 52;
    } else if (time === "hour") {
        annualGrossPay = grossPay * hours * 52;
    }

    const taxDeduction = annualGrossPay * (taxRate / 100);
    const NIDeduction = annualGrossPay * (NI_Rate / 100);

    const perYear = annualGrossPay - taxDeduction - NIDeduction;
    const perMonth = perYear / 12;
    const perWeek = perYear / 52;
    const perHour = perWeek / hours;

    // =========================================
    // DISPLAY RESULT
    // =========================================

    result.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Calculation Result";

    const jobInfo = document.createElement("p");
    jobInfo.textContent = "Job: " + jobtitle;

    const workingHoursInfo = document.createElement("p");
    workingHoursInfo.textContent =
        "Working " +
        hours +
        " hours per week for a gross pay of £" +
        grossPay.toFixed(2) +
        " per " +
        time +
        ".";

    const deductionsInfo = document.createElement("p");
    deductionsInfo.textContent =
        "Tax: " +
        taxRate +
        "% | National Insurance: " +
        NI_Rate +
        "%";

    const takeHomeInfo = document.createElement("p");
    takeHomeInfo.textContent = "Estimated take-home pay:";

    const list = document.createElement("ul");

    const hourlyItem = document.createElement("li");
    hourlyItem.textContent = "£" + perHour.toFixed(2) + " per hour";

    const weeklyItem = document.createElement("li");
    weeklyItem.textContent = "£" + perWeek.toFixed(2) + " per week";

    const monthlyItem = document.createElement("li");
    monthlyItem.textContent = "£" + perMonth.toFixed(2) + " per month";

    const yearlyItem = document.createElement("li");
    yearlyItem.textContent = "£" + perYear.toFixed(2) + " per year";

    list.appendChild(hourlyItem);
    list.appendChild(weeklyItem);
    list.appendChild(monthlyItem);
    list.appendChild(yearlyItem);

    result.appendChild(heading);
    result.appendChild(jobInfo);
    result.appendChild(workingHoursInfo);
    result.appendChild(deductionsInfo);
    result.appendChild(takeHomeInfo);
    result.appendChild(list);

    // SAVE CALCULATION TO HISTORY

    saveCalculation({
        job: jobtitle,
        grossPay: grossPay,
        timeframe: time,
        netPay: perYear
    });

    displayHistory();
}


// CALCULATOR ERROR MESSAGE

function showCalculatorError(message) {
    const result = document.getElementById("resultText");

    result.innerHTML = "";

    const error = document.createElement("p");
    error.textContent = message;
    error.className = "errorMessage";

    result.appendChild(error);
}


// CALCULATION HISTORY

function saveCalculation(calculation) {

    let history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

    history.unshift(calculation);

    // Keep only the 5 most recent calculations
    history = history.slice(0, 5);

    localStorage.setItem("calculationHistory", JSON.stringify(history));
}


function displayHistory() {

    const historyContainer = document.getElementById("calculationHistory");

    if (!historyContainer) {
        return;
    }

    const history = JSON.parse(localStorage.getItem("calculationHistory")) || [];

    historyContainer.innerHTML = "";

    if (history.length === 0) {
        return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "Recent Calculations";

    historyContainer.appendChild(heading);

    history.forEach((calculation) => {

        const item = document.createElement("div");
        item.className = "historyItem";

        const job = document.createElement("strong");
        job.textContent = calculation.job;

        const details = document.createElement("p");
        details.textContent =
            "£" +
            calculation.grossPay.toFixed(2) +
            " per " +
            calculation.timeframe +
            " → £" +
            calculation.netPay.toFixed(2) +
            " net per year";

        item.appendChild(job);
        item.appendChild(details);

        historyContainer.appendChild(item);
    });

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear History";
    clearButton.type = "button";
    clearButton.className = "clearHistoryButton";

    clearButton.addEventListener("click", clearHistory);

    historyContainer.appendChild(clearButton);
}


function clearHistory() {

    localStorage.removeItem("calculationHistory");

    displayHistory();
}


// Display existing history when the calculator page loads
document.addEventListener("DOMContentLoaded", function () {
    displayHistory();
});


// VACANCANCY SEARCH

let vacanciesForm = document.getElementById("vacanciesForm");

if (vacanciesForm) {
    vacanciesForm.addEventListener("submit", vacanciesAPI);
}


function vacanciesAPI(evt) {

    evt.preventDefault();

    const jobType = document.getElementById("jobType").value.trim();
    const location = document.getElementById("location").value.trim();

    const resultPara = document.getElementById("result");

    // Validate job title
    if (!jobType) {
        resultPara.innerHTML =
            "<p class='errorMessage'>Please enter a job title to search for vacancies.</p>";
        return;
    }

    // Show loading message
    resultPara.innerHTML =
        "<p class='loadingMessage'>Searching for vacancies...</p>";

    const encodedJob = encodeURIComponent(jobType);
    const encodedLocation = encodeURIComponent(location);

    const url =
        "https://api.lmiforall.org.uk/api/v1/vacancies/search?limit=10&location=" +
        encodedLocation +
        "&keywords=" +
        encodedJob;

    fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to retrieve vacancies.");
            }

            return response.json();
        })

        .then(data => {
            display(data);
        })

        .catch(error => {

            console.error(error);

            resultPara.innerHTML =
                "<p class='errorMessage'>Unable to retrieve vacancies. The vacancy service may currently be unavailable.</p>";
        });
}


// DISPLAY VACANCIES

function display(data) {

    const resultPara = document.getElementById("result");

    resultPara.innerHTML = "";

    if (!data || data.length === 0) {

        resultPara.innerHTML =
            "<p class='noResultsMessage'>No vacancies were found for this search.</p>";

        return;
    }

    const first10 = data.slice(0, 10);

    const resultHeading = document.createElement("h3");
    resultHeading.textContent =
        first10.length + " vacancy result" + (first10.length === 1 ? "" : "s");

    resultPara.appendChild(resultHeading);

    first10.forEach(vacancy => {

        const vacancyElement = document.createElement("div");
        vacancyElement.className = "vacancyCard";

        // Vacancy title
        const title = document.createElement("h3");

        title.textContent = vacancy.title || "Untitled vacancy";

        const colSymbol = document.createElement("span");
        colSymbol.className = "col_symbol";
        colSymbol.textContent = "+";

        title.appendChild(colSymbol);

        // Details container
        const details = document.createElement("div");
        details.className = "fullInformation";

        const company = document.createElement("p");
        company.innerHTML =
            "<strong>Company:</strong> " +
            (vacancy.company || "Not provided");

        const location = document.createElement("p");
        location.innerHTML =
            "<strong>Location:</strong> " +
            (
                vacancy.location &&
                vacancy.location.location
                    ? vacancy.location.location
                    : "Not provided"
            );

        const description = document.createElement("p");
        description.innerHTML =
            "<strong>Description:</strong> " +
            (vacancy.summary || "No description provided.");

        const linkPara = document.createElement("p");

        const linkLabel = document.createElement("strong");
        linkLabel.textContent = "Link: ";

        const link = document.createElement("a");
        link.href = vacancy.link || "#";
        link.textContent = "Click here to apply";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        linkPara.appendChild(linkLabel);
        linkPara.appendChild(link);

        details.appendChild(company);
        details.appendChild(location);
        details.appendChild(description);
        details.appendChild(linkPara);

        vacancyElement.appendChild(title);
        vacancyElement.appendChild(details);

        resultPara.appendChild(vacancyElement);

        // Expand/collapse vacancy information
        colSymbol.addEventListener("click", () => {

            details.classList.toggle("visible");

            if (details.classList.contains("visible")) {
                colSymbol.textContent = "-";
            } else {
                colSymbol.textContent = "+";
            }
        });
    });
}