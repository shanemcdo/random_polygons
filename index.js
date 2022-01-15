const els = {
    'num_points': document.querySelector('#num-points'),
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    stroke(255);
    noFill();
    els.num_points.addEventListener('input', ()=>{
        let val = parseInt(els.num_points.value || '0');
        if(val > els.num_points.max)
            els.num_points.value = els.num_points.max;
        else if(val < els.num_points.min)
            els.num_points.value = els.num_points.min;
        
        redraw();
    });
    noLoop();
}

function draw(){
    translate(windowWidth / 2, windowHeight / 2);
    background(0);
    draw_polygon(make_random_polygon());
}

function random_vector(){
    return createVector(
        random(-windowWidth / 2, windowWidth / 2),
        random(-windowHeight / 2, windowHeight / 2)
    );
}

function make_random_polygon(){
    let size = parseInt(els.num_points.value);
    let result = [];
    for(let i = 0; i < size; i++)
        result.push(random_vector());
    return result;
}

function draw_polygon(points){
    beginShape();
    for(let pos of points){
        vertex(pos.x, pos.y);
        circle(pos.x, pos.y, 10);
    }
    endShape(CLOSE);
}
