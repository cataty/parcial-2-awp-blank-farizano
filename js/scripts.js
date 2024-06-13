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
                    <p>watering: ${plant.watering}</p>
                    <p>sunlight: <span>${plant.sunlight[0]}</span><span>${plant.sunlight[1]}</span></p>
                    <p>cycle: ${plant.cycle}</p>
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
          <span class="card-title">${plant.name}</span>
          <a class="btn-floating halfway-fab waves-effect waves-light green-accent-2"><i class="material-icons">add</i></a>
                <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
                </div>
                <div class="card-tabs">
                <ul class="tabs tabs-fixed-width">
                    <li class="tab"><a href="#test4">Test 1</a></li>
                    <li class="tab"><a class="active" href="#test5">Test 2</a></li>
                    <li class="tab"><a href="#test6">Test 3</a></li>
                </ul>
                </div>
                <div class="card-content grey lighten-4">
                <div id="test4">Test 1</div>
                <div id="test5">
                    <h3>Growing information<h3>
                    <h4>Watering</h4>
                    <ul>
                        <li>frequency: ${plant.watering}</li>
                        <li>time period:  ${plant.watering_period}</li>
                        <li>recomendation: ${plant.watering_general_benchmark.value} ${plant.watering_general_benchmark.unit} </li>
                        <li>watering depth: ${plant.depth_water_requirement.value} ${plant.depth_water_requirement.unit}</li>
                    </ul>
                </div>
                <div id="test6">Test 3</div>
                </div>
            </div>
        </div>
    `
    plantContainer.innerHTML += plantCard;
}


window.addEventListener("DOMContentLoaded", (e) => {
    if (window.location.href.includes('index.html')){
        getEdiblePlants();
    } else {
        const searchParams = new URLSearchParams(window.location.search);
        getPlant(searchParams.get('id'));
    }
});