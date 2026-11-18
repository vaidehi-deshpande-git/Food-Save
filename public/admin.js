let allDonations = [];

// Load Donations from Server
async function loadDashboard() {
  try {
    const response = await fetch("/donations");

    if (!response.ok) {
      throw new Error("Unable to load dashboard data");
    }

    allDonations = await response.json();

    updateDashboard();
  } catch (error) {
    console.log("Dashboard Error:", error);
  }
}

// Check Expired Food
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

// Update Dashboard Statistics
function updateDashboard() {
  const total = allDonations.length;

  let valid = 0;
  let expired = 0;

  allDonations.forEach(function (donation) {
    if (isExpired(donation)) {
      expired++;
    } else {
      valid++;
    }
  });

  document.getElementById("totalDonations").textContent = total;

  document.getElementById("validDonations").textContent = valid;

  document.getElementById("expiredDonations").textContent = expired;
}

// Load Dashboard
loadDashboard();
