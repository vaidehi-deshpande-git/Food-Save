console.log("Welcome to FoodSave!");

const donateForm = document.getElementById("donateForm");

donateForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const donorName = document.getElementById("donorName").value.trim();
  const foodName = document.getElementById("foodName").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const location = document.getElementById("location").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const expiry = document.getElementById("expiry").value;
  const description = document.getElementById("description").value.trim();

  const message = document.getElementById("message");

  if (
    donorName === "" ||
    foodName === "" ||
    quantity <= 0 ||
    location === "" ||
    email === "" ||
    phone === "" ||
    expiry === ""
  ) {
    message.textContent = "Please fill all required fields.";
    message.style.color = "red";
    return;
  }

  const donationData = {
    donorName: donorName,
    foodName: foodName,
    quantity: quantity,
    location: location,
    email: email,
    phone: phone,
    expiry: expiry,
    description: description,
  };

  try {
    const response = await fetch("/donate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donationData),
    });

    const result = await response.text();

    if (!response.ok) {
      throw new Error(result);
    }

    message.textContent = result;
    message.style.color = "green";

    donateForm.reset();
  } catch (error) {
    message.textContent = "Donation failed: " + error.message;
    message.style.color = "red";
  }
});
