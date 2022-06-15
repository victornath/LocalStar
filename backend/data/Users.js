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
        experience: 10,
        level: 10,
        point: 1000,
        gold: 1000,
        item_ids: ["bottom_pants_l_bk", "bottom_pants_l_dbl", "bottom_pants_l_kh", "bottom_pants_l_lbl",
            "bottom_pants_s_bk", "bottom_pants_s_dbl", "bottom_pants_s_kh", "bottom_pants_s_lbl", "hair_long_bk",
            "hair_long_br", "hair_long_gr", "hair_long_yw", "hair_short_bk", "hair_short_br", "hair_short_gr",
            "hair_short_yw", "hat_cap_bl", "hat_cap_gn", "hat_cap_rd", "hat_cap_yw", "hat_fedora_bk",
            "hat_fedora_br", "shoes_basic_bk", "shoes_basic_bl", "shoes_basic_br", "shoes_basic_rd",
            "shoes_basic_wh", "top_shirt_bk", "top_shirt_bl", "top_shirt_gn", "top_shirt_pk", "top_shirt_rd"],
        num_of_win: [1, 2, 3, 4],
    },
];

export default users;
