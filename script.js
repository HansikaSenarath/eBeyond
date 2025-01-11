function toggleMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const hamburger = document.querySelectorAll('.hamburger'); 
  navMenu.classList.toggle('active');
  hamburger.forEach((btn) => btn.classList.toggle('active'));
}

document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.trim();
  if (query) {
    searchMovies(query);
  } else {
    document.getElementById('movie-cards').innerHTML = ''; 
  }
});

let addedMovies = []; 

function searchMovies(query) {
  const apiUrl = `https://api.tvmaze.com/search/shows?q=${query}`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const movieCardsContainer = document.getElementById('movie-cards');
      movieCardsContainer.innerHTML = ''; 

      const searchResults = data.slice(0, 3);

      searchResults.forEach(item => {
        const show = item.show;
        const card = createMovieCard(show);
        movieCardsContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

function createMovieCard(show) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <button class="close-btn" onclick="removeFromGrid(event)">&times;</button>
    <img src="${show.image ? show.image.medium : 'default-image.jpg'}" alt="${show.name}">
    <h3>${show.name}</h3>
    <p>${show.summary ? show.summary.replace(/(<([^>]+)>)/gi, "").substring(0, 100) + '...' : 'No description available'}</p>
  `;
  
  card.addEventListener('click', function() {
    addToGrid(show.id); 
  });

  return card;
}

function addToGrid(showId) {
  if (!addedMovies.includes(showId)) {
    const apiUrl = `https://api.tvmaze.com/shows/${showId}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(show => {
        addedMovies.push(show.id); 
        const gridItemsContainer = document.getElementById('grid-items');
        
        const card = createMovieCard(show);
        
        gridItemsContainer.appendChild(card);
        
        document.getElementById('search-input').value = ''; 
        document.getElementById('movie-cards').innerHTML = ''; 
      })
      .catch(error => console.error('Error fetching movie details:', error));
  }
}

function removeFromGrid(event) {
  const card = event.target.closest('.card');
  const cardId = card.querySelector('h3').innerText;
  addedMovies = addedMovies.filter(id => id !== cardId);
  card.remove();
}

// Validation function for the contact form
function validateForm() {
  let isValid = true;

 
  document.querySelectorAll('.error-message').forEach(function (errorSpan) {
    errorSpan.textContent = '';
  });

 
  const firstname = document.getElementById('firstname');
  if (!firstname.value.trim()) {
    document.getElementById('firstname-error').textContent = 'First name is required';
    isValid = false;
  }


  const lastname = document.getElementById('lastname');
  if (!lastname.value.trim()) {
    document.getElementById('lastname-error').textContent = 'Last name is required';
    isValid = false;
  }


  const email = document.getElementById('email');
  if (!email.value.trim()) {
    document.getElementById('email-error').textContent = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    document.getElementById('email-error').textContent = 'Please enter a valid email';
    isValid = false;
  }


  const message = document.getElementById('message');
  if (!message.value.trim()) {
    document.getElementById('message-error').textContent = 'Message is required';
    isValid = false;
  }

 
  const terms = document.getElementById('terms');
  if (!terms.checked) {
    document.getElementById('terms-error').textContent = 'You must agree to the terms';
    isValid = false;
  }

  return isValid;
}
