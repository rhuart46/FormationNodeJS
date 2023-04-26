const express = require("express");

const albumController = require("../controllers/album.controller");

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/albums");
});

router.get("/albums", albumController.showAlbums);
router.get("/albums/create", albumController.createAlbumForm);
router.post("/albums/create", albumController.createAlbum);

router.get("/albums/:id", albumController.showAlbum);
router.post("/albums/:id", albumController.addImage);
router.get("/albums/:id/delete", albumController.deleteAlbum);
router.get("/albums/:id/delete/:index", albumController.deleteImage);

module.exports = router;
