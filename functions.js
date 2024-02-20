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







const helper = {
    pingMetricsUrl:  async function pingMetricsUrl(ioUrl) {
        let responseText;

        const fullUrl = `http://${ioUrl}/metrics`;
    
        try {
            const response = await fetch(fullUrl, { method: 'GET',mode: 'no-cors'});
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else 
            if (response) {
				responseText = (await response.text()).toString()
			}
            
        } catch (error) {
            console.error('Error fetching data:', 'Offline');
        }
        // console.log('response', responseText)
        return responseText;
    },

    // pingNodeURL: async function pingNodeURL(url) {
    //     try {
    //         const nodeData = await this.pingMetricsUrl(url);
    //         console.log('node Data', nodeData); // Handle the response data
    //         return nodeData;
    //     } catch (error) {
    //         console.error('Error:', error); // Handle any errors
    //         throw error; // Rethrow the error to handle it in the calling code
    //     }
    // },

    getProcessState: async function getProcessState(ioProcessType, ioHostIp, ioHostname) {
        const respProcessStateArr = [];
    
        let bProcessRunningState = false;
    
        // Get process state, send notification if process is stopped/not running
        try {
            
            const resp = await this.pingMetricsUrl(ioHostIp); // Assuming pingMetricsUrl is already defined
            if (resp == undefined) {
                const alertText = `${ioProcessType} status: Stopped, Hostname: ${ioHostname}`;
                try {
                    console.log('status offline')
                    await this.sendTelegramNotification(alertText);
                } catch (error) {
                    console.error('Error sending Telegram notification:', error);
                }
                bProcessRunningState = false;
            } else {
                bProcessRunningState = true;
            }
    
            respProcessStateArr.push(resp);
            // console.log(resp)
            respProcessStateArr.push(bProcessRunningState);
        } catch (error) {
            console.error('Error fetching process state:', error);
            // Handle the error accordingly
        }
    
        return respProcessStateArr;
    },
    

    parseMetricsToObj: function parseMetricsToObj(ioRestStr) {
        try{
            const restArr = ioRestStr.split("# HELP");
        const responseMetrics = [];
    
        for (let i = 0; i < restArr.length; i++) {
            const partArr = restArr[i].split("\n");
            const help = partArr[0];
            const type = partArr[1];
    
            for (let j = 2; j < partArr.length; j++) {
                let criteria = "";
                const part = partArr[j].toString().trim();
    
                if (j === 2 && part.toLowerCase().indexOf(" unit ") < 0 && part.trim() !== "" && part.toLowerCase().indexOf("eof") < 0) {
                    const valueArr = type.trim('#').split(' ');
                    const valueName = valueArr[2];
                    const labelName = valueArr[1];
                    let labelValue = null;
                    const value = valueArr[3];
    
                    const metric = {
                        Name: valueName,
                        Id: labelName,
                        Instance: labelValue,
                        Value: value
                    };
    
                    responseMetrics.push(metric);
    
                    const dataValueArr = part.split(' ');
                    const dataValueName = dataValueArr[0];
                    let dataLabelName = null;
                    let dataLabelValue = null;
                    const dataValue = dataValueArr[1];
    
                    const dataMetric = {
                        Name: dataValueName,
                        Id: dataLabelName,
                        Instance: dataLabelValue,
                        Value: dataValue
                    };
    
                    responseMetrics.push(dataMetric);
                } else if (part.trim() !== "" && part.toLowerCase().indexOf("eof") < 0) {
                    const valueArr = part.split(/[{}]/).map(item => item.trim());
                        // console.log(valueArr)
                    if (valueArr.length != 1) {
                        const valueName = valueArr[0];
                        const labelArr = valueArr[1].split("=");
                        const labelName = labelArr[0];
                        const labelValue = labelArr[1].replace(/"/g, "");
                        const value = valueArr[2];
                        criteria = labelArr[2];
    
                        const metric = {
                            Name: valueName,
                            Id: labelName,
                            Instance: labelValue,
                            Value: value,
                            Criteria: criteria
                        };
    
                        responseMetrics.push(metric);
                    } else if (part.indexOf("#") < 0) {
                        const valueArr = part.split(' ');
                        const valueName = valueArr[0];
                        let labelName = null;
                        let labelValue = null;
                        const value = valueArr[1];
    
                        const metric = {
                            Name: valueName,
                            Id: labelName,
                            Instance: labelValue,
                            Value: value
                        };
    
                        responseMetrics.push(metric);
                    } else {
                        const valueArr = part.trim('#').split(' ');
                        const valueName = valueArr[2];
                        const labelName = valueArr[1];
                        let labelValue = null;
                        const value = valueArr[3];
    
                        const metric = {
                            Name: valueName,
                            Id: labelName,
                            Instance: labelValue,
                            Value: value
                        };
    
                        responseMetrics.push(metric);
                    }
                }
            }
        }
        return responseMetrics;

        }catch(err){
            console.log('Error parseMetricstoObj ', err)
        }
        
    },
    sendTelegramNotification: async function sendTelegramNotification(message) {
        try {
        //   config.Telegram
            const response = await axios.post(config.Telegram, {
                chat_id: config.Chat_ID,
                text: `${message}`,
                parse_mode: 'HTML'
            });

            if (response.status === 200) {
                console.log(`Telegram Request was successful: Code ${response.status}`)
            } else {
                console.log(`Telegram Request failed: ${response}`)
            }

        } catch (error) {
            console.error('Error:', 'error log is off');
        }
    }
    ,

    getNodeMetrics: function getNodeMetrics(io_node_metrics_arr) {
        try{
            let resp_node_metrics_arr = [];
    
            let node_sync_obj;
            let node_peers_obj
        
            let chain_id_sync = "";
            let chain_id_peer = "";
            let node_sync_status = 0;
            let node_peer_count = 0;
        
            for (let metrics_obj of io_node_metrics_arr) {
                if (metrics_obj.Name.includes("substrate_sub_libp2p_is_major_syncing") && metrics_obj.Name.includes("chain")) {
                    node_sync_status = metrics_obj.Value;
                    chain_id_sync = metrics_obj.Instance;
                    let node_sync_info = {
                        Id: chain_id_sync,
                        State: node_sync_status
                    };
    
                    node_sync_obj = node_sync_info;
                } else if (metrics_obj.Name.includes("substrate_sub_libp2p_peers_count") && metrics_obj.Name.includes("chain")) {
                    node_peer_count = metrics_obj.Value;
                    chain_id_peer = metrics_obj.Instance;
                    let node_peer_info = {
                        Id: chain_id_peer,
                        Connected: node_peer_count
                    };
                    node_peers_obj = node_peer_info;
                }
            }
        
            let node_metrics = {
                Sync: node_sync_obj,
                Peers: node_peers_obj
            };
            resp_node_metrics_arr.push(node_metrics);
            // console.log(_resp_node_metrics_arr[0].Peers,_resp_node_metrics_arr[0].Sync)
            // console.log(_resp_node_metrics_arr)
            return resp_node_metrics_arr;
        }catch(err){
            console.log('getNodeMetrics Error', err)
        }
       
    },
    
    getDiskSectorPerformance: function GetDiskSectorPerformance(io_farmer_metrics_arr = [], farmerIp,farmerIsRunning) {
    try{
        let resp_disk_metrics_arr = [];

        let resp_UUId_arr = [];
        let resp_sector_perf_arr = [];
        let resp_rewards_arr = [];
        let resp_misses_arr = [];
        let resp_plots_completed_arr = [];
        let resp_plots_remaining_arr = [];
    
        let unit_type = "";
        let unique_farm_id = "";
        let farmer_disk_id = "";
        let farmer_disk_sector_plot_time = 0.00;
        let farmer_disk_sector_plot_count = 0;
        let total_sectors_plot_count = 0;
        let uptime_seconds = 0;
        let total_sectors_plot_time_seconds = 0;
        let total_disk_per_farmer = 0;
    
        let farmer_disk_id_rewards = "";
        let farmer_disk_proving_success_count = 0;
        let farmer_disk_proving_misses_count = 0;
        let total_rewards_per_farmer = 0;
        if(farmerIsRunning){
        
            for (let metrics_obj of io_farmer_metrics_arr) {
                if (metrics_obj.Name.indexOf("_farmer_sectors_total_sectors") >= 0 && metrics_obj.Id.indexOf("farm_id") >= 0) {
                    const plot_id = ((metrics_obj.Instance?.split(","))[0]);
                    const plot_state = metrics_obj.Criteria.trim().split('"')[1];
                    const sectors = metrics_obj.Value;
        
                    let plots_info = {
                        Id: plot_id,
                        PlotState: plot_state,
                        Sectors: sectors
                    };
                    if (plot_state.toLowerCase() == "notplotted") {
                        resp_plots_remaining_arr.push(plots_info);
                    } else if (plot_state.toLowerCase() === "plotted") {
                        resp_plots_completed_arr.push(plots_info);
                    }
                } else if (metrics_obj.Name.indexOf("_farmer_auditing_time_seconds_count") >= 0 && metrics_obj.Id.indexOf("farm_id") >= 0) {
                    uptime_seconds = metrics_obj.Value;
                    unique_farm_id = metrics_obj.Instance;
                    let farm_id_info = {
                        Id: unique_farm_id
                    };
                    resp_UUId_arr.push(farm_id_info);
                } else if (metrics_obj.Name.indexOf("_farmer_sector_plotting_time_seconds") >= 0) {
                    if (metrics_obj.Id.toLowerCase().indexOf("unit") >= 0 || metrics_obj.Id.toLowerCase().indexOf("type") >= 0) {
                        unit_type = metrics_obj.Value.toLowerCase();
                        farmer_disk_id = "";
                    } else if (metrics_obj.Id.indexOf("farm_id") >= 0) {
                        farmer_disk_id = metrics_obj.Instance;
                        if (metrics_obj.Name.toLowerCase().indexOf("sum") >= 0) { farmer_disk_sector_plot_time = parseFloat(metrics_obj.Value); }
                        if (metrics_obj.Name.toLowerCase().indexOf("count") >= 0) { farmer_disk_sector_plot_count = parseInt(metrics_obj.Value); }
                        if (farmer_disk_sector_plot_time > 0 && farmer_disk_sector_plot_count > 0) {
                            let sectors_per_hour = 0.0;
                            let minutes_per_sector = 0.0;
                            switch (unit_type) {
                                case "seconds":
                                    sectors_per_hour = ((farmer_disk_sector_plot_count * 3600) / farmer_disk_sector_plot_time).toFixed(2);
                                    minutes_per_sector = (farmer_disk_sector_plot_time / (farmer_disk_sector_plot_count * 60)).toFixed(2);
                                    total_sectors_plot_time_seconds += farmer_disk_sector_plot_time;
                                    break;
                                case "minutes":
                                    sectors_per_hour = (farmer_disk_sector_plot_count / farmer_disk_sector_plot_time).toFixed(2);
                                    minutes_per_sector = (farmer_disk_sector_plot_time / farmer_disk_sector_plot_count).toFixed(2);
                                    total_sectors_plot_time_seconds += (farmer_disk_sector_plot_time * 60);
                                    break;
                                case "hours":
                                    sectors_per_hour = (farmer_disk_sector_plot_count / (farmer_disk_sector_plot_time * 60)).toFixed(2);
                                    minutes_per_sector = ((farmer_disk_sector_plot_time * 60) / farmer_disk_sector_plot_count).toFixed(2);
                                    total_sectors_plot_time_seconds += (farmer_disk_sector_plot_time * 3600);
                                    break;
                            }
                            total_disk_per_farmer += 1;
        
                            farmer_disk_sector_plot_time = 0.00;
                            farmer_disk_sector_plot_count = 0;
        
                            let disk_sector_perf = {
                                Id: farmer_disk_id,
                                SectorsPerHour: sectors_per_hour,
                                MinutesPerSector: minutes_per_sector,
                            };
                            resp_sector_perf_arr.push(disk_sector_perf);
                        }
                    }
                } else if (metrics_obj.Name.indexOf("_farmer_sector_plotted_counter_sectors_total") >= 0) {
                    total_sectors_plot_count = parseInt(metrics_obj.Value);
                } else if (metrics_obj.Name.indexOf("_farmer_proving_time_seconds") >= 0) {
                    if (metrics_obj.Id.toLowerCase().indexOf("unit") >= 0 || metrics_obj.Id.toLowerCase().indexOf("type") >= 0) {
                        farmer_disk_id_rewards = "";
                    } else if (metrics_obj.Id.indexOf("farm_id") >= 0 && metrics_obj.Name.toLowerCase().indexOf("count") >= 0) {
                        let farmer_id = metrics_obj.Instance.split(",");
                        farmer_disk_id_rewards = farmer_id[0];
                        if (metrics_obj.Criteria.toLowerCase().indexOf("success") >= 0) {
                            farmer_disk_proving_success_count = parseInt(metrics_obj.Value);
        
                            let disk_rewards_metric = {
                                Id: farmer_disk_id_rewards,
                                Rewards: farmer_disk_proving_success_count
                            };
                            resp_rewards_arr.push(disk_rewards_metric);
                        } else if (metrics_obj.Criteria.toLowerCase().indexOf("timeout") >= 0) {
                            farmer_disk_proving_misses_count = parseInt(metrics_obj.Value);
        
                            let disk_misses_metric = {
                                Id: farmer_disk_id_rewards,
                                Misses: farmer_disk_proving_misses_count
                            };
                            resp_misses_arr.push(disk_misses_metric);
                        }
                        total_rewards_per_farmer += farmer_disk_proving_success_count;
        
                        farmer_disk_proving_success_count = 0;
                        farmer_disk_proving_misses_count = 0;
                    }
                }
            }
            
            
            resp_UUId_arr.sort((a, b) => a.Id.localeCompare(b.Id));
           resp_sector_perf_arr.sort((a, b) => a.Id.localeCompare(b.Id));
             resp_rewards_arr.sort((a, b) => a.Id.localeCompare(b.Id));
            resp_misses_arr.sort((a, b) => a.Id.localeCompare(b.Id));
            resp_plots_completed_arr.sort((a, b) => a.Id.localeCompare(b.Id));
            resp_plots_remaining_arr.sort((a, b) => a.Id.localeCompare(b.Id));


            
            let disk_sector_perf = {
                Id: "overall",
                TotalSectors: total_sectors_plot_count,
                TotalSeconds: total_sectors_plot_time_seconds,
                TotalDisks: total_disk_per_farmer,
                Uptime: uptime_seconds,
                TotalRewards: total_rewards_per_farmer
            };
            resp_sector_perf_arr['disk_sector_perf'] = disk_sector_perf;
        
            let disk_metrics = {
                Id: resp_UUId_arr,
                Performance: resp_sector_perf_arr,
                Rewards: resp_rewards_arr,
                Misses: resp_misses_arr,
                PlotsCompleted: resp_plots_completed_arr,
                PlotsRemaining: resp_plots_remaining_arr,
                farmerIp: farmerIp,
                farmerIsRunning: farmerIsRunning
            };
            // console.log('test',disk_metrics.PlotsCompleted, disk_metrics.PlotsRemaining)
            resp_disk_metrics_arr.push(disk_metrics);
            return resp_disk_metrics_arr;
            // return disk_metrics
        }else{
        
            let disk_sector_perf = {
                Id: "overall",
                TotalSectors: total_sectors_plot_count,
                TotalSeconds: total_sectors_plot_time_seconds,
                TotalDisks: total_disk_per_farmer,
                Uptime: uptime_seconds,
                TotalRewards: total_rewards_per_farmer
            };
            resp_sector_perf_arr['disk_sector_perf'] = disk_sector_perf;
        
            let disk_metrics = {
                Id: resp_UUId_arr,
                Performance: resp_sector_perf_arr,
                Rewards: resp_rewards_arr,
                Misses: resp_misses_arr,
                PlotsCompleted: resp_plots_completed_arr,
                PlotsRemaining: resp_plots_remaining_arr,
                farmerIp: farmerIp,
                farmerIsRunning: farmerIsRunning
            };
            return disk_metrics
        }
    }catch(error){
        console.log( "getDiskSectorPerformance", error)
    }
    }

};

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
                if(indexxx > 0){
                    outputTelegram += "\n\n"
                }
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
        helper.sendTelegramNotification(outputTelegram)
        // 1000 milliseconds = 1 second
        
        this.guiLogger((`\x1b[93m Last saved to: ${filePath} \x1b[92m ${dateLastOutput.format('YYYY-MM-DD HH:mm:ss')} \x1b[0m  \n` ));


        setTimeout(() => {
        countdownToRefresh();
        }, 2000); 

        }catch(error){
                console.log('error displayData',error);
        }
        
        
    }

}    



const getAllData = async function () {
   
    try {
        
        let nodeProcessArr = await helper.getProcessState("node", config.Node, config.Node);
        // console.log('test',nodeProcessArr) this sends the metrics base data


        const nodeIsRunningOk = nodeProcessArr[1];
        // console.log(nodeIsRunningOk) IS BOOLEAN
        const nodeMetricsRaw = nodeProcessArr[0];
        let nodeDisplayData
        if(nodeIsRunningOk === true){
            const parsedNodeDataArr = helper.parseMetricsToObj(nodeMetricsRaw);
            const nodeMetricsArr = helper.getNodeMetrics(parsedNodeDataArr);
             nodeDisplayData = functions.getNodeDisplayData(nodeMetricsArr, nodeIsRunningOk,config.Node);
    
        }else{
            nodeDisplayData = functions.getNodeDisplayData()
        }
      
        const farmersArrIp = config.Farmers;
        const farmerDisplaySector = [];

        for (const farmer of farmersArrIp) {
            let farmerProcessArr = await helper.getProcessState("farmer", farmer, farmer);
            // console.log(farmerProcessArr)
            const farmerMetricsRaw = farmerProcessArr[0];
            const farmerIsRunning = farmerProcessArr[1];
            if(farmerIsRunning === false){
                const farmerSectorPerformance = await helper.getDiskSectorPerformance(parsedFarmerDataArr= [],farmer,farmerIsRunning);
                farmerDisplaySector.push(farmerSectorPerformance);
            }else{
                // console.log('metrics', farmerMetricsRaw)
                const parsedFarmerDataArr = helper.parseMetricsToObj(farmerMetricsRaw);
                const farmerSectorPerformance = await helper.getDiskSectorPerformance(parsedFarmerDataArr,farmer,farmerIsRunning);
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

let timeToRefresh = config.Refresh


function countdownToRefresh() {
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
getAllData()
    // Call getAllData immediately
    refreshInterval = setInterval(() => {
        process.stdout.clearLine()
        getAllData()
    }
        , (config.Refresh+1)*1000)


// Call getAllData at intervals defined by config.Refresh (in seconds)