/*
    Ben Eater's boids implementation provided the initial inspiration for this, link below:  
    https://github.com/beneater/boids
*/



const centeringFactor = 0.4;
const turnBias = 0.25;
const avoidFactor = 0.2;
const vMatchingFactor = 0.05;
const maxAngleChange = 0.3;
const minSpeedFactor = 0.7;
const initVelocity = 1;
const speedLimitFactor = 0.4;
const speedRandomness = 0.2;
const marginFactor = 4;
const visualRangeFactor = 10;
const minDistanceFactor = 1.5;
let frameTime;



class Boid 
{
    constructor(currentX, currentY, currentAngle, deltaX, deltaY, index, colour, speedLimit, canvas) 
    {
        this.currentX = currentX;
        this.currentY = currentY;
        this.currentAngle = currentAngle;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.index = index;
        this.colour = colour;
        this.speedLimit = speedLimit;
        this.canvas = canvas;
    }


    draw(colour) 
    {
        if (this.colour === colour)
        {
            return;
        }
        this.colour = colour;

        const ctx = this.canvas.getContext('2d');
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.fillStyle = colour; 

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height);
        ctx.lineTo(width * 0.25, height / 2);
        ctx.closePath();
        ctx.fill();
    }


    applyFlockingForces(boidArray, numBoids, mousePresent, mouseX, mouseY, 
                        containerWidth, containerHeight, visualRange, borderMargin,
                        minDistance, frameTime) 
    {
        let numNeighbors = 0;
        let localCenterX = 0;
        let localCenterY = 0;
        let avoidNudgeX = 0;
        let avoidNudgeY = 0;
        let avgDeltaX = 0;
        let avgDeltaY = 0;
        let otherCurrentX = 0;
        let otherCurrentY = 0;
        let otherDeltaX = 0;
        let otherDeltaY = 0;
        let mouseVisible = false;

        if (this.isInBounds(containerWidth, containerHeight, borderMargin) === false)
        {
            return;
        }

        if (mousePresent == true)
        {
            const absA = Math.abs(mouseX - this.currentX);
            const absB = Math.abs(this.currentY - mouseY);
            const newVisualRange = (visualRange * 2);
            
            if ((absA + absB) < newVisualRange)
            {
                mouseVisible = true;
                visualRange = newVisualRange;
            }
        }
    
        for (let i = 0; i < numBoids; i++)
        {
            if (mouseVisible == true)
            {
                otherCurrentX = mouseX;
                otherCurrentY = mouseY;
                i = numBoids;
            }
            else
            {
                otherCurrentX = boidArray[i].currentX;
                otherCurrentY = boidArray[i].currentY;
                otherDeltaX = boidArray[i].deltaX;
                otherDeltaY = boidArray[i].deltaY;
            }
            
            if ((i !== this.index) || (mouseVisible == true))
            {            
                const a = (otherCurrentX - this.currentX);
                const absA = Math.abs(a);
                if (absA > visualRange)
                {
                    continue;
                }

                const b = (this.currentY - otherCurrentY);
                const absB = Math.abs(b);
                if (absB > visualRange)
                {
                    continue;
                }

                // This is clearly a rubbish way to calculate distance
                // but it works well enough, and it's fast.
                const distance = absA + absB;
                
                if (distance < visualRange) 
                {
                    if ((mouseVisible == false) && Math.abs(this.currentAngle + Math.atan2(b, a)) > 1.5)
                    {
                        continue;
                    }

                    localCenterX += otherCurrentX;
                    localCenterY += otherCurrentY;
                    avgDeltaX += otherDeltaX;
                    avgDeltaY += otherDeltaY;
                    numNeighbors += 1;

                    if (distance < minDistance)
                    {
                        avoidNudgeX += (this.currentX - otherCurrentX) * (minDistance - distance);
                        avoidNudgeY += (this.currentY - otherCurrentY) * (minDistance - distance);
                    }
                }
            }
        }
    
        if (numNeighbors > 0) 
        {
            localCenterX /= numNeighbors;
            localCenterY /= numNeighbors;
            avgDeltaX /= numNeighbors;
            avgDeltaY /= numNeighbors;
        
            this.deltaX += (localCenterX - this.currentX) * centeringFactor * frameTime;
            this.deltaY += (localCenterY - this.currentY) * centeringFactor * frameTime;
            this.deltaX += (avgDeltaX - this.deltaX) * vMatchingFactor * frameTime;
            this.deltaY += (avgDeltaY - this.deltaY) * vMatchingFactor * frameTime;
            this.deltaX += avoidNudgeX * avoidFactor * frameTime;
            this.deltaY += avoidNudgeY * avoidFactor * frameTime;

            if (avoidNudgeX != 0)
            {
                this.draw('purple');
            }
            else
            {
                this.draw('green');
            }
        }
        else
        {
            // This will cause boids with no neighbour to have a bit of random walk.
            const otherBoid = boidArray[(numBoids - this.index) - 1];
            this.deltaX += otherBoid.deltaX * centeringFactor * frameTime;
            this.deltaY += otherBoid.deltaY * centeringFactor * frameTime;
            this.draw('red');
        }
    }


    limitVelocity() 
    {
        const speed = Math.sqrt((this.deltaX ** 2) + (this.deltaY ** 2));
        const angle = Math.atan2(this.deltaY, this.deltaX);
        const phi = Math.abs(angle - this.currentAngle);
        const angleDiff = (phi > Math.PI) ? ((2 * Math.PI) - phi) : phi;

        if (Math.abs(angleDiff) > maxAngleChange)
        {
            let angleChange = (angleDiff > 0) ? maxAngleChange : -maxAngleChange
            let newAngle = this.currentAngle + angleChange;

            this.deltaX = Math.cos(newAngle) * speed;
            this.deltaY = Math.sin(newAngle) * speed;
        }

        if (speed > this.speedLimit) 
        {
            this.deltaX = (this.deltaX / speed) * this.speedLimit;
            this.deltaY = (this.deltaY / speed) * this.speedLimit;
        }
        else if (speed < (this.speedLimit * minSpeedFactor))
        {
            this.deltaX = (this.deltaX / speed) * (this.speedLimit * minSpeedFactor);
            this.deltaY = (this.deltaY / speed) * (this.speedLimit * minSpeedFactor);
        }
    }


    isInBounds(containerWidth, containerHeight, borderMargin)
    {
        const tooFarLeft = (this.currentX < borderMargin);
        const tooFarRight = (this.currentX > (containerWidth - borderMargin));
        const tooFarUp = (this.currentY < borderMargin);
        const tooFarDown = (this.currentY > (containerHeight - borderMargin));

        if (tooFarLeft || tooFarRight || tooFarUp || tooFarDown)
        {
            return false;
        }
        else
        {
            return true;
        }
    }


    keepWithinBounds(containerWidth, containerHeight, borderMargin)
    {
        const tooFarLeft = (this.currentX < borderMargin);
        const tooFarRight = (this.currentX > (containerWidth - borderMargin));
        const tooFarUp = (this.currentY < borderMargin);
        const tooFarDown = (this.currentY > (containerHeight - borderMargin));
        let outsideBounds = false;

        if (((this.currentX + this.deltaX) < 0) || ((this.currentX + this.deltaX) > containerWidth))
        {
            this.currentX = containerWidth / 2;
            outsideBounds = true;
        }

        if (((this.currentY + this.deltaY) < 0) || ((this.currentY + this.deltaY) > containerHeight))
        {
            this.currentY = containerHeight / 2;
            outsideBounds = true;
        }

        if (outsideBounds)
        {
            return;
        }


        if ((tooFarLeft) || (tooFarRight))
        {
            const edgePos = (tooFarLeft) ? borderMargin : (containerWidth - borderMargin);
            const changeFactor = ((edgePos - this.currentX) / borderMargin) ** 2;
            const vChange = Math.abs(this.deltaX * changeFactor) + turnBias;

            this.deltaX += (tooFarLeft) ? vChange : -vChange;

            if ((!tooFarUp) && (!tooFarDown))
            {
                this.deltaY += (this.deltaY > 0) ? vChange : -vChange;
            }
        }

        if ((tooFarUp) || (tooFarDown))
        {
            const edgePos = (tooFarUp) ? borderMargin : (containerHeight - borderMargin);
            const changeFactor = ((edgePos - this.currentY) / borderMargin) ** 2;
            const vChange = Math.abs(this.deltaY * changeFactor) + turnBias;

            this.deltaY += (tooFarUp) ? vChange : -vChange;

            if ((!tooFarLeft) && (!tooFarRight))
            {
                this.deltaX += (this.deltaX > 0) ? vChange : -vChange;
            }
        }
    }
}





class BoidContainer
{    
    constructor(boidsDiv, options) 
    {
        this.boidsDiv = boidsDiv;
        this.numBoids = parseInt(options[0]);
        this.boidArray = [];
        this.prevTimestamp = 0;
        this.mousePresent = false;
        this.mouseX = 0;
        this.mouseY = 0;

        if (options.includes("follow-mouse"))
        {
            this.boidsDiv.addEventListener("mousemove", this.mouseMove.bind(this), false);
            this.boidsDiv.addEventListener("mouseenter", this.mouseEnter.bind(this), false);
            this.boidsDiv.addEventListener("mouseleave", this.mouseLeave.bind(this), false);
        }

        for (let i = 0; i < this.numBoids; i++) 
        {
            this.boidsDiv.innerHTML += "\n<canvas class=\"boids\"></canvas>"
        }

        this.canvasArray = this.boidsDiv.querySelectorAll("canvas");

        for (let i = 0; i < this.numBoids; i++) 
        {
            const newBoid = new Boid(
                Math.random() * (this.boidsDiv.getBoundingClientRect().width * 0.9),
                Math.random() * (this.boidsDiv.getBoundingClientRect().height * 0.9),
                0,
                (Math.random() * initVelocity) - (2 * initVelocity),
                (Math.random() * initVelocity) - (2 * initVelocity),
                i,
                '',
                0,
                this.canvasArray[i]
            );

            newBoid.seed = Math.random();
            this.boidArray.push(newBoid);
            newBoid.draw('red');
        }
    }


    stepBoids()
    {
        const boidSize = Math.min((this.boidsDiv.boundingRect.width * 0.02), 20);
        const containerWidth = this.boidsDiv.boundingRect.width - boidSize;
        const containerHeight = this.boidsDiv.boundingRect.height - boidSize;        
        const visualRange = boidSize * visualRangeFactor;
        const borderMargin = boidSize * marginFactor;
        const minDistance = boidSize * minDistanceFactor;

        for (let i = 0; i < this.numBoids; i++) 
        {
            this.boidArray[i].speedLimit = (boidSize * speedLimitFactor) + (this.boidArray[i].seed * speedRandomness);

            this.boidArray[i].applyFlockingForces(this.boidArray, this.numBoids, this.mousePresent, this.mouseX, this.mouseY,
                                                    containerWidth, containerHeight, visualRange, borderMargin, 
                                                    minDistance, frameTime);
            this.boidArray[i].limitVelocity();
            this.boidArray[i].keepWithinBounds(containerWidth, containerHeight, borderMargin);

            this.boidArray[i].currentX += this.boidArray[i].deltaX;
            this.boidArray[i].currentY += this.boidArray[i].deltaY;
            this.boidArray[i].currentAngle = Math.atan2(this.boidArray[i].deltaY, this.boidArray[i].deltaX);

            this.canvasArray[i].style.cssText = `transform: translate3d(${this.boidArray[i].currentX}px,
                                                                        ${this.boidArray[i].currentY}px, 
                                                                        0px)
                                                            rotate(${this.boidArray[i].currentAngle}rad)`;
        }
    }

    mouseMove(event)
    {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

    mouseEnter(event)
    {
        this.mousePresent = true;
    }

    mouseLeave(event)
    {
        this.mousePresent = false;
    }
}


let boidContainers = [];
let prevTimestamp = 0;

function isContainerOnScreen(boundingRect)
{
    return (
        boundingRect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        boundingRect.bottom >= 0 &&
        boundingRect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        boundingRect.right >= 0
    );
}

function boidControlLoop(timestamp)
{
    if (prevTimestamp == 0)
    {
        prevTimestamp = timestamp;
    }
    frameTime = (timestamp - prevTimestamp) / 1000;
    prevTimestamp = timestamp;
    
    boidContainers.forEach((i) => 
    {
        i.boidsDiv.boundingRect = i.boidsDiv.getBoundingClientRect();

        if (isContainerOnScreen(i.boidsDiv.boundingRect))
        {
            i.stepBoids();
        }
    });
    
    window.requestAnimationFrame(boidControlLoop);
}



function boidsInit()
{
    let boidDivs = document.querySelectorAll("#boidsDiv");

    boidDivs.forEach((htmlSegment) =>
    {
        let options = htmlSegment.className.split(",");
        let boidInstance = new BoidContainer(htmlSegment, options);
        boidContainers.push(boidInstance);
    });

    window.requestAnimationFrame(boidControlLoop);
}



if (document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
    boidsInit()
} 
else 
{
    document.addEventListener("DOMContentLoaded", boidsInit());
}