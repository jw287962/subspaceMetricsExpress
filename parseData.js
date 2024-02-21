
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
            console.error('Error fetching data:', 'Offline');
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
                const alertText = `${ioProcessType} status: Stopped, Hostname: ${ioHostname}`;
               
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
        let totalFarmerDiskSize = 0;
    
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
                        if(plots_info.Sectors == "0"){
                            resp_sector_perf_arr.push({Id: plots_info.Id, SectorsPerHour: '0', MinutesPerSector: '0'})
                        }
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
    
            
            const totalPlotsRemaining = (resp_plots_remaining_arr.reduce((a,b) => a+1*b.Sectors, 0))
            const totalPlotsCompleted = (resp_plots_completed_arr.reduce((a,b) => a+1*b.Sectors, 0))
            const totalSectorPerHour = resp_sector_perf_arr.reduce((acc,val) => val.SectorsPerHour*1+acc,0)
           
            const totalMinutesPerSector = 60/totalSectorPerHour*60
            const totalETADays = ((totalPlotsRemaining/totalSectorPerHour)/(24)).toFixed(1);
            const totalETA = totalETADays < 1 ? `${(totalETADays * 24).toFixed(1)} Hrs` : `${totalETADays} Days`;
            const totalPercentComplete =((totalPlotsCompleted/(totalPlotsCompleted+totalPlotsRemaining))*100).toFixed(1);
            const totalFarmerDiskSize = ((totalPlotsRemaining + totalPlotsCompleted)/1000).toFixed(2)

            let summaryData = {
                Id: "Overall",
                TotalSectors: total_sectors_plot_count,
                TotalSeconds: total_sectors_plot_time_seconds,
                TotalSize: totalFarmerDiskSize,
                TotalMinutesPerSector: totalMinutesPerSector,
                TotalETA: totalETA,
                TotalPercentComplete: totalPercentComplete,
                TotalDisks: total_disk_per_farmer,
                Uptime: uptime_seconds,
                TotalRewards: total_rewards_per_farmer,
            }
            // resp_sector_perf_arr['disk_sector_perf'] = disk_sector_perf;
        
            let disk_metrics = {
                Id: resp_UUId_arr,
                Performance: resp_sector_perf_arr,
                Rewards: resp_rewards_arr,
                Misses: resp_misses_arr,
                PlotsCompleted: resp_plots_completed_arr,
                PlotsRemaining: resp_plots_remaining_arr,
                FarmerIp: farmerIp,
                FarmerIsRunning: farmerIsRunning,
                SummaryData: summaryData
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
                TotalSize: totalFarmerDiskSize,
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
                FarmerIp: farmerIp,
                FarmerIsRunning: farmerIsRunning
            };
            return [disk_metrics];
        }
    }catch(error){
        console.log( "getDiskSectorPerformance", error)
    }
    }

};

module.exports = parseData;