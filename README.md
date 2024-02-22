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
      "Id": "Overall",
      "TotalSectors": 842,
      "TotalSeconds": 305036.77548994095,
      "TotalDisks": 4,
      "Uptime": {
        "Seconds": "76534",
        "FormattedTime": "0D 21H 15M 34S"
      },
      "TotalSectorsPerHour": 39.75,
      "TotalDiskSize": "14.61",
      "TotalPercentComplete": "64.8",
      "TotalRewards": 58,
      "TotalRewardsPerHour": "2.73",
      "TotalPlotsRemaining": 5136,
      "TotalPlotsCompleted": 9472,
      "TotalSectorTime": {
        "sectorTime": 90.56603773584906,
        "formattedSectorTime": "1m 30s"
      },
      "TotalETA": "5 Days 9 HR 12 Min",
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
            "Sectors": "1286"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2366"
          }
        },
        "01HPCK9S5BEZRH9300N6ZZW52A": {
          "Id": "01HPCK9S5BEZRH9300N6ZZW52A",
          "Rewards": {
            "Rewards": 8
          },
          "Performance": {
            "SectorsPerHour": "9.95",
            "MinutesPerSector": "6.03"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2367"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1285"
          }
        },
        "01HPCK9RAH1V6E61NRY4NP3EHH": {
          "Id": "01HPCK9RAH1V6E61NRY4NP3EHH",
          "Rewards": {
            "Rewards": 17
          },
          "Performance": {
            "SectorsPerHour": "9.93",
            "MinutesPerSector": "6.04"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2370"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1282"
          }
        },
        "01HPCK9QEKPXBXW85M68SEH27S": {
          "Id": "01HPCK9QEKPXBXW85M68SEH27S",
          "Rewards": {
            "Rewards": 14
          },
          "Performance": {
            "SectorsPerHour": "9.92",
            "MinutesPerSector": "6.05"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "1283"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "2369"
          }
        }
      }
    },
    {
      "Id": "Overall",
      "TotalSectors": 432,
      "TotalSeconds": 171873.09958357696,
      "TotalDisks": 3,
      "Uptime": {
        "Seconds": "83961",
        "FormattedTime": "0D 23H 19M 21S"
      },
      "TotalSectorsPerHour": 18.310000000000002,
      "TotalDiskSize": "10.98",
      "TotalPercentComplete": "53.3",
      "TotalRewards": 41,
      "TotalRewardsPerHour": "1.76",
      "TotalPlotsRemaining": 5129,
      "TotalPlotsCompleted": 5854,
      "TotalSectorTime": {
        "sectorTime": 196.61387220098305,
        "formattedSectorTime": "3m 16s"
      },
      "TotalETA": "11 Days 16 HR 7 Min",
      "IndividualDiskDataObj": {
        "01HPKJJFEWFNZEBBXGEN5H8XWV": {
          "Id": "01HPKJJFEWFNZEBBXGEN5H8XWV",
          "Rewards": {
            "Rewards": 3
          },
          "Performance": {
            "SectorsPerHour": "9.16",
            "MinutesPerSector": "6.55"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2554"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1098"
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
            "Sectors": "3679"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "0"
          }
        },
        "01HPKJJGJ0P4BEHRW4T9S9ADEP": {
          "Id": "01HPKJJGJ0P4BEHRW4T9S9ADEP",
          "Rewards": {
            "Rewards": 10
          },
          "Performance": {
            "SectorsPerHour": "9.15",
            "MinutesPerSector": "6.55"
          },
          "PlotsCompleted": {
            "PlotState": "Plotted",
            "Sectors": "1077"
          },
          "PlotsRemaining": {
            "PlotState": "NotPlotted",
            "Sectors": "2575"
          }
        }
      }
    },
    {
      "Id": "Overall",
      "TotalSectors": 593,
      "TotalSeconds": 130022.2524927999,
      "TotalDisks": 1,
      "Uptime": {
        "Seconds": "166820",
        "FormattedTime": "1D 22H 20M 20S"
      },
      "TotalSectorsPerHour": 0,
      "TotalDiskSize": "3.74",
      "TotalPercentComplete": "100.0",
      "TotalRewards": 45,
      "TotalRewardsPerHour": "0.97",
      "TotalPlotsRemaining": 0,
      "TotalPlotsCompleted": 3736,
      "TotalSectorTime": {
        "sectorTime": "-",
        "formattedSectorTime": "-"
      },
      "TotalETA": "-",
      "IndividualDiskDataObj": {
        "01HP23RHWK9M0AB2PTW0B7DAZB": {
          "Id": "01HP23RHWK9M0AB2PTW0B7DAZB",
          "Rewards": {
            "Rewards": 45
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

