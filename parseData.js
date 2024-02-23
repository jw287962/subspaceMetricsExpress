
const axios = require('axios')
const config = require('./config.json')

// PARSES DATA TO BE USED BY MAIN 
const parseData = {
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
            // console.error('Error Fetching Data | Offline Hostname:', ioUrl);
        }
        // console.log('response', responseText)
        return responseText;
    },

    getProcessState: async function getProcessState(ioProcessType, ioHostIp, ioHostname) {
        const respProcessStateArr = [];
    
        let bProcessRunningState = false;
    
        // Get process state, send notification if process is stopped/not running
        try {
            
            const resp = await this.pingMetricsUrl(ioHostIp); // Assuming pingMetricsUrl is already defined
            if (resp == undefined) {
                const alertText = `Failed to ping Metrics @ Hostname: ${ioHostname}, ${ioProcessType} status: Stopped,`;
               
                respProcessStateArr.push(alertText);
                bProcessRunningState = false;
            } else {
                bProcessRunningState = true;
                respProcessStateArr.push(resp);
                // console.log(resp)
            }
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
            // useless data is in help & type
            // good data is after Arr[2]
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
            console.error('Error:', error);
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
    convertSecondsMinutes: function convertSecondsMinutes(seconds){
        try{
            if(seconds >0){

                const minutes = Math.floor((seconds % 3600) / 60);
                const second = Math.floor(seconds % 60)
                const formattedTime = `${minutes}m ${second}s`;
                return formattedTime;
            }else{
                return '-'
            }
        
        }catch(err){
            console.log('Error: convertSecondsDays', err)
        }
    },
 
     convertSecondsDays: function convertSecondsDays(seconds){
         try{
             const days = Math.floor(seconds / (3600 * 24));
             const hours = Math.floor((seconds % (3600 * 24)) / 3600);
             const minutes = Math.floor((seconds % 3600) / 60);
             const second = Math.floor(seconds % 60)
             const formattedTime = `${days}D ${hours}H ${minutes}M ${second}S`;
             return formattedTime;
         
         }catch(err){
             console.log('Error: convertSecondsDays', err)
         }
        
     },
     
     setUpIndividualObj: function setUpIndividualObj(plot_id,individualDiskDataObj){
            return {
                Id: plot_id,
                Rewards: { Rewards: 0},
                Performance: {
                    SectorsPerHour: 0,
                    MinutesPerSector: 0,
                },
                PlotsRemaining: {
                    PlotState: "N/A",
                    Sectors: "0"
                },
                PlotsCompleted: {
                    PlotState: "N/A",
                    Sectors: "0"
                },
                Data:{
                    DiskSize: 0,
                    CompletePercent: "0",
                    ETA: "N/A"
                },
                Misses: {
                    Misses: 0
                }
                

            }
        
     },
    
    getDiskSectorPerformance: function GetDiskSectorPerformance(io_farmer_metrics_arr = [], farmerIp,farmerIsRunning,farmerName) {
    try{
        const individualDiskDataObj = { };
    
        let unit_type = "";
        let uptime_seconds = 0;
        let total_rewards_per_farmer = 0;
        // let total_sectors_plot_time_seconds = 0;
        let total_disk_per_farmer = 0;

        let farmer_disk_sector_plot_time = 0.00;
        let farmer_disk_sector_plot_count = 0;
    
       
        const summaryData = {
            Id: "Overall",
            Name: farmerName,
            TotalSectors: 0,
            TotalSeconds: 0,
            TotalDisks: {
                FinishedPlotting: 0,
                Plotting: 0,
                Total: 0,
            },
            Uptime: {
                Seconds: 0,
                FormattedTime: "-"
            },
            FarmerIsRunning: farmerIsRunning,
            FarmerIp: farmerIp,
            TotalSectorsPerHour: 0,
            TotalDiskSize: 0,
            TotalPercentComplete: 0,
            TotalRewards: 0,
            TotalRewardsPerHour: 0,
            TotalPlotsRemaining: 0,
            TotalPlotsCompleted: 0,
            TotalSectorTime: {
                    sectorTime: 0,
                    formattedSectorTime: '',
                },
            TotalETA: ""
        }
        if(farmerIsRunning){
            for (let metrics_obj of io_farmer_metrics_arr) {
                let farmer_disk_id
                let total_sectors_plot_time_seconds
                let farmer_disk_id_rewards
                let farmer_disk_proving_misses_count
                let unique_farm_id
                let farmer_disk_proving_success_count
                if (metrics_obj.Name.indexOf("_farmer_sectors_total_sectors") >= 0 && metrics_obj.Id.indexOf("farm_id") >= 0) {
                    const plot_id = ((metrics_obj.Instance?.split(","))[0]);
                    const plot_state = metrics_obj.Criteria.trim().split('"')[1];
                    const sectors = metrics_obj.Value;
                    let plots_info = {
                        PlotState: plot_state,
                        Sectors: sectors
                    }
                    if (plot_state.toLowerCase() == "notplotted") {
                                individualDiskDataObj[plot_id]['PlotsRemaining'] = (plots_info)
                                summaryData.TotalDisks.Plotting--;
                                summaryData.TotalDisks.FinishedPlotting++;


                        
                    } else if (plot_state.toLowerCase() === "plotted") {
                                individualDiskDataObj[plot_id]['PlotsCompleted'] = (plots_info)
                    }
                } else if (metrics_obj.Name.indexOf("_farmer_auditing_time_seconds_count") >= 0 && metrics_obj.Id.indexOf("farm_id") >= 0) {
                    uptime_seconds = metrics_obj.Value;
                    unique_farm_id = metrics_obj.Instance;
                    if(unique_farm_id && !individualDiskDataObj[unique_farm_id]){
                        individualDiskDataObj[unique_farm_id] = this.setUpIndividualObj(unique_farm_id,individualDiskDataObj)
                        }

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
                                    sector_time = this.convertSecondsMinutes((farmer_disk_sector_plot_time / (farmer_disk_sector_plot_count)))
                                    minutes_per_sector =farmer_disk_sector_plot_time / (farmer_disk_sector_plot_count)/60
                                    console.log(farmer_disk_sector_plot_time,farmer_disk_sector_plot_count)
                                    total_sectors_plot_time_seconds += farmer_disk_sector_plot_time;
                                    break;
                                case "minutes":
                                    sectors_per_hour = (farmer_disk_sector_plot_count / farmer_disk_sector_plot_time).toFixed(2);
                                    sector_time = this.convertSecondsMinutes((farmer_disk_sector_plot_time / farmer_disk_sector_plot_count)*60)
                                    minutes_per_sector =farmer_disk_sector_plot_time*60 / (farmer_disk_sector_plot_count)
                                    total_sectors_plot_time_seconds += (farmer_disk_sector_plot_time * 60);
                                    break;
                                case "hours":
                                    sectors_per_hour = (farmer_disk_sector_plot_count / (farmer_disk_sector_plot_time * 60)).toFixed(2);
                                    sector_time = this.convertSecondsMinutes(((farmer_disk_sector_plot_time * 60*60) / farmer_disk_sector_plot_count))
                                    minutes_per_sector =farmer_disk_sector_plot_time *60*60 / (farmer_disk_sector_plot_count)
                                    total_sectors_plot_time_seconds += (farmer_disk_sector_plot_time * 3600);
                                    break;
                            }
                            // total_disk_per_farmer += 1;
                            summaryData.TotalDisks.Total += 1
                            summaryData.TotalDisks.Plotting+=1
        
                            farmer_disk_sector_plot_time = 0.00;
                            farmer_disk_sector_plot_count = 0;
        
                            let disk_sector_perf = {
                                SectorsPerHour: sectors_per_hour,
                                SectorTime: sector_time,
                                MinutesPerSector: minutes_per_sector,
                            };
                                individualDiskDataObj[farmer_disk_id]['Performance'] = (disk_sector_perf)
                        }
                    }
                } else if (metrics_obj.Name.indexOf("_farmer_sector_plotted_counter_sectors_total") >= 0) {
                } else if (metrics_obj.Name.indexOf("_farmer_proving_time_seconds") >= 0) {
      
                    if (metrics_obj.Id.toLowerCase().indexOf("unit") >= 0 || metrics_obj.Id.toLowerCase().indexOf("type") >= 0) {
                        farmer_disk_id_rewards = "";
                    } else if (metrics_obj.Id.indexOf("farm_id") >= 0 && metrics_obj.Name.toLowerCase().indexOf("count") >= 0) {
                        let farmer_id = metrics_obj.Instance.split(",");
                        farmer_disk_id_rewards = farmer_id[0];

                        if (metrics_obj.Criteria.toLowerCase().indexOf("success") >= 0) {
                            farmer_disk_proving_success_count = parseInt(metrics_obj.Value);
                            individualDiskDataObj[farmer_disk_id_rewards]['Rewards'] = {Rewards: farmer_disk_proving_success_count}
                        // }
                        } else if (metrics_obj.Criteria.toLowerCase().indexOf("timeout") >= 0) {
                            farmer_disk_proving_misses_count = parseInt(metrics_obj.Value);
                            individualDiskDataObj[farmer_disk_id_rewards]['Misses'] = { Misses:farmer_disk_proving_misses_count}
                        }
                                total_rewards_per_farmer += farmer_disk_proving_success_count;
                            farmer_disk_proving_success_count = 0;
                            farmer_disk_proving_misses_count = 0;
                }
            }
                summaryData.TotalSeconds = total_sectors_plot_time_seconds
                summaryData.TotalSectors = parseInt(metrics_obj.Value)
                summaryData.Uptime.Seconds = uptime_seconds;
                summaryData.Uptime.FormattedTime=this.convertSecondsDays(uptime_seconds)

        }
            summaryData.TotalDisks = total_disk_per_farmer
            for(key in individualDiskDataObj){

                individualDiskDataObj[key]["Data"] = this.discDataMetrics(individualDiskDataObj[key])
                if(!individualDiskDataObj[key].Misses){
                    individualDiskDataObj[key].Misses = {Misses: 0}
                }
                summaryData.TotalRewards += individualDiskDataObj[key].Rewards.Rewards*1
                summaryData.TotalPlotsRemaining += individualDiskDataObj[key].PlotsRemaining.Sectors*1
                summaryData.TotalPlotsCompleted += individualDiskDataObj[key].PlotsCompleted.Sectors*1

                // check for NOT PLOTTING
                if(individualDiskDataObj[key].PlotsRemaining.Sectors == 0){
                    individualDiskDataObj[key].Performance.SectorsPerHour = 0
                    individualDiskDataObj[key].Performance.MinutesPerSector = "0s"

                }
                else if(individualDiskDataObj[key].PlotsRemaining.Sectors != 0)
                    summaryData.TotalSectorsPerHour += (individualDiskDataObj[key].Performance.SectorsPerHour*1)
            }
            const totalPlotsRemaining = summaryData.TotalPlotsRemaining
            const totalPlotsCompleted = summaryData.TotalPlotsCompleted
            const totalSectorPerHour = summaryData.TotalSectorsPerHour*1
            const totalETADays = ((totalPlotsRemaining/totalSectorPerHour)/(24));

            if(totalSectorPerHour === 0){
                summaryData.TotalSectorTime.sectorTime = '-'
                summaryData.TotalSectorTime.formattedSectorTime = "-"   
                summaryData.TotalETA= '-'     
            }else{
                summaryData.TotalSectorTime.sectorTime = 60/totalSectorPerHour*60
                summaryData.TotalSectorTime.formattedSectorTime = this.convertSecondsMinutes(summaryData.TotalSectorTime.sectorTime)
                summaryData.TotalETA = totalETADays < 1 ? `${(totalETADays * 24).toFixed(1)} Hrs` : `${Math.floor(totalETADays)} Days ${Math.floor((totalETADays% 1)*24)} HR ${Math.floor(((totalETADays * 24) % 1) * 60)} Min`;

            }
            
            summaryData.TotalPercentComplete =((totalPlotsCompleted/(totalPlotsCompleted+totalPlotsRemaining))*100).toFixed(1);
            summaryData.TotalDiskSize = ((totalPlotsRemaining + totalPlotsCompleted)/1000).toFixed(2)

            summaryData.TotalRewardsPerHour = (summaryData.TotalRewards/(summaryData.Uptime.Seconds/(60*60))).toFixed(2);

            const allData = {SummaryData: summaryData}
            allData['IndividualDiskDataObj'] = individualDiskDataObj;


            return allData
            // return disk_metrics
        }else{



            const allData = {SummaryData: summaryData}
            allData['IndividualDiskDataObj'] = individualDiskDataObj;

            return allData
            

        }
    }catch(error){
        console.log( "getDiskSectorPerformance", error)
    }
    },

    discDataMetrics: function discDataMetrics(farmer){
        
        const DiskSize = (farmer.PlotsCompleted.Sectors*1+1*farmer.PlotsRemaining.Sectors)/1000
        const CompletePercent = (((farmer.PlotsCompleted.Sectors)/(farmer?.PlotsRemaining.Sectors*1+1*farmer.PlotsCompleted.Sectors))*100).toFixed(2)
        const ETA = this.diskPlotETA(farmer.PlotsRemaining.Sectors,farmer?.Performance.MinutesPerSector)
        if(farmer.PlotsRemaining.Sectors == 0){
            return {DiskSize,CompletePercent: 100,ETA: "-"}
        }
        return {DiskSize,CompletePercent,ETA}
    },
    diskPlotETA: function diskPlotETA(remaining_sectors,minutes_per_sector_data_disp){
        try{
            if (minutes_per_sector_data_disp !== "-") {
                let eta = this.convertSecondsDays(((parseFloat(minutes_per_sector_data_disp) * 1*remaining_sectors)*60))
                eta = eta.substring(0,eta.indexOf('M')+1)
                return eta.toString();
            }}catch(err){
                console.log('DiskPlotETA err ', err)
            }
    }

};

module.exports = parseData;