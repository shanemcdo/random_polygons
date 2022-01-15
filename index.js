function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    stroke(255);
    noFill();
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

function make_random_polygon(num_sides = 10){
    let result = [];
    for(let i = 0; i < num_sides; i++)
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
