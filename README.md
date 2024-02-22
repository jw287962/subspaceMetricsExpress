Parsing Functions derived from https://github.com/irbujam/ss_log_event_monitor written in Powershell
But i have added my own for new summaryData that I wanted.
I actually reorganized the design of the data structure to use objects rather than arrays in his parser function

# subspaceMetricsExpress

1) remember to npm install and install node to run JS

2) rename config file to  config.json
3) and update config.json to your correct data.

4) RUN: 
```
node ./functions.js
```
 (bad name... ik) and it should start
 
![CLI IMG](https://raw.githubusercontent.com/jw287962/subspaceMetricsExpress/main/CLI.png)
 
 Auto start
 
## Frontend
1)you can get the data from GET REQUEST: 
- 'http://localhost:3000/api/data'
2)Add your IP to the cors for Front-End Website
```
app.use(cors({
    origin: 'http://localhost:0000'
  }));
```

## SAMPLE DATA
Example:
### NODE IS EASY
Data.nodeDisplayData.NodeIp

### Summary/Overall Data per PC
Data.farmerDisplaySector[#].SummaryData
Data.farmerDisplaySector[#].SummaryData.FarmerIsRunning
Data.farmerDisplaySector[#].SummaryData.TotalDiskSize
Data.farmerDisplaySector[#].SummaryData.TotalSectorTime.formattedSectorTime
### Individual Disk Data
I think in most languages you can loop through Objects?? not sure. but you can in JS. which is good for Front-end...
Data.farmerDisplaySector[#].IndividualDiskDataObj['DISKID']
.Rewards
.Misses
.Performance
.PlotsCompleted
.PlotsRemaining

Example OBJECT:
```
{
  "nodeDisplayData": {
    "nodeSyncState": "0",
    "nodePeersConnected": "6",
    "nodeIp": "192.168.1.91:1111",
    "nodeIsRunningOk": true
  },
  "farmerDisplaySector": [
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "7950x",
        "TotalSectors": 869,
        "TotalSeconds": 314872.35891938995,
        "TotalDisks": 4,
        "Uptime": {
          "Seconds": "79014",
          "FormattedTime": "0D 21H 56M 54S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.253:2222",
        "TotalSectorsPerHour": 39.74,
        "TotalDiskSize": "14.61",
        "TotalPercentComplete": "65.0",
        "TotalRewards": 63,
        "TotalRewardsPerHour": "2.87",
        "TotalPlotsRemaining": 5109,
        "TotalPlotsCompleted": 9499,
        "TotalSectorTime": {
          "sectorTime": 90.5888273779567,
          "formattedSectorTime": "1m 30s"
        },
        "TotalETA": "5 Days 8 HR 33 Min"
      },
      "IndividualDiskDataObj": {
        "01HPCK9T133M8D3E11E4XWNWXS": {
          "Id": "01HPCK9T133M8D3E11E4XWNWXS",
          "Rewards": {
            "Rewards": 19
          },
          "Performance": {
            "SectorsPerHour": "9.95",
            "MinutesPerSector": "6.03"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1279"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2373"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.35",
            "ETA": "5.36"
          }
        },
        "01HPCK9S5BEZRH9300N6ZZW52A": {
          "Id": "01HPCK9S5BEZRH9300N6ZZW52A",
          "Rewards": {
            "Rewards": 8
          },
          "Performance": {
            "SectorsPerHour": "9.94",
            "MinutesPerSector": "6.04"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2373"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1279"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.29",
            "ETA": "5.36"
          }
        },
        "01HPCK9RAH1V6E61NRY4NP3EHH": {
          "Id": "01HPCK9RAH1V6E61NRY4NP3EHH",
          "Rewards": {
            "Rewards": 19
          },
          "Performance": {
            "SectorsPerHour": "9.93",
            "MinutesPerSector": "6.04"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2377"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1275"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.35",
            "ETA": "5.35"
          }
        },
        "01HPCK9QEKPXBXW85M68SEH27S": {
          "Id": "01HPCK9QEKPXBXW85M68SEH27S",
          "Rewards": {
            "Rewards": 17
          },
          "Performance": {
            "SectorsPerHour": "9.92",
            "MinutesPerSector": "6.05"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1276"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2376"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "39.27",
            "ETA": "5.36"
          }
        }
      }
    },
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "5800x ROG J",
        "TotalSectors": 444,
        "TotalSeconds": 177555.06011205295,
        "TotalDisks": 3,
        "Uptime": {
          "Seconds": "86441",
          "FormattedTime": "1D 0H 0M 41S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.91:2222",
        "TotalSectorsPerHour": 18.240000000000002,
        "TotalDiskSize": "10.98",
        "TotalPercentComplete": "53.4",
        "TotalRewards": 41,
        "TotalRewardsPerHour": "1.71",
        "TotalPlotsRemaining": 5118,
        "TotalPlotsCompleted": 5866,
        "TotalSectorTime": {
          "sectorTime": 197.36842105263156,
          "formattedSectorTime": "3m 17s"
        },
        "TotalETA": "11 Days 16 HR 35 Min"
      },
      "IndividualDiskDataObj": {
        "01HPKJJFEWFNZEBBXGEN5H8XWV": {
          "Id": "01HPKJJFEWFNZEBBXGEN5H8XWV",
          "Rewards": {
            "Rewards": 3
          },
          "Performance": {
            "SectorsPerHour": "9.11",
            "MinutesPerSector": "6.59"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2548"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1104"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "16.75",
            "ETA": "11.66"
          }
        },
        "01HNK443JWGNNSHNHWYT2ANDVR": {
          "Id": "01HNK443JWGNNSHNHWYT2ANDVR",
          "Rewards": {
            "Rewards": 28
          },
          "Performance": {
            "SectorsPerHour": "0",
            "MinutesPerSector": "0"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "3680"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          },
          "Data": {
            "DiskSize": 3.68,
            "CompletePercent": "Infinity",
            "ETA": "0.00"
          }
        },
        "01HPKJJGJ0P4BEHRW4T9S9ADEP": {
          "Id": "01HPKJJGJ0P4BEHRW4T9S9ADEP",
          "Rewards": {
            "Rewards": 10
          },
          "Performance": {
            "SectorsPerHour": "9.13",
            "MinutesPerSector": "6.57"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1082"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2570"
          },
          "Data": {
            "DiskSize": 3.652,
            "CompletePercent": "16.47",
            "ETA": "11.73"
          }
        }
      }
    },
    {
      "SummaryData": {
        "Id": "Overall",
        "Name": "5800x ROG W",
        "TotalSectors": 593,
        "TotalSeconds": 130022.2524927999,
        "TotalDisks": 1,
        "Uptime": {
          "Seconds": "169300",
          "FormattedTime": "1D 23H 1M 40S"
        },
        "FarmerIsRunning": true,
        "FarmerIp": "192.168.1.83:2222",
        "TotalSectorsPerHour": 0,
        "TotalDiskSize": "3.74",
        "TotalPercentComplete": "100.0",
        "TotalRewards": 46,
        "TotalRewardsPerHour": "0.98",
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
            "Rewards": 46
          },
          "Misses": {
            "Misses": 1
          },
          "Performance": {
            "SectorsPerHour": "0",
            "MinutesPerSector": "0"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "3736"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          },
          "Data": {
            "DiskSize": 3.736,
            "CompletePercent": "Infinity",
            "ETA": "0.00"
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

