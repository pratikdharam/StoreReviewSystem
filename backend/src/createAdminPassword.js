import bcrypt from "bcryptjs";

const password = "Store@123";

bcrypt.hash(password, 10).then(hash => {
    console.log("Use this hash in your SQL queries:", hash);
});