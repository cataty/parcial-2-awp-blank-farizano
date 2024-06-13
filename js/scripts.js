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
    await fetch(`https://perenual.com/api/species/details/${id}?${token}`)
    .then(response => response.json())
    .then(response => response.data.forEach(plant => {
        renderCard(plant);
    }))
    .catch(error => console.log('error', error));
}

const renderCard = (plant, containerID) => {
    console.log(plant);
    const plantsContainer = document.getElementById(containerID);
    const plantCard = `
        <div class="col s12 m6 l4">
            <div class="card">
                <div class="card-image">
                    <img src='${plant.default_image.small_url}'>
                    <span class="card-title">${plant.common_name}</span>
                </div>
                <div class="card-content">
                    <p>${plant.scientific_name[0]}</p>
                    <p>watering: ${plant.watering}</p>
                    <p>sunlight: <span>${plant.sunlight[0]}</span><span>${plant.sunlight[1]}</span></p>
                    <p>cycle: ${plant.cycle}</p>
                </div>
                <div class="card-action">
                    <a href="/plant.html?${plant.id}">Learn more</a>
                </div>
            </div>
        </div>
    `
    plantsContainer.innerHTML += plantCard;
}

const renderDetail = (plant) => {

}

getEdiblePlants();