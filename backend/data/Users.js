import bcrypt from "bcryptjs";

const users = [
    {
        name: "Victor Nathanael",
        email: "victornathanael26@gmail.com",
        password: bcrypt.hashSync("victor2312", 10),
    }

];

export default users;
