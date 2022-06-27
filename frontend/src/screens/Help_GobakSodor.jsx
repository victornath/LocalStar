import React from 'react'
import Header from '../components/Header'

const Help_Congklak = () => {
    return (
        <div>
            <Header />

            <div className="help-banner">
                <div class="container px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5">
                        <div class="col-6 justify-content-center help-content">
                            <p>Gobak Sodor adalah tradisional dengan menggunakan sebuah lapangan segi empat berpetak-petak.</p>
                            <p>Dimana, pada setiap garis, dijaga oleh seorang penjaga. Tim lawan harus melewati setiap garis nya untuk mencapai garis akhir.</p>
                            <p>Dalam versi Legends Arcadia, setiap kali pemain melewati garis, akan mendapatkan poin. Sementara itu setiap kali penjaga berhasil menangkap lawan, penjaga akan mendapatkan poin.</p>
                            <p>Untuk membuat permainan lebih adil, setiap tim diberikan satu "Special Move" secara acak. Dimana jika berhasil mencetak skor dengan Special Move tersebut, poin yang didapatkan sebesar 3x lipat.</p>
                        </div>
                        <div class="col-6 justify-content-center help-images">
                            <img class="img-fluid center" src="/images/gobaksodor_1.png"></img>
                            <img class="img-fluid center" src="/images/gobaksodor_2.png"></img>
                            <img class="img-fluid center" src="/images/gobaksodor_3.png"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Help_Congklak