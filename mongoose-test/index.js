const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");


async function main() {
    await mongoose.connect("mongodb://localhost/mongoose-test");

    console.log("Connection OK");

    const remainingAlice = await User.findOneAndRemove({
        email: "alice@example.org"
    });
    console.log(remainingAlice);  // just prints null if alice was already deleted

    const deletedUsers = await User.deleteMany(
        { age: { $lt: 100 } }
    );
    console.log(deletedUsers);

    const user1 = new User({
        email: "jean@example.org",
        firstName: "Jean",
        lastName: "Dupont",
        age: 38,
    });
    await user1.save();
    console.log(user1);

    const user2 = await User.create({
        email: "alice@example.org",
        firstName: "Alice",
        age: 25,
    });
    console.log(user2);

    const allUsers = await User.find();
    console.log(allUsers);

    const sameUsers = await User.find(
        {
            $or: [
                { firstName: "Jean" },
                { age: { $lte: 30 }},
            ]
        }
    ).select("firstName lastName email -_id");
    console.log(sameUsers);

    const jean = await User.findById(user1._id);
    jean.age = 40;
    await jean.save();
    console.log(jean);

    const alice = await User.findByIdAndUpdate(
        user2._id,
        { lastName: "Dubois" },
        { new: true }
    );
    console.log(alice);

    const updatedUsers = await User.updateMany(
        { email: "alice@example.org" },
        { lastName: "Martin" },
    );
    console.log(updatedUsers);

    // (Re-)Création des articles (Posts) :
    await Post.deleteMany();

    await Post.create({
        title: "Nouvelle version de Node.js !",
        content: "...",
        status: "PUBLISHED",
        author: jean._id,
    });

    await Post.create({
        title: "Créer un formulaire en HTML",
        content: "...",
        status: "DRAFT",
        author: alice._id,
    });

    // Wait 2 seconds then update posts:
    const start = Date.now();
    let now = start;
    while (now - start < 3000) {
      now = Date.now();
    }

    await Post.updateMany({}, { content: "vide" });

    const posts = await Post.find().populate("author");
    console.log(posts);

    const deletedAlice = await User.findByIdAndDelete(user2._id);
    console.log(deletedAlice);

    mongoose.disconnect();
}


main();
