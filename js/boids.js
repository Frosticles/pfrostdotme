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
let minDistance;
const centeringFactor = 0.005;
const turnBias = 0.01;
const initVelocity = 0.5;
const numBoids = 100;
const avoidFactor = 0.03;
const vMatchingFactor = 0.02;



class boid
{
    currentX = 0;
    currentY = 0;
    currentZ = 0;
    deltaX = 0;
    deltaY = 0;
    deltaZ = 0;
    index = 0;
    colour = '';
}



function drawIndividualBoid(index, colour)
{
    if (boidArray[index].colour === colour)
    {
        return;
    }
    boidArray[index].colour = colour;

    const ctx = canvasArray[index].getContext('2d'); 
    const width = canvasArray[index].width;
    const height = canvasArray[index].height;

    ctx.fillStyle = colour; 

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height / 2);
    ctx.lineTo(0, height);
    ctx.lineTo(width * 0.25, height / 2);
    ctx.closePath();
    ctx.fill();
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

        boidArray[i].currentX = Math.random() * (boidsDiv.getBoundingClientRect().width * 0.9);
        boidArray[i].currentY = Math.random() * (boidsDiv.getBoundingClientRect().height * 0.9);
        boidArray[i].deltaX = (Math.random() * initVelocity) - (2 * initVelocity);
        boidArray[i].deltaY = (Math.random() * initVelocity) - (2 * initVelocity);
        boidArray[i].index = i;
        boidArray[i].colour = 'white';

        drawIndividualBoid(i, boidArray[i].colour);
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



function applyFlockingForces(currentBoid) 
{
    let numNeighbors = 0;

    let localCenterX = 0;
    let localCenterY = 0;
    let avoidNudgeX = 0;
    let avoidNudgeY = 0;
    let avgdeltaX = 0;
    let avgdeltaY = 0;
  
    for (let i = 0; i < numBoids; i++)
    {
        if (i !== currentBoid.index) 
        {
            const distance = getDistance(currentBoid, boidArray[i])
            
            if (distance < visualRange) 
            {
                localCenterX += boidArray[i].currentX;
                localCenterY += boidArray[i].currentY;
                avgdeltaX += boidArray[i].deltaX;
                avgdeltaY += boidArray[i].deltaY;
                numNeighbors += 1;
            }

            if (distance < minDistance)
            {
                avoidNudgeX += currentBoid.currentX - boidArray[i].currentX;
                avoidNudgeY += currentBoid.currentY - boidArray[i].currentY;
            }
        }
    }

    currentBoid.deltaX += avoidNudgeX * avoidFactor;
    currentBoid.deltaY += avoidNudgeY * avoidFactor;
  
    if (numNeighbors > 0) 
    {
        localCenterX /= numNeighbors;
        localCenterY /= numNeighbors;
        avgdeltaX /= numNeighbors;
        avgdeltaY /= numNeighbors;
    
        currentBoid.deltaX += (localCenterX - currentBoid.currentX) * centeringFactor;
        currentBoid.deltaY += (localCenterY - currentBoid.currentY) * centeringFactor;
        currentBoid.deltaX += (avgdeltaX - currentBoid.deltaX) * vMatchingFactor;
        currentBoid.deltaY += (avgdeltaY - currentBoid.deltaY) * vMatchingFactor;
        drawIndividualBoid(currentBoid.index, 'green');
    }
    else
    {
        // This will cause boids with no neighbour to head towards the centre but with
        // a bit of random walk introduced by the other boid.
        otherBoid = boidArray[numBoids - currentBoid.index - 1];
        currentBoid.deltaX += (((boidsDiv.boundingRect.width / 2) - currentBoid.currentX) - otherBoid.deltaX) * centeringFactor;
        currentBoid.deltaY += (((boidsDiv.boundingRect.height / 2) - currentBoid.currentY) - otherBoid.deltaY) * centeringFactor;
        drawIndividualBoid(currentBoid.index, 'red');
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
    const tooFarLeft = (currentBoid.currentX < borderMargin);
    const tooFarRight = (currentBoid.currentX > (width - borderMargin));
    const tooFarUp = (currentBoid.currentY < borderMargin);
    const tooFarDown = (currentBoid.currentY > (height - borderMargin));
    
    if ((tooFarLeft) || (tooFarRight))
    {
        const edgePos = (tooFarLeft) ? borderMargin : (width - borderMargin);
        const changeFactor = ((edgePos - currentBoid.currentX) / borderMargin) ** 2;
        const vChange = Math.abs(currentBoid.deltaX * changeFactor) + turnBias;

        currentBoid.deltaX += (tooFarLeft) ? vChange : -vChange;

        if ((!tooFarUp) && (!tooFarDown))
        {
            currentBoid.deltaY += (currentBoid.deltaY > 0) ? vChange : -vChange;
        }
    }

    if ((tooFarUp) || (tooFarDown))
    {
        const edgePos = (tooFarUp) ? borderMargin : (height - borderMargin);
        const changeFactor = ((edgePos - currentBoid.currentY) / borderMargin) ** 2;
        const vChange = Math.abs(currentBoid.deltaY * changeFactor) + turnBias;

        currentBoid.deltaY += (tooFarUp) ? vChange : -vChange;

        if ((!tooFarLeft) && (!tooFarRight))
        {
            currentBoid.deltaX += (currentBoid.deltaX > 0) ? vChange : -vChange;
        }
    }

    if ((currentBoid.currentX < 0) || (currentBoid.currentX > width))
    {
        console.log("Exceeded width");
    }

    if ((currentBoid.currentY < 0) || (currentBoid.currentY > height))
    {
        console.log("Exceeded height");
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

    boidsDiv.boundingRect = boidsDiv.getBoundingClientRect();

    const boidSize = Math.min((boidsDiv.boundingRect.width * 0.02), 20);
    visualRange = boidSize * 10;
    borderMargin = boidSize * 6;
    speedLimit = boidSize * 0.6;
    minDistance = boidSize * 2;

    for (let i = 0; i < numBoids; i++) 
    {
        applyFlockingForces(boidArray[i]);
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