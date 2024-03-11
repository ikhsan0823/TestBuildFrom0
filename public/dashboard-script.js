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
document.getElementById("color7").style.color = "#cfcfcf";
document.addEventListener('DOMContentLoaded', function () {
    var selfUsername = '<%= usernames %>';
    var usernameHidden = document.getElementById('username-hidden');
    usernameHidden.innerText = selfUsername;

    var usernames = '<%= username %>';
    var greetingMessageElement = document.getElementById('greeting-message');
    var onlineCount = document.getElementById('online-count');
    var currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
        greetingMessageElement.innerText = 'Good Morning, ' + usernames;
    } else if (currentTime >= 12 && currentTime < 18) {
        greetingMessageElement.innerText = 'Good Afternoon, ' + usernames;
    } else {
        greetingMessageElement.innerText = 'Good Evening, ' + usernames;
    }

});

document.addEventListener('DOMContentLoaded', function (){
    var motivationText = [
        "What's on your agenda for today?",
        "Any plans on your schedule today?",
        "What do you have lined up for today?",
        "How are you spending your day today?",
        "Any specific plans for today?",
        "What's your plan of action for today?",
        "What's in store for you today?",
        "Any activities or tasks planned for today?",
        "How are you occupying yourself today?",
        "What are your plans for the day ahead?",
        "Seize the day!",
        "Embrace challenges boldly.",
        "Pursue your passions.",
        "Achieve your goals.",
        "Stay focused, achieve.",
        "Strive for greatness.",
        "Unleash your potential.",
        "Inspire with action.",
        "Conquer your fears.",
        "Make every moment count."
    ];
    var randomMotivation = motivationText[Math.floor(Math.random() * motivationText.length)];
    document.getElementById('motivation-text').innerText = randomMotivation;
});

document.addEventListener('DOMContentLoaded', function (){
    var myDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var myMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'];
    var currentDay = new Date().getDay();
    var currentDate = new Date().getDate();
    var currentMonth = new Date().getMonth();
    var currentMyDay = myDay[currentDay];
    var currentMyMonth = myMonth[currentMonth];
    document.getElementById('day').innerText = currentMyDay;
    document.getElementById('date').innerText = currentDate;
    document.getElementById('month').innerText = currentMyMonth;
});

function myDaily() {
    window.location.href = '/daily';
}

function myMoney() {
    window.location.href = '/money';
}

document.addEventListener('DOMContentLoaded', function () {
    const buttonChat = document.querySelector(".button-chat");
    const closeChat = document.getElementById("close-chat");
    const liveChat = document.querySelector("section");

    buttonChat.addEventListener("click", () => liveChat.classList.add("livechat-active"));
    closeChat.addEventListener("click", () => liveChat.classList.remove("livechat-active"));
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
        window.location.href = "/dashboard";
    }
}

const username = '<%= usernames %>';

        const socket = io('https://freckle-peaceful-singularity.glitch.me',{
            withCredentials: true,
            query: {
                username: username
            }
        });

        socket.emit('username', username);
        socket.emit('login', username);

        $('form').submit(function() {
            var inputValue = $('#m').val();
            if (inputValue.trim() === "") {
                return false;
            }

            socket.emit('chat', { message: inputValue, username: username });
            $('#m').val('');
            return false;
        });

        socket.on('chat', function(data) {
            var chatUser = data.username;
            var chatText = data.message;
            var now = new Date();
            var chatTimeHours = now.getHours();
            var chatTimeMinutes = now.getMinutes();

            var listChat = $('<li>');
            var component1 = $('<div class="username-chat">').text(chatUser);
            var component2 = $('<div class="chat-text">').text(chatText);
            var component3 = $('<div class="chat-time">').text(chatTimeHours + ':' + (chatTimeMinutes < 10 ? '0' : '') + chatTimeMinutes);
            
            listChat.append(component1, component2, component3);
            $('#messages').append(listChat);

            var lastChatList = $('#messages li:last')[0];
            lastChatList.scrollIntoView({ behavior:"smooth", block:"end", inline:"nearest" });
        });

        socket.on('userStatus', ({ username, online }) => {
            var yourusername = document.getElementById('username-hidden').innerHTML;
            if (!username) {
                return;
            }
            if (username === yourusername) {
                $('#messages').append($('<li class="userstatus">').text(`You ${online ? 'join' : 'leave'} the chat`));
            } else {
                $('#messages').append($('<li class="userstatus">').text(`${username} ${online ? 'join' : 'leave'} the chat`));
            }
            var lastStatusList = $('#messages .userstatus:last')[0];
            lastStatusList.scrollIntoView({ behavior:"smooth", block:"end", inline:"nearest" });
        });

        socket.on('updateUserCount', (onlineUserCount) => {
            $('#online-count').text(onlineUserCount);
        });

        window.addEventListener('beforeunload', () => {
            socket.emit('logout', username);
        });