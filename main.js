// 1. UZDEVUMS: KOMANDAS SADAĻA (PAR MUMS uzspiežot)

const komanda = [
    {
        vards: "Edžus Voss",
        vecums: 34,
        loma: "Dizainers",
        hobijs: "Ceļošana",
        foto: "Bildes/edzus1.jpg" 
    },
    {
        // Nav komandas biedru, bet vajadzēja vēl kādu izsaukumu
        vards: "Edžus Voss (Alter ego)", 
        vecums: 34,
        loma: "Programmētājs",
        hobijs: "Prokrastinēšana",
        foto: "Bildes/edzus2.jpg"
    }
    // Ja vajag vēl kādu tad te var pielikt klāt
];
// Meklēju HTML failā komandas sarakstu
const saraksts = document.getElementById("komandas-saraksts");

if (saraksts) {
    // Pievienoju konteinera klasi, lai kartiņas būtu smuki blakus
    saraksts.className = "container"; 

    komanda.forEach((dalibnieks) => {
        // Ielieku apaļu bildi dalībniekam
        const kartina = `
            <div class="card">
                <img src="${dalibnieks.foto}" alt="${dalibnieks.vards}" 
                     style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; display: block; border: 4px solid #FCFBF4;">
                
                <h2>${dalibnieks.vards}</h2>
                <ul style="text-align: left; margin-top: 20px; list-style-type: none; padding: 0; display: inline-block;">
                    <li style="margin-bottom: 10px;"><strong>Vecums:</strong> ${dalibnieks.vecums}</li>
                    <li style="margin-bottom: 10px;"><strong>Loma:</strong> ${dalibnieks.loma}</li>
                    <li style="margin-bottom: 10px;"><strong>Hobijs:</strong> ${dalibnieks.hobijs}</li>
                </ul>
            </div>
        `;
        saraksts.innerHTML += kartina;
    });
}

// 3. UZDEVUMS: DATU VIZUALIZĀCIJA

// Atrodu <canvas> elementus, kur zīmēt grafikus index.html failā
const tempCanvas = document.getElementById('temperaturasGrafiks');
const lietusCanvas = document.getElementById('budzetaGrafiks');

const krasas = {
    teksts: '#FCFBF4',
    linijas: 'rgba(252, 251, 244, 0.2)'
};

if (tempCanvas && lietusCanvas) {

    // Šeit ieelādēju datus no faila
    fetch('klimata_dati_2024.csv')
        .then(response => response.text()) // Pārvēršu failu tekstā
        .then(data => {
            
            // 1. Datu apstrāde
            // Sadalu failu rindiņās un izlaižu pirmo (virsrakstu) rindu
            const rindas = data.split('\n').slice(1);
            
            // Sagatavoju tukšus masīvus, kur liksim datus
            const menesi = []; // Mēnešus paņemu no pirmās vietas datiem
            const azoruTemp = [], kanarijuTemp = [], sicilijasTemp = [];
            const azoruLietus = [], kanarijuLietus = [], sicilijasLietus = [];

            // Ejam cauri katrai faila rindiņai
            rindas.forEach(rinda => {
                const kolonnas = rinda.split(','); // Sadalu pa komatiem
                const vieta = kolonnas[0];
                const menesis = kolonnas[1];
                const temp = parseFloat(kolonnas[2]);
                const lietus = parseFloat(kolonnas[3]);

                // Šķiroju datus pa pareizajiem plauktiņiem
                if (vieta === 'Azoru salas') {
                    azoruTemp.push(temp);
                    azoruLietus.push(lietus);
                    menesi.push(menesis); // Mēnešus saglabāju tikai vienreiz
                } else if (vieta === 'Kanāriju salas') {
                    kanarijuTemp.push(temp);
                    kanarijuLietus.push(lietus);
                } else if (vieta === 'Sicīlija') {
                    sicilijasTemp.push(temp);
                    sicilijasLietus.push(lietus);
                }
            });

            // 2. Zīmēju grafikus
            
            // 1. GRAFIKS: Temperatūra
            new Chart(tempCanvas, {
                type: 'line', 
                data: {
                    labels: menesi,
                    datasets: [
                        {
                            label: 'Azoru s.',
                            data: azoruTemp,
                            borderColor: '#90EE90',
                            backgroundColor: '#90EE90',
                            tension: 0.3,
                            pointRadius: 2
                        },
                        {
                            label: 'Kanāriju s.',
                            data: kanarijuTemp,
                            borderColor: '#D68C45',
                            backgroundColor: '#D68C45',
                            tension: 0.3,
                            pointRadius: 2
                        },
                        {
                            label: 'Sicīlija',
                            data: sicilijasTemp,
                            borderColor: '#ccc',
                            backgroundColor: '#ccc',
                            borderDash: [5, 5],
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Vidējā temperatūra (°C)', color: krasas.teksts },
                        legend: { position: 'bottom', labels: { color: krasas.teksts } }
                    },
                    scales: {
                        y: { 
                            beginAtZero: false, min: 10,
                            ticks: { color: krasas.teksts },
                            grid: { color: krasas.linijas }
                        },
                        x: {
                            ticks: { color: krasas.teksts },
                            grid: { color: krasas.linijas }
                        }
                    }
                }
            });

            // 2. GRAFIKS: Nokrišņi
            new Chart(lietusCanvas, {
                type: 'bar',
                data: {
                    labels: menesi,
                    datasets: [
                        {
                            label: 'Azoru s.',
                            data: azoruLietus,
                            backgroundColor: '#90EE90', // Gaišāk zaļš
                            borderRadius: 3
                        },
                        {
                            label: 'Kanāriju s.',
                            data: kanarijuLietus,
                            backgroundColor: '#D68C45', // Oranžs
                            borderRadius: 3
                        },
                        {
                            label: 'Sicīlija',
                            data: sicilijasLietus,
                            backgroundColor: '#ccc', // Pelēks (tāpat kā temp. grafikā)
                            borderRadius: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Nokrišņi mēnesī (mm)', color: krasas.teksts },
                        legend: { position: 'bottom', labels: { color: krasas.teksts } }
                    },
                    scales: {
                        y: {
                            ticks: { color: krasas.teksts },
                            grid: { color: krasas.linijas }
                        },
                        x: {
                            ticks: { color: krasas.teksts },
                            grid: { display: false }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Kļūda ielādējot CSV:', error));

}
