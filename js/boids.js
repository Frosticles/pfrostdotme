let boidsDiv;
let canvasArray;
let prevTimestamp = 0;
let boidArray = []; 
const visualRange = 200;
const centeringFactor = 0.005;
const borderMargin = 200;
const turnFactor = 1;

class boid
{
    currentX = 0;
    currentY = 0;
    currentZ = 0;
    currentAngle = 0;
    deltaX = 0;
    deltaY = 0;
    deltaZ = 0;
    deltaAngle = 0;
}


function drawBoids() 
{
    boidsDiv = document.querySelector("#boidsDiv");
    canvasArray = boidsDiv.querySelectorAll("canvas");
    boidsDiv.boundingRect = boidsDiv.getBoundingClientRect();

    for (let i = 0; i < canvasArray.length; i++) 
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




function keepWithinBounds(currentBoid)
{
    let width = boidsDiv.boundingRect.width;
    let height = boidsDiv.boundingRect.height;
    
    if (currentBoid.currentX < borderMargin) 
    {
        currentBoid.deltaX += turnFactor;
    }
    else if (currentBoid.currentX > (width - borderMargin)) 
    {
        currentBoid.deltaX -= turnFactor;
    }

    if (currentBoid.currentY < borderMargin) 
    {
        currentBoid.deltaY += turnFactor;
    }
    else if (currentBoid.currentY > (height - borderMargin)) 
    {
        currentBoid.deltaY -= turnFactor;
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

    for (let i = 0; i < canvasArray.length; i++) 
    {
        const currentTransform = canvasArray[i].style.transform.replace(/rot.*|3d\(|[^\d,.]/g, '').split(',');
        //const currentRotation = canvasArray[i].style.transform.replace(/.*e\(|[^\d,.]/g, '');
        boidArray[i].currentX = parseFloat(currentTransform[0]);
        boidArray[i].currentY = parseFloat(currentTransform[1]);
        boidArray[i].currentZ = parseFloat(currentTransform[2]);

        flyTowardsCenter(boidArray[i]);
        keepWithinBounds(boidArray[i]);

        canvasArray[i].style.transform = `translate3d(${boidArray[i].currentX + boidArray[i].deltaX}px,
                                                      ${boidArray[i].currentY + boidArray[i].deltaY}px, 
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