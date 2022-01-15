const els = {
    'num_points': document.querySelector('#num-points'),
}
let history = [];

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    els.num_points.addEventListener('input', ()=>{
        let val = parseInt(els.num_points.value || '0');
        if(val > els.num_points.max)
            els.num_points.value = els.num_points.max;
        else if(val < els.num_points.min)
            els.num_points.value = els.num_points.min;
        reset();
    });
    reset();
    stroke(255);
    noFill();
    noLoop();
}

function keyPressed(){
    if(keyCode === 32 || keyCode === RIGHT_ARROW){
        go_forward();
    }else if(keyCode === LEFT_ARROW){
        go_back();
    }
}

function draw(){
    translate(windowWidth / 2, windowHeight / 2);
    background(0);
    draw_polygon(polygon);
    let prev = previous();
    if(prev !== null){
        push();
        stroke('red');
        draw_polygon(prev);
        pop();
    }
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

function make_next_polygon(points){
    let result = [];
    let prev = points[points.length - 1];
    for(let pos of points){
        result.push(midpoint(pos, prev));
        prev = pos
    }
    return result;
}

function draw_polygon(points){
    beginShape();
    for(let pos of points){
        vertex(pos.x, pos.y);
        push();
        strokeWeight(10);
        point(pos.x, pos.y)
        pop();
    }
    endShape(CLOSE);
}

function midpoint(a, b){
    return a.copy().add(b).div(2)
}

function previous(){
    if(history.length === 0)
        return null;
    return history[history.length - 1];
}

function go_forward(){
    history.push(polygon);
    polygon = make_next_polygon(polygon);
    redraw();
}

function go_back(){
    if(previous() !== null){
        polygon = history.pop();
        redraw();
    }
}

function reset(){
    polygon = make_random_polygon();
    history = [];
    redraw();
}
