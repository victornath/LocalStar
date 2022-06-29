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
        item_owned: [
            {
                item_id: "bottom_pants_l_bk",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_l_dbl",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_l_kh",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_l_lbl",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_s_bk",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_s_dbl",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_s_kh",
                category: "bottom",
            },
            {
                item_id: "bottom_pants_s_lbl",
                category: "bottom",
            },
            {
                item_id: "hair_long_bk",
                category: "hair",
            },
            {
                item_id: "hair_long_br",
                category: "hair",
            },
            {
                item_id: "hair_long_gr",
                category: "hair",
            },
            {
                item_id: "hair_long_yw",
                category: "hair",
            },
            {
                item_id: "hair_short_bk",
                category: "hair",
            },
            {
                item_id: "hair_short_br",
                category: "hair",
            },
            {
                item_id: "hair_short_gr",
                category: "hair",
            },
            {
                item_id: "hair_short_yw",
                category: "hair",
            },
            {
                item_id: "hat_cap_bl",
                category: "hat",
            },
            {
                item_id: "hat_cap_gn",
                category: "hat",
            },
            {
                item_id: "hat_cap_rd",
                category: "hat",
            },
            {
                item_id: "hat_cap_yw",
                category: "hat",
            },
            {
                item_id: "hat_fedora_bk",
                category: "hat",
            },
            {
                item_id: "hat_fedora_br",
                category: "hat",
            },
            {
                item_id: "shoes_basic_bk",
                category: "shoes",
            },
            {
                item_id: "shoes_basic_bl",
                category: "shoes",
            },
            {
                item_id: "shoes_basic_br",
                category: "shoes",
            },
            {
                item_id: "shoes_basic_rd",
                category: "shoes",
            },
            {
                item_id: "shoes_basic_wh",
                category: "shoes",
            },
            {
                item_id: "top_shirt_bk",
                category: "top",
            },
            {
                item_id: "top_shirt_bl",
                category: "top",
            },
            {
                item_id: "top_shirt_gn",
                category: "top",
            },
            {
                item_id: "top_shirt_pk",
                category: "top",
            },
            {
                item_id: "top_shirt_rd",
                category: "top",
            },
        ],
        num_of_win: {
            congklak: 0,
            gobak_sodor: 0,
            tarik_tambang: 0,
            balap_karung: 0,
        },
        equipped_items: {
            hat: "hat_cap_gn",
            hair: "hair_long_gr",
            top: "top_shirt_rd",
            bottom: "bottom_pants_l_bk",
            shoes: "shoes_basic_br",
        }
    },
];

export default users;
