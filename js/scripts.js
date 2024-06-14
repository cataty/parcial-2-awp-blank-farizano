
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('../sw.js');
}

const token = "sk-cIK4666b199c48f9f5915";

const getEdiblePlants = async () => {
    await fetch(`https://perenual.com/api/species-list?key=${token}&edible=1`)
    .then(response => response.json())
    .then(response => response.data.forEach(plant => {
        renderCard(plant, "ediblePlantsContainer");
    }))
    .catch(error => console.log('error', error));
}

const getPlant = async (id) => {
    await fetch(`https://perenual.com/api/species/details/${id}?key=${token}`)
    .then(response => {
        if (response.status === 200) {
            response.json()
            .then(response => renderDetails(response));
        } else if (response.status === 404) {
            create404(plant);
        };
    })
    .catch(error => console.log('error', error));
}

const getUserPlants = (userId) => {
    getEdiblePlants(); // por ahora. TODO: traer las plantas del usuario
}

const create404 = () => {} // TODO: crear 404

const renderCard = (plant, containerID) => {
    console.log(plant);
    const plantsContainer = document.getElementById(containerID);
    const plantCard = `
        <div class="col s12 m6 l4">
            <div class="card">
                <div class="card-image">
                    <img src='${(plant.default_image.small_url ? plant.default_image.small_url : '/img/placeholder.png')} '>
                    <span class="card-title">${plant.common_name}</span>
                </div>
                <div class="card-content">
                    <p>${plant.scientific_name[0]}</p>
                    <p class="card-list"><img class="list-icon" src="/img/icon-watering.svg" alt="icon watering"> ${plant.watering}</p>
                    <p class="card-list"><img class="list-icon" src="/img/icon-sun.svg" alt="icon sun"> ${(plant.sunlight[0])}${(plant.sunlight[1] ? ", " + plant.sunlight[1] : "" )}${(plant.sunlight[2] ? ", " + plant.sunlight[2] : "" )}</li>
                    <p class="card-list"><img class="list-icon" src="/img/icon-cycle.svg" alt="icon cycle">  ${plant.cycle}</p>
                </div>
                <div class="card-action">
                    <a class="green-text text-accent-4" href="plant.html?id=${plant.id}">Learn more</a>
                </div>
            </div>
        </div>
    `
    plantsContainer.innerHTML += plantCard;
}

const renderDetails = (plant) => {
    console.log(plant);
    const plantContainer = document.getElementById("plantDetailContainer");
    const plantCard = `
        <div class="col s12 m12 l12">
            <div class="card">
                <div class="card-image">
                    <img src="${plant.default_image.regular_url}" alt="${plant.name}">
                    <h2 class="card-title">${plant.common_name}</h2>
                </div>
                <div class="card-content">
                    <p>${plant.description}</p>
                </div>
                <div class="card-tabs">
                    <ul class="tabs tabs-fixed-width">
                        <li class="tab"><a href="#plant-data">Data</a></li>
                        <li class="tab"><a href="#plant-care">Care</a></li>
                        <li class="tab"><a href="#test6">Test 3</a></li>
                    </ul>
                </div>
                <div class="card-content grey lighten-4">
                    <div id="plant-data" class="active">
                        <h3>Plant Data</h3>
                        <ul>
                            <li>type: ${plant.type}</li>
                            <li>family: ${plant.family}</li>
                            <li>cycle:  ${(plant.cycle)}</li>
                            <li>growth rate:  ${(plant.growth_rate)}</li>
                            <li>care level: ${(plant.care_level ? plant.care_level : "?")}</li>
                            <li>harvest season: ${(plant.harvest_season ? plant.harvest_season : "?")}</li>
                            <li>propagatation:  ${(plant.propagation[0])}${(plant.propagation[1] ? ", " + plant.propagation[1] : "" )}${(plant.propagation[2] ? ", " + plant.propagation[2] : "" )}</li>
                        </ul>
                    </div>
                    <div id="plant-care">
                        <h3>Watering</h3>
                        <ul>
                            <li>frequency: ${plant.watering}</li>
                            <li>time of the day:  ${(plant.watering_period ? plant.watering_period : "?")}</li>
                            <li>recomendation: once every ${(plant.watering_general_benchmark.value ? plant.watering_general_benchmark.value : "?")} ${plant.watering_general_benchmark.unit} </li>
                            <li>amount of water: ${(plant.volume_water_requirement.value ? plant.volume_water_requirement.value : "?")} ${(plant.volume_water_requirement.unit ? plant.volume_water_requirement.unit : "")}</li>
                        </ul>
                        <h3>Conditions and Care</h3>
                        <ul>
                            <li>soil: ${plant.soil}</li>
                            <li>sunlight:  ${(plant.sunlight[0])}${(plant.sunlight[1] ? ", " + plant.sunlight[1] : "" )}${(plant.sunlight[2] ? ", " + plant.sunlight[2] : "" )}</li> 
                            <li>pruning: ${(plant.pruning_count.amount ? plant.pruning_count.amount : "?")} ${plant.pruning_count.interval} </li>
                            <li>pruning months: ${(plant.pruning_month[0])}${(plant.pruning_month[1] ? ", " + plant.pruning_month[1] : "" )}${(plant.pruning_month[2] ? ", " + plant.pruning_month[2] : "" )}${(plant.pruning_month[3] ? ", " + plant.pruning_month[3] : "" )}</li>
                        </ul>
                    </div>
                    <div id="test6">Test 3</div>
                </div>
            </div>
        </div>
    `
    plantContainer.innerHTML += plantCard;
    var instance = M.Tabs.init(document.querySelector('.card-tabs'), {});
    instance.select('tab_id');
    $('.tabs').tabs();
}

/* <ul>

</ul> */


window.addEventListener("DOMContentLoaded", (e) => {
    if (window.location.href.includes('index.html')){
        getEdiblePlants();
    } else if (window.location.href.includes('plant.html')) {
        const searchParams = new URLSearchParams(window.location.search);
        getPlant(searchParams.get('id'));
    } else if (window.location.href.includes('my-plants.html')){
        getUserPlants(userId); // corregir cunado tengamos la autentificación de usuario
    }
});