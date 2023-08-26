
export const chartOptions = {
    responsive: true,
     maintainAspectRatio: false,


     scales: {

         y: {
           beginAtZero: false,
           // borderRadius: 0,
           // min: 72,
           ticks: {
             color: 'white',
             stepSize: 5,
           },
         },
       },
       plugins: {
         datalabels: {
           color: 'white',
           rotation: -90,
           display: true,
           align: 'end',
           anchor: 'start',
           font: {
            size: 20,
          },
           formatter: function (value: any, context: any) {
             // Access the label (driver name) for the current dataset
             const driverName = context.dataset.label;
             const uppercaseDriverName = driverName.toUpperCase();
             // Return the label (driver name) to display in the tooltip
             return uppercaseDriverName ;
           }
         },
         title: {
           display: true,
           text: 'Lap Pace of a Driver in seconds',
           color: 'white',
           font: {
             size: 24,
           },
       },
         legend: {
            display: false,
           position: 'bottom',
           labels: {
             color: 'white', 
             padding: 10,
 
           },
         },
       },
 }
 export const chartOptions2 = {
   plugins: {

     legend: {
       position: 'right',
       labels: {
         color: 'white', 
         padding: 10

       },
     },
     
   },
   responsive: true,
   maintainAspectRatio: false,
   scales: {
     x: {
       display: false,
     },
     y: {
       position: 'left',
       reverse: true,
       min: 1,
       max: 20,
       ticks: {
         color: 'white',
         stepSize: 1,
       },
       
     },
     right: {
       position: 'right',
       reverse: true,
       min: 1,
       max: 20,
       ticks: {
         color: 'white',
         stepSize: 1,
       },
     },
   },
 };
 



 const data5 = {
   labels: [
     'REDBULL',
     'FERARRI',
     'ASTON',
     'MERCEDES',
     'MCLAREN',
     'ALPINE',
     'A-ROMEO',
     'A-TAURI',
     'WILLIAMS',
     'HAAS',

   ],
   datasets: [
     {
       label: 'ToHide',
       data: [
         0.000, // Verstappen
         0.355, // Hamilton
         0.805, // Norris
         1.205, // Leclerc
         1.710, // Ricciardo
         2.135, // Sainz
         2.755, // Perez
         3.150, // Gasly
         3.600, // Ocon
         4.005, // Vettel
       ],
       
       backgroundColor: [
         'white',
         'teal',
         'grey',
         'lime',
         'red',
         'yellow',
         'purple',
         'yellow',
         'blue',
         'teal',
       ],


     },
   ],
 };

  
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
       text: 'RACE - Average Lap Gap Time Per Team',
       color: 'white',
       font: {
         size: 24,
       },
   },
     datalabels: {
       align: 'end',
       anchor: 'end',

       font: {
         size: 20,
       },
       color: '#FFFFFF'
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
         reverse: true,
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

   
   
   
 export const chartOptions6 = {
   responsive: true,
   maintainAspectRatio: false,
   indexAxis: 'y', 
   plugins: {
     legend: 
     {
       display:false
     },
     title: {
       display: true,
       text: 'RACE - Average Lap Pace Gap to Teamamte',
       color: 'white',
       font: {
         size: 24,
       },
   },
     datalabels: {
       font: {
         size: 24,
       },
       color: '#FFFFFF'
     },
   },
   scales: {
     x: {
       display: true,
       title: {
         display: false,
         text: 'Lap Time (seconds)',
       },
       ticks: {
         beginAtZero: true,
         autoSkip: false,
         color: 'white', 
         // callback: function (value: number) {
         //   const seconds = Math.floor(value);
         //   return seconds.toString();
         // },
       },
     },
     y: {
       display: true,

       ticks: {
         reverse: true,
         color: 'white', 

       },
     },
     
   },
   elements: {
     bar: {
       borderRadius: 10, 
     }}
 };

 const data6 = {
   labels: [
     'VER-PER',
     'HAM-RUS',
     'NOR-PIA',
     'ZOU-BOT',
     'RIC-TSU',
     'GAS-OCO',
     'SAR-ALB',
     'LEC-SAN',
     'ALO-STR',
     'HUL-MAG',

   ],
   datasets: [
     {
       label: 'Lap Times',
       data: [
         0.230, 
         0.255, 
         0.405,
         0.505, 
         0.610, 
         0.735,
         1.255, 
         1.277, 
         1.900,
         2.105, 
       ],
       
   backgroundColor: [
     'red',
     'lime',
     'teal',
     'blue',
     'purple',
     'orange',
     'pink',
     'green',
     'yellow',
     'brown',
   ]
     },
   ],
   
 };  
 export const chartOptions4 = {
   responsive: true,
   maintainAspectRatio: false,
   indexAxis: 'y', 
   plugins: {
     legend: 
     {
       display:false
     },
     title: {
       display: true,
       text: 'Qualiy Q3 GAP',
       color: 'white',
       font: {
         size: 28,
       },
   },
     datalabels: {
       font: {
         size: 24,
       },
       color: '#FFFFFF',
      //  formatter: (value:any, context:any) => {
      //    if (context.dataIndex === 0) {
      //      return '';
      //    }
      //    return value;
      //  },
     },
   },
   scales: {
     x: {
       display: true,
       title: {
         display: false,
         text: 'Lap Time (seconds)',
        },
        
        ticks: {
         stepSize: 0.5,
         font: {
           size: 24,
         },
         beginAtZero: true,
         autoSkip: false,
         color: 'white', 
         // callback: function (value: number) {
         //   const seconds = Math.floor(value);
         //   return seconds.toString();
         // },
       },
     },
     y: {
       display: true,

       ticks: {
         reverse: true,
         color: 'white', 
        
         font: {
           size: 24,
         },
       },
     },

   },
   elements: {
     bar: {
       borderRadius: 10, 
     }}
 };

 const data4 = {
 "labels": [
     "leclerc",
     "vettel",
     "hamilton",
     "bottas",
     "max_verstappen",
     "kevin_magnussen",
     "sainz",
     "grosjean",
     "raikkonen",
     "norris"
 ],
 "datasets": [
     {
         "label": "Gaps to First",
         "data": [
             0.0,
             0.294,
             0.324,
             0.39,
             0.886,
             0.891,
             0.947,
             1.149,
             1.156,
             1.177
         ]
     }
 ]
}

     const data = {
     labels: [1,2],
     datasets:  [
       {
         label: 'Verstappen',
         data: [15, 14],
       },
       {
         label: 'Perez',
         data: [5, 3],
       },
       {
         label: 'Hamilton',
         data: [8, 10],
       },
       {
         label: 'Norris',
         data: [11, 9],
       },
       {
         label: 'Ricciardo',
         data: [1, 6],
       },
       {
         label: 'Leclerc',
         data: [17, 15],
       },
       {
         label: 'Sainz',
         data: [3, 5],
       },
       {
         label: 'Vettel',
         data: [9, 11],
       },
       {
         label: 'Stroll',
         data: [10, 8],
       },
       {
         label: 'Ocon',
         data: [16, 20],
       },
       {
         label: 'Alonso',
         data: [12, 7],
       },
       {
         label: 'Gasly',
         data: [6, 1],
       },
       {
         label: 'Tsunoda',
         data: [4, 12],
       },
       {
         label: 'Raikkonen',
         data: [19, 13],
       },
       {
         label: 'Giovinazzi',
         data: [13, 2],
       },
       {
         label: 'Latifi',
         data: [14, 19],
       },
       {
         label: 'Russell',
         data: [20, 16],
       },
       {
         label: 'Schumacher',
         data: [7, 18],
       },
       {
         label: 'Mazepin',
         data: [18, 17],
       },
       {
         label: 'Bottas',
         data: [2, 4],
       },
     ]
   };