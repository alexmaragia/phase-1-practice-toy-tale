let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.getElementById("add-toy-form");

  // Toggle the form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch toys and display them
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });

  // Handle form submission to add a new toy
  addToyForm.addEventListener("submit", event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const toyData = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        renderToy(newToy);
        addToyForm.reset();
      });
  });

  // Function to render a toy card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(toyCard);

    // Add event listener to the like button
    toyCard.querySelector(".like-btn").addEventListener("click", () => {
      toy.likes++;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: toy.likes
        })
      })
        .then(response => response.json())
        .then(updatedToy => {
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    });
  }
});
