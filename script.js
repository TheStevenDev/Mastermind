var randomColors = []; //Pc random colors
var mySequence = [];

var myColors;
var attempts = 0;
var selected;

function riempiArray(){

    /*
        COLORS:
        1 -> red
        2 -> yellow
        3 -> green
        4 -> blue
        5 -> white
        6 -> gray
    */

    for(let i=0; i<4;i++){
        let random = Math.floor(Math.random() * 6+1);
        randomColors[i] = random;
    }

    console.log(randomColors);
}

function numberToColor(number){
    switch (number){
        case 1:
            return "#FF0000";
        case 2:
            return "#FFFF00";
        case 3:
            return "#008000";
        case 4:
            return "#0000FF";
        case 5:
            return "#FFFFFF";
        case 6:
            return "#808080";
        default:
            return null;
    }

}

function colorToNumber(color){
    switch (color){
        case "rgb(255, 0, 0)":
            return 1;
        case "rgb(255, 255, 0)":
            return 2;
        case "rgb(0, 128, 0)":
            return 3;
        case "rgb(0, 0, 255)":
            return 4;
        case "rgb(255, 255, 255)":
            return 5;
        case "rgb(128, 128, 128)":
            return 6;
        default:
            return null;
    }

}

function configure(){
    console.log(document.getElementById("3").style.width);
    document.getElementById("submit").addEventListener("click",submitButton); //Submit button

    //set-up colors
    riempiArray();
    myColors = document.getElementsByClassName("color-box");

    for(color of myColors){
        color.addEventListener("dragstart",dragStartEvent);
    }


    //AGGIUNGO DRAGOVER E DRAGDROP agli slot
    let slots = document.getElementsByClassName("color-item");

    for(slot of slots){
        slot.addEventListener("dragover",dragOverEvent);
        slot.addEventListener("drop",dropEvent);
    }

}

//EVENTS

function dragStartEvent(e) {
    selected = e.target.id;
}

function dragOverEvent(e){
    e.preventDefault();
}

function dropEvent(e){
    let newColor = numberToColor(parseInt(selected));

    let slotElement = document.getElementById(e.target.id);
    slotElement.style.setProperty("background-color",newColor);
    
    selected = null;
}

//ALERTS

function showAlert(){
    let alertDiv = document.getElementById("alert");

    alertDiv.innerHTML = "MISSING COLORS!";
    alertDiv.style.backgroundColor = "orangered";
    alertDiv.style.display = "flex";
}


function showWin(){
    let alertDiv = document.getElementById("alert");

    alertDiv.innerHTML = "YOU WON!";
    alertDiv.style.backgroundColor = "green";
    alertDiv.style.display = "flex";
}

function showLost(){
    let alertDiv = document.getElementById("alert");

    alertDiv.innerHTML = "YOU LOST!";
    alertDiv.style.backgroundColor = "red";
    alertDiv.style.display = "flex";
}

function hideAlert() {
    let alertDiv = document.getElementById("alert");
    alertDiv.style.display = "none";
}

//GAME CHECK

function checkEmpty(){
    let slots = document.getElementsByClassName("color-item");
    for(slot of slots){
        var slotColor = window.getComputedStyle(slot).getPropertyValue("background-color");
        console.log(window.getComputedStyle(slot).getPropertyValue("background-color"))

        if(slotColor === "rgb(210, 180, 140)"){
            return true;
        }
    }

    return false;
}

function checkWin(arr1, arr2){
    for(let i=0; i<4; i++){
        if(arr1[i] !== arr2[i]) return false;
    }

    return true;
}


function submitButton(e){
    if (checkEmpty()===true){
        showAlert();
        setTimeout(hideAlert, 3000);
        return;
    }

    attempts++; //increase attempts
    if(attempts===9){
        showLost();
        setTimeout(hideAlert, 3000);
        setTimeout(function() {location.reload();}, 2000);
        return;
    }

    //Check positions
    mySequence = [colorToNumber(document.getElementById("first").style.backgroundColor),colorToNumber(document.getElementById("second").style.backgroundColor),colorToNumber(document.getElementById("third").style.backgroundColor),colorToNumber(document.getElementById("fourth").style.backgroundColor)];
    
    //Fill the 4 divs
    var rowsNumber = document.getElementById("table").rows.length;
    let items = document.getElementById("table").getElementsByTagName("tbody")[0].getElementsByTagName("tr")[rowsNumber-1].getElementsByClassName("result-containter")[0].getElementsByClassName("result-item");

    for(let i =0; i<4;i++){
        if(randomColors.includes(mySequence[i])){
            items[i].style.backgroundColor = "black"; // C'è nella posizione sbagliata
            if(mySequence[i] === randomColors[i]) items[i].style.backgroundColor = "white"; //In posizione corretta
        }
        else{
            // Colore non presente
        }
    }

    //Display win
    if(checkWin(mySequence,randomColors)){
        showWin();
        setTimeout(hideAlert, 3000);
        setTimeout(function() {location.reload();}, 2000);
        return;
    }

    //Remove event listener from old row
    let slots = document.getElementsByClassName("color-item");
    for(let i =0; i<(attempts*4);i++){
        slots[i].removeAttribute("id");
        slots[i].removeEventListener("dragover",dragOverEvent);
        slots[i].removeEventListener("drop",dropEvent);
    }
    

    //Add the new row
    let newRow = document.createElement("tr");
    newRow.classList.add('row-content');
    
    newRow.innerHTML =
    '<td><div class="color-item" id="first"></div></td>' +
    '<td><div class="color-item" id="second"></div></td>' +
    '<td><div class="color-item" id="third"></div></td>' +
    '<td><div class="color-item" id="fourth"></div></td>' +
    '<td class="result-containter">' +
        '<div class="result-box">' +
            '<div class="result-item"></div>' +
            '<div class="result-item"></div>' +
            '<div class="result-item"></div>' +
            '<div class="result-item"></div>' +
        '</div>' +
    '</td>';

    newRow.addEventListener("dragover",dragOverEvent);
    newRow.addEventListener("drop",dropEvent);

    document.getElementById("table").getElementsByTagName("tbody")[0].appendChild(newRow);

}