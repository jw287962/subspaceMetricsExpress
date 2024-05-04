// server.js
const PORT = 3000
const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

const config = require('./config.json')
const fs = require('fs');
const moment = require('moment');

// console clear
const clear = require('console-clear')
const clearLog = config.Clear ;

// MY JS
const guiCliHelper = require('./guiCliHelper')
const {parseData,nodeSubstrate} = require('./parseData');
const { setTimeout } = require('timers/promises');
const filePath = './data.json';

let balance = 0;


app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


let refreshInterval;
app.use(cors({
    origin: 'http://localhost:5173'
  }));

// Function to read JSON data from file
async function readJsonData() {
  try {
    const data = await fs.promises.readFile('data.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing JSON data:', error);
    throw error; // Re-throw the error to handle it in the route handlers
  }
}



app.get('/api/data', async (req, res) => {
  try {
    const jsonData = await readJsonData();
    res.json(jsonData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
  });

app.get('/api/refresh', async (req , res) => {
    try{
      res.json(refreshMetricsData());
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.get('/', async (req, res) => {
    try {
      const jsonData = await readJsonData();
      let toggle = Array.apply(null, Array(5)).map(function () {return false})

      res.render('index', { 
        nodeDisplayData: jsonData.nodeDisplayData, 
        farmerDisplaySector: jsonData.farmerDisplaySector,
        walletBalance: jsonData.walletBalance,
        updateStatus: '',
        timeToRefresh: guiCliHelper.timeToRefresh,
        resetTimer: jsonData.timer*60*1000,
        toggle
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(PORT, () => {
  try{
    console.log('Server running on port 3000');
  }catch(err){
    console.log('https err, ', err)
  }
});

// let timeToRefresh = config.Refresh

  // refreshData & refreshIntervalTimer
  async function refreshMetricsData(){
    refreshInterval.reset()
      // refreshInterval = setInterval(refreshInterval,)
    await getAllData()
      const jsonData = await readJsonData();
      
        return jsonData
    
  }
  async function delay(ms) {
  return new Promise((resolve) => {
      setTimeout(() => {
        resolve("0");
      }, ms);
    });
    
}
// MAIN FUNCTION
const getAllData = async function () {
  if(clearLog) clear();
  process.stdout.clearLine()
            nodeSubstrate.fetchWalletbalance(PORT).then((val) => {
              balance = val
            }).catch((err) => {
              console.log('error')
                balance = 0

            });

          // console.log(await delay(100))
      
    try {
      let nodeDisplayData = []

      for (let i =0; i < config.Node.length;i++){

        let nodeProcessArr = await parseData.getProcessState("node", config.Node[i], config.Node[i]);


        const nodeIsRunningOk = nodeProcessArr[1];
        const nodeMetricsRaw = nodeProcessArr[0];
        if(nodeIsRunningOk === true){
            const parsedNodeDataArr = await parseData.parseMetricsToObj(nodeMetricsRaw);
            const nodeMetricsArr = await parseData.getNodeMetrics(parsedNodeDataArr);
             nodeDisplayData.push(guiCliHelper.getNodeDisplayData(nodeMetricsArr, nodeIsRunningOk,config.Node[i]))

    
        }else{
            nodeDisplayData.push(guiCliHelper.getNodeDisplayData())
        }
      }
      
        const farmersArrIp = config.Farmers;
        const namesArr = config.Names;
        
        const farmerDisplaySector = [];
        let statusDownTotal = ""
        // for (const farmer of farmersArrIp)
        for (let i =0; i < farmersArrIp.length;i++)
         {
          
            let farmer = {address:  farmersArrIp[i], name: namesArr[i] || "Unknown"}
            let farmerProcessArr = await parseData.getProcessState("farmer", farmer.address, farmer.address);
           
            // console.log(farmerProcessArr)
            const farmerMetricsRaw = farmerProcessArr[0];
            const farmerIsRunning = farmerProcessArr[1];
           if (farmerIsRunning === true){
              // console.log('metrics', farmerMetricsRaw)
              const parsedFarmerDataArr = parseData.parseMetricsToObj(farmerMetricsRaw);
              const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr,farmer.address,farmerIsRunning,farmer.name);

              farmerDisplaySector.push(farmerSectorPerformance);
              if(farmerSectorPerformance?.SummaryData?.Uptime?.Seconds <= 1 && farmerMetricsRaw?.length <= 50){
                statusDownTotal += farmerMetricsRaw + '\n'
              }
            }else if(farmerIsRunning === false){
              statusDownTotal += farmerMetricsRaw + '\n'
                const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr= [],farmer.address,farmerIsRunning, farmer.name);
                farmerDisplaySector.push(farmerSectorPerformance);
            }
        }
        if(statusDownTotal.length != 0) {
          try {
            guiCliHelper.guiLogger(statusDownTotal)
            // console.log('status offline')
            parseData.sendTelegramNotification(statusDownTotal)
            // await this.sendTelegramNotification(alertText);
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
        }
        }
        
        const currentDate = moment();

        // FILE OUTPUT
        const timer = (config.Refresh+1)
        const displayData = { nodeDisplayData, farmerDisplaySector, walletBalance: balance,timer}
        const jsonData = JSON.stringify(displayData);
        // fs.writeFileSync(filePath, jsonData);
        let fd = 0;
        try {
           fd = fs.openSync( filePath, 'w', 0o666  );  
           let writen = fs.writeSync( fd, jsonData, 0, 'utf8' );
        } catch ( e ) {
        } finally {
           if ( fd )
             fs.closeSync(fd);
        }
        // CONSOLE OUTPUT
        guiCliHelper.displayData(displayData, currentDate)

// Get the current date and format it

  

        return filePath;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error for proper error handling
    }
};




// MAIN FUNCTION: GETALLDATA
if(clearLog) clear();
getAllData()

refreshInterval = new refreshMetricsObject()
function refreshMetricsObject(){

  function intervalRefresherFunction(){

    // console.log('Server running on port 3000');
    getAllData()
  } 
  let refreshInterval = setInterval(intervalRefresherFunction, (config.Refresh+1)*1000);

 
  this.reset = function(){
    clearInterval(refreshInterval);
    
    refreshInterval = setInterval(intervalRefresherFunction, (config.Refresh+1)*1000);

  }


}
