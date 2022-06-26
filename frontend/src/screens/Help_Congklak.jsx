import React from 'react'
import Header from '../components/Header'

const Help_Congklak = () => {
    return (
        <div>
            <Header />

            <div className="banner">
                <div class="help-content">
                    <h4>Congklak merupakan salah satu jenis permainan tradisional yang menggunakan papan kayu dengan lubang bulat berjumlah 16 lubang.
                        Dari total jumlah lubang yang terdapat pada papan congklak, 2 diantaranya memiliki ukuran yang lebih besar dan terletak diujung papan.
                        2 Lubang yang berukuran lebih besar inilah yang disebut sebagai Rumah dari kedua pemain.
                        Lubang-lubang kecil yang ada di hadapan pemain, dianggap sebagai barisan lubang milik pemain.</h4>
                    <br></br><br></br>

                    <h4>
                        Berikut aturan aturan yang berlaku pada permainan congklak:<br></br>
                        1. Pada awal permainan, setiap lubang kecil diisi dengan 7 buah biji congklak.<br></br><br></br>
                        2. Pemain Pertama boleh memilih lubang yang akan diambil<br></br><br></br>
                        3. Biji diturunkan setiap melewati lubang<br></br><br></br>
                        4. Jika biji berhenti di "Rumah", pemain boleh memilih lubang lagi untuk diambil.<br></br><br></br>
                        5. Jika berhenti di lubang yang masih ada isinya, maka pemain tersebut diperbolehkan untuk mengambil semua biji dan lanjutkan permainan.<br></br><br></br>
                        6. Jika berhenti di lubang kosong pada baris kita:<br></br>
                        - Jika disisi lawan terdapat biji congklak, maka pemain diperbolehkan untuk mengambil biji lawan dan biji terakhir yang diturunkan tadi, lalu memasukkannya ke Rumah pemain.<br></br>
                        - Jika disisi lawan tidak terdapat biji congklak, maka giliran selesai.<br></br><br></br>
                        7. Jika berhenti di lubang kosong milik lawan, giliran selesai.<br></br><br></br>
                        8. Pemenang permainan ditentukan oleh pemilik biji terbanyak pada akhir permainan.<br></br><br></br>
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default Help_Congklak