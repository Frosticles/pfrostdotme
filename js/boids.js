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
const initVelocity = 1;
const numBoids = 500;
const centeringFactor = 0.4;
const turnBias = 0.25;
const avoidFactor = 0.2;
const vMatchingFactor = 0.05;
const maxAngleChange = 0.3;
const minSpeedFactor = 0.7;
const speedLimitFactor = 0.4;
const speedRandomness = 0.2;
const marginFactor = 4;
const visualRangeFactor = 10;
const minDistanceFactor = 1.5;



class boid
{
    currentX = 0;
    currentY = 0;
    currentZ = 0;
    currentAngle = 0;
    deltaX = 0;
    deltaY = 0;
    deltaZ = 0;
    index = 0;
    colour = '';
    speedLimit = 0;
    seed = 0;
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
        boidArray[i].seed = Math.random();

        drawIndividualBoid(i, boidArray[i].colour);
    }

    window.requestAnimationFrame(stepBoids);
}





function applyFlockingForces(currentBoid, boidSize, frameTime) 
{
    let numNeighbors = 0;
    let localCenterX = 0;
    let localCenterY = 0;
    let avoidNudgeX = 0;
    let avoidNudgeY = 0;
    let avgdeltaX = 0;
    let avgdeltaY = 0;

    if (boidIsInBounds(currentBoid, boidSize) == false)
    {
        return;
    }
  
    for (let i = 0; i < numBoids; i++)
    {
        if (i !== currentBoid.index) 
        {            
            const a = (boidArray[i].currentX - currentBoid.currentX);
            const b = (currentBoid.currentY - boidArray[i].currentY);

            // This is clearly a rubbish way to calculate distance
            // but it works well enough, and it's fast.
            const distance = Math.abs(a) + Math.abs(b);
            
            if (distance < visualRange) 
            {
                if (Math.abs(currentBoid.currentAngle + Math.atan2(b, a)) > 1.5)
                {
                    continue;
                }

                localCenterX += boidArray[i].currentX;
                localCenterY += boidArray[i].currentY;
                avgdeltaX += boidArray[i].deltaX;
                avgdeltaY += boidArray[i].deltaY;
                numNeighbors += 1;

                if (distance < minDistance)
                {
                    avoidNudgeX += (currentBoid.currentX - boidArray[i].currentX) * (minDistance - distance);
                    avoidNudgeY += (currentBoid.currentY - boidArray[i].currentY) * (minDistance - distance);
                }
            }


        }
    }
  
    if (numNeighbors > 0) 
    {
        localCenterX /= numNeighbors;
        localCenterY /= numNeighbors;
        avgdeltaX /= numNeighbors;
        avgdeltaY /= numNeighbors;
    
        currentBoid.deltaX += (localCenterX - currentBoid.currentX) * centeringFactor * frameTime;
        currentBoid.deltaY += (localCenterY - currentBoid.currentY) * centeringFactor * frameTime;
        currentBoid.deltaX += (avgdeltaX - currentBoid.deltaX) * vMatchingFactor * frameTime;
        currentBoid.deltaY += (avgdeltaY - currentBoid.deltaY) * vMatchingFactor * frameTime;
        currentBoid.deltaX += avoidNudgeX * avoidFactor * frameTime;
        currentBoid.deltaY += avoidNudgeY * avoidFactor * frameTime;


        if (avoidNudgeX != 0)
        {
            drawIndividualBoid(currentBoid.index, 'purple');
        }
        else
        {
            drawIndividualBoid(currentBoid.index, 'green');
        }
    }
    else
    {
        // This will cause boids with no neighbour to head towards the centre but with
        // a bit of random walk introduced by the other boid.
        otherBoid = boidArray[numBoids - currentBoid.index - 1];
        currentBoid.deltaX += otherBoid.deltaX * centeringFactor * frameTime;
        currentBoid.deltaY += otherBoid.deltaY * centeringFactor * frameTime;
        drawIndividualBoid(currentBoid.index, 'red');
    }
}




function limitVelocity(currentBoid, frameTime) 
{
    const speed = Math.sqrt((currentBoid.deltaX ** 2) + (currentBoid.deltaY ** 2));
    const angle = Math.atan2(currentBoid.deltaY, currentBoid.deltaX);
    const angleDiff = angle - currentBoid.currentAngle;

    if (Math.abs(angleDiff) > maxAngleChange)
    {
        let angleChange = (angleDiff > 0) ? maxAngleChange : -maxAngleChange
        let newAngle = currentBoid.currentAngle + angleChange;

        currentBoid.deltaX = Math.cos(newAngle) * speed;
        currentBoid.deltaY = Math.sin(newAngle) * speed;
    }

    if (speed > currentBoid.speedLimit) 
    {
        currentBoid.deltaX = (currentBoid.deltaX / speed) * currentBoid.speedLimit;
        currentBoid.deltaY = (currentBoid.deltaY / speed) * currentBoid.speedLimit;
    }
    else if (speed < (currentBoid.speedLimit * minSpeedFactor))
    {
        currentBoid.deltaX = (currentBoid.deltaX / speed) * (currentBoid.speedLimit * minSpeedFactor);
        currentBoid.deltaY = (currentBoid.deltaY / speed) * (currentBoid.speedLimit * minSpeedFactor);
    }
}




function boidIsInBounds(currentBoid, boidSize)
{
    const width = boidsDiv.boundingRect.width - boidSize;
    const height = boidsDiv.boundingRect.height - boidSize;
    const tooFarLeft = (currentBoid.currentX < borderMargin);
    const tooFarRight = (currentBoid.currentX > (width - borderMargin));
    const tooFarUp = (currentBoid.currentY < borderMargin);
    const tooFarDown = (currentBoid.currentY > (height - borderMargin));

    if (tooFarLeft || tooFarRight || tooFarUp || tooFarDown)
    {
        return false;
    }
    else
    {
        return true;
    }
}



function keepWithinBounds(currentBoid, boidSize, frameTime)
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
        currentBoid.currentX = width / 2;
    }

    if ((currentBoid.currentY < 0) || (currentBoid.currentY > height))
    {
        console.log("Exceeded height");
        currentBoid.currentY = height / 2;
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
    visualRange = boidSize * visualRangeFactor;
    borderMargin = boidSize * marginFactor;
    minDistance = boidSize * minDistanceFactor;

    for (let i = 0; i < numBoids; i++) 
    {
        boidArray[i].speedLimit = (boidSize * speedLimitFactor) + (boidArray[i].seed * speedRandomness);

        applyFlockingForces(boidArray[i], boidSize, frameTime);
        limitVelocity(boidArray[i], frameTime);
        keepWithinBounds(boidArray[i], boidSize, frameTime);

        boidArray[i].currentX += boidArray[i].deltaX;
        boidArray[i].currentY += boidArray[i].deltaY;
        boidArray[i].currentAngle = Math.atan2(boidArray[i].deltaY, boidArray[i].deltaX);

        canvasArray[i].setAttribute("style", `transform: translate3d(${boidArray[i].currentX}px,
                                                      ${boidArray[i].currentY}px, 
                                                      0px)
                                          rotate(${boidArray[i].currentAngle}rad)`);
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