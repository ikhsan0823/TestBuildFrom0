//Toggle the display of elements
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

//Functions to set and unset color for elements
document.getElementById("color").style.color = "#cfcfcf";
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
function setColor3(){
    document.getElementById("color3").style.color = "#cfcfcf";
}
function unsetColor3(){
    document.getElementById("color3").style.color = "#030303";
}
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

//Popup related code
const popupContainer = document.querySelector("section");
const overlay = document.querySelector(".overlay");
const showCreateItem = document.querySelector(".show-createitem");
const closeBtn = document.querySelector(".close-btn");
const submitBtn = document.querySelector(".btn");

showCreateItem.addEventListener("click", () => popupContainer.classList.add("active"));
closeBtn.addEventListener("click", () => popupContainer.classList.remove("active"));
submitBtn.addEventListener("click", () => popupContainer.classList.remove("active"));


async function getDailyTasks() {
    try{
        const response = await fetch('/carddaily', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Error retrieving daily tasks: ${response.statusText}');
        }

        const data = await response.json();
        return data.dailyTasks;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function displayDailyTasks() {
    const dailyTasks = await getDailyTasks();

    const dayList = document.getElementById('daylist');
    dayList.innerHTML = '';

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];

    const cards = dailyTasks
        .map(task => {
            const card = document.createElement('div');
            card.className = 'card';
            var fromServerDate = task.date;
            var serverDate = new Date(fromServerDate);
            var cardDate = serverDate.toISOString().split('T')[0];
            var cardTitle = task.title;
            var cardDescription = task.description;
            var uniqueId = task.uniqueId;
            var nameday = task.nameday;
            card.id = 'card-' + uniqueId;
            card.innerHTML = '<div class="title-day">'+ nameday +'</div><div class="date">'+ cardDate +'</div><div class="title">Title</div><div class="titlediv">'+ cardTitle +'</div><div class="title">Description</div><div class="description">'+ cardDescription +'</div><div class="task-card-btn"><i onclick="myDeleteFunction(\'' + card.id + '\')" id="delete-task" class="fa-solid fa-trash-can"></i><button onclick="readProperty(\'' + card.id + '\')" class="finish-btn">Finish</button></div>';
            return {card, cardDate};
        })
        .sort((a, b) => new Date(a.cardDate) - new Date(b.cardDate));
    
    cards.forEach(({ card }) => dayList.appendChild(card));

    // Move cards to uncompleted after they are appended to dayList
    const uncompletedItemContent = document.querySelector('.uncompleted-item-content');
    uncompletedItemContent.innerHTML = '';
    const moveCardIds = new Set();
    cards.forEach(({ card, cardDate }) => {
        const cardDates = new Date(cardDate);
        const cardDateString = cardDates.toISOString().split('T')[0];
        const currentDate = new Date().toISOString().split('T')[0];

        if (!moveCardIds.has(card.id) && cardDateString < currentDate) {
            uncompletedItemContent.appendChild(card);
            moveCardIds.add(card.id);
        }
    });

    var parentElement = document.querySelector('.uncompleted-item-content');
    function updateCardCount() {
        var cardCount = parentElement.querySelectorAll('.card').length;
        document.getElementById('uncompleted-count').innerHTML = cardCount;
    }

    updateCardCount();

    var observer = new MutationObserver(updateCardCount);
    var observerConfig = { childList: true, subtree: true };
    observer.observe(parentElement, observerConfig);

    const popupTaskUncompeted = document.querySelector("section");
    /*document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("uncompleted")) {
            popupTaskUncompeted.classList.toggle("false");
        }
    });*/

    function uncompletedShow() {
        popupTaskUncompeted.classList.toggle("false");
    }

    function myEnterFunction() {
        popupTaskUncompeted.classList.remove("false");
    }
}

document.addEventListener('DOMContentLoaded', displayDailyTasks);


async function sendDailyTaskToServer(title, description, date, uniqueId, nameday) {
    try {
        const response = await fetch('/dailytask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                date: date,
                uniqueId: uniqueId,
                nameday: nameday,
            }),
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Server response:', data);
        } else {
            console.error('Unexpected response type:', contentType);
        }
    } catch (error) {
        console.error('Error sending data to server:', error);

        if (error instanceof TypeError || error.name === 'TypeError') {
            console.error('Network error. Unable to fetch data from the server.');
        } else if (error instanceof SyntaxError || error.name === 'SyntaxError') {
            console.error('Error parsing JSON from the server response.');
        } else {
            console.error('Other error:', error);
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    displayDailyTasks();

    document.getElementById('cardForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var date = document.getElementById('task-date').value;

        const d = new Date(date);
        const dateString = d.toISOString().split('T')[0];

        function generateRandomId() {
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            const getRandomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
            const getRandomNumber = () => Math.floor(Math.random() * 10);

            const randomId = getRandomNumber() + getRandomLetter() + getRandomLetter();
            return randomId;
        }
        //Function to get day name
        function getDayName(date) {
            var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var dayIndex = date.getDay();
            return daysOfWeek[dayIndex];
        }

        var card = document.createElement('div');
        card.className = 'card';
        var uniqueId = generateRandomId();
        var nameday = getDayName(d)
        card.id = 'card-' + uniqueId;
        card.innerHTML = '<div class="title-day">' + nameday + '</div><div class="date">' + date + '</div><div class="title">Title</div><div class="titlediv">' + title + '</div><div class="title">Description</div><div class="description">' + description + '</div><div class="task-card-btn"><i onclick="myDeleteFunction(\'' + card.id + '\')" id="delete-task" class="fa-solid fa-trash-can"></i><button onclick="readProperty(\'' + card.id + '\')" class="finish-btn">Finish</button></div>';

        var dayList = document.getElementById('daylist');
        var cards = dayList.getElementsByClassName('card');
        var insertIndex = 0;

        for (var i = 0; i < cards.length; i++) {
            var cardDate = new Date(cards[i].getElementsByClassName('date')[0].innerText);
            if (cardDate.toISOString().split('T')[0] > dateString) {
                break;
            }
            insertIndex++;
        }

        if (insertIndex === cards.length) {
            dayList.appendChild(card);
        } else {
            dayList.insertBefore(card, cards[insertIndex]);
        }

        for (var i = 0; i < cards.length; i++) {
            var cardDates = new Date(cards[i].getElementsByClassName('date')[0].innerText);
            var cardDateString = cardDates.toISOString().split('T')[0];
            var currentDate = new Date().toISOString().split('T')[0];
            if (cardDateString < currentDate) {
                document.querySelector('.uncompleted-item-content').appendChild(cards[i]);
            } else {
                if (cardDates >= d) {
                    break;
                }
                insertIndex++;
            }
        }

        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('task-date').value = '';

        sendDailyTaskToServer(title, description, date, uniqueId, nameday);
    });
});


//Functions to show and hide elements based on completion status
function showElementTrue() {
    document.getElementById('finish-task-content').style.display = "block";
    document.getElementById('notcompleted-task-content').style.display = "none";
    document.getElementById('showelementtrue').style.backgroundColor = "#030303";
    document.getElementById('showelementtrue').style.color = "#f9f9f9";
    document.getElementById('showelementnot').style.backgroundColor = "transparent";
    document.getElementById('showelementnot').style.color = "#030303";
}
function showElementNot() {
    document.getElementById('finish-task-content').style.display = "none";
    document.getElementById('notcompleted-task-content').style.display = "block";
    document.getElementById('showelementtrue').style.backgroundColor = "transparent";
    document.getElementById('showelementtrue').style.color = "#030303";
    document.getElementById('showelementnot').style.backgroundColor = "#030303";
    document.getElementById('showelementnot').style.color = "#f9f9f9";
}

//Functions related to finishing a task popup
const popupTaskFinish = document.querySelector("section");
document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("finish-btn")) {
        popupTaskFinish.classList.toggle("true");
    }
});

const submitBtnFinish = document.querySelector(".submit-image");
const submitBtnFinish1 = document.querySelector(".submit-image1");

function myCloseFunction() {
    popupTaskFinish.classList.remove("true");
}
submitBtnFinish.addEventListener("click", () => popupTaskFinish.classList.remove("true"));
submitBtnFinish1.addEventListener("click", () => popupTaskFinish.classList.remove("true"));

// Function to delete a task
async function myDeleteFunction(elementId) {
    var confirmation = window.confirm("Are you sure you want to remove this task?");
    if (confirmation) {
        const elementToRemove = document.getElementById(elementId);
        if (elementToRemove) {
            // Get the uniqueId from the element's ID
            const uniqueId = elementId.split('-')[1];
            
            // Make an asynchronous request to delete the task from the server
            await deleteTaskFromServer(uniqueId);

            // Remove the element from the DOM
            elementToRemove.remove();
        }
    }
}

// Function to send a request to delete the task from the server
async function deleteTaskFromServer(uniqueId) {
    try {
        const response = await fetch(`/dailytask/${uniqueId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Server response:', data);
        } else {
            console.error('Unexpected response type:', contentType);
        }
    } catch (error) {
        console.error('Error deleting data from the server:', error);
    }
}

//Function related to displaying uncompleted tasks
const popupTaskUncompeted = document.querySelector("section");
/*document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("uncompleted")) {
        popupTaskUncompeted.classList.toggle("false");
    }
});*/
function uncompletedShow() {
    popupTaskUncompeted.classList.toggle("false");
}

function myEnterFunction() {
    popupTaskUncompeted.classList.remove("false");
}

document.addEventListener('DOMContentLoaded', function (){
var parentElement = document.querySelector('.uncompleted-item-content');
function updateCardCount() {
    var cardCount = parentElement.querySelectorAll('.card').length;
    document.getElementById('uncompleted-count').innerHTML = cardCount;
}
updateCardCount();
var observer = new MutationObserver(function (mutations) {
    updateCardCount();
});
var observerConfig = { childList: true, subtree: true };
observer.observe(parentElement, observerConfig);
});

var globalCardElementId = null;

function readProperty(elementId) {
    var cardElement = document.getElementById(elementId);
    cardElementId = cardElement.id;
    var idSplit = cardElementId.split('-')[1];
    globalCardElementId = idSplit;
    document.getElementById("uniqueId").value = globalCardElementId;
}

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
        window.location.href = "/daily";
    }
}