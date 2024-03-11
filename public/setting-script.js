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
document.getElementById("color5").style.color = "#cfcfcf";
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

const popupContainer = document.querySelector("section");
const showEditProfile = document.querySelector(".edit-profile");
const showResetPass = document.querySelector(".change-password");

showEditProfile.addEventListener("click", () => popupContainer.classList.add("active"));
function myCloseFunction() {
    popupContainer.classList.remove("active");
}
showResetPass.addEventListener("click", () => popupContainer.classList.add("actives"));
function myCloseFunctions() {
    popupContainer.classList.remove("actives");
}

async function sendResetEmail() {
    const emailpass = document.getElementById('emailspass').value;
    const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailpass }),
    });
    const data = await response.json();
    alert(data.message);
}
async function resetPassword() {
    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch(`/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, token }),
        });
        
        const data = await response.json();
        alert(data.message);
        window.location.href = '/setting';
    } catch (error) {
        console.error('Error during password reset:', error);
        alert('An error occurred during password reset.');
    }
}

const emailSpan = document.getElementById('emailpass');
const email = emailSpan.value;
const sensorEmail = email.replace(/(.{2})(.*)(?=@)/, (match, gp1, gp2) => {
    const starredChars = gp1 + '*'.repeat(gp2.length);
    return starredChars;
});
emailSpan.value = sensorEmail;

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
        window.location.href = "/setting";
    }
}