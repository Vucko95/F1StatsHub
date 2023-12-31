
export const chartOptions = {
    responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: false
          
        },
        legend: {
          // position: 'right',
          position: 'bottom',
          labels: {
            color: 'white', 
            padding: 10,

          }},
        tooltip: {
          bodyFont: {
            size: 14, 
          },
        },
      },
      scales: {
      
      },
    }



export const chartOptions2 = {
      responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            // position: 'right',
            position: 'bottom',
            labels: {
              color: 'white', 
              // padding: 10,
  
            }},
            datalabels: {
              font: {
                size: 24,
              },
              color: '#FFFFFF'
            },
            // title: {
            //   display: true,
            //   text: 'Driver Points',
            //   color: 'white',
            //   font: {
            //     size: 24,
            //   }},

          tooltip: {
            bodyFont: {
              size: 14,
              color: '#FFFFFF', },
          },
        },
        scales: {
        
        },
      }

export const chartOptions5 = {
        responsive: true,
        maintainAspectRatio: false,
  
        plugins: {
          legend: 
          {
            display:false
          },
          title: {
            display: true,
            text: 'Average Points Per Race Top 10',
            color: 'white',
            font: {
              size: 24,
            },
        },
          datalabels: {
            font: {
              size: 20,
            },
            color: '#FFFFFF',
            rotation: -90,
          },
        },
        scales: {
          x: {
            display: true,
            ticks : {
              color: 'white', 
              font: {
                size: 10,
              },
              // reverse: true,
              // backgroundColor: '#FFFFFF',
              // rotation: -90, 
              // padding: 30,
            }
            
          },
          y: {
            display: false,
            ticks: {
              color: 'white', 
              font: {
                size: 18,
              },
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 10, 
            // borderWidth: 10,
          }},
      };