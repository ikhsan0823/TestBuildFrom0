function main(){
    if (window.matchMedia("(min-width: 1023px)").matches) {
        document.getElementById("barList").style.display = "block";
        document.getElementById("account-list").style.display = "block";
        const sidebar = document.getElementById("sidebar");
        sidebar.style.width = "300px";
        sidebar.style.backgroundColor = "#f9f9f9";
        sidebar.style.boxShadow = "0 2px 18px rgba(0, 0, 0, .08)";
    }
}
function hide(){
    if (window.matchMedia("(min-width: 1023px)").matches) {
        document.getElementById("barList").style.display = "none";
        document.getElementById("account-list").style.display = "none";
        const sidebar = document.getElementById("sidebar");
        sidebar.style.width = "";
        sidebar.style.backgroundColor = "";
        sidebar.style.boxShadow = "";
    }
}

let isDisplayed = false;
function toggleDisplay() {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        event.stopPropagation();
        const barList = document.getElementById("barList");
        const accountList = document.getElementById("account-list");
        const sidebar = document.getElementById("sidebar");
        if(!isDisplayed) {
            barList.style.display = "block";
            accountList.style.display = "block";
            sidebar.style.width = "200px";
            sidebar.style.backgroundColor = "#f9f9f9";
            sidebar.style.boxShadow = "0 2px 18px rgba(0, 0, 0, .08)";
        } else {
            sidebar.style.width = "";
            sidebar.style.backgroundColor = "";
            barList.style.display = "none";
            accountList.style.display = "none";
            sidebar.style.boxShadow = "";
        }
        isDisplayed = !isDisplayed;
    }

}

document.addEventListener("click", function(event) {
    if (window.matchMedia("(max-width: 1023px)").matches) {
        const sidebar = document.getElementById("sidebar");
        const isClickInsideSidebar = sidebar.contains(event.target);

        if (!isClickInsideSidebar) {sidebar.style.width = "";
            sidebar.style.backgroundColor = "";
            sidebar.style.boxShadow = "";
            document.getElementById("barList").style.display = "none";
            document.getElementById("account-list").style.display = "none";
            isDisplayed = false;
        }
    }
});

function setColor(){
    document.getElementById("color").style.color = "#cfcfcf";
}
function unsetColor(){
    document.getElementById("color").style.color = "#030303";
}
function setColor1(){
    document.getElementById("color1").style.color = "#cfcfcf";
}
function unsetColor1(){
    document.getElementById("color1").style.color = "#030303";
}
function setColor2(){
    document.getElementById("color2").style.color = "#cfcfcf";
}
function unsetColor2(){
    document.getElementById("color2").style.color = "#030303";
}
document.getElementById("color3").style.color = "#cfcfcf";
function setColor4(){
    document.getElementById("color4").style.color = "#cfcfcf";
}
function unsetColor4(){
    document.getElementById("color4").style.color = "#030303";
}
function setColor5(){
    document.getElementById("color5").style.color = "#cfcfcf";
}
function unsetColor5(){
    document.getElementById("color5").style.color = "#030303";
}
function setColor6(){
    document.getElementById("color6").style.color = "#cfcfcf";
}
function unsetColor6(){
    document.getElementById("color6").style.color = "#030303";
}
function setColor7(){
    document.getElementById("color7").style.color = "#cfcfcf";
}
function unsetColor7(){
    document.getElementById("color7").style.color = "#030303";
}

const username = '<%= usernames %>';
const value = '<%= value %>';

const socket = io('https://freckle-peaceful-singularity.glitch.me',{
    withCredentials: true,
    query: {
        username: username
    }
});

socket.emit('value', value);

socket.on('balance', (addValue) => {
    $('#balance').text(addValue);
});

$(document).ready(function() {
    initialHistory();

    $("#deposit-button").on("click", async function() {
        var inputValue = $("#deposite").val();
        var addValue = parseInt(inputValue);
        $("#deposite").val('');
        var type = 'Deposite';
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const response = await fetch('/addvalue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: addValue, formattedDate: formattedDate, formattedTime: formattedTime, type: type, amount:addValue }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const data = await response.json();
        $('#balance').text(data);

        const getHistory = await fetchHistory();
        const historyLogElement = $('.history-log');
        historyLogElement.empty();

        const cards = getHistory.map(historyItem => {
            const dateString = historyItem.formattedDate;
            const type = historyItem.type;
            const amount = historyItem.amount;
            const formattedDate = new Date(dateString).toISOString().split('T')[0];
            var logElement = $('<div>').addClass('log');
            if (historyItem.type === 'Reset') {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">Reset</div>');
            } else {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">' + type + ' Rp' + amount + '</div>');
            }
            return logElement.get(0);
        });

        historyLogElement.append(cards);
    })

    $("#withdraw-button").on("click", async function() {
        var inputValue = $("#withdraw").val();
        var minValue = parseInt(inputValue);
        $("#withdraw").val('');
        var type = 'Withdraw';
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const response = await fetch('/minvalue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: minValue, formattedDate: formattedDate, formattedTime: formattedTime, type: type, amount: minValue }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const data = await response.json();
        $('#balance').text(data);

        const getHistory = await fetchHistory();
        const historyLogElement = $('.history-log');
        historyLogElement.empty();

        const cards = getHistory.map(historyItem => {
            const dateString = historyItem.formattedDate;
            const type = historyItem.type;
            const amount = historyItem.amount;
            const formattedDate = new Date(dateString).toISOString().split('T')[0];
            var logElement = $('<div>').addClass('log');
            if (historyItem.type === 'Reset') {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">Reset</div>');
            } else {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">' + type + ' Rp' + amount + '</div>');
            }
            return logElement.get(0);
        });

        historyLogElement.append(cards);
    })

    $('#reset-btn').on("click", async function() {
        var type = 'Reset';
        var amounts = 0;
        const d = new Date();
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        const response = await fetch('/resetvalue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formattedDate: formattedDate, formattedTime: formattedTime, type: type, value: amounts })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        };
        const data = await response.json();
        $('#balance').text(data);

        const getHistory = await fetchHistory();
        const historyLogElement = $('.history-log');
        historyLogElement.empty();

        const cards = getHistory.map(historyItem => {
            const dateString = historyItem.formattedDate;
            const type = historyItem.type;
            const amount = historyItem.amount;
            const formattedDate = new Date(dateString).toISOString().split('T')[0];
            var logElement = $('<div>').addClass('log');
            if (historyItem.type === 'Reset') {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">Reset</div>');
            } else {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">' + type + ' Rp' + amount + '</div>');
            }
            return logElement.get(0);
        });

        historyLogElement.append(cards);
    })

    async function fetchHistory() {
        const response = await fetch('/gethistory');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.getHistory;
    }

    async function initialHistory() {
        const getHistory = await fetchHistory();
        const historyLogElement = $('.history-log');
        historyLogElement.empty();

        const cards = getHistory.map(historyItem => {
            const dateString = historyItem.formattedDate;
            const type = historyItem.type;
            const amount = historyItem.amount;
            const formattedDate = new Date(dateString).toISOString().split('T')[0];
            var logElement = $('<div>').addClass('log');
            if (historyItem.type === 'Reset') {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">Reset</div>');
            } else {
                logElement.html('<div class="date-container"><div class="date-log">' + formattedDate + '</div><div class="time-log">' + historyItem.formattedTime + '</div></div><div id="text-log" class="text-log">' + type + ' Rp' + amount + '</div>');
            }
            return logElement.get(0);
        });

        historyLogElement.append(cards);
    }

    $("#trash-can").on("click", async function() {
        var confirmation = window.confirm("Are you sure you want to delete all transaction logs?");
        if (confirmation) {
            try {
                const response = await fetch('/history/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error deleting transaction logs: ${response.statusText}`);
                }

                initialHistory()
            } catch (error) {
                console.error('Error:', error);
            }
        }
    })
});

function confirmLogout() {
    const logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if (logoutConfirmed) {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/";
            } else {
                alert("Logout failed!");
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
            alert("Logout failed");
        });
    } else {
        window.location.href = "/money";
    }
}