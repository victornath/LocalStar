import React from 'react'
import Header from '../components/Header'

const Help_Congklak = () => {
    return (
        <div>
            <Header />

            <div className="banner">
                <div class="container px-4 px-lg-5 help-content">
                    <div class="row gx-4 gx-lg-5 justify-content-center">
                        <div class="col-md-10 col-lg-8 col-xl-7">
                            <p>Congklak merupakan salah satu jenis permainan tradisional yang menggunakan papan kayu dengan lubang bulat berjumlah 16 lubang.</p>
                            <p>Dari total jumlah lubang yang terdapat pada papan congklak, 2 diantaranya memiliki ukuran yang lebih besar dan terletak diujung papan.
                                Dua lubang yang berukuran lebih besar inilah yang disebut sebagai "Rumah" dari kedua pemain.
                                Lubang-lubang kecil yang ada di hadapan pemain, dianggap sebagai barisan lubang milik pemain.</p>
                            <h1 class="section-heading">Berikut aturan aturan yang berlaku pada permainan congklak:</h1>
                            <ol class="list-group-numbered">
                                <li>Pada awal permainan, setiap lubang kecil diisi dengan 7 buah biji congklak.</li>
                                <li>Pemain Pertama boleh memilih lubang yang akan diambil</li>
                                <li>Biji diturunkan setiap melewati lubang</li>
                                <li>Jika biji berhenti di "Rumah", pemain boleh memilih lubang lagi untuk diambil.</li>
                                <li>Jika berhenti di lubang yang masih ada isinya, maka pemain tersebut diperbolehkan untuk mengambil semua biji dan lanjutkan permainan.</li>
                                <li>Jika berhenti di lubang kosong pada baris kita:
                                    <ul>
                                        <li>Jika disisi lawan terdapat biji congklak, maka pemain diperbolehkan untuk mengambil biji lawan dan biji terakhir yang diturunkan tadi, lalu memasukkannya ke Rumah pemain.</li>
                                        <li>Jika disisi lawan tidak terdapat biji congklak, maka giliran selesai.</li>
                                    </ul>
                                </li>
                                <li>Jika berhenti di lubang kosong milik lawan, giliran selesai.</li>
                                <li>Pemenang permainan ditentukan oleh pemilik biji terbanyak pada akhir permainan.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Help_Congklak