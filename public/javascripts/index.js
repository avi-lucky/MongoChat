const socket = io()

// List All Friends
var ownerEmail
axios.get('/friends', {
        headers: {
            Authorization: ('Bearer ', localStorage.getItem("token"))
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
                Authorization: ('Bearer ', localStorage.getItem("token"))
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
        })
        .catch(function(error) {
            console.log(error)
        });
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
                Authorization: ('Bearer ', localStorage.getItem("token"))
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
            messageElement.scrollTop = messageElement.scrollHeight
        })
        .catch(function(error) {
            console.log(error);
        })
}

// function scrollToBottom() {
//     let messageArea = document.getElementsByClassName('chat-panel')
//     console.log(messageArea)
//     window.scrollTo(0, messageArea.scrollHeight)
//         // messageArea.scrollTop = messageArea.scrollHeight
// }

// Logout User
function logOut() {
    console.log(localStorage.getItem("token"))
    axios.post('/users/logout', {
        headers: {
            Authorization: ('Bearer ', localStorage.getItem("token"))
        }
    }).then((response) => {
        console.log("Logged Out")
        localStorage.removeItem("token");
        location.replace('/')
    }).catch((error) => {
        console.log(error)
        console.log(localStorage.getItem("token"))
    })
}