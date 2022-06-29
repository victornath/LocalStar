import React from 'react'
import Header from '../components/Header'

const Help_TarikTambang = () => {
    return (
        <div>
            <Header />

            <div className="help-banner">
                <div class="container px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5">
                        <div class="col-6 justify-content-center help-content">
                            <p>Tarik tambang adalah merupakan salah satu jenis permainan tradisional.</p>
                            <p>Perlengkapan yang diperlukan dalam tarik tambang hanya sebuah tali yang kuat.</p>
                            <h1 class="section-heading">Cara Memainkan Permainan Tarik Tambang:</h1>
                            <ol class="list-group-numbered">
                                <li>Para pemain dibagi menjadi dua regu.</li>
                                <li>Pemain dapat menarik tali ke sisi bermainnya dengan cara mengklik tombol kiri pada mouse.</li>
                                <li>Pemainan ini menggunakan fitur power gauge yang menentukan seberapa kuat tarikan pemain. Semakin besar power, maka tali akan tertarik lebih jauh.</li>
                                <li>Pemain yang berhasil menarik tali lebih jauh pada saat waktu habis dinyatakan menang.</li>
                            </ol>
                        </div>
                        <div class="col-6 justify-content-center help-images">
                            <img class="img-fluid center" src="/images/Tarik_Tambang_1.png"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Help_TarikTambang