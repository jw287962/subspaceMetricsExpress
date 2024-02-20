// server.js
const express = require('express');
const config = require('./config.json')
const axios = require('axios')
const fs = require('fs');
// const fs = require('fs').promises;
const cors = require('cors')
const app = express();
const clear = require('console-clear')
const moment = require('moment');
const { error } = require('console');

const parseData = require('./parseData')

const filePath = './data.json';


app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.get('/api/data', (req, res) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      try {
        const jsonData = JSON.parse(data);
      console.log('send ')

        res.json(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ error: 'Error parsing JSON' });
      }
    });
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const functions = {
   guiLogger: function guiLogger(message) {
        console.log(message);
    },
    getHostUser: function getHostUser(index){
        switch (index) {
            case 1:
                return "ROG STRIX Jas";
            case 2:
                return "Windows RogStrix";
            default:
               return "AMD 7950X";
        }
    },

    formatTime: function formatTime(seconds) {
        const duration = moment.duration(seconds, 'seconds');
        const minutes = Math.floor(duration.asMinutes());
        const remainingSeconds = duration.seconds();
        return `${minutes} min: ${remainingSeconds} sec`;
    },

    convertSecondsDays: function convertSecondsDays(seconds){
        try{
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
        
            const formattedTime = `${days}D ${hours}H ${minutes}M ${remainingSeconds}S`;
            return formattedTime;
        
        }catch(err){
            console.log('Error: convertSecondsDays', err)
        }
       
    },

    getNodeDisplayData: function getNodeDisplayData(nodeMetricsArr = [],nodeIsRunningOk = false,nodeIp = '0.0.0.0'){
        try{

            if(!nodeIsRunningOk){
                const nodeDisplayData = {nodeSyncState: "", nodePeersConnected: ""}
                nodeDisplayData.nodeSyncState = 'N/A'
                nodeDisplayData.nodePeersConnected= 'N/A'
                nodeDisplayData.nodeIp = nodeIp 
                nodeDisplayData.nodeIsRunningOk = nodeIsRunningOk 
                return nodeDisplayData;
            }else{
                const nodeDisplayData = {nodeSyncState: "", nodePeersConnected: ""}
                nodeDisplayData.nodeSyncState = nodeMetricsArr[0].Sync.State
                nodeDisplayData.nodePeersConnected= nodeMetricsArr[0].Peers.Connected 
                nodeDisplayData.nodeIp = nodeIp 
                nodeDisplayData.nodeIsRunningOk = nodeIsRunningOk
                return nodeDisplayData;
            }
        }catch(err){
            console.log('getNodedisplayData Error', error)
        }
    
    },

    
diskPlotETA: function diskPlotETA(remaining_sectors,minutes_per_sector_data_disp){
    try{
        if (minutes_per_sector_data_disp !== "-") {
            let eta = (((parseFloat(minutes_per_sector_data_disp) * 1*remaining_sectors)) / (60*24)).toFixed(2);
            return eta.toString();
        }}catch(err){
            console.log('DiskPlotETA err ', err)
        }
},

    discDataMetrics: function discDataMetrics(farmer,minPerSector,index){

        const discDataMetrics = (farmer.PlotsCompleted[index].Sectors*1+1*farmer.PlotsRemaining[index].Sectors)/100
        const completePercent = ((farmer.PlotsCompleted[index].Sectors)/discDataMetrics).toFixed(2)
        const ETA = functions.diskPlotETA(farmer.PlotsRemaining[index].Sectors,minPerSector,index)
        return {discDataMetrics,completePercent,ETA}
    },
    getFarmerTableHeaderOutput: function getTableHeader(){
        try{
            let label =`|${'Disk Id'.padEnd(27)}|${'Size(TB)'.padEnd(8)}|`
            label += `${'% Comp'.padEnd(8)}|${'ETA(Days)'.padEnd(7)}|`
            label += `${'Sectors/Hr'.padEnd(8)}|${'Min/Sector'.padEnd(8)}|${'Reward|Miss'.padEnd(8)}|`;
            return label;
        }catch(err){
            console.log('getFarmerTableHeaderOutput err ',err)
        }
    },
    getFarmerPCStatusOutput: function getTableName(farmer,currentUser){
        let holder = ""
        holder += `${this.dasher}\n`;
        holder += `\x1b[96m ${currentUser} Status: ${farmer.farmerIsRunning === true ? '\x1b[92mRunning\x1b[0m' : '\x1b[31mStopped\x1b[0m'}, `;
        holder += `\x1b[96mHostname: \x1b[93m${farmer.farmerIp}\x1b[0m, `;
        this.guiLogger(holder)
    },
    getFarmerPCMetricsOutput: function getTable(disk_sector_perf,farmerId){
        let sectorHr = (disk_sector_perf.TotalSectors/disk_sector_perf.Uptime*3600).toFixed(2)
        let upTime = this.convertSecondsDays(disk_sector_perf.Uptime);
        let sectorTime = this.formatTime(60/sectorHr*60);
        let sectorHrAvg = (sectorHr/(farmerId.length)).toFixed(2)
        let rewards = disk_sector_perf.TotalRewards;

      return {sectorHr,sectorTime,sectorHrAvg,upTime,rewards}
       
    },
    printsFarmerPCmetricsOutput: function printsFamerPCmetricsOutput(data){
        let farmerString2 ="";
        farmerString2 += `Uptime: ${data.upTime} | `;
        farmerString2 += `Sector Time: ${data.sectorTime}|`
        farmerString2 += `Sectors/Hr (avg): ${data.sectorHrAvg} | `
        farmerString2 += `Rewards: ${data.rewards } | `;
        this.guiLogger(farmerString2)

    },
    sendTelegramPCmetrics: function sendTelegramPCmetrics(data){
        let outputTelegram = "";
        outputTelegram += ` <b>${this.convertSecondsDays(data.upTime)}</b> Uptime, `						
        outputTelegram += `\n   <b>${data.sectorTime}</b> Sector Time, `		
        outputTelegram += `\n   <b>${data.sectorHr}</b> Sectors Total, `
        outputTelegram += `\n   <b>${data.sectorHrAvg}</b> Sectors/Hour (avg/disk), `				
        outputTelegram += `\n   <b>${data.rewards}</b> Total Rewards`

        return outputTelegram
    },
    dasher: "------------------------------------------------------------------------------------------",
    displayData: function displayData(data, dateLastOutput) {
        clear();
        let outputTelegram = ""
        let nodeString = '';

        let dasher= this.dasher;
    
        nodeString += `\x1b[96mNode Status: ${data.nodeDisplayData.nodeIsRunningOk === true ? '\x1b[92mRunning\x1b[0m' : '\x1b[31mStopped\x1b[0m'}, `;
        nodeString += `\x1b[96mHostname: \x1b[93m${data.nodeDisplayData.nodeIp}, \x1b[0m`;
        nodeString += `\x1b[96mSynced: ${data.nodeDisplayData.nodeSyncState === '0' ? '\x1b[92mYes\x1b[0m' : '\x1b[31mNo\x1b[0m'}, `;
        nodeString += `\x1b[96mPeers: \x1b[93m${data.nodeDisplayData.nodePeersConnected},\x1b[0m`;
        this.guiLogger(nodeString);
        this.guiLogger(dasher);
        try{
            data.farmerDisplaySector.forEach((farmer1,indexxx) => {
                if(indexxx > 0) outputTelegram += "\n\n"
        
               let currentUser = this.getHostUser(indexxx);
               outputTelegram += currentUser;

                farmer1.forEach((farmer) => {
                        // Farmerstring2 is group status  2nd row (uptime, sector time, rewards for entire PC)
                         // PC status 1st LINE of data
                    this.getFarmerPCStatusOutput(farmer,currentUser) // PC status 1st LINE

                         // PC METRICS & DATA 2nd LINE
                    data = this.getFarmerPCMetricsOutput(farmer.Performance.disk_sector_perf,farmer.Id) // PC METRICS & DATA 2nd LINE
                    this.printsFarmerPCmetricsOutput(data)
                          // send telegram notification too
                    this.sendTelegramPCmetrics(data)
            
                    this.guiLogger(dasher);
                          // TABLE HEADER TEXT
                    this.guiLogger(this.getFarmerTableHeaderOutput())
                    this.guiLogger(dasher);

                        // INDIVIDUAL TABLE DISK DATA 
                    farmer.Performance.forEach((data,index) => {
                        let dataString = ""
                        const discData = this.discDataMetrics(farmer,data.MinutesPerSector,index);
                        dataString += `|${farmer.Id[index].Id.padEnd(27)}|${discData.discDataMetrics.toString().padEnd(8)}|`
                        dataString += `${discData.completePercent.toString().padEnd(8)}|`
                        dataString += `${discData.ETA.toString().padEnd(8)} `;
                        dataString += `|${data.SectorsPerHour.toString().padEnd(10)}|${data.MinutesPerSector.toString().padEnd(10)}`
                        dataString += `|${(farmer.Rewards[index]?.Rewards.toString()|| '0').padEnd(6)}|${'0'.padEnd(4)}|` 
                        this.guiLogger(dataString)
                    })
                  })    
            })
            this.guiLogger(dasher+ '\n');
            parseData.sendTelegramNotification(outputTelegram)
            // 1000 milliseconds = 1 second
            
            this.guiLogger((`\x1b[93m Last saved to: ${filePath} \x1b[92m ${dateLastOutput.format('YYYY-MM-DD HH:mm:ss')} \x1b[0m  \n` ));


            setTimeout(() => {
            countdownToRefresh();
            }, 2000); 

        }catch(error){
                console.log('error displayData',error);
        }
        
        
    },
    countdownToRefresh: function countdownToRefresh() {
        timeToRefresh--;
        loader = '';
        switch(timeToRefresh%4){
            case 0:{
                loader='—'
                break
            } 
            case 1:{
                loader='/'
                break
            } 
            case 2:{
                loader="|";
                break
            } 
            default:{
                loader= '\\'
                break;
            }
        }
      
            if (timeToRefresh < 1) {
                // Trigger data refresh when countdown reaches 0
                process.stdout.clearLine();
                timeToRefresh = config.Refresh
                return;
            } else {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(` ${loader} Refreshing in ${timeToRefresh} seconds`);
                
                setTimeout(countdownToRefresh, 1000); // Update countdown every second
            }
        }
}    
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
             nodeDisplayData = functions.getNodeDisplayData(nodeMetricsArr, nodeIsRunningOk,config.Node);
    
        }else{
            nodeDisplayData = functions.getNodeDisplayData()
        }
      
        const farmersArrIp = config.Farmers;
        const farmerDisplaySector = [];

        for (const farmer of farmersArrIp) {
            let farmerProcessArr = await parseData.getProcessState("farmer", farmer, farmer);
            // console.log(farmerProcessArr)
            const farmerMetricsRaw = farmerProcessArr[0];
            const farmerIsRunning = farmerProcessArr[1];
            if(farmerIsRunning === false){
                const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr= [],farmer,farmerIsRunning);
                farmerDisplaySector.push(farmerSectorPerformance);
            }else{
                // console.log('metrics', farmerMetricsRaw)
                const parsedFarmerDataArr = parseData.parseMetricsToObj(farmerMetricsRaw);
                const farmerSectorPerformance = await parseData.getDiskSectorPerformance(parsedFarmerDataArr,farmer,farmerIsRunning);
                farmerDisplaySector.push(farmerSectorPerformance);

            }
        }
        const currentDate = moment();

        // FILE OUTPUT
        const displayData = { nodeDisplayData, farmerDisplaySector}
        const jsonData = JSON.stringify(displayData);
        fs.writeFileSync(filePath, jsonData);

        // CONSOLE OUTPUT
        functions.displayData(displayData, currentDate)

// Get the current date and format it

  

        return filePath;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error for proper error handling
    }
};




// MAIN FUNCTION: GETALLDATA
getAllData()
    // Call getAllData immediately
refreshInterval = setInterval(() =>{
        process.stdout.clearLine()
        getAllData()
     }, (config.Refresh+1)*1000)


// Call getAllData at intervals defined by config.Refresh (in seconds)