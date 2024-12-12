// Initial table setup with empty items and a total of 0
const table = [
  { id: "table1", name: "Table-1", total: 0, items: {} },
  { id: "table2", name: "Table-2", total: 0, items: {} },
  { id: "table3", name: "Table-3", total: 0, items: {} },
];

// Menu items with their details like price and type
const menuItems = [
  { id: "item1", name: "chicken", price: 50.0, type: "mainCourse" },
  { id: "item2", name: "pannerCurry", price: 35.0, type: "Starter" },
  { id: "item3", name: "mutton", price: 10.0, type: "starter" },
];

// Once the DOM is fully loaded, render the menu and the tables
document.addEventListener("DOMContentLoaded", () => {
  renderMenu(menuItems);
  renderTable(table);
});

// Function to render the menu items dynamically into the menu container
function renderMenu(menuItems) {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = ""; // Clear previous menu if any
  menuItems.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item"; // Assign a class to the menu item
    menuItem.id = item.id; // Set unique ID for each item (used during drag)
    menuItem.draggable = true; // Enable drag functionality
    menuItem.dataset.name = item.name;
    menuItem.dataset.price = item.price;
    menuItem.dataset.type = item.type;

    menuItem.innerHTML = `
          <h4>${item.name}</h4>
          <p>${item.price.toFixed(2)} - ${item.type}</p>
      `; // HTML content for each menu item

    menuContainer.append(menuItem); // Add menu item to the container

    // Attach the 'dragstart' event listener to each menu item to handle drag
    menuItem.addEventListener("dragstart", dragStart);
  });
}

// Function to render tables dynamically into the table container
function renderTable(table) {
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = ""; // Clear previous table list if any

  table.forEach((tableData) => {
    const tableCard = document.createElement("div");
    tableCard.className = "table-card"; // Assign a class to each table card
    tableCard.id = tableData.id; // Set unique ID for each table card

    tableCard.innerHTML = `
          <h3>${tableData.name}</h3>
          <p>Total: ${tableData.total.toFixed(2)}</p>
          <p>Items: ${Object.values(tableData.items).reduce(
            (a, b) => a + b.quantity,
            0
          )}</p>
      `; // Display table name, total amount, and number of items

    // Attach the 'click' event listener to show order details (this function is currently a placeholder)
    tableCard.addEventListener("click", () => showOrderDetails(tableData.id));

    // Attach 'dragover' and 'drop' event listeners to the table card for drag-and-drop functionality
    tableCard.addEventListener("dragover", dragOver); // Allow the drop event to occur
    tableCard.addEventListener("drop", dropItem); // Handle the drop action when an item is dropped on the table

    tableContainer.append(tableCard); // Append the table card to the table container
  });
}

// Function to display order details for a specific table (currently just logs table ID)
function showOrderDetails(tableId) {
  console.log(`Show details for ${tableId}`);
}

// Function to handle the 'dragstart' event. It's triggered when an item starts being dragged.
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id); // Store the ID of the dragged item in the 'dataTransfer' object
}

// Function to allow dropping an item onto a table (triggered when an item is dragged over a table).
function dragOver(e) {
  e.preventDefault(); // Prevent the default behavior to allow the drop action
}

// Function to handle the 'drop' event. Triggered when a dragged item is dropped on a table.
function dropItem(e) {
  e.preventDefault();

  const itemId = e.dataTransfer.getData("text/plain"); // Get the dragged item's ID from dataTransfer
  const itemElement = document.getElementById(itemId); // Get the DOM element of the dragged item

  const itemName = itemElement.dataset.name; // Retrieve item name from dataset
  const itemPrice = parseFloat(itemElement.dataset.price); // Retrieve item price from dataset
  const tableId = e.target.id; // Get the ID of the table where the item is dropped

  // Ensure the table exists and item data is valid before adding to the table
  if (itemName && itemPrice && table.some((t) => t.id === tableId)) {
    addItemToTable(tableId, itemName, itemPrice); // Call the function to add the item to the table
  }
}

// Function to add an item to the table's order (called when an item is dropped onto a table).
function addItemToTable(tableId, itemName, itemPrice) {
  // Find the table by ID
  const tableData = table.find((table) => table.id === tableId);

  // If the item isn't already in the table's items, initialize it
  if (!tableData.items[itemName]) {
    tableData.items[itemName] = { quantity: 0, price: itemPrice };
  }

  // Increase the quantity of the item (the customer ordered one more of it)
  tableData.items[itemName].quantity++;
  tableData.total += itemPrice; // Add the item's price to the total

  // Update the table card UI with the new total and item count
  const tableCard = document.getElementById(tableId);

  // Update total amount displayed on the table card
  tableCard.querySelector(
    "p:nth-of-type(1)"
  ).textContent = `Total: ${tableData.total.toFixed(2)}`;

  // Update number of items displayed on the table card
  tableCard.querySelector(
    "p:nth-of-type(2)"
  ).textContent = `Items: ${Object.values(tableData.items).reduce(
    (a, b) => a + b.quantity,
    0
  )}`;
}
