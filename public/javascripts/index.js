const socket = io()

// List All Friends
var ownerEmail
axios.get('/friends', {
        // token = document.cookie
        headers: {
            Authorization: ('Bearer ', ('; ' + document.cookie).split(`; token=`).pop().split(';')[0])
        },
    })
    .then(function(response) {
        var friends = ''
        var flag = "card active"
        for (i = 0; i < response.data.length; i++) {
            id = response.data[i].email
            friends += `<div class="row-8"><button id="${id}" class="${flag}" onclick="openClick(event)" value="${response.data[i].name}"><h3>${response.data[i].name}</h3></button></div><br>`
            flag = "card"
        }
        document.getElementById('friends').innerHTML = friends
        document.getElementById('chatTitle').innerHTML = response.data[0].name
        document.getElementById('ownerId').innerHTML = response.data[0].owner
        ownerEmail = response.data[0].owner
        inboxMsg(window[document.getElementById('messenger').innerHTML])
    })
    .then(() => {
        socket.on(ownerEmail, (msg) => {
            const messageElement = document.createElement('div')
            messageElement.classList.add('chat-panel');
            messageElement.classList.add('col-md-3');
            messageElement.classList.add('chat-bubble');
            messageElement.classList.add('chat-bubble--left');
            messageElement.innerHTML = `<h4>${msg}</h4>`
            messenger.append(messageElement)
            scrollToBottom()
        })
    })
    .catch(function(error) {
        console.log(error)
    });

// Button Active Function
function openClick(e) {
    var cards = document.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
        cards[i].className = cards[i].className.replace(" active", "");
    }
    e.currentTarget.className += " active";
    document.getElementById('chatTitle').innerHTML = e.currentTarget.getAttribute('value')
    inboxMsg(window[e.currentTarget.getAttribute('value').split(" ").join("")])
}

// List All Chats
function inboxMsg() {
    axios.get('/chats', {
            headers: {
                Authorization: ('Bearer ', ('; ' + document.cookie).split(`; token=`).pop().split(';')[0])
            },
        })
        .then(function(response) {
            var chat = ''
            friendId = document.getElementsByClassName('active')[0].id
            for (i = 0; i < response.data.length; i++) {
                if (response.data[i].sender == ownerEmail && response.data[i].receiver == friendId) {
                    chat += `<div class="chat-panel col-md-3 offset-md-9 chat-bubble chat-bubble--right" id=${i}><h4>${response.data[i].message}</h4></div>`
                } else if (response.data[i].sender == friendId && response.data[i].receiver == ownerEmail) {
                    chat += `<div class="chat-panel col-md-3 chat-bubble chat-bubble--left" id=${i}><h4>${response.data[i].message}</h4></div>`
                }
            }
            document.getElementById('messenger').innerHTML = chat
            scrollToBottom()
        })
        .catch(function(error) {
            console.log(error)
        });
}

function scrollToBottom() {
    var objDiv = document.getElementById("messenger");
    objDiv.scrollIntoView(false)
}

// Create Chat
function chatUser() {
    const receiver = document.getElementsByClassName('active')[0].id
    const message = document.getElementById("message").value
    socket.emit('chat', message, receiver)
    axios.post('/chats', {
            friend: receiver,
            message: message
        }, {
            headers: {
                Authorization: ('Bearer ', ('; ' + document.cookie).split(`; token=`).pop().split(';')[0])
            }
        })
        .then(function(response) {
            const messageElement = document.createElement('div')
            messageElement.classList.add('chat-panel');
            messageElement.classList.add('col-md-3');
            messageElement.classList.add('offset-md-9');
            messageElement.classList.add('chat-bubble');
            messageElement.classList.add('chat-bubble--right');
            messageElement.innerHTML = `<h4>${message}</h4>`
            messenger.append(messageElement)
            document.getElementById("message").value = ''
            scrollToBottom()
        })
        .catch(function(error) {
            console.log(error);
        })
}
// send message by hitting enter key
document.getElementById("message").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        chatUser()
    }
});

// Logout User
function logOut() {
    console.log(document.cookie)
    axios.post('/users/logout', {}, {
            headers: {
                Authorization: ('Bearer ', ('; ' + document.cookie).split(`; token=`).pop().split(';')[0])
            }
        })
        .then((response) => {
            console.log("Logged Out")
            document.cookie = "token=";
            // localStorage.removeItem("token");
            location.replace('https://avikal-webchat-app.herokuapp.com/')
        }).catch((error) => {
            console.log(error)
            console.log(document.cookie)
        })
}