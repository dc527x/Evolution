let pictureInfo;
let targetImg;
let departmentInfo;
let pictureSelection = [];
let library;
let sel;
let sel2;
let rng;
let rngSelection = [];
let targetImageUrl;
let selectedWork;
var title;
var artWork;
let uploadImg;

function preload() {
    //Department 11, European paintings
    $('#picInventory').hide();
    $('#save-settings').hide();
    $('#save-picture').hide();
    $('#delete-picture').hide();
    let searchUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&hasImages=true&q=*';
    let departmentUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11';
    departmentInfo = loadJSON(searchUrl, randomObject);
}

function setup() {

    var shortInit = split(pictureSelection[0].title, '(');
    title = createElement('h3', shortInit[0]);
    title.parent('targetImgTitle');
    var canvas = createCanvas(400, 400);
    canvas.parent('canvas3');
    background(127);

    //BETA TAKE THIS OUT
//    capture = createCapture(VIDEO);
//    capture.size(320, 240);

    let canvas3 = document.getElementById("defaultCanvas2");
    if (targetImg.width <= targetImg.height) {
        targetImg.resize(0, 400);
    } else {
        targetImg.resize(400, 0);
    }
    resizeCanvas(targetImg.width, targetImg.height);
    canvas3.width = targetImg.width;
    canvas3.height = targetImg.height;
    image(targetImg, 0, 0);

    let canvas1 = document.getElementById("defaultCanvas0");
    let ctx = canvas1.getContext("2d");
    canvas1.style.width = canvas.width + 'px';
    canvas1.style.height = canvas.height + 'px';
    canvas1.width = canvas.width;
    canvas1.height = canvas.height;
    ctx.fillStyle = "#59415d";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);

    let canvas2 = document.getElementById("defaultCanvas1");
    let ctx2 = canvas2.getContext("2d");
    canvas2.style.width = canvas.width + 'px';
    canvas2.style.height = canvas.height + 'px';
    canvas2.width = canvas.width;
    canvas2.height = canvas.height;
    ctx2.fillStyle = "#59415d";
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

    sel2 = document.getElementById("picInventory");
    sel = select('#picInventory');

    for (var i = 0; i < pictureSelection.length; i++) {
        var added = false;
        if (pictureSelection[i].title.includes("(")) {
            console.log(pictureSelection[i].title.length);
            console.log(pictureSelection[i].title);
            var shortNames = split(pictureSelection[i].title, '(');

            //check if picture is a user picture
            if (typeof userFavorites !== 'undefined') {
                $("#save-picture").attr('disabled', true);
                $("#delete-picture").attr('disabled', true);
                for (var t = 0; t < userFavorites.length; t++) {
                    if (userFavorites[t].pictureUrl.includes(pictureSelection[i].objectID) && added === false) { //add user pics
                        var selUser = document.getElementById("favorites")
                        var opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(shortNames[0]));
                        opt.value = userFavorites[t].userIdPictures;
                        selUser.appendChild(opt);
                        added = true;
                    }
                }
                for (var t = 0; t < userFavorites.length; t++) { //add visitor pics
                    if (!userFavorites[t].pictureUrl.includes(pictureSelection[i].objectID) && added === false) {
                        var opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(shortNames[0]));
                        opt.value = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + pictureSelection[i].objectID;
                        sel2.appendChild(opt);
                        added = true;
                    }
                }
            } else { //user not logged in. Add everything
                var opt = document.createElement('option');
                opt.appendChild(document.createTextNode(shortNames[0]));
                opt.value = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + pictureSelection[i].objectID;
                sel2.appendChild(opt);
            }
        } else {
            //check if picture is a user picture
            if (typeof userFavorites !== 'undefined') {
                $("#save-picture").attr('disabled', true);
                $("#delete-picture").attr('disabled', true);
                for (var t = 0; t < userFavorites.length; t++) {
                    if (userFavorites[t].pictureUrl.includes(pictureSelection[i].objectID) && added === false) { //add user pics
                        var selUser = document.getElementById("favorites")
                        var opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(pictureSelection[i].title));
                        opt.value = userFavorites[t].userIdPictures;
                        selUser.appendChild(opt);
                        added = true;
                    }
                }
                for (var t = 0; t < userFavorites.length; t++) { //add visitor pics
                    if (!userFavorites[t].pictureUrl.includes(pictureSelection[i].objectID) && added === false) {
                        var opt = document.createElement('option');
                        opt.appendChild(document.createTextNode(pictureSelection[i].title));
                        opt.value = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + pictureSelection[i].objectID;
                        sel2.appendChild(opt);
                        added = true;
                    }
                }
            } else { //user not logged in. Add everything       
                var opt = document.createElement('option');
                opt.appendChild(document.createTextNode(pictureSelection[i].title));
                opt.value = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + pictureSelection[i].objectID;
                sel2.appendChild(opt);
                //sel.option(pictureSelection[i].title);
            }
        }
    }
    sel.changed(loadJSONImage);

    $('.loadingGif').hide();
    $('#start').show();
    $('#defaultCanvas0').show();
    $('#defaultCanvas1').show();
    $('#picInventory').show();
    $('#save-settings').show();
    $('#save-picture').show();
    $('#delete-picture').show();
    console.log(pictureSelection);

//FILE UPLOADER
    input = createFileInput(handleFile);
    input.parent('imageUploader');
}

//ADDED 02/24/2020
function drawUploadedImage() {
    background(255);
    if (uploadImg) {
        let canvas3 = document.getElementById("defaultCanvas2");
        if (uploadImg.width <= uploadImg.height) {
            var newWidth = (int) (uploadImg.width * 400 / uploadImg.height);
            var newHeight = 400;
            resizeCanvas((int) (uploadImg.width * 400 / uploadImg.height), 400);
        } else {
            var newWidth = 400;
            var newHeight = (int) (uploadImg.height * 400 / uploadImg.width);
            resizeCanvas(400, (int) (uploadImg.height * 400 / uploadImg.width));
        }
            canvas3.width = newWidth;
            canvas3.height = newHeight;  
        image(uploadImg, 0, 0, canvas3.width, canvas3.height);

        let canvas1 = document.getElementById("defaultCanvas0");
        let ctx = canvas1.getContext("2d");
        canvas1.style.width = canvas3.style.width;
        canvas1.style.height = canvas3.style.height;
        canvas1.width = canvas3.width;
        canvas1.height = canvas3.height;
        ctx.fillStyle = "#59415d";
        ctx.fillRect(0, 0, canvas1.width, canvas1.height);
//    ctx.drawImage(canvas3, 0, 0);

        let canvas2 = document.getElementById("defaultCanvas1");
        let ctx2 = canvas2.getContext("2d");
        canvas2.style.width = canvas3.style.width;
        canvas2.style.height = canvas3.style.height;
        canvas2.width = canvas3.width;
        canvas2.height = canvas3.height; //changed from canvas3
        ctx2.fillStyle = "#59415d";
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    }
}

function randomObject() {
    pictureSelection = [];
    library = departmentInfo.objectIDs.length;
    if (typeof userFavorites !== 'undefined') {
        for (var t = 0; t < userFavorites.length; t++) {
            targetImgUrl = userFavorites[t].pictureUrl;
            pictureInfo = loadJSON(targetImgUrl, fillPicSelection);
        }
    }
    for (var i = 0; i < 10; i++) {
        rng = departmentInfo.objectIDs[int(random(library))];
        rngSelection.push(rng);
        targetImgUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + rng;
        pictureInfo = loadJSON(targetImgUrl, fillPicSelection);
    }
}

function fillPicSelection(pictureInfo) {
    if (pictureInfo.primaryImageSmall !== "") {
        pictureSelection.push(pictureInfo);
    }
    if (pictureSelection.length > 0) {
        targetImg = loadImage(pictureSelection[0].primaryImageSmall);
    }
}

function loadJSONImage() {
    //cors-anywhere bypasses the cors block
    //targetImg = loadImage('https://cors-anywhere.herokuapp.com/' + pictureInfo.primaryImageSmall, randomObject);

    if (typeof userFavorites !== 'undefined') {
        if (sel2.selectedIndex < userFavorites.length) {
            $("#save-picture").attr('disabled', true);
            $("#delete-picture").attr('disabled', false);
            var deletePicId = sel2.value;
            $("#delete-link").attr("href", "deletePicture?userIdPictures=" + deletePicId);
        } else {
            $("#save-picture").attr('disabled', false);
            $("#delete-picture").attr('disabled', true);
        }
    }
    for (var j = 0; j < pictureSelection.length; j++) {
        if (pictureSelection[j].title.includes(sel2.selectedOptions[0].label)) {
            selectedWork = pictureSelection[j];
            title.html(sel2.selectedOptions[0].label);
            targetImg = loadImage(selectedWork.primaryImageSmall, drawSelectedImage);
            //targetImg = loadImage('css/Mondrian.jpg', drawSelectedImage);
        }
    }
}

function drawSelectedImage() {
//    clear();
//    background(127);
    let canvas3 = document.getElementById("defaultCanvas2");
    if (targetImg.width <= targetImg.height) {
        targetImg.resize(0, 400);
    } else {
        targetImg.resize(400, 0);
    }
    resizeCanvas(targetImg.width, targetImg.height);
    canvas3.width = targetImg.width;
    canvas3.height = targetImg.height;
    image(targetImg, 0, 0);
    //use to test fitness function
    //background(0);

    let canvas1 = document.getElementById("defaultCanvas0");
    let ctx = canvas1.getContext("2d");
    canvas1.style.width = canvas3.style.width;
    canvas1.style.height = canvas3.style.height;
    canvas1.width = canvas3.width;
    canvas1.height = canvas3.height;
    ctx.fillStyle = "#59415d";
    ctx.fillRect(0, 0, canvas1.width, canvas1.height);
//    ctx.drawImage(canvas3, 0, 0);

    let canvas2 = document.getElementById("defaultCanvas1");
    let ctx2 = canvas2.getContext("2d");
    canvas2.style.width = canvas3.style.width;
    canvas2.style.height = canvas3.style.height;
    canvas2.width = canvas3.width;
    canvas2.height = canvas3.height; //changed from canvas3
    ctx2.fillStyle = "#59415d";
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

//    canvas3.width = targetImg.width;
//    canvas3.height = targetImg.height;
//    canvas3.style.width = targetImg.width + 'px';
//    canvas3.style.height = targetImg.height + 'px';
}

//ADDED 02/24/2020
function handleFile(file) {
    print(file);
    if (file.type === 'image') {
        uploadImg = createImg(file.data, '', '', drawUploadedImage);
        uploadImg.hide();
        title.html(file.name);  
    } else {
        uploadImg = null;
    }
}