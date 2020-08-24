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
const turnBias = 1;
const initVelocity = 0.5;
const numBoids = 10;
const minDistance = 20;
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
        canvasArray[i].boundingRect = canvasArray[i].getBoundingClientRect();


        ctx.fillStyle = 'white'; 

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.25, height / 2);
        ctx.closePath();
        ctx.fill();

        boidArray[i].currentX = Math.random() * boidsDiv.getBoundingClientRect().width;
        boidArray[i].currentY = Math.random() * boidsDiv.getBoundingClientRect().height;
        boidArray[i].deltaX = (Math.random() * initVelocity) - (2 * initVelocity);
        boidArray[i].deltaY = (Math.random() * initVelocity) - (2 * initVelocity);

        /*canvasArray[i].style.transform = `translate3d(${}px,
                                                      ${}px, 
                                                      0px)
                                          rotate(${Math.random() * 360}deg)`;*/
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
    visualRange = Math.max(document.documentElement.clientWidth * 0.15, 150);
    borderMargin = Math.max(document.documentElement.clientWidth * 0.1, 50);
    speedLimit = Math.min(document.documentElement.clientWidth * 0.025, 20);
    boidsDiv.boundingRect = boidsDiv.getBoundingClientRect();


    for (let i = 0; i < numBoids; i++) 
    {
        flyTowardsCenter(boidArray[i]);
        avoidOthers(boidArray[i]);
        matchVelocity(boidArray[i]);
        keepWithinBounds(boidArray[i], canvasArray[i]);
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