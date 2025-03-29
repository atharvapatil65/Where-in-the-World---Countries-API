const countryName = new URLSearchParams(location.search).get('name')
const flagImage = document.querySelector('.country-details img')
const countryNameH1 = document.querySelector('.country-details h1')
const nativeName = document.querySelector('.native-name')
const population = document.querySelector('.population')
const region = document.querySelector('.region')
const subRegion = document.querySelector('.sub-region')
const capital = document.querySelector('.capital')
const topLevelDomain = document.querySelector('.top-level-domain')
const currencies = document.querySelector('.currencies')
const languages = document.querySelector('.languages')
const borderCountries = document.querySelector('.border-countries')
const backButton = document.querySelector('.back-button')
const mainContainer = document.querySelector('.country-details-container')

// Redirect to home if no country name is provided
if (!countryName) {
  location.href = 'index.html'
}

// Set document title
document.title = `${countryName} - Where in the world?`

// Update back button to use the homepage
backButton.addEventListener('click', (e) => {
  e.preventDefault()
  window.location.href = 'index.html'
})

// Apply saved theme
document.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('darkMode') === 'true'
  if (isDark) {
    document.body.classList.add('dark')
    const themeChanger = document.querySelector('.header-content p')
    if (themeChanger) {
      const themeIcon = themeChanger.querySelector('i')
      themeIcon.classList.remove('fa-moon')
      themeIcon.classList.add('fa-sun')
      themeChanger.innerHTML = themeChanger.innerHTML.replace('Dark Mode', 'Light Mode')
    }
  }
})

// Theme toggle functionality for country page
const themeChanger = document.querySelector('.header-content p')
if (themeChanger) {
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
}

// Show loading state
mainContainer.innerHTML = '<div class="loading">Loading country information...</div>'

fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
  .then((res) => {
    if (!res.ok) {
      throw new Error('Country not found')
    }
    return res.json()
  })
  .then(([country]) => {
    // Restore the original HTML structure
    mainContainer.innerHTML = `
      <span class="back-button">
        <i class="fa-solid fa-arrow-left"></i>&nbsp; Back
      </span>
      <div class="country-details">
        <img src="${country.flags.svg}" alt="${country.name.common} flag" />
        <div class="details-text-container">
          <h1>${country.name.common}</h1>
          <div class="details-text">
            <p><b>Native Name: </b><span class="native-name">${getNativeName(country)}</span></p>
            <p><b>Population: </b><span class="population">${country.population.toLocaleString('en-IN')}</span></p>
            <p><b>Region: </b><span class="region">${country.region}</span></p>
            <p><b>Sub Region: </b><span class="sub-region">${country.subregion || 'N/A'}</span></p>
            <p><b>Capital: </b><span class="capital">${country.capital?.[0] || 'N/A'}</span></p>
            <p>
              <b>Top Level Domain: </b><span class="top-level-domain">${country.tld?.join(', ') || 'N/A'}</span>
            </p>
            <p><b>Currencies: </b><span class="currencies">${getCurrencies(country)}</span></p>
            <p><b>Languages: </b><span class="languages">${getLanguages(country)}</span></p>
          </div>
          <div class="border-countries"><b>Border Countries: </b>&nbsp;</div>
        </div>
      </div>
    `

    // Update back button event listener
    document.querySelector('.back-button').addEventListener('click', () => {
      window.location.href = 'index.html'
    })

    // Handle border countries
    const borderCountriesElement = document.querySelector('.border-countries')
    if (country.borders && country.borders.length > 0) {
      // Create a wrapper for border country links
      const borderLinksWrapper = document.createElement('div')
      borderLinksWrapper.className = 'border-links'
      borderLinksWrapper.style.display = 'inline-flex'
      borderLinksWrapper.style.flexWrap = 'wrap'
      borderLinksWrapper.style.gap = '8px'
      borderLinksWrapper.style.marginLeft = '8px'
      
      // Add loading indicator for borders
      borderLinksWrapper.innerHTML = '<span>Loading...</span>'
      borderCountriesElement.appendChild(borderLinksWrapper)

      // Fetch all border countries in one request to avoid multiple separate requests
      const borderCodes = country.borders.join(',')
      fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`)
        .then((res) => res.json())
        .then((borderCountries) => {
          borderLinksWrapper.innerHTML = ''
          
          borderCountries.forEach((borderCountry) => {
            const borderCountryTag = document.createElement('a')
            borderCountryTag.innerText = borderCountry.name.common
            borderCountryTag.href = `country.html?name=${encodeURIComponent(borderCountry.name.common)}`
            borderLinksWrapper.appendChild(borderCountryTag)
          })
        })
        .catch(error => {
          console.error('Error fetching border countries:', error)
          borderLinksWrapper.innerHTML = '<span>Failed to load border countries</span>'
        })
    } else {
      borderCountriesElement.innerHTML += '<span>None</span>'
    }
  })
  .catch(error => {
    console.error('Error fetching country:', error)
    mainContainer.innerHTML = `
      <span class="back-button">
        <i class="fa-solid fa-arrow-left"></i>&nbsp; Back
      </span>
      <div class="error-message">
        <h2>Country Not Found</h2>
        <p>We couldn't find information for "${countryName}". Please try a different country.</p>
      </div>
    `
    document.querySelector('.back-button').addEventListener('click', () => {
      window.location.href = 'index.html'
    })
  })

// Helper functions
function getNativeName(country) {
  if (country.name.nativeName) {
    return Object.values(country.name.nativeName)[0].common
  }
  return country.name.common
}

function getCurrencies(country) {
  if (country.currencies) {
    return Object.values(country.currencies)
      .map((currency) => currency.name)
      .join(', ')
  }
  return 'N/A'
}

function getLanguages(country) {
  if (country.languages) {
    return Object.values(country.languages).join(', ')
  }
  return 'N/A'
}