import bcrypt from "bcryptjs";

const users = [
    {
        name: "Victor N",
        email: "victornathanael26@gmail.com",
        password: bcrypt.hashSync("victor2312", 10),
    },
    {
        name: "Kopeyy",
        email: "hans123@gmail.com",
        password: bcrypt.hashSync("hans123", 10),
    },
];

export default users;
