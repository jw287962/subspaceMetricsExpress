Revised: The parsing functions, originally written by https://github.com/irbujam/ss_log_event_monitor in Powershell, have been revamped. Instead of generating multiple arrays that are mixed randomly as in the original parser function, I redesigned it to organize the data into objects. This modification simplifies the process of editing and accessing data across various modern programming languages. Consequently, designing a frontend, particularly in languages optimized for this purpose such as React, becomes much more straightforward.

Copied Metric Functions (into JS):
- Uptime
- Sectors/Hr
- Disk ID
- Git Version


Created Personal Metric calcuations for:
- Per PC:
 -- Sector Time
 -- Sectors/Hr
 -- % Complete
 -- Rewards/Hr, Rewards/Day
 -- ETA Remaining, 
 -- Total Size
 - Per Disk
  -- % Complete
  -- ETA
 
  
 Features:
- Telegram Updates
- NEW: TSSC Balance
- CLI GUI Support (based on irbujam's design as well) 
	- added new metrics as stated above
- WEB UI HOSTED ON PORT 3000 (BASIC)

 API:
 - /api/data --> Returns JSON DATA (does not refresh data.json 
 - /api/refresh --> REFERSH & returns NEW JSON DATA

  


# subspaceMetricsExpress

1) remember to npm install and install node to run JS

2) rename config file to  config.json
3) and update config.json to your correct data.

4) RUN: 
```
node ./main.js
```
 (bad name... ik) and it should start
 
![CLI IMG](https://raw.githubusercontent.com/jw287962/subspaceMetricsExpress/main/picture/CLI.png)

 
## Frontend
1)you can get the data from GET REQUEST: 
- 'http://localhost:3000/api/data'
2)Add your IP to the cors for Front-End Website
```
main.js

app.use(cors({
    origin: 'http://localhost:0000'
  }));
```

## SAMPLE DATA
#### NODE IS EASY:
Data.nodeDisplayData.NodeIp

#### Summary/Overall Data per PC:
- Data.farmerDisplaySector[#].SummaryData
- Data.farmerDisplaySector[#].SummaryData.FarmerIsRunning
- Data.farmerDisplaySector[#].SummaryData.TotalDiskSize
- Data.farmerDisplaySector[#].SummaryData.TotalSectorTime.formattedSectorTime
#### Individual Disk Data
Most languages you can loop through Objects. So should be easy to get all the data in one loop for Front End Design...
Data.farmerDisplaySector[#].IndividualDiskDataObj['DISKID']
.Rewards
.Misses
.Performance
.PlotsCompleted
.PlotsRemaining

### Example Object

Example Data:
```
{
  "nodeDisplayData": {
    "nodeSyncState": "0",
    "nodePeersConnected": "9",
    "nodeIp": "192.168.1.91:1111",
    "nodeIsRunningOk": true
  },
  "farmerDisplaySector": [
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "7950x",
        "TotalSectors": 65,
        "TotalDisks": {
          "FinishedPlotting": 4,
          "Plotting": 0,
          "Total": 4
        },
        "Uptime": {
          "Seconds": "43147",
          "FormattedTime": "0D 11H 59M 7S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.253:2222",
        "TotalSectorsPerHour": 39.72,
        "TotalDiskSize": "14.61",
        "TotalPercentComplete": "75.2",
        "TotalRewards": 34,
        "TotalRewardsPerHour": "2.84",
        "TotalPlotsRemaining": 3624,
        "TotalPlotsCompleted": 10984,
        "TotalSectorTime": {
          "sectorTime": 90.6344410876133,
          "formattedSectorTime": "1m 30s"
        },
        "TotalETA": "3 Days 19 HR 14 Min"
      },
      "IndividualDiskDataObj": {
        "01HPCK9S5BEZRH9300N6ZZW52A": {
          "Id": "01HPCK9S5BEZRH9300N6ZZW52A",
          "Rewards": {
            "Rewards": 7
          },
          "Performance": {
            "SectorsPerHour": "9.93",
            "SectorTime": "6m 2s",
            "MinutesPerSector": 6.0414273455910354
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "907"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2745"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "75.16",
            "ETA": "3D 19H 19M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9QEKPXBXW85M68SEH27S": {
          "Id": "01HPCK9QEKPXBXW85M68SEH27S",
          "Rewards": {
            "Rewards": 8
          },
          "Performance": {
            "SectorsPerHour": "9.89",
            "SectorTime": "6m 3s",
            "MinutesPerSector": 6.06624156935918
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "906"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2746"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "75.19",
            "ETA": "3D 19H 36M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9T133M8D3E11E4XWNWXS": {
          "Id": "01HPCK9T133M8D3E11E4XWNWXS",
          "Rewards": {
            "Rewards": 11
          },
          "Performance": {
            "SectorsPerHour": "9.93",
            "SectorTime": "6m 2s",
            "MinutesPerSector": 6.043050462983191
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "908"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2744"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "75.14",
            "ETA": "3D 19H 27M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9RAH1V6E61NRY4NP3EHH": {
          "Id": "01HPCK9RAH1V6E61NRY4NP3EHH",
          "Rewards": {
            "Rewards": 8
          },
          "Performance": {
            "SectorsPerHour": "9.97",
            "SectorTime": "6m 1s",
            "MinutesPerSector": 6.018233643705044
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "903"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2749"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "75.27",
            "ETA": "3D 18H 34M"
          },
          "Misses": {
            "Misses": 0
          }
        }
      }
    },
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "5800x ROG J",
        "TotalSectors": 1,
        "TotalDisks": {
          "FinishedPlotting": 3,
          "Plotting": 0,
          "Total": 3
        },
        "Uptime": {
          "Seconds": "221345",
          "FormattedTime": "2D 13H 29M 5S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.91:2222",
        "TotalSectorsPerHour": 18.32,
        "TotalDiskSize": "10.98",
        "TotalPercentComplete": "59.7",
        "TotalRewards": 103,
        "TotalRewardsPerHour": "1.68",
        "TotalPlotsRemaining": 4430,
        "TotalPlotsCompleted": 6554,
        "TotalSectorTime": {
          "sectorTime": 196.5065502183406,
          "formattedSectorTime": "3m 16s"
        },
        "TotalETA": "10 Days 1 HR 48 Min"
      },
      "IndividualDiskDataObj": {
        "01HPKJJFEWFNZEBBXGEN5H8XWV": {
          "Id": "01HPKJJFEWFNZEBBXGEN5H8XWV",
          "Rewards": {
            "Rewards": 11
          },
          "Performance": {
            "SectorsPerHour": "9.16",
            "SectorTime": "6m 33s",
            "MinutesPerSector": 6.552778516843653
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2204"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1448"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.65",
            "ETA": "10D 0H 42M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HNK443JWGNNSHNHWYT2ANDVR": {
          "Id": "01HNK443JWGNNSHNHWYT2ANDVR",
          "Rewards": {
            "Rewards": 68
          },
          "Performance": {
            "SectorsPerHour": 0,
            "SectorTime": "11m 31s",
            "MinutesPerSector": "0s"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "3680"
          },
          "Data": {
            "DiskSize": 3.68,
            "CompletePercent": 100,
            "ETA": "-"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPKJJGJ0P4BEHRW4T9S9ADEP": {
          "Id": "01HPKJJGJ0P4BEHRW4T9S9ADEP",
          "Rewards": {
            "Rewards": 24
          },
          "Performance": {
            "SectorsPerHour": "9.16",
            "SectorTime": "6m 32s",
            "MinutesPerSector": 6.547112053210734
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2226"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1426"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.05",
            "ETA": "10D 2H 53M"
          },
          "Misses": {
            "Misses": 0
          }
        }
      }
    },
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "5800x ROG W",
        "TotalSectors": 2,
        "TotalDisks": {
          "FinishedPlotting": 1,
          "Plotting": 0,
          "Total": 1
        },
        "Uptime": {
          "Seconds": "304223",
          "FormattedTime": "3D 12H 30M 23S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.83:2222",
        "TotalSectorsPerHour": 0,
        "TotalDiskSize": "3.73",
        "TotalPercentComplete": "100.0",
        "TotalRewards": 73,
        "TotalRewardsPerHour": "0.86",
        "TotalPlotsRemaining": 0,
        "TotalPlotsCompleted": 3734,
        "TotalSectorTime": {
          "sectorTime": "-",
          "formattedSectorTime": "-"
        },
        "TotalETA": "-"
      },
      "IndividualDiskDataObj": {
        "01HP23RHWK9M0AB2PTW0B7DAZB": {
          "Id": "01HP23RHWK9M0AB2PTW0B7DAZB",
          "Rewards": {
            "Rewards": 73
          },
          "Performance": {
            "SectorsPerHour": 0,
            "SectorTime": "3m 41s",
            "MinutesPerSector": "0s"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "3734"
          },
          "Data": {
            "DiskSize": 3.734,
            "CompletePercent": 100,
            "ETA": "-"
          },
          "Misses": {
            "Misses": 1
          }
        }
      }
    }
  ]
}
```
    
    

# CRONTAB AUTOSTART BOOTUP

create sh file and apply `chmod +x`
``` 
 #!/bin/bash

# Change directory to your Express app directory
cd /path/to/your/express/app

# Open a new terminal window and execute the command to start your Express app using Node.js
gnome-terminal -- node app.js
```

`crontab -e` to edit crontab and addd to end:
`@reboot /path/to/start_app.sh`

