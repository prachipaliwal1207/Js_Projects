const config = {
    cUrl: "https://api.countrystatecity.in/v1/countries",
    cKey: "R3NUdUE3RTdlbWt5ckF3WEJLMkFwQ0VJWDNUaThLUGdrU09VZEhuaA==",
    wUrl: "http://api.openweathermap.org/data/2.5/",
    wKey: " 063645545b8d8831d5d2c850a4bcfc5e",
  };

//get countries
const getCountries = async(fieldName , ...args) =>{
  let apiEndPoint;
  switch(fieldName){
    case 'countries':
      apiEndPoint = config.cUrl;
      break;
    case 'states':
      apiEndPoint = `${config.cUrl}/${args[0]}/states`;
      break;
    case 'cities':  
      apiEndPoint = `${config.cUrl}/${args[0]}/states/${args[1]}/cities`;
      break;
  }
 const response = await fetch(apiEndPoint , {headers:{"X-CSCAPI-KEY" : config.cKey},
});
if(response.status!=200){
  throw new Error(`Something went wrong , status code : ${response.status}`);
}
const countries = await response.json();
return countries;
}

const countriesListDropDown = document.querySelector("#countrylist");
const citiesListDropDown = document.querySelector("#citylist");
const statesListDropDown = document.querySelector("#statelist");

document.addEventListener('DOMContentLoaded' , async ()=> {
  const countries = await getCountries('countries');
  console.log(countries);
  let countriesOptions = "";
  if(countries) {
   countriesOptions+= `<option value = ""> Country </option>`;
   countries.forEach((country) =>{
       countriesOptions = countriesOptions  + `<option value="${country.iso2}">${country.name} </option>`;  
   });
   countriesListDropDown.innerHTML = countriesOptions;
  }


  //list of states
  countriesListDropDown.addEventListener('change' , async function() {
   const selectedCountryCode = this.value;
   const states = await getCountries('states' , selectedCountryCode);
   console.log(states);
   let statesOptions = "";
  if(states) {
   statesOptions+= `<option value = ""> State </option>`;
   states.forEach((state) =>{
       statesOptions = statesOptions  + `<option value="${state.iso2}">${state.name} </option>`;  
   });
   statesListDropDown.innerHTML = statesOptions;
   statesListDropDown.disabled=  false;
  }
  });

  //list of cities
  statesListDropDown.addEventListener('change' , async function() {
    const selectedCountryCode = countriesListDropDown.value;
    const selectedstatesCode = this.value;
    const cities= await getCountries('cites' , selectedCountryCode , selectedstatesCode);
    console.log(cities);
    let citiesOptions = "";
   if(cities) {
    citiesOptions+= `<option value = ""> City </option>`;
    cities.forEach((cites) =>{
        citiesOptions = citiesOptions  + `<option value="${cities.iso2}">${cities.name} </option>`;  
    });
    citiesListDropDown.innerHTML = citiesOptions;
    citiesListDropDown.disabled=  false;
   }
   });
});
