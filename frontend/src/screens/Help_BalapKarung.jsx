import React from 'react'
import Header from '../components/Header'

const Help_BalapKarung = () => {
    return (
        <div>
            <Header />

            <div className="help-banner">
                <div class="container px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5">
                        <div class="col-6 justify-content-center help-content">
                            <p>Balap karung adalah permainan kompetitif yang dilakukan dengan memasukkan kedua kaki peserta di dalam karung atau sarung bantal yang mencapai pinggang atau
                                leher mereka dan melompat ke depan dari titik awal menuju garis finis.</p>
                            <p> Orang pertama yang melewati garis finis adalah pemenang perlombaan. </p>
                            <h1 class="section-heading">Cara Memainkan Permainan Balap Karung:</h1>
                            <ol class="list-group-numbered">
                                <li>Pemain akan berhadapan satu lawan satu dengan pemain lain.</li>
                                <li>Pemain akan memulai permainan dari garis start.</li>
                                <li>Pemain dapat melangkah maju dengan cara menekan tombol klik kiri pada mouse.</li>
                                <li>Langkah maju dari pemain ditentukan dengan power gauge.</li>
                                <li>Power gauge ini menentukan seberapa jauh pemain dapat melompat dalam sekali klik, semakin besar maka akan melangkah lebih jauh.</li>
                                <li>Pemain yang mencapai garis finish lebih dulu adalah pemenang.</li>
                            </ol>
                        </div>
                        <div class="col-6 justify-content-center help-images">
                            <img class="img-fluid center" src="/images/Lompat_1.png"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Help_BalapKarung