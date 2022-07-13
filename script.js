let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')

let cameraOffset = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}
let cameraZoom = 1
let MAX_ZOOM = 8
let MIN_ZOOM = 1
let SCROLL_SENSITIVITY = 0.01

let lowDetailImage = new Image()
lowDetailImage.src = "./epätarkkakartta.png"

let highDetailImage = new Image()
highDetailImage.src = "./tarkkakartta.png"

ctx.imageSmoothingQuality = 'high';

function draw() {


    canvas.height = window.innerHeight
    canvas.width = window.innerWidth


    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2)
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate(-window.innerWidth + cameraOffset.x, -window.innerHeight + cameraOffset.y)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)




    requestAnimationFrame(draw)


    let image;



    if (cameraZoom > 2) {
        image = highDetailImage

    } else {

        image = lowDetailImage

    }

    ctx.drawImage(image, 0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height);

}


// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
    } else if (e.clientX && e.clientY) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
}

function drawRect(x, y, width, height) {
    ctx.fillRect(x, y, width, height)
}

function drawText(text, x, y, size, font) {
    ctx.font = `${size}px ${font}`
    ctx.fillText(text, x, y)
}

let isDragging = false
let dragStart = {
    x: 0,
    y: 0
}

function onPointerDown(e) {
    isDragging = true
    dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x
    dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y
}

function onPointerUp(e) {
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

function onPointerMove(e) {
    if (isDragging) {
        cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x
        cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y
    }
}

function handleTouch(e, singleTouchHandler) {
    if (e.touches.length == 1) {
        singleTouchHandler(e)
    } else if (e.type == "touchmove" && e.touches.length == 2) {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

function handlePinch(e) {
    e.preventDefault()

    let touch1 = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    }
    let touch2 = {
        x: e.touches[1].clientX,
        y: e.touches[1].clientY
    }

    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

    if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance
    } else {
        adjustZoom(null, currentDistance / initialPinchDistance)
    }
}

function adjustZoom(zoomAmount, zoomFactor) {
    if (!isDragging) {
        if (zoomAmount) {
            cameraZoom += zoomAmount
        } else if (zoomFactor) {
            console.log(zoomFactor)
            cameraZoom = zoomFactor * lastZoom
        }

        cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
        cameraZoom = Math.max(cameraZoom, MIN_ZOOM)

        console.log(zoomAmount)



        // Set up CSS size.
        canvas.style.width = canvas.style.width || canvas.width + 'px';
        canvas.style.height = canvas.style.height || canvas.height + 'px';

        // Resize canvas and scale future draws.
        let dpi = 600
        var scaleFactor = dpi / 96;
        canvas.width = Math.ceil(canvas.width * scaleFactor);
        canvas.height = Math.ceil(canvas.height * scaleFactor);
        var ctx = canvas.getContext('2d');
        ctx.scale(scaleFactor, scaleFactor);




    }
}

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY * SCROLL_SENSITIVITY))

// Ready, set, go
draw()