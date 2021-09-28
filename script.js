// initialization
let add = document.querySelector(".add");
let del = document.querySelector(".delete");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let deleteMode = false;
let filtersArr = ["pink", "green", "blue", "black"]
// load all the tcikets from the local storage
loadTasks();

// filtering of the tickets 
let filters = document.querySelectorAll(".filter div");
for(let i=0; i<filters.length; i++)
{
    filters[i].addEventListener("click", function(e)
    {
        let selectedColor = e.currentTarget.classList[0];
        loadTasks(selectedColor);
    })
}

// if there is no object for allTickets created then create an object
if (localStorage.getItem("allTickets") == undefined) {
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("allTickets", allTickets);
}


// add button functioning
add.addEventListener("click", function () {
    // if delete button was selected then unselect
    if (deleteMode) {
        deleteMode = false;
        del.classList.remove("delete-selected");
    }

    // check if the modal already exist 
    let preModal = document.querySelector(".modal")
    if (preModal != null) {
        return;
    }

    //create modal 
    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<div class="modal-text-area-container">
    <div class="modal-text-area-inner" contenteditable="true"></div>
</div>
<div class="modal-filter-container">
    <div class="modal-filter-inner">
        <div class="modal-priorities pink"></div>
        <div class="modal-priorities green"></div>
        <div class="modal-priorities blue"></div>
        <div class="modal-priorities black selected"></div>
    </div>
</div>`;
    let ticketColor = "black";
    // append modal to body
    body.append(div);

    //event listeners on the filters n the modal
    let allPriorities = div.querySelectorAll(".modal-priorities");
    for (let i = 0; i < allPriorities.length; i++) {
        allPriorities[i].addEventListener("click", function (e) {
            for (let j = 0; j < allPriorities.length; j++) {
                allPriorities[j].classList.remove("selected");
            }
            e.currentTarget.classList.add("selected");
            ticketColor = e.currentTarget.classList[1];
        })
    }
    // ID function
    let uid = new ShortUniqueId();
    // event listener for text area in the modal
    let textArea = div.querySelector(".modal-text-area-inner");
    textArea.addEventListener("keydown", function (e) {
        if (e.key == "Enter") {
            let id = uid();
            div.remove();
            //local storage
            allTickets = JSON.parse(localStorage.getItem("allTickets"));
            let ticketObj = {
                color: ticketColor,
                task: e.currentTarget.innerText
            };
            allTickets[id] = ticketObj;
            localStorage.setItem("allTickets", JSON.stringify(allTickets));
            //create ticket
            let ticketDiv = document.createElement("div");
            ticketDiv.setAttribute("data-id", id);
            ticketDiv.classList.add("ticket");
            ticketDiv.innerHTML = `<div data-id="${id}" class="ticket-color ${ticketColor}" ></div>
            <div class="ticket-id">#${id}</div>
            <div data-id="${id}" class="ticket-content" contenteditable="true">${e.currentTarget.innerText}</div>`;
            // edit color of the ticket
            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", function (e) {
                let currId = e.currentTarget.getAttribute("data-id");
                let currColor = ticketColorDiv.classList[1];
                let index = -1;
                index = filtersArr.indexOf(currColor);
                index = (index + 1) % 4;
                let newColor = filtersArr[index];
                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
                // edit color in local storage
                let allTickets = JSON.parse(localStorage.getItem("allTickets"));

                allTickets[currId].color = newColor;
                localStorage.setItem("allTickets", JSON.stringify(allTickets));

            })
            //edit task of the tickets
            let ticketContentDiv = ticketDiv.querySelector(".ticket-content");
            ticketContentDiv.addEventListener("input", function (e) {
                let newContent = e.currentTarget.innerText;
                let currId = e.currentTarget.getAttribute("data-id");
                let allTickets = JSON.parse(localStorage.getItem("allTickets"));
                allTickets[currId].task = newContent;
                localStorage.setItem("allTickets", JSON.stringify(allTickets));
            })
            // delete ticket
            ticketDiv.addEventListener("click", function (e) {
                if (deleteMode) {

                    let currId = e.currentTarget.getAttribute("data-id");
                    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
                    delete allTickets[currId];
                    localStorage.setItem("allTickets", JSON.stringify(allTickets));
                    ticketDiv.remove();
                }
            })
            grid.append(ticketDiv);

        }
        else if (e.key == "Escape") {
            div.remove();
        }


    })




});

// delete button event listener
del.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("delete-selected")) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else {
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
})


// load Task function for the tickets to load after refreash
function loadTasks(color) {
    let allTicketDiv = document.querySelectorAll(".ticket");
    for(let i=0; i<allTicketDiv.length; i++)
    {
        allTicketDiv[i].remove();
    }


    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    for (currId in allTickets) {
        let currTicketObj = allTickets[currId];
        if(color && color!=currTicketObj.color) continue;
    // create tickets
        let ticketDiv = document.createElement("div");
        ticketDiv.setAttribute("data-id", currId);
        ticketDiv.classList.add("ticket");
        ticketDiv.innerHTML = `<div data-id="${currId}" class="ticket-color ${currTicketObj.color}" ></div>
        <div class="ticket-id">#${currId}</div>
        <div data-id="${currId}" class="ticket-content" contenteditable="true">${currTicketObj.task}</div>`;
        // add event listeners to the tickets 
        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", function (e) {
                let currId = e.currentTarget.getAttribute("data-id");
                let currColor = ticketColorDiv.classList[1];
                let index = -1;
                index = filtersArr.indexOf(currColor);
                index = (index + 1) % 4;
                let newColor = filtersArr[index];
                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
                // edit color in local storage
                let allTickets = JSON.parse(localStorage.getItem("allTickets"));

                allTickets[currId].color = newColor;
                localStorage.setItem("allTickets", JSON.stringify(allTickets));

            })
            //edit task of the tickets
            let ticketContentDiv = ticketDiv.querySelector(".ticket-content");
            ticketContentDiv.addEventListener("input", function (e) {
                let newContent = e.currentTarget.innerText;
                let currId = e.currentTarget.getAttribute("data-id");
                let allTickets = JSON.parse(localStorage.getItem("allTickets"));
                allTickets[currId].task = newContent;
                localStorage.setItem("allTickets", JSON.stringify(allTickets));
            })
            // delete ticket
            ticketDiv.addEventListener("click", function (e) {
                if (deleteMode) {

                    let currId = e.currentTarget.getAttribute("data-id");
                    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
                    delete allTickets[currId];
                    localStorage.setItem("allTickets", JSON.stringify(allTickets));
                    ticketDiv.remove();
                }
            })
        
        grid.append(ticketDiv);

    }
}