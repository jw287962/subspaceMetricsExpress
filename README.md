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
- CLI GUI Support (based on irbujam's design as well) 
	- added new metrics as stated above

 

  


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
Data.farmerDisplaySector[#].SummaryData
Data.farmerDisplaySector[#].SummaryData.FarmerIsRunning
Data.farmerDisplaySector[#].SummaryData.TotalDiskSize
Data.farmerDisplaySector[#].SummaryData.TotalSectorTime.formattedSectorTime
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
    "nodePeersConnected": "11",
    "nodeIp": "192.168.1.91:1111",
    "nodeIsRunningOk": true
  },
  "farmerDisplaySector": [
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "7950x",
        "TotalSectors": 0,
        "TotalDisks": 0,
        "Uptime": {
          "Seconds": "12563",
          "FormattedTime": "0D 3H 29M 23S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.253:2222",
        "TotalSectorsPerHour": 39.970000000000006,
        "TotalDiskSize": "14.61",
        "TotalPercentComplete": "72.9",
        "TotalRewards": 17,
        "TotalRewardsPerHour": "4.87",
        "TotalPlotsRemaining": 3962,
        "TotalPlotsCompleted": 10646,
        "TotalSectorTime": {
          "sectorTime": 90.06755066299723,
          "formattedSectorTime": "1m 30s"
        },
        "TotalETA": "4 Days 3 HR 7 Min"
      },
      "IndividualDiskDataObj": {
        "01HPCK9S5BEZRH9300N6ZZW52A": {
          "Id": "01HPCK9S5BEZRH9300N6ZZW52A",
          "Rewards": {
            "Rewards": 4
          },
          "Performance": {
            "SectorsPerHour": "10.00",
            "SectorTime": "6m 0s",
            "MinutesPerSector": 6.001037655071078
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "992"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2660"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "72.84",
            "ETA": "4D 3H 13M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9QEKPXBXW85M68SEH27S": {
          "Id": "01HPCK9QEKPXBXW85M68SEH27S",
          "Rewards": {
            "Rewards": 4
          },
          "Performance": {
            "SectorsPerHour": "9.85",
            "SectorTime": "6m 5s",
            "MinutesPerSector": 6.088357786267156
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "990"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2662"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "72.89",
            "ETA": "4D 4H 27M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9T133M8D3E11E4XWNWXS": {
          "Id": "01HPCK9T133M8D3E11E4XWNWXS",
          "Rewards": {
            "Rewards": 4
          },
          "Performance": {
            "SectorsPerHour": "9.99",
            "SectorTime": "6m 0s",
            "MinutesPerSector": 6.0070221299142155
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "993"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2659"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "72.81",
            "ETA": "4D 3H 24M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HPCK9RAH1V6E61NRY4NP3EHH": {
          "Id": "01HPCK9RAH1V6E61NRY4NP3EHH",
          "Rewards": {
            "Rewards": 5
          },
          "Performance": {
            "SectorsPerHour": "10.13",
            "SectorTime": "5m 55s",
            "MinutesPerSector": 5.924229316012856
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "987"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2665"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "72.97",
            "ETA": "4D 1H 27M"
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
        "TotalSectors": 4,
        "TotalDisks": 0,
        "Uptime": {
          "Seconds": "190749",
          "FormattedTime": "2D 4H 59M 9S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.91:2222",
        "TotalSectorsPerHour": 18.310000000000002,
        "TotalDiskSize": "10.98",
        "TotalPercentComplete": "58.3",
        "TotalRewards": 87,
        "TotalRewardsPerHour": "1.64",
        "TotalPlotsRemaining": 4585,
        "TotalPlotsCompleted": 6399,
        "TotalSectorTime": {
          "sectorTime": 196.61387220098305,
          "formattedSectorTime": "3m 16s"
        },
        "TotalETA": "10 Days 10 HR 24 Min"
      },
      "IndividualDiskDataObj": {
        "01HPKJJFEWFNZEBBXGEN5H8XWV": {
          "Id": "01HPKJJFEWFNZEBBXGEN5H8XWV",
          "Rewards": {
            "Rewards": 9
          },
          "Performance": {
            "SectorsPerHour": "9.15",
            "SectorTime": "6m 33s",
            "MinutesPerSector": 6.558811763608779
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2282"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1370"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "37.51",
            "ETA": "10D 9H 27M"
          },
          "Misses": {
            "Misses": 0
          }
        },
        "01HNK443JWGNNSHNHWYT2ANDVR": {
          "Id": "01HNK443JWGNNSHNHWYT2ANDVR",
          "Rewards": {
            "Rewards": 58
          },
          "Performance": {
            "SectorsPerHour": 0,
            "SectorTime": "11m 21s",
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
            "Rewards": 20
          },
          "Performance": {
            "SectorsPerHour": "9.16",
            "SectorTime": "6m 33s",
            "MinutesPerSector": 6.552057927938623
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2303"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1349"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "36.94",
            "ETA": "10D 11H 29M"
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
        "TotalSectors": 82,
        "TotalDisks": 0,
        "Uptime": {
          "Seconds": "273625",
          "FormattedTime": "3D 4H 0M 25S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.83:2222",
        "TotalSectorsPerHour": 0,
        "TotalDiskSize": "3.74",
        "TotalPercentComplete": "100.0",
        "TotalRewards": 67,
        "TotalRewardsPerHour": "0.88",
        "TotalPlotsRemaining": 0,
        "TotalPlotsCompleted": 3736,
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
            "Rewards": 67
          },
          "Performance": {
            "SectorsPerHour": 0,
            "SectorTime": "3m 40s",
            "MinutesPerSector": "0s"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "3736"
          },
          "Data": {
            "DiskSize": 3.736,
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

