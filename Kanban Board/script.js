const cards = document.querySelectorAll(".card"); // Select all elements with the class "card" to enable drag functionality.
const lists = document.querySelectorAll(".list"); // Select all elements with the class "list" to enable drop functionality.

function dragStart(e) {
  // Triggered when dragging starts on a card.
  // Store the ID of the dragged element in the dataTransfer object for retrieval during drop.
  e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {
  // Triggered when dragging ends on a card.
  // Log a message to indicate the drag operation has ended.
  console.log("Drag ended");
}

function dragOver(e) {
  // Triggered when a dragged element is over a drop target.
  // Prevent the default behavior to allow dropping on the target.
  e.preventDefault();
}

function dragEnter(e) {
  // Triggered when a dragged element enters a drop target.
  // Prevent the default behavior and add a hover effect to the target.
  e.preventDefault();
  this.classList.add("over"); // Add hover effect to the drop target.
}

function dragLeave(e) {
  // Triggered when a dragged element leaves a drop target.
  // Remove the hover effect from the target.
  this.classList.remove("over");
}

function dragDrop(e) {
  // Triggered when a dragged element is dropped onto a drop target.
  // Retrieve the ID of the dragged element from the dataTransfer object.
  const id = e.dataTransfer.getData("text/plain");
  const card = document.getElementById(id); // Get the dragged element by its ID.

  this.appendChild(card); // Append the dragged element to the drop target.
  this.classList.remove("over"); // Remove the hover effect from the drop target after the drop.
}

for (const card of cards) {
  // Add event listeners to each card to enable drag functionality.
  card.addEventListener("dragstart", dragStart); // Trigger dragStart when dragging starts.
  card.addEventListener("dragend", dragEnd); // Trigger dragEnd when dragging ends.
}

for (const list of lists) {
  // Add event listeners to each list to enable drop functionality.
  list.addEventListener("dragover", dragOver); // Trigger dragOver when a dragged element is over the list.
  list.addEventListener("dragenter", dragEnter); // Trigger dragEnter when a dragged element enters the list.
  list.addEventListener("dragleave", dragLeave); // Trigger dragLeave when a dragged element leaves the list.
  list.addEventListener("drop", dragDrop); // Trigger dragDrop when a dragged element is dropped onto the list.
}
