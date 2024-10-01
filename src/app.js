const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")
app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {
    // console.log(req.body)
    try {
        validateSignupData(req);

        //encrypt the password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        })

        await user.save();
        res.send("User added sucessfully!")
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials1!")
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            //create a jwt token
            const token = await user.getJWT();
            console.log(token);

            //Send the cookie back to user
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("Login Sucessfull!");
        } else {
            throw new Error("Invalid Credentials2!");
        }

    } catch (err) {
        res.status(400).send("Something went wrong!" + err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log("Sending a connecton request!");
    res.send(user.firstName + " Sent the Connection Request!")
})


connectDB().then(() => {
    console.log("Database connected successfully!!");
    app.listen(3000, () => {
        console.log("connected with port 3000")
    })

}).catch(err => {
    console.log("Database cannot connected successfully!!" + err.message);

})


