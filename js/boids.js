/*
    Ben Eater's boids implementation provided the initial inspiration for this, link below:  
    https://github.com/beneater/boids
*/


let boidsDiv;
let canvasArray;
let prevTimestamp = 0;
let boidArray = []; 
let visualRange = document.documentElement.clientWidth * 0.15;
let borderMargin = document.documentElement.clientWidth * 0.1;
const centeringFactor = 0.005;
const turnBias = 1;
const initVelocity = 0.5;

class boid
{
    currentX = 0;
    currentY = 0;
    currentZ = 0;
    deltaX = 0;
    deltaY = 0;
    deltaZ = 0;
}


function drawBoids() 
{
    boidsDiv = document.querySelector("#boidsDiv");
    canvasArray = boidsDiv.querySelectorAll("canvas");

    for (let i = 0; i < canvasArray.length; i++) 
    {
        boidArray.push(new boid());

        const ctx = canvasArray[i].getContext('2d'); 
        const width = canvasArray[i].width;
        const height = canvasArray[i].height;
        canvasArray[i].boundingRect = canvasArray[i].getBoundingClientRect();


        ctx.fillStyle = 'white'; 

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.25, height / 2);
        ctx.closePath();
        ctx.fill();

        boidArray[i].deltaX = (Math.random() * initVelocity) - (2 * initVelocity);
        boidArray[i].deltaY = (Math.random() * initVelocity) - (2 * initVelocity);

        canvasArray[i].style.transform = `translate3d(${Math.random() * boidsDiv.getBoundingClientRect().width}px,
                                                      ${Math.random() * boidsDiv.getBoundingClientRect().height}px, 
                                                      0px)
                                          rotate(${Math.random() * 360}deg)`;
    }

    window.requestAnimationFrame(stepBoids);
}


function getDistance(boid1, boid2)
{
    const aSquared = (boid1.currentX - boid2.currentX) ** 2;
    const bSquared = (boid1.currentY - boid2.currentY) ** 2;
    const cSquared = aSquared + bSquared;

    return Math.sqrt(cSquared);
}



function flyTowardsCenter(currentBoid) 
{
    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;
  
    for (otherBoid of boidArray) 
    {
        if (getDistance(currentBoid, otherBoid) < visualRange) 
        {
            centerX += otherBoid.currentX;
            centerY += otherBoid.currentY;
            numNeighbors += 1;
        }
    }
  
    if (numNeighbors > 0) 
    {
        centerX = centerX / numNeighbors;
        centerY = centerY / numNeighbors;
    
        currentBoid.deltaX += (centerX - currentBoid.currentX) * centeringFactor;
        currentBoid.deltaY += (centerY - currentBoid.currentY) * centeringFactor;
    }
}




function keepWithinBounds(currentBoid, canvas)
{
    const width = boidsDiv.boundingRect.width - canvas.boundingRect.width;
    const height = boidsDiv.boundingRect.height - canvas.boundingRect.height;
    
    if (currentBoid.currentX < borderMargin) 
    {
        currentBoid.deltaX += turnBias + (Math.abs(currentBoid.deltaX) / (Math.max(currentBoid.currentX, 1)));
    }
    else if (currentBoid.currentX > (width - borderMargin)) 
    {
        currentBoid.deltaX -= turnBias + (Math.abs(currentBoid.deltaX) / (Math.max(width - currentBoid.currentX, 1)));
    }

    if (currentBoid.currentY < borderMargin) 
    {
        currentBoid.deltaY += turnBias + (Math.abs(currentBoid.deltaY) / (Math.max(currentBoid.currentY, 1)));
    }
    else if (currentBoid.currentY > (height - borderMargin)) 
    {
        currentBoid.deltaY -= turnBias + (Math.abs(currentBoid.deltaY) / (Math.max(height - currentBoid.currentY, 1)));
    }
}





function stepBoids(timestamp)
{
    if (prevTimestamp == 0)
    {
        prevTimestamp = timestamp;
    }
    const frameTime = (timestamp - prevTimestamp) / 1000;
    prevTimestamp = timestamp;
    visualRange = document.documentElement.clientWidth * 0.15;
    borderMargin = document.documentElement.clientWidth * 0.1;
    boidsDiv.boundingRect = boidsDiv.getBoundingClientRect();


    for (let i = 0; i < canvasArray.length; i++) 
    {
        const currentTransform = canvasArray[i].style.transform.replace(/rot.*|3d\(|[^\d,.]/g, '').split(',');
        boidArray[i].currentX = parseFloat(currentTransform[0]);
        boidArray[i].currentY = parseFloat(currentTransform[1]);
        boidArray[i].currentZ = parseFloat(currentTransform[2]);

        flyTowardsCenter(boidArray[i]);
        keepWithinBounds(boidArray[i], canvasArray[i]);

        const finalX = boidArray[i].currentX + boidArray[i].deltaX;
        const finalY = boidArray[i].currentY + boidArray[i].deltaY;

        canvasArray[i].style.transform = `translate3d(${finalX}px,
                                                      ${finalY}px, 
                                                      0px)
                                          rotate(${Math.atan2(boidArray[i].deltaY, boidArray[i].deltaX)}rad)`;
    }

    window.requestAnimationFrame(stepBoids);
}


if (document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
    drawBoids();
} 
else 
{
    document.addEventListener("DOMContentLoaded", drawBoids());
}