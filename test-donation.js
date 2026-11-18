fetch("http://localhost:5000/donate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    donorName: "Rahul",
    foodName: "Chapati",
    quantity: 20,
  }),
})
  .then(function (response) {
    return response.text();
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log("Error:", error);
  });
