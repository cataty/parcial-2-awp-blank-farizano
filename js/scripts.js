if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then((register) => {
            M.toast({ html: `Offline mode active` })
        })
        .catch((error) => {
            console.log("error: ", error)
        })
}

const token = "sk-cIK4666b199c48f9f5915";

const replacePlaceholderImgs = () => { // para implementar eventualmente
    // funcióna con el formato <img src="data/img/placeholder.png" data-src="data/img/image.jpg" alt="name" />
    let imagesToLoad = document.querySelectorAll("img[data-src]");
    const loadImages = (image) => {
        image.setAttribute("src", image.getAttribute("data-src"));
        image.onload = () => {
            image.removeAttribute("data-src");
        };
    };
    imagesToLoad.forEach((img) => {
        loadImages(img);
    });
}

// botón & prompt de instalación

const installButtons = document.querySelectorAll(".installButton");
let installEvent;

window.addEventListener("beforeinstallprompt", (event) => {
    installEvent = event;
});

installButtons.forEach(installButton => {
    installButton.addEventListener("click", async () => {
        if (installEvent && installEvent.prompt) {
            console.log(installEvent);
            await installEvent.prompt()
                .then((result) => {
                    const selectedOption = result.outcome;
                    console.log("selected option: ", selectedOption)
                    if (selectedOption == "dismissed") {
                        console.log("install cancelled");
                    } else if (selectedOption == "accepted") {
                        console.log("install complete")
                        hideInstallButton();
                    }
                })
                .catch((error) => console.log("error during install"))
        }
    })
});

const hideInstallButton = () => {
    installButtons.forEach(installButton => { installButton.style.display = "none" });
};

setTimeout(() => {
    if (installEvent == null) {
        hideInstallButton();
    }
}, 200);

// traer y mostrar contenido

const getEdiblePlants = async (containerId) => {
    await fetch(`https://perenual.com/api/species-list?key=${token}&edible=1`)
        .then(response => response.json())
        .then(response => response.data.forEach(plant => {
            renderCard(plant, containerId);
        }))
        .catch(error => {
            console.log('error', error);
            M.toast({ html: `Error fetching plant data. Please try again later.` })
        });
    const preloader = document.querySelector(".preloader-wrapper");
    document.getElementById(containerId).removeChild(preloader);
}

const getPlant = async (id) => {
    await fetch(`https://perenual.com/api/species/details/${id}?key=${token}`)
        .then(response => {
            if (response.status === 200) {
                response.json()
                    .then(response => renderDetails(response))
            } else if (response.status === 404) {
                create404(plant);
            };
        })
        .catch(error => {
            console.log('error', error);
            M.toast({ html: `Error fetching plant details.  Please try again later.` })
        });
}

const getUserPlants = () => {
    const allPlantIds = Object.keys(localStorage);
    allPlantIds.forEach(userPlantId => {
        fetch(`https://perenual.com/api/species/details/${userPlantId}?key=${token}`)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(response => renderUserPlantCard(response))
                }
            })
    });
    const preloader = document.querySelector(".preloader-wrapper");
    document.getElementById("myPlantsContainer").removeChild(preloader);
}


const create404 = () => { } // TODO: crear 404

const renderCard = (plant) => {
    const plantsContainer = document.getElementById("ediblePlantsContainer");
    let plantCard = `
        <div class="col s12 m6 l4">
            <div class="card">
                <div class="card-image">
                    <img src='${(plant.default_image ? (plant.default_image.small_url ? plant.default_image.small_url : plant.default_image.original_url) : '/img/placeholder.svg')} '>
                    <span class="card-title">${plant.common_name}</span>
                </div>
                <div class="card-content">
                    <p>${plant.scientific_name[0]}</p>
                    <p class="card-list"><img class="list-icon" src="/img/icon-watering.svg" alt="icon watering"> ${plant.watering}</p>
                    <p class="card-list"><img class="list-icon" src="/img/icon-sun.svg" alt="icon sun"> ${(plant.sunlight[0])}${(plant.sunlight[1] ? ", " + plant.sunlight[1] : "")}${(plant.sunlight[2] ? ", " + plant.sunlight[2] : "")}</li>
                    <p class="card-list"><img class="list-icon" src="/img/icon-cycle.svg" alt="icon cycle">  ${plant.cycle}</p>
                </div>
                <div class="card-action">
                    <a class="green-text text-accent-4" href="plant.html?id=${plant.id}">See Details</a>
                </div>
            </div>
        </div>
        `

    plantsContainer.innerHTML += plantCard;
}

const renderUserPlantCard = (plant) => {
    const plantsContainer = document.getElementById("myPlantsContainer");
    userPlantData = JSON.parse(localStorage.getItem(`${plant.id}`));
    console.log(userPlantData);
    let plantCard = `
        <div class="col s12 m6">
            <div class="card">
                <div class="card-image">
                    <img src='${(plant.default_image ? (plant.default_image.small_url ? plant.default_image.small_url : plant.default_image.original_url) : '/img/placeholder.svg')} '>
                    <span class="card-title">${plant.common_name}</span>
                </div>
                <div class="card-content">
                    <p>${plant.scientific_name[0]}</p>
                        <div class="card-list">
                        <p>
                            <img class="list-icon" src="/img/icon-quantity.svg" alt="icon seeding">
                            <span>${userPlantData.quantity}</span>
                        </p>
                        <form action="#">
                            <p class="range-field">
                            <input type="range" id="quantity" min="0" max="50" class="tooltipped" data-position="top" data-tooltip="How many plants do you have?">
                            </p>
                            <button id="quantitySubmit" class="green accent-3 white-text" type="submit">  <i class="material-icons"><span class="material-symbols-outlined">playlist_add_check</span></i></button>
                        </form>
                    </div>
                    <div class="card-list">
                        <p>
                            <img class="list-icon" src="/img/icon-seed.svg" alt="icon seeding">
                            <span>${userPlantData.seedingDate}</span>
                        </p>
                        <form>
                          <input type="date" name="seedDate" id="seedingDate" class="tooltipped" data-position="top" data-tooltip="Seeding Date"><label for="seedDate" aria-hidden="true" hidden>New Date</label></input>
                            <button id="seedingDateSubmit" class="green accent-3 white-text" type="submit">  <i class="material-icons"><span class="material-symbols-outlined">playlist_add_check</span></i></button>
                        </form>
                    </div>
                    <div class="card-list">
                        <div>
                            <img class="list-icon" src="/img/icon-watering.svg" alt="icon watering">
                            <span>${userPlantData.wateringDate}</span>
                        </div>
                        <form>
                            <input type="date" name="wateringDate" id="wateringDate" class="tooltipped" data-position="top" data-tooltip="Last Watering Date"><label for="wateringDate" aria-hidden="true" hidden>New Date</label></input>
                            <button id="wateringDateSubmit" class="green accent-3 white-text" type="submit">  <i class="material-icons"><span class="material-symbols-outlined">playlist_add_check</span></i></button>
                        </form>
                    </div>
                </div>
                <div class="card-action">
                    <a class="green-text text-accent-4" href="plant.html?id=${plant.id}">See Details</a>
                </div>
            </div>
        </div>
        `;
    plantsContainer.innerHTML += plantCard;

    document.getElementById("quantitySubmit").addEventListener("click", event => {
        event.preventDefault;
        userPlantData.quantity = document.getElementById("quantity").value;
        localStorage.setItem(plant.id, JSON.stringify(userPlantData));
    });

    document.getElementById("seedingDateSubmit").addEventListener("click", event => {
        event.preventDefault;
        console.log(document.getElementById("seedingDate").value);
        userPlantData.seedingDate = document.getElementById("seedingDate").value;
        localStorage.setItem(plant.id, JSON.stringify(userPlantData));
    });
    document.getElementById("wateringDateSubmit").addEventListener("click", event => {
        event.preventDefault;
        console.log(document.getElementById("wateringDate").value);
        userPlantData.wateringDate = document.getElementById("wateringDate").value;
        localStorage.setItem(plant.id, JSON.stringify(userPlantData));
    });

    if (document.querySelector('.datepicker')) {
        var options = {
            autoClose: true,
            format: 'dd.mm.yyyy',
        };
        var elems = document.querySelectorAll('.datepicker');
        var instances = M.Datepicker.init(elems, options);
    };

        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
};


const renderDetails = (plant) => {
    console.log(plant);
    
    const plantContainer = document.getElementById("plantDetailContainer");
    const plantCard = `
        <div class="col s12 m12 l12">
            <div class="card">
                <div class="card-image">
                    <img src="${plant.default_image.regular_url}" alt="${plant.name}">
                    <h2 class="card-title">${plant.common_name}</h2>
                    <a class="btn-floating btn-large halfway-fab waves-effect waves-light green accent-3"><i class="material-icons"><span class="material-symbols-outlined">add</span></i></a>
                </div>
                <div class="card-content">
                    <p>${plant.description}</p>
                </div>
                <div class="card-tabs">
                    <ul class="tabs tabs-fixed-width" id="plantDetailTabs">
                        <li class="tab"><a href="#plant-data">Data</a></li>
                        <li class="tab"><a href="#plant-care">Conditions & Care</a></li>
                        <li class="tab"><a href="#plant-guide">Care Guide</a></li>
                    </ul>
                </div>
                <div class="card-content grey lighten-4">
                    <div id="plant-data" class="active">
                        <h3>Plant Data</h3>
                        <ul>
                            <li>type: ${plant.type}</li>
                            <li>family: ${(plant.family ? plant.family : "?")}</li>
                            <li>cycle:  ${(plant.cycle)}</li>
                            <li>growth rate:  ${(plant.growth_rate)}</li>
                            <li>care level: ${(plant.care_level ? plant.care_level : "?")}</li>
                            <li>harvest season: ${(plant.harvest_season ? plant.harvest_season : "?")}</li>
                            <li>propagatation:  ${(plant.propagation[0])}${(plant.propagation[1] ? ", " + plant.propagation[1] : "")}${(plant.propagation[2] ? ", " + plant.propagation[2] : "")}</li>
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
                            <li>soil: ${(plant.soil ? plant.soil : "any")}</li>
                            <li>sunlight:  ${(plant.sunlight[0])}${(plant.sunlight[1] ? ", " + plant.sunlight[1] : "")}${(plant.sunlight[2] ? ", " + plant.sunlight[2] : "")}</li> 
                            <li>pruning amount: ${(plant.pruning_count.amount ? (plant.pruning_count.amount, " ", plant.pruning_count.interval) : "?")} </li>
                            <li>pruning months: ${(plant.pruning_month[0])}${(plant.pruning_month[1] ? ", " + plant.pruning_month[1] : "")}${(plant.pruning_month[2] ? ", " + plant.pruning_month[2] : "")}${(plant.pruning_month[3] ? ", " + plant.pruning_month[3] : "")}</li>
                        </ul>
                    </div>
                    <div id="plant-guide">Guide</div>
                </div>
            </div>
        </div>
    `
    plantContainer.innerHTML += plantCard;


    fetch(`https://perenual.com/api/species-care-guide-list?key=${token}&species_id=${plant.id}`)
    .then(response => {
        if (response.status === 200) {
            response.json()
                .then(response => {
                    console.log(response);
                    let guideDetails = response[data][0].section[1];
                    document.selectElementbyId("plant-guide").innerHTML = guideDetails;
                })
    }})
    .catch(error => {
        console.log('error', error);
        M.toast({ html: `Error fetching plant care guide.  Please try again later.` })
    });

    document.querySelector(".halfway-fab").addEventListener("click", event => {
        const plantToAdd = {
            name: plant.common_name,
            img: plant.default_image.regular_url,
            quantity: 0,
            seedDate: 0,
            wateringDate: 0
        };
        localStorage.setItem(plant.id, JSON.stringify(plantToAdd));
        M.toast({ html: `added to "My Plants"` })
    });


    var options = {
        duration: 300,
        swipeable: true
    };
    M.Tabs.init(document.getElementById('plantDetailTabs'), options);

    const preloader = document.querySelector(".preloader-wrapper");
    document.getElementById("plantDetailContainer").removeChild(preloader);
};

// acciones de usuario


window.addEventListener("DOMContentLoaded", (e) => {

    if (window.location.href.includes('index.html')) {
        getEdiblePlants("ediblePlantsContainer");
    } else if (window.location.href.includes('plant.html')) {
        const searchParams = new URLSearchParams(window.location.search);
        getPlant(searchParams.get('id'));
    } else if (window.location.href.includes('my-plants.html')) {
        getUserPlants();
    };
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

