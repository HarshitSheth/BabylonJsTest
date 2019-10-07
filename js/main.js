var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
// window.onload = function() {
// };
// var x = 50;
function random2DCoordinates() {
    var x = (Math.random() - 0.5) * (80 + width * 2) + width;
    var y = (Math.random() - 0.5) * (30 + height * 2) + height;
    return new BABYLON.Vector3(x, y, 0);
}

var boxes = [];
var numberOfBoxes = 10;
var height = 1, width = 1, depth = 1;

function createBoxes(){
    for (var i=0; i<numberOfBoxes;i++){
        var box = new BABYLON.MeshBuilder.CreateBox('Box '+i, {height: height, width: width, depth: depth}, scene);
        box.position = random2DCoordinates();
        if(i!==0){
            console.log("i : " + i);
            for(var j=0; j<boxes.length;j++){
                console.log(j);
                if(BABYLON.Vector3.Distance(box.position,boxes[j].position) - 2*width < 0){
                    console.log(j);
                    console.log(BABYLON.Vector3.Distance(box.position,boxes[j].position) - 2*width);
                    box.position = random2DCoordinates();
                    j=-1;
                }
            }
        }
        var material = new BABYLON.StandardMaterial('Material'+i, scene);
        // material.emissiveColor = new BABYLON.Color3(Math.random()+0.5, Math.random()+0.5, Math.random()+0.5);
        material.emissiveColor = BABYLON.Color3.Black();
        box.material = material;

        // box.color = material.emissiveColor;
        box.color = BABYLON.Color3.Black();
        boxes.push(box);
    }
}

function drawCurvedConnectors(){
    for(var i=0;i<numberOfBoxes;i++){
        var curvedLinesArray = [];
        for(var j=i+1;j<numberOfBoxes;j++){
            var quadraticBezierVectors = BABYLON.Curve3.CreateQuadraticBezier(
                new BABYLON.Vector3(boxes[i].position.x, boxes[i].position.y + height/2, 0),
                new BABYLON.Vector3((boxes[i].position.x+boxes[j].position.x)/2, 10, 0),
                new BABYLON.Vector3(boxes[j].position.x, boxes[j].position.y + height/2, 0),
                25);
            var quadraticBezierCurve = BABYLON.Mesh.CreateLines("Curved Line", quadraticBezierVectors.getPoints(), scene);
            quadraticBezierCurve.alpha = 0;
            quadraticBezierCurve.color = new BABYLON.Color3(0.5, 0.5, 0.5);
            curvedLinesArray.push(quadraticBezierCurve);
        }
        boxes[i].curvedLines = curvedLinesArray;
        // boxes[i].callback = createBoxes();
        // boxes.splice(i, 1, boxes[i]);
        boxes[i] = boxes[i];
    }
}

function showConnections(){
    for (var i=0;i<boxes.length;i++){
        for(var j=0; i<boxes[i].curvedLines.length;j++){

        }
    }
}

function createScene() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(1, 1, 1);

    createBoxes();
    drawCurvedConnectors();
    // console.log(box.position);
    // var box2 = new BABYLON.MeshBuilder.CreateBox('Box2', {height: 2, width: 2, depth: 2}, scene);
    // var material = new BABYLON.StandardMaterial("material1", scene);
    // material.diffuseTexture = new BABYLON.Texture('../TrialImage.jpeg', scene);
    // material.wireframe = true;
    // box2.material = material;
    // box2.position = random2DCoordinates();
    // console.log(box2.position);
    // box2.position = new BABYLON.Vector3(0, 5, 0);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -50), scene);
    // var camera = new BABYLON.ArcRotateCamera("arcCamera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 20, new BABYLON.Vector3(0, 0, 20), scene);
    // var camera = new BABYLON.FollowCamera("followCam", BABYLON.Vector3.Zero(), scene);
    // camera.lockedTarget = box;
    // camera.radius = 20;
    // camera.heightOffset = 0;
    // camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    // camera.keysUp.push(87);
    // camera.keysDown.push(83);
    // camera.keysLeft.push(65);
    // camera.keysRight.push(68);

    // var light = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0,10,0), scene);
    // light.diffuse = new BABYLON.Color3(1,0,0); //set color of the light
    // light.parent = camera;
    // //To turn light on and off controlled by SpaceBar
    // scene.actionManager = new BABYLON.ActionManager(scene);
    // scene.actionManager.registerAction(
    //     new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: " "},
    //         function () {
    //             light.setEnabled(!light.isEnabled());
    //         }
    //     )
    // );

    // var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0), BABYLON.Tools.ToRadians(45), 0.1, scene);
    // light.diffuse = new BABYLON.Color3(1, 0, 0);



    // var line = new BABYLON.MeshBuilder.CreateLines("Line", {points: [new BABYLON.Vector3(box.position.x, box.position.y + 1, 0), new BABYLON.Vector3(box2.position.x, box2.position.y + 1, 0)]}, scene);
    // line.color = new BABYLON.Color3(1,0,0);

    return scene;
}

var scene = createScene();

function setHoverAction(){
    // new BABYLON.ExecuteCodeAction(
    //     BABYLON.ActionManager.OnPointerOverTrigger,
    //     function(evt) {
    //
    //     },);

    for(var i=0;i<boxes.length;i++){
        var box = boxes[i];
        // console.log(box);
        boxes[i].actionManager = new BABYLON.ActionManager(scene);
        (function (e) {
            boxes[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {trigger: BABYLON.ActionManager.OnPointerOverTrigger},
                function () {
                    for (var j = 0; j < boxes[e].curvedLines.length; j++) {
                        boxes[e].curvedLines[j].alpha = 1;
                    }
                }));
            boxes[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {trigger: BABYLON.ActionManager.OnPointerOutTrigger},
                function () {
                    for(var j=0;j<boxes[e].curvedLines.length;j++){
                        boxes[e].curvedLines[j].alpha = 0;
                    }
                }));
        }(i));
    }

}

window.addEventListener('DOMContentLoaded', function () {
    canvas.focus();
    setHoverAction();
    engine.runRenderLoop(function () {
        // scene.getMeshByName("Box").position.z += 0.01;
        //For pointLight
        // var light = scene.getLightByName('pointLight');
        // light.diffuse.g += 0.01;
        // light.diffuse.b += 0.01;

        // var light = scene.getLightByName('spotLight');
        // light.position.y -= 0.01;
        // var material = scene.getMeshByName('Box2').material;
        // if (material.alpha <= 0 ) material.alpha = 1;
        // material.alpha -= 0.01;
        scene.render();
    })
});

