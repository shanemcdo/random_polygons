// TODO: zoom
const els = {
    'num_points': document.querySelector('#num-points'),
    'show_all': document.querySelector('#show-all'),
    'polygon_type': document.querySelector('#polygon-type'),
}
let colors;
let history = [];
let polygon;
let make_polygon_fn;

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    update_make_polygon_fn();
    els.num_points.addEventListener('input', ()=>{
        let val = parseInt(els.num_points.value || '0');
        if(val > els.num_points.max)
            els.num_points.value = els.num_points.max;
        else if(val < els.num_points.min)
            els.num_points.value = els.num_points.min;
        reset();
    });
    els.show_all.addEventListener('input', redraw);
    els.polygon_type.addEventListener('input', update_make_polygon_fn);
    document.querySelector('canvas').addEventListener('click', go_forward);
    colors = [
        color(255, 0, 0),
        color(255, 128, 0),
        color(255, 255, 0),
        color(128, 255, 0),
        color(0, 255, 0),
        color(0, 255, 128),
        color(0, 255, 255),
        color(0, 128, 255),
        color(0, 0, 255),
        color(128, 0, 255),
        color(255, 0, 255),
        color(255, 0, 128)
    ];
    angleMode(DEGREES);
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
    if(els.show_all.checked){
        push();
        let i;
        for(i = 0; i < history.length; i++){
            stroke(colors[i % colors.length])
            draw_polygon(history[i]);
        }
        stroke(colors[i % colors.length])
        draw_polygon(polygon);
        pop();
    }else{
        let prev = previous();
        if(prev !== null){
            push();
            stroke('red');
            draw_polygon(prev);
            pop();
        }
        draw_polygon(polygon);
    }
}

function random_vector(){
    return createVector(
        random(-windowWidth / 2, windowWidth / 2),
        random(-windowHeight / 2, windowHeight / 2)
    );
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
    polygon = make_polygon_fn();
    history = [];
    redraw();
}

function update_make_polygon_fn(){
    switch(els.polygon_type.value){
        case 'regular':
            make_polygon_fn = () => {
                let size = parseInt(els.num_points.value);
                let result = [];
                let radius = min(windowWidth, windowHeight) / 2;
                for(let i = 0; i < size; i++){
                    let theta = i / size * 360;
                    result.push(createVector(
                        cos(theta) * radius,
                        sin(theta) * radius
                    ));
                }
                return result;
            }
            break;
        case 'regular-ish':
            make_polygon_fn = () => {
                let size = parseInt(els.num_points.value);
                let result = [];
                for(let i = 0; i < size; i++){
                    let theta = i / size * 360;
                    result.push(createVector(
                        cos(theta) * windowWidth / 2,
                        sin(theta) * windowHeight / 2
                    ));
                }
                return result;
            }
            break;
        case 'radial-random':
            make_polygon_fn = () => {
                let size = parseInt(els.num_points.value);
                let result = [];
                let radius = min(windowWidth, windowHeight) / 2;
                for(let i = 0; i < size; i++){
                    let theta = i / size * 360;
                    let r = random(-radius, radius);
                    result.push(createVector(
                        cos(theta) * r,
                        sin(theta) * r
                    ));
                }
                return result;
            }
            break;
        case 'random':
        default:
            make_polygon_fn = () => {
                let size = parseInt(els.num_points.value);
                let result = [];
                for(let i = 0; i < size; i++)
                    result.push(random_vector());
                return result;
            }
            break;
    }
    reset();
}
