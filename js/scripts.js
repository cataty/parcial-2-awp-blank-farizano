let token;

const auth = () => {
    fetch("http://trefle.io/api/auth/claim", {
        method: "POST",
        body: JSON.stringify({
                "origin": "http://127.0.0.1:5500/index.html",
                "ip": "190.229.159.80",
                "token": "VyAG9-mhukFFwjlRaB0P-OM2eNyEiNP5inutaNpx2Bw"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
      }})
      .then(response => response.json)
      .then(data => {
            token = data.token;
            console.log(token);
      })
    }



const getPlants = () => {
     fetch(`https://trefle.io/api/v1/plants?token=${token}`)
     .then(response => response.json)
     .then(data => console.log(data));
}

getPlants();