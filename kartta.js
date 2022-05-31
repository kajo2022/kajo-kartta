

var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext("2d");

// Map sprite
var image = new Image();


image.src = "./asemakaava.png";





//important
let scalar = 0


window.onload = () => {

    console.log("onload bitch")


    canvas.style.height = window.innerHeight + 'px';
    canvas.style.width = window.innerHeight / 16 * 9 + 'px';

    console.log(canvas.style.height, canvas.height)
    console.log(canvas.style.width, canvas.width)

    scalar = canvas.height / window.innerHeight
    console.log(scalar)


}


var startingDevicePixelRatio;


var firstLoad = function () {
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.translate(0.5, 0.5);







}

firstLoad();



var main = function () {
    draw();
    console.log("width:", window.innerWidth, "\nheight:", window.innerHeight)

    
};

var draw = function () {

    //get the current scale compared to "default"

    // Clear Canvas
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Draw map
    // Sprite, X location, Y location, Image width, Image height
    // You can leave the image height and width off, if you do it will draw the image at default size

    let image = new Image()
    image.src = "./asemakaava.png"


    lowDetailImage = new Image()
    lowDetailImage.src = "./asemakaava.png"

    highDetailImage = new Image()
    highDetailImage.src = "./asemakaava_töherrys.png"


    if (window.devicePixelRatio >  2) {
        ctx.drawImage(highDetailImage, 0, 0, image.width, image.height,
            0, 0, canvas.width, canvas.height);
    }
    else {
        ctx.drawImage(lowDetailImage, 0, 0, image.width, image.height,
            0, 0, canvas.width, canvas.height);

    }
    document.getElementById("text").innerHTML = window.devicePixelRatio + " " + screen.deviceXDPI


    document.getElementById("zoom").onclick = () => {
        console.log("h")
        ctx.scale(1.5, 1.5)
    }

    document.getElementById("unzoom").onclick = () => {
        console.log("h")
        ctx.scale(0.5, 0.5)
    }






};

setInterval(main, (1000 / 60)); // Refresh 60 times a second