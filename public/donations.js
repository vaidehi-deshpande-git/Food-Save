let allDonations = [];

// Load All Donations
async function loadDonations() {
  const donationList = document.getElementById("donationList");

  try {
    const response = await fetch("/donations");

    if (!response.ok) {
      throw new Error("Unable to fetch donations");
    }

    allDonations = await response.json();

    applyFilters();
  } catch (error) {
    donationList.textContent = error.message;
  }
}

// Check Food Status
function isExpired(donation) {
  if (!donation.expiry) {
    return false;
  }

  const expiryDate = new Date(donation.expiry);

  if (isNaN(expiryDate.getTime())) {
    return false;
  }

  return expiryDate < new Date();
}

// Apply Search and Status Filter
function applyFilters() {
  const searchValue = document
    .getElementById("searchFood")
    .value.trim()
    .toLowerCase();

  const filterValue = document.getElementById("foodFilter").value;

  let filteredDonations = allDonations.filter(function (donation) {
    const matchesSearch =
      (donation.foodName || "").toLowerCase().includes(searchValue) ||
      (donation.location || "").toLowerCase().includes(searchValue);

    const expired = isExpired(donation);

    let matchesStatus = true;

    if (filterValue === "valid") {
      matchesStatus = !expired;
    }

    if (filterValue === "expired") {
      matchesStatus = expired;
    }

    return matchesSearch && matchesStatus;
  });

  displayDonations(filteredDonations);
}

// Display Donations
function displayDonations(donations) {
  const donationList = document.getElementById("donationList");

  donationList.innerHTML = "";

  if (donations.length === 0) {
    donationList.textContent = "No Donations Found";
    return;
  }

  donations.forEach(function (donation) {
    const card = document.createElement("div");

    // Food Name
    const foodName = document.createElement("h2");
    foodName.textContent = donation.foodName;

    // Donor
    const donor = document.createElement("p");
    donor.textContent = "Donor: " + donation.donorName;

    // Quantity
    const quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + donation.quantity;

    // Location
    const location = document.createElement("p");
    location.textContent = "Location: " + donation.location;

    // Expiry Date
    const expiry = document.createElement("p");
    const expiryDate = new Date(donation.expiry);

    if (donation.expiry && !isNaN(expiryDate.getTime())) {
      expiry.textContent = "Expiry Date: " + expiryDate.toLocaleString("en-IN");
    } else {
      expiry.textContent = "Expiry Date: Not Available";
    }

    // Expiry Status
    const expiryStatus = document.createElement("p");

    if (!donation.expiry || isNaN(expiryDate.getTime())) {
      expiryStatus.textContent = "Status: Unknown";
      expiryStatus.style.color = "orange";
    } else if (isExpired(donation)) {
      expiryStatus.textContent = "Status: Expired";
      expiryStatus.style.color = "red";
    } else {
      expiryStatus.textContent = "Status: Valid";
      expiryStatus.style.color = "green";
    }

    // Description
    const description = document.createElement("p");
    description.textContent =
      "Description: " + (donation.description || "No description");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Donation";

    editButton.addEventListener("click", function () {
      editDonation(donation);
    });

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Donation";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function () {
      deleteDonation(donation._id);
    });

    // Append Elements
    card.appendChild(foodName);
    card.appendChild(donor);
    card.appendChild(quantity);
    card.appendChild(location);
    card.appendChild(expiry);
    card.appendChild(expiryStatus);
    card.appendChild(description);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    donationList.appendChild(card);
  });
}

// Search Food Function
function searchFood() {
  applyFilters();
}

// Clear Search Function
function clearSearch() {
  document.getElementById("searchFood").value = "";
  applyFilters();
}

// Edit Donation Function
async function editDonation(donation) {
  const foodName = prompt("Enter Food Name:", donation.foodName);

  if (foodName === null) return;

  const quantity = prompt("Enter Quantity:", donation.quantity);

  if (quantity === null) return;

  const location = prompt("Enter Location:", donation.location);

  if (location === null) return;

  const updatedQuantity = Number(quantity);

  if (
    foodName.trim() === "" ||
    !Number.isInteger(updatedQuantity) ||
    updatedQuantity < 1 ||
    location.trim() === ""
  ) {
    alert("Please enter valid details.");
    return;
  }

  try {
    const response = await fetch("/donations/" + donation._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodName: foodName.trim(),
        quantity: updatedQuantity,
        location: location.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error("Update Failed");
    }

    alert("Donation Updated Successfully!");

    await loadDonations();
  } catch (error) {
    alert(error.message);
  }
}

// Delete Donation Function
async function deleteDonation(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this donation?",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch("/donations/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete Failed");
    }

    alert("Donation Deleted Successfully!");

    await loadDonations();
  } catch (error) {
    alert(error.message);
  }
}

// Search Button Event
document.getElementById("searchButton").addEventListener("click", searchFood);

// Clear Button Event
document.getElementById("clearButton").addEventListener("click", clearSearch);

// Food Filter Event
document.getElementById("foodFilter").addEventListener("change", applyFilters);

// Load Donations
loadDonations();
