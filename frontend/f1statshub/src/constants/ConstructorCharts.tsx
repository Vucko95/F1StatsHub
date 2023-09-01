export const chartOptions = {
    responsive: true,
      maintainAspectRatio: false,
      plugins: {

        tooltip: {
          bodyFont: {
            size: 14,
            color: '#FFFFFF', 
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
          //   text: 'Constructor Points',
          //   color: 'white',
          //   font: {
          //     size: 24,
          //   }},

        tooltip: {
          bodyFont: {
            size: 14,
            color: '#FFFFFF', 
          },
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
        text: 'Average Team Points Per Race',
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
            size: 13,
          },
        }
        
      },
      y: {
        display: true,
        ticks: {
          color: 'white', 
          // reverse: true,
          font: {
            size: 18,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 10, 
        // borderWidth: 5, 
      }}
  };