let boidsDiv;
let canvasArray;
let prevTimestamp = 0;



function drawBoids() 
{
    boidsDiv = document.querySelector("#boidsDiv");
    canvasArray = boidsDiv.querySelectorAll("canvas");

    for (let i = 0; i < canvasArray.length; i++) 
    {
        const ctx = canvasArray[i].getContext('2d'); 
        ctx.fillStyle = 'white'; 

        const width = canvasArray[i].width;
        const height = canvasArray[i].height;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(width / 2, height * 0.75);
        ctx.closePath();
        ctx.fill();

        canvasArray[i].style.transform = `translate3d(${Math.random() * boidsDiv.getBoundingClientRect().width}px,
                                                      ${Math.random() * boidsDiv.getBoundingClientRect().height}px, 
                                                      0px)
                                          rotate(${Math.random() * 360}deg)`;
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
        const currentRotation = parseFloat(canvasArray[i].style.transform.replace(/.*e\(|[^\d,.]/g, ''));
        const currentX = parseFloat(currentTransform[0]);
        const currentY = parseFloat(currentTransform[1]);
        const currentZ = parseFloat(currentTransform[2]);
        //console.log(currentTransform);
        //console.log(currentRotation);

        let deltaX = 0;
        let deltaY = 0;
        let deltaRot = frameTime * 10;

        canvasArray[i].style.transform = `translate3d(${currentX + deltaX}px,
                                                      ${currentY + deltaY}px, 
                                                      0px)
                                          rotate(${currentRotation + deltaRot}deg)`;
    }

    window.requestAnimationFrame(stepBoids);
}


if (document.readyState === "complete" ||
	(document.readyState !== "loading" && !document.documentElement.doScroll)) 
{
    drawBoids();
    window.requestAnimationFrame(stepBoids);
} 
else 
{
    document.addEventListener("DOMContentLoaded", drawBoids());
    window.requestAnimationFrame(stepBoids);
}