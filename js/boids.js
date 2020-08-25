/*
    Ben Eater's boids implementation provided the initial inspiration for this, link below:  
    https://github.com/beneater/boids
*/


let boidsDiv;
let canvasArray;
let prevTimestamp = 0;
let boidArray = []; 
let visualRange;
let borderMargin;
let speedLimit;
const centeringFactor = 0.005;
const turnBias = 0.2;
const initVelocity = 0.5;
const numBoids = 100;
const minDistance = 40;
const avoidFactor = 0.05;
const vMatchingFactor = 0.05;



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

    for (let i = 0; i < numBoids; i++) 
    {
        boidsDiv.innerHTML += "\n<canvas class=\"boids\"></canvas>"
    }

    canvasArray = boidsDiv.querySelectorAll("canvas");

    for (let i = 0; i < numBoids; i++) 
    {
        boidArray.push(new boid());

        const ctx = canvasArray[i].getContext('2d'); 
        const width = canvasArray[i].width;
        const height = canvasArray[i].height;

        ctx.fillStyle = 'white'; 

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.25, height / 2);
        ctx.closePath();
        ctx.fill();

        boidArray[i].currentX = Math.random() * (boidsDiv.getBoundingClientRect().width * 0.9);
        boidArray[i].currentY = Math.random() * (boidsDiv.getBoundingClientRect().height * 0.9);
        boidArray[i].deltaX = (Math.random() * initVelocity) - (2 * initVelocity);
        boidArray[i].deltaY = (Math.random() * initVelocity) - (2 * initVelocity);
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
        if (otherBoid !== currentBoid) 
        {
            if (getDistance(currentBoid, otherBoid) < visualRange) 
            {
                centerX += otherBoid.currentX;
                centerY += otherBoid.currentY;
                numNeighbors += 1;
            }
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



function avoidOthers(currentBoid) 
{
    let moveX = 0;
    let moveY = 0;

    for (otherBoid of boidArray) 
    {
        if (otherBoid !== currentBoid) 
        {
            if (getDistance(currentBoid, otherBoid) < minDistance) 
            {
                moveX += currentBoid.currentX - otherBoid.currentX;
                moveY += currentBoid.currentY - otherBoid.currentY;
            }
        }
    }
  
    currentBoid.deltaX += moveX * avoidFactor;
    currentBoid.deltaY += moveY * avoidFactor;
}




function matchVelocity(currentBoid) 
{  
    let avgdeltaX = 0;
    let avgdeltaY = 0;
    let numNeighbors = 0;
  
    for (otherBoid of boidArray) 
    {
        if (otherBoid !== currentBoid) 
        {
            if (getDistance(currentBoid, otherBoid) < visualRange) 
            {
                avgdeltaX += otherBoid.deltaX;
                avgdeltaY += otherBoid.deltaY;
                numNeighbors += 1;
            }
        }
    }
    
    if (numNeighbors > 0) 
    {
        avgdeltaX = avgdeltaX / numNeighbors;
        avgdeltaY = avgdeltaY / numNeighbors;
    
        boid.deltaX += (avgdeltaX - boid.deltaX) * vMatchingFactor;
        boid.deltaY += (avgdeltaY - boid.deltaY) * vMatchingFactor;
    }
}




function limitSpeed(currentBoid) 
{
    const speed = Math.sqrt((currentBoid.deltaX ** 2) + (currentBoid.deltaY ** 2));

    if (speed > speedLimit) 
    {
        currentBoid.deltaX = (currentBoid.deltaX / speed) * speedLimit;
        currentBoid.deltaY = (currentBoid.deltaY / speed) * speedLimit;
    }
  }




function keepWithinBounds(currentBoid, boidSize)
{
    const width = boidsDiv.boundingRect.width - boidSize;
    const height = boidsDiv.boundingRect.height - boidSize;
    
    if (currentBoid.currentX < borderMargin) 
    {
        const changeFactor = turnBias + ((1 - (currentBoid.currentX / borderMargin)) ** 2);
        currentBoid.deltaX += Math.abs(currentBoid.deltaX * changeFactor);
    }
    else if (currentBoid.currentX > (width - borderMargin)) 
    {
        const changeFactor = turnBias + ((1 - ((width - currentBoid.currentX) / borderMargin)) ** 2);
        currentBoid.deltaX -= Math.abs(currentBoid.deltaX * changeFactor);
    }

    if (currentBoid.currentY < borderMargin) 
    {
        const changeFactor = turnBias + ((1 - (currentBoid.currentY / borderMargin)) ** 2);
        currentBoid.deltaY += Math.abs(currentBoid.deltaY * changeFactor);
    }
    else if (currentBoid.currentY > (height - borderMargin)) 
    {
        const changeFactor = turnBias + ((1 - ((height - currentBoid.currentY) / borderMargin)) ** 2);
        currentBoid.deltaY -= Math.abs(currentBoid.deltaY * changeFactor);
    }

    /*if ((currentBoid.currentX < 0) || (currentBoid.currentX > width))
    {
        console.log("Exceeded width");
    }

    if ((currentBoid.currentY < 0) || (currentBoid.currentY > height))
    {
        console.log("Exceeded height");
    }*/
}





function stepBoids(timestamp)
{
    if (prevTimestamp == 0)
    {
        prevTimestamp = timestamp;
    }
    const frameTime = (timestamp - prevTimestamp) / 1000;
    prevTimestamp = timestamp;

    boidsDiv.boundingRect = boidsDiv.getBoundingClientRect();

    const boidSize = Math.min((boidsDiv.boundingRect.width * 0.02), 20);
    visualRange = boidSize * 10;
    borderMargin = boidSize * 5;
    speedLimit = boidSize * 0.7;

    for (let i = 0; i < numBoids; i++) 
    {
        flyTowardsCenter(boidArray[i]);
        avoidOthers(boidArray[i]);
        matchVelocity(boidArray[i]);
        keepWithinBounds(boidArray[i], boidSize);
        limitSpeed(boidArray[i]);

        boidArray[i].currentX += boidArray[i].deltaX;
        boidArray[i].currentY += boidArray[i].deltaY;

        canvasArray[i].style.transform = `translate3d(${boidArray[i].currentX}px,
                                                      ${boidArray[i].currentY}px, 
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