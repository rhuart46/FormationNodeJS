const fs = require("fs");
const path = require("path");

const catchAsync = require("./helpers/catchAsync");
const Album = require("../models/Album");

const showAlbums = async (req, res) => {
    const albums = await Album.find();
    res.render("albums", { title: "Albums", albums });
};

const showAlbum = async (req, res) => {
    try {
        const album = await Album.findById(req.params.id);
        res.render("album", { title: `Mon album ${album.title}`, album, errors: req.flash("error") });
    } catch(err) {
        console.log(err);
        res.redirect("/404");
    }
};

const addImage = async (req, res) =>{
    const albumId = req.params.id;
    const album = await Album.findById(albumId);

    const image = req?.files?.image;
    if (!image) {
        req.flash("error", "Aucun fichier mis en ligne");
        res.redirect(`/albums/${albumId}`);
        return;
    }
    else if (image.mimetype != "image/jpeg" && image.mimetype != "image/png") {
        req.flash("error", "Seuls les fichier JPG et PNG sont acceptés.");
        res.redirect(`/albums/${albumId}`);
        return;
    }

    const imageName = image.name;
    if (album.images.includes(imageName)) {
        res.redirect(`/albums/${albumId}`);
        return;
    }

    const folderPath = path.join(__dirname, "..", "public", "uploads", albumId);
    fs.mkdirSync(folderPath, { recursive: true });

    const localPath = path.join(folderPath, imageName);
    await image.mv(localPath);

    album.images.push(imageName);
    await album.save();

    res.redirect(`/albums/${albumId}`);
};

const deleteImage = async (req, res) => {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);

    const imageIndex = req.params.index;
    const imageName = album.images[imageIndex];
    if (!imageName) {
        res.redirect(`/albums/${albumId}`);
        return;
    }

    album.images.pull(imageName);
    await album.save();

    const imagePath = path.join(__dirname, "..", "public", "uploads", albumId, imageName);
    fs.rmSync(imagePath);

    res.redirect(`/albums/${albumId}`);
};

const createAlbumForm = (req, res) => {
    res.render("new-album", { title: "Nouvel album", errors: req.flash("error") });
};

const createAlbum = async (req, res) => {
    try {
        const albumTitle = req.body.albumTitle;
        if (!albumTitle) {
            req.flash("error", "Le titre ne doit pas être vide.");
            res.redirect("/albums/create");
            return;
        }

        await Album.create({ title: albumTitle });

        res.redirect("/albums");
    } catch(err) {
        req.flash("error", "Erreur lors de la création de l'album.");
        res.redirect("/albums/create");
    }
};

const deleteAlbum = async (req, res) => {
    const albumId = req.params.id;
    await Album.findByIdAndDelete(albumId);

    const albumPath = path.join(__dirname, "..", "public", "uploads", albumId);
    if (fs.existsSync(albumPath))
        fs.rmSync(albumPath, { recursive: true });

    res.redirect("/albums");
};

module.exports = {
    showAlbums: catchAsync(showAlbums),
    showAlbum,
    addImage: catchAsync(addImage),
    deleteImage: catchAsync(deleteImage),
    createAlbumForm,
    createAlbum,
    deleteAlbum: catchAsync(deleteAlbum),
};
