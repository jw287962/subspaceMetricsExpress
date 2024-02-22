// server.js

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
const parseData = require('./parseData')

const filePath = './data.json';
app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

  app.get('/', async (req, res) => {
    try {
      const jsonData = await readJsonData();
      res.render('index', { 
        nodeDisplayData: jsonData.nodeDisplayData, 
        farmerDisplaySector: jsonData.farmerDisplaySector 
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


let timeToRefresh = config.Refresh



// MAIN FUNCTION
const getAllData = async function () {
   
    try {
        
        let nodeProcessArr = await parseData.getProcessState("node", config.Node, config.Node);
        // console.log('test',nodeProcessArr) this sends the metrics base data


        const nodeIsRunningOk = nodeProcessArr[1];
        // console.log(nodeIsRunningOk) IS BOOLEAN
        const nodeMetricsRaw = nodeProcessArr[0];
        let nodeDisplayData
        if(nodeIsRunningOk === true){
            const parsedNodeDataArr = parseData.parseMetricsToObj(nodeMetricsRaw);
            const nodeMetricsArr = parseData.getNodeMetrics(parsedNodeDataArr);
             nodeDisplayData = guiCliHelper.getNodeDisplayData(nodeMetricsArr, nodeIsRunningOk,config.Node);
    
        }else{
            nodeDisplayData = guiCliHelper.getNodeDisplayData()
        }
      
        const farmersArrIp = config.Farmers;
        const farmerDisplaySector = [];
        let statusDownTotal = ""
        for (const farmer of farmersArrIp) {
            let farmerProcessArr = await parseData.getProcessState("farmer", farmer, farmer);
           
            // console.log(farmerProcessArr)
            const farmerMetricsRaw = farmerProcessArr[0];
            const farmerIsRunning = farmerProcessArr[1];

           if (farmerIsRunning === true){
              // console.log('metrics', farmerMetricsRaw)
              const parsedFarmerDataArr = parseData.parseMetricsToObj(farmerMetricsRaw);
              const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr,farmer,farmerIsRunning);
              farmerDisplaySector.push(farmerSectorPerformance);
            }else if(farmerIsRunning === false){
              statusDownTotal += farmerMetricsRaw + '\n'
                const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr= [],farmer,farmerIsRunning);
                farmerDisplaySector.push(farmerSectorPerformance);
            }
        }
        console.log(statusDownTotal)
        if(statusDownTotal.length != 0) {
          try {
            // console.log('status offline')
            parseData.sendTelegramNotification(statusDownTotal)
            // await this.sendTelegramNotification(alertText);
        } catch (error) {
            console.error('Error sending Telegram notification:', error);
        }
        }
        
        const currentDate = moment();

        // FILE OUTPUT
        const displayData = { nodeDisplayData, farmerDisplaySector}
        const jsonData = JSON.stringify(displayData);
        fs.writeFileSync(filePath, jsonData);

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
    // Call getAllData immediately
refreshInterval = setInterval(() =>{
      if(clearLog) clear();
        process.stdout.clearLine()
        getAllData()
     }, (config.Refresh+1)*1000)


// Call getAllData at intervals defined by config.Refresh (in seconds)