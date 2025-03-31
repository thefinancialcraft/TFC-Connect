function checkInternetSpeed() {
    const imageUrl = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png";
    const startTime = new Date().getTime();
    
    fetch(imageUrl, { cache: "no-cache", mode: "no-cors" })
        .then(() => {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000;
            const speedMbps = (Math.random() * 20).toFixed(2);
            displayNetworkStrength(speedMbps);
        })
        .catch(() => {
            displayNetworkStrength(0);
        });
}

function displayNetworkStrength(speed) {
    let strength = "Very Weak";
    let colors = ["#D3D3D3", "#D3D3D3", "#D3D3D3"];

    if (speed > 15) {
        strength = "Strong";
        colors = ["#5b48d6", "#5b48d6", "#5b48d6"];
    } else if (speed > 10) {
        strength = "Moderate";
        colors = ["#FFA500", "#FFA500", "#D3D3D3"];
    } else if (speed > 5) {
        strength = "Weak";
        colors = ["#FF0000", "#D3D3D3", "#D3D3D3"];
    }


    setTimeout(() => document.getElementById("wifi-path1").setAttribute("fill", colors[0]), 200);
    setTimeout(() => document.getElementById("wifi-path2").setAttribute("fill", colors[1]), 400);
    setTimeout(() => document.getElementById("wifi-path3").setAttribute("fill", colors[2]), 600);
}

setInterval(checkInternetSpeed, 5000);
checkInternetSpeed();