const dotenv = require("dotenv");
const connectDB = require("./src/config/db.js");
const app = require("./app.js");

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is Running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB Connection Failed: ${error.message}`);
    });
