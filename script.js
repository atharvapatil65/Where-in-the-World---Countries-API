const countriesContainer = document.querySelector('.countries-container')
const filterByRegion = document.querySelector('.filter-by-region')
const searchInput = document.querySelector('.search-container input')
const themeChanger = document.querySelector('.theme-changer')

let allCountriesData

fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((data) => {
    renderCountries(data)
    allCountriesData = data
  })
  .catch(error => {
    console.error('Error fetching countries:', error)
    countriesContainer.innerHTML = '<p>Failed to load countries. Please try again later.</p>'
  })

filterByRegion.addEventListener('change', (e) => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then((res) => res.json())
    .then(renderCountries)
    .catch(error => {
      console.error('Error fetching region:', error)
      countriesContainer.innerHTML = '<p>Failed to load region data. Please try again later.</p>'
    })
})

function renderCountries(data) {
  countriesContainer.innerHTML = ''
  
  if (data.length === 0) {
    countriesContainer.innerHTML = '<p>No countries found matching your criteria.</p>'
    return
  }
  
  data.forEach((country) => {
    const countryCard = document.createElement('a')
    countryCard.classList.add('country-card')
    // Use relative path instead of absolute path
    countryCard.href = `country.html?name=${encodeURIComponent(country.name.common)}`
    countryCard.innerHTML = `
          <img src="${country.flags.svg}" alt="${country.name.common} flag" />
          <div class="card-text">
              <h3 class="card-title">${country.name.common}</h3>
              <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
              <p><b>Region: </b>${country.region}</p>
              <p><b>Capital: </b>${country.capital?.[0] || 'N/A'}</p>
          </div>
  `
    countriesContainer.append(countryCard)
  })
}

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase()
  const filteredCountries = allCountriesData.filter((country) => 
    country.name.common.toLowerCase().includes(searchTerm) ||
    (country.capital && country.capital[0] && country.capital[0].toLowerCase().includes(searchTerm))
  )
  renderCountries(filteredCountries)
})

// Save the theme preference in localStorage
themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  const isDark = document.body.classList.contains('dark')
  localStorage.setItem('darkMode', isDark)
  
  // Update icon
  const themeIcon = themeChanger.querySelector('i')
  if (isDark) {
    themeIcon.classList.remove('fa-moon')
    themeIcon.classList.add('fa-sun')
    themeChanger.innerHTML = themeChanger.innerHTML.replace('Dark Mode', 'Light Mode')
  } else {
    themeIcon.classList.remove('fa-sun')
    themeIcon.classList.add('fa-moon')
    themeChanger.innerHTML = themeChanger.innerHTML.replace('Light Mode', 'Dark Mode')
  }
})

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('darkMode') === 'true'
  if (isDark) {
    document.body.classList.add('dark')
    const themeIcon = themeChanger.querySelector('i')
    themeIcon.classList.remove('fa-moon')
    themeIcon.classList.add('fa-sun')
    themeChanger.innerHTML = themeChanger.innerHTML.replace('Dark Mode', 'Light Mode')
  }
})