function addDiv() {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = "This is a new div!";
    document.body.appendChild(newDiv);
}

function deleteDiv() {
    var lastDiv = document.querySelector("div:last-child");
    lastDiv.remove();
}
