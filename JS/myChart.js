import { totalQuestion } from "./dashboard.js";

const myChart = document.getElementsByClassName("chart")

 export function createChart(score){
    let result = document.getElementById('result-display')
    result.innerText = `Score: ${score[0]} / ${totalQuestion}`;
    new Chart(myChart, {
        type: 'doughnut',
        data: {
            labels: ["Correct", "Incorrect", "Not Answered"],
            datasets: [
                {
                    data: score,
                    label: "Count: "
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        color: "white",
                        font: {
                            size: 14, 
                        }
                    },
                    title: {
                        display: true,
                        text: "", 
                        fullSize: false,
                        padding: { top: 20 }
                    }
                }
            }
        }
    });
}