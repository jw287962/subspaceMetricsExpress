
const moment = require('moment');
const parseData = require('./parseData')
const config = require('./config.json')



const filePath = './data.json';
let timeToRefresh = config.Refresh





const guiCliHelper = {
    guiLogger: function guiLogger(message) {
         console.log(message);
     },
    //  getHostUser: function getHostUser(index){
    //      switch (index) {
    //          case 1:
    //              return "5800x Rog J";
    //          case 2:
    //              return "5800x Rog W";
    //          default:
    //             return "AMD 7950X";
    //      }
    //  },
     checkGitVersion: async function CheckGitNewVersion() {
        try {
            const gitVersionArr = [];
            const response = await fetch("https://api.github.com/repos/subspace/subspace/releases/latest");
            if (response.ok) {
                const gitVersionCurrObj = await response.json();
                if (gitVersionCurrObj) {
                    gitVersionArr.push(gitVersionCurrObj.tag_name);
                    const gitNewVersionReleaseDate = new Date(gitVersionCurrObj.published_at);
                    gitVersionArr.push(gitNewVersionReleaseDate.toLocaleString());
                }
            }
            return gitVersionArr;
        } catch (error) {
            console.error("Error fetching Git version:", error);
            return [];
        }
    },    
 
     formatTime: function formatTime(seconds) {
        const duration = moment.duration(seconds, 'seconds');
        const minutes = Math.floor(duration.asMinutes());
        const remainingSeconds = duration.seconds();
    
        // Add leading zero if the number is less than 10
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    
        return `${this.replaceWithDash(formattedMinutes)}:${this.replaceWithDash(formattedSeconds)}`;
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
             console.log('getNodedisplayData Error', err)
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
 
     discDataMetrics: function discDataMetrics(farmer,minPerSector){
         const discDataMetrics = (farmer.PlotsCompleted.Sectors*1+1*farmer.PlotsRemaining.Sectors)/1000
         const completePercent = ((farmer.PlotsCompleted.Sectors/10)/discDataMetrics).toFixed(2)

         const ETA = this.diskPlotETA(farmer.PlotsRemaining.Sectors,minPerSector)

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

    //  line1 & PRINT
     getFarmerPCStatusOutput: function getTableName(farmer){
         let holder = ""
         holder += `${this.dasher}\n`;
         holder += `\x1b[96m${farmer.Name} \x1b[96mStatus:`
        //  display uptime if it's running, otherwise display STOPPED 
         if(farmer.FarmerIsRunning === true)
            holder +=`\x1b[92m✔ ${farmer.Uptime.FormattedTime} \x1b[0m`
         else
             holder +=`\x1b[31m❌ STOPPED\x1b[0m'}`
             holder += `\x1b[96mHostname: \x1b[93m${farmer.FarmerIp}\x1b[0m, `;

         this.guiLogger(holder)
     },

     replaceWithDash: function replaceWithDash(string){
         if(isNaN(string)){
             return '-'
            }else{
                return string
            }
            
        },
        //  line2 DATA OBJECT
         getFarmerPCMetricsOutput: function getTable(summaryData){
            try{
                let upTime = summaryData.Uptime.FormattedTime
                let sectorHr = (summaryData.TotalSectorsPerHour).toFixed(2)
                let totalSectorTime = summaryData.TotalSectorTime.formattedSectorTime;
                let sectorHrAvg = ((sectorHr)/(summaryData.TotalDisks)).toFixed(2)
                let rewards = summaryData.TotalRewards;
                let totalSize = summaryData.TotalDiskSize
                let totalETA = summaryData.TotalETA
                let totalPercentComplete = summaryData.TotalPercentComplete
                let totalRewardsPerHour = summaryData.TotalRewardsPerHour
              return {totalRewardsPerHour,totalPercentComplete,totalETA,sectorHr,totalSectorTime,sectorHrAvg,upTime,rewards,totalSize}
               
            }catch(err){
                console.log('getFarmerPCMetrics error ', err)
            }
           
         },
    //   LINE 2 PRINT
     printsFarmerPCmetricsOutput: function printsFarmerPCmetricsOutput(data){
         let farmerString2 ="";
         farmerString2 += `|\x1b[92mSector\x1b[93m Time: \x1b[0m${data.totalSectorTime} `
         farmerString2 += `\x1b[0m|\x1b[93m${this.replaceWithDash(data.sectorHr)}\x1b[0m Sectors per Hr `
         farmerString2 += `|\x1b[92mRewards: \x1b[93m${data.rewards} \x1b[0mtotal, \x1b[93m${data.totalRewardsPerHour}\x1b[0m per Hr, \x1b[93m${(data.totalRewardsPerHour*24).toFixed(2)} \x1b[0mper Day\x1b[49m |\n`;
         farmerString2 += `|\x1b[0mRemain: \x1b[93m${data.totalETA} \x1b[0m`;
         farmerString2 += `|\x1b[93m${data.totalPercentComplete}%\x1b[0m Complete\x1b[49m `;
         farmerString2 += `|\x1b[93m${data.totalSize }\x1b[0mTiB `;
         farmerString2 += `|`;
         
         this.guiLogger(farmerString2)
     },
     sendTelegramPCmetrics: function sendTelegramPCmetrics(data){
         let outputTelegram = "";
         outputTelegram += ` <b>${data.upTime}</b> Uptime, `						
         outputTelegram += `\n   <b>${data.totalSectorTime}</b> Sector Time, `		
         outputTelegram += `\n   <b>${data.sectorHr}</b> Sectors Total, `
         outputTelegram += `\n   <b>${data.rewards}</b> Total Rewards`
         outputTelegram +=  `\n   <b>${data.totalPercentComplete}%</b>  Complete \n`
         return outputTelegram
     },
     dasher: "------------------------------------------------------------------------------------------",
     displayData: function displayData(data, dateLastOutput) {
         let outputTelegram = ""
         let nodeString = '';
 
         let dasher= this.dasher;
     
         nodeString += `\x1b[96mNode Status: ${data.nodeDisplayData.nodeIsRunningOk === true ? '\x1b[92mRunning\x1b[0m' : '\x1b[31mStopped\x1b[0m'}, `;
         nodeString += `\x1b[96mHostname: \x1b[93m${data.nodeDisplayData.nodeIp}, \x1b[0m`;
         nodeString += `\x1b[96mSynced: ${data.nodeDisplayData.nodeSyncState === '0' ? '\x1b[92mYes\x1b[0m' : '\x1b[31mNo\x1b[0m'}, `;
         nodeString += `\x1b[96mPeers: \x1b[93m${data.nodeDisplayData.nodePeersConnected},\x1b[0m`;
         this.guiLogger(nodeString);
         try{

            
             data.farmerDisplaySector.forEach((farmer,indexxx) => {
                 if(indexxx > 0) outputTelegram += "\n\n"


                // if(Array.isArray(farmer)){

                    outputTelegram += farmer.Name;;
                     currentUser = "Name: \x1b[0m" + farmer.Name;
                     
                     // Farmerstring2 is group status  2nd row (uptime, sector time, rewards for entire PC)
                     // PC status 1st LINE of data
                     this.getFarmerPCStatusOutput(farmer.SummaryData) // PC status 1st LINE
                     if(farmer.SummaryData.FarmerIsRunning){
                          // PC METRICS & DATA 2nd LINE
                     dataOutput = this.getFarmerPCMetricsOutput(farmer.SummaryData,farmer.Id) // PC METRICS & DATA 2nd LINE
                     this.printsFarmerPCmetricsOutput(dataOutput)
                           // send telegram notification too
                    outputTelegram += this.sendTelegramPCmetrics(dataOutput)
             
                     this.guiLogger(dasher);
                           // TABLE HEADER TEXT
                     this.guiLogger(this.getFarmerTableHeaderOutput())
                     this.guiLogger(dasher);
                         // INDIVIDUAL TABLE DISK DATA 
                         for (key in farmer.IndividualDiskDataObj){
                        let dataString = ""
                            const data = farmer.IndividualDiskDataObj[key] ;
                        //  will add a grouping of all disk data in parsing
                        //  const discData = this.discDataMetrics(data,data?.Performance.MinutesPerSector);
                         dataString += `|${data.Id.padEnd(27)}|${data.Data.DiskSize.toString().padEnd(8)}|`
                         dataString += `${data.Data.CompletePercent.toString().padEnd(8)}|`
                         dataString += `${data.Data.ETA.toString().padEnd(8)} `;
                         dataString += `|${(data?.Performance.SectorsPerHour|| 'N/A').toString().padEnd(10) }|${(data?.Performance.MinutesPerSector || 'N/A').toString().padEnd(10)}`
                         dataString += `|${(data.Rewards.Rewards.toString()|| '0').padEnd(6)}|${(data?.Misses?.Misses || '0').toString().padEnd(4)}|` 

                         this.guiLogger(dataString)
                     }
                    }else{
                        
                    }
                // }
             })
            

             this.checkGitVersion().then((data) =>{
             let gitVersion

                const hoursDifference = dateLastOutput.diff(moment(data[1], 'M/D/YYYY, h:mm:ss A'), 'hours');
                if(hoursDifference < 10){
                    gitVersion = `<b>${data[0]} ${data[1]}</b>`;
                    this.guiLogger(`\x1b[31m[1m${gitVersion} \n\x1b[0m`);
                }else{
                 gitVersion = `${data[0]} ${data[1]}`;
                }
                this.guiLogger(`\x1b[1m${gitVersion} \n\x1b[0m`);

                outputTelegram += `Released: ${data[0]}`
                parseData.sendTelegramNotification(outputTelegram)
             })

             this.guiLogger(dasher);
             
            
            
             // 1000 milliseconds = 1 second
             this.guiLogger((`\x1b[93m Last saved to: ${filePath} \x1b[92m ${dateLastOutput.format('YYYY-MM-DD HH:mm:ss')} \x1b[0m  \n` ));
 

 
             setTimeout(() => {
             this.countdownToRefresh();
             }, 2000); 
 
         }catch(error){
                 console.log('error displayData',error);
         }
         
         
     },
     countdownToRefresh: function countdownToRefresh() {
        try{
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
                 
                 setTimeout(() => this.countdownToRefresh(), 1000); // Update countdown every second
             }
        }catch(err){
            console.log('countDownToRefersh error ', err)
        }
    }
    
 }    

 module.exports = guiCliHelper