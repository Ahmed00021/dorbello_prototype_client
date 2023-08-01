let path = window.location.pathname;
let page = path.split("/").pop();
// console.log(page);

let numberOfRows = 0;
let response;
async function  getData() {
    const data = await fetch('https://dorbelloprototypeserver-production.up.railway.app/')
    response = await data.json();
    console.log(response.data);
    numberOfRows = response.data.rows_from_database.length;
}

let totalMinutesArray = Array();
function putDataInTable() {
    if (page == "index.html" || page == "/") {
        let table = document.getElementById('myTable').children[1];

        for (let index = 0; index < numberOfRows; index++) {
            let row = table.insertRow(-1);
            let column1 = row.insertCell(0);
            let column3 = row.insertCell(1);
            let checkboxcolumn = row.insertCell(2);

            let eta = response.data.rows_from_database[index].placeholder_eta;
            etaArray = eta.split(" ");
            if (etaArray.length > 1) {
                etaArray.splice(1, 0, 'hour(s)');
                etaArray.push("minute(s)");
                let finishedEta = etaArray.join(" ");
                column3.textContent = finishedEta;

                let tempEtaArray = etaArray;
                tempEtaArray[0] = tempEtaArray[0] * 60;
                let totalMinutes = +tempEtaArray[0] + +tempEtaArray[2];
                let specificRow = response.data.rows_from_database[index];
                let total = totalMinutes;
                totalMinutesArray.push({total, specificRow});
            } else {
                etaArray.push("minute(s)");
                let finishedEta = etaArray.join(" ");
                column3.textContent = finishedEta;
                let totalMinutes = etaArray[0];
                let specificRow = response.data.rows_from_database[index];
                let totalMinutesstringToNumber = Number(totalMinutes)
                let total = totalMinutesstringToNumber;
                totalMinutesArray.push({total, specificRow});
            }

            let link = document.createElement("a");
            link.setAttribute("href", `${response.data.rows_from_database[index].security_pic}`);

            let parentNameArray = response.data.rows_from_database[index].parent_name.split(" ");
            let childNameArray = response.data.rows_from_database[index].student_name.split(" ");

            childNameArray[1] = parentNameArray[1]

            childName = childNameArray.join(" ");

            column1.textContent = childName;
            
            let checkboxelement = document.createElement('input');
            checkboxelement.setAttribute("onclick", "checkboxCheckerPrompt(event)");
            checkboxelement.type = 'checkbox';

            checkboxcolumn.appendChild(checkboxelement);

            row.id = 'row' + (index);
            checkboxelement.setAttribute("id", `checkbox ${index} `);
        }
    }
}

function sortHTML() {
    if (page == "index.html" || page == "/") {
        let sortedTotalMinutesArray = totalMinutesArray.sort(function(a, b){return (a.total) - (b.total)});

        for (let index = 0; index < sortedTotalMinutesArray.length; index++) {
            let column1 = document.getElementById("row" + index).children[0];
            let column3 = document.getElementById("row" + index).children[1];
            let column4 = document.getElementById("row" + index).children[2];
            let checkboxcolumn = document.getElementById("row" + index).children[3];
            
            column3.textContent = sortedTotalMinutesArray[index].specificRow.placeholder_eta;

            let eta = sortedTotalMinutesArray[index].specificRow.placeholder_eta;
            etaArray = eta.split(" ");
            if (etaArray.length > 1) {
                etaArray.splice(1, 0, 'hour(s)');
                etaArray.push("minute(s)");
                let finishedEta = etaArray.join(" ");
                column3.textContent = finishedEta;
            } else {
                etaArray.push("minute(s)");
                let finishedEta = etaArray.join(" ");
                column3.textContent = finishedEta;
            }

            let link = column4.children[0];
            link.setAttribute("href", `${sortedTotalMinutesArray[index].specificRow.security_pic}`);

            let parentNameArray = sortedTotalMinutesArray[index].specificRow.parent_name.split(" ");
            let childNameArray = sortedTotalMinutesArray[index].specificRow.student_name.split(" ");

            childNameArray[1] = parentNameArray[1]

            childName = childNameArray.join(" ");

            column1.textContent = childName;

            link.textContent = `${parentNameArray[1]} and ${childNameArray[0]} Confirmation Picture`;
        }
    }
}

function decrementETAs(id) {
    setTimeout(function() {
        let table2 = document.getElementById("myTable");
        lastRowEta = table2.children[1].lastChild.children[1].textContent;
        lastRowID = table2.children[1].lastChild.id;
        if (lastRowEta !== "0 minute(s)" && id == lastRowID) {
            increaseTime();
        }

        let table = document.getElementById("myTable");
        let amountOfRows = table.children[1].children.length - 1;
        let column3 = document.getElementById(id).children[1];
        let columnText = column3.textContent.split(" ");
        
        let decreasedValue;
        if (+columnText.length === 4) {
            if (+columnText[2] !== 0) {
                decreasedValue = columnText[0] + " " + columnText[1] + " " + (+columnText[2] - 1) + " " + columnText[3];
            } else if (+columnText[0] !== 0) {
                columnText[2] = +59;
                decreasedValue = (Number(columnText[0]) - 1) + " " + columnText[1] + " " + (columnText[2]) + " " + columnText[3];
                if (+columnText[0] - 1 === 0) {
                    decreasedValue = (+columnText[2]) + " " + columnText[3];
                }
            } 
        } else if (+columnText.length === 2) {
            if (+columnText[0] !== 0) {
            decreasedValue = +columnText[0] - 1 + " " + columnText[1];
            }
        }
        column3.textContent = decreasedValue;

        if (column3.textContent == "3 minute(s)") {
            column3.setAttribute('style', "color:MediumSeaGreen");
        }

        if (column3.textContent == "0 minute(s)") {
            column3.textContent = "ARRIVED";
            column3.setAttribute('style', "color:red");
        }

        if ((+columnText.length == 2 && +columnText[0] != 1) || (+columnText.length == 4 && (+columnText[0] != 0 || +columnText[2] != 1))) {
            decrementETAs(id);
        }
        
    }, 3000);
}
    

function moveToOtherRow() {
    let table = document.getElementById("myTable");
    let numberOfRows = table.children[1].children.length;  

    for (let index = 0; index < numberOfRows; index++) {
        row = table.children[1].children[index];
        decrementETAs(row.id);
    }

    
}

function increaseTime() {
    let clock = document.getElementsByClassName("clock");
    let clockArray = clock[0].textContent.split("")
    if (+clockArray[4] < 9) {
        clockArray[4] = (+clockArray[4] + 1);
        newClockString = clockArray.join("");
    } else if (+clockArray[4] == 9 && +clockArray[3] < 5) {
        clockArray[3] = (+clockArray[3] + 1);
        clockArray[4] = 0;
        newClockString = clockArray.join("");
    } else if (+clockArray[4] == 9 && +clockArray[3] == 5 && +clockArray[1] < 9) {
        clockArray[1] = (+clockArray[1] + 1);
        clockArray[3] = 0;
        clockArray[4] = 0;
        newClockString = clockArray.join("");
    } else if (+clockArray[1] == 9 && +clockArray[0] < 1) {
        clockArray[0] = (+clockArray[0] + 1);
        clockArray[1] = 0;
        newClockString = clockArray.join("");
    } else if (+clockArray[0] == 1 && +clockArray[1] <= 2 ) {
        clockArray[1] = (+clockArray[1] + 1);
        newClockString = clockArray.join("");
    } else if (+clockArray[0] == 1 && +clockArray[1] == 2 ) {
        clockArray[0] = 0;
        clockArray[1] = 1;
        newClockString = clockArray.join("");
    }
    clock[0].textContent = newClockString;
}

function checkboxCheckerPrompt(event) {
    let checkedTable = event.target.parentNode.parentNode.parentNode.parentNode;
    if (checkedTable.id == "checkedTable") {
        return;
    }

    let etaText = event.target.parentNode.parentNode.children[1].textContent;
    if (etaText != "ARRIVED") {
        if (confirm("ARE YOU SURE YOU WOULD LIKE TO CHECK THIS STUDENT? \nTHEIR GUARDIAN HASN'T ARRIVED YET.")) {
            let selectedBox = event.target;
            if (selectedBox.checked) {{
                let row = event.target.parentNode.parentNode;
                let table = document.getElementById("checkedTable").children[1];
                let newRow = document.createElement("tr");
                newRow.setAttribute("id", `${event.target.parentNode.parentNode.id}`);
                newRow.innerHTML = event.target.parentNode.parentNode.innerHTML;

                let clockTime = document.getElementsByClassName("clock");
                let newColumn = document.createElement("td");
                newColumn.textContent = clockTime[0].textContent;
                table.appendChild(newRow).appendChild(newColumn);
                row.remove();
                let checkbox = event.target;
                checkbox.disabled = true;
            }}
        } else {
            event.target.checked = false;
        }
    } else {
        // COPYED FROM CODE RIGHT ABOVE IN if (selectedBox.checked) BLOCK
        let row = event.target.parentNode.parentNode;
        let table = document.getElementById("checkedTable").children[1];
        let newRow = document.createElement("tr");
        newRow.setAttribute("id", `${event.target.parentNode.parentNode.id}`);
        let clockTime = document.getElementsByClassName("clock");
        let newColumn = document.createElement("td");
        newColumn.textContent = clockTime[0].textContent;
        newRow.innerHTML = event.target.parentNode.parentNode.innerHTML;
        table.appendChild(newRow).appendChild(newColumn);
        row.remove();
    }
    let pageNumber = document.getElementById("page").textContent.charAt(0);
    changePage(pageNumber);

    getNumberOfRemainingKids();
    
}

function getNumberOfRemainingKids() {
    if (page == "index.html" || page == "/") {
        let remainingKids = document.getElementById("myTable").children[1].children.length;
        let countContainer = document.getElementById("remaining-count");
        if (remainingKids == undefined) {
            countContainer.textContent = 0;
        } else {
            countContainer.textContent = remainingKids;
        }
    }
}

function openTable(event, tableID) {
    if (page == "index.html" || page == "/") {
        // Declare all variables
        let i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tableID).style.display = "table";
        event.currentTarget.className += " active";
    }
}

    let current_page = 1;
    let records_per_page = 10;

    function prevPage() {
        if (current_page > 1) {
            current_page--;
            changePage(current_page);
        }
    }

    function nextPage() {
        if (current_page < numPages()) {
            current_page++;
            changePage(current_page);
        }
    }
        
    function changePage(page) {
        let btn_next = document.getElementById("btn_next");
        let btn_prev = document.getElementById("btn_prev");
        let table = document.getElementById("myTable");
        let page_span = document.getElementById("page");
    
        // Validate page
        if (page < 1) page = 1;
        if (page > numPages()) {page = numPages()};
        
        let tableHeading = table.children[0].children[0];
        tableHeading.setAttribute("style", "display:none");
        for (let index = 0; index < table.children[1].children.length; index++){
            let row = table.children[1].children[index];
            row.setAttribute("style", "display:none");
        }

        for (let index = (page-1) * records_per_page; index < (page * records_per_page) && index < table.children[1].children.length; index++) {
            tableHeading.removeAttribute("style", "display:table");
            row = table.children[1].children[index];
            row.removeAttribute("style", "display:table");
        }
        page_span.innerHTML = page + "/" + numPages();

        if (page == 1) {
            btn_prev.style.visibility = "hidden";
        } else {
            btn_prev.style.visibility = "visible";
        }

        if (page == numPages()) {
            btn_next.style.visibility = "hidden";
        } else {
            btn_next.style.visibility = "visible";
        }
    }

    function numPages() {
        if (page == "index.html" || page == "/") {
            let table = document.getElementById("myTable");
            return Math.ceil(table.children[1].children.length / records_per_page);
        }
    }
    
    let added = true;
    let done = false;
    function getETATime() {
        if (page == "parentScreen.html") {
            if (done == false) {
                let tableRowSelected = 5
                let etaTimeText = document.getElementById("myTable").children[1].children[tableRowSelected].children[2].textContent;
                let etaContainer = document.getElementById("eta-number-container");
                let etaText = document.getElementById("eta-text");
                etaContainer.textContent = etaTimeText;
                if (etaContainer.textContent == "ARRIVED") {
                    let placeInTable = Number(document.getElementById("myTable").children[1].children[tableRowSelected].id.replace("row", ""))
                    etaText.textContent = "";
                    etaContainer.textContent = `Estimate pick up time: ${placeInTable * 30} sec`;
                    if (added == true) {
                        var marker = L.marker([41.035454, -74.214932]).addTo(map);
                        marker.bindPopup("<b>You</b>", {closeOnClick: false, autoClose: false}).openPopup();
                        added = false;
                        done = true;
                    }
                }
            }
        }
    }

    let finished = false;
    let clicked = false;
    function decreaseETAonApponSeperatePage() {
        if (clicked == false) {
            clicked = true;
            let etaContainer = document.getElementById("eta-number-container");
            let etaText = document.getElementById("eta-text");
            etaContainer.textContent = "15 Minutes";
            
            let interval = setInterval(function() {
                if (etaContainer.textContent != "1 Minutes") {
                    etaValue = Number(etaContainer.textContent.split(" ").shift());
                    etaValue--;
                    etaContainer.textContent = String(etaValue) + " Minutes";
                } else {
                    etaText.textContent = "";
                    // etaContainer.textContent = `Head towards pick-up 1 - estimate pick up time: ${placeInTable * 30} sec`;
                    // etaContainer.textContent = `Estimate pick up time: ${placeInTable * 30} sec`;
                    etaContainer.textContent = "Estimate Pickup Time: 3 Minutes";
                    if (added == true) {
                        var marker = L.marker([41.035454, -74.214932]).addTo(map);
                        marker.bindPopup("<b>You</b>", {closeOnClick: false, autoClose: false}).openPopup();
                        finished = true;
                    }
                    clearInterval(interval)
                }
            }, 3000);
        }
    }

    let tableRowSelected1 = 4
    function updateETAonApp() {
        let etaContainer = document.getElementById("eta-number-container");
        let etaText = document.getElementById("eta-text");
        if (etaText.textContent == "") {
            let placeInTable = Number(document.getElementById("myTable").children[1].children[tableRowSelected1].id.replace("row", ""))
            etaContainer.textContent = `Estimated Pickup Time: ${tableRowSelected1 * 30} sec`;
            if (tableRowSelected1 >= 0) {
                tableRowSelected1 = tableRowSelected1 - 1;
            }
        }
        
    }
    
    window.onload = async function() {
        await getData();
        putDataInTable();
        sortHTML();
        if (page == "index.html" || page == "/") {
            changePage(1);
        }
        getNumberOfRemainingKids();
        if (page == "parentScreen.html") {
            map.scrollWheelZoom.disable();
        }
    }