Parsing Functions derived from https://github.com/irbujam/ss_log_event_monitor written in Powershell.

# subspaceMetricsExpress

rename config file to  config.json
and update config.json to your correct data.
type in terminal:
```
node ./functions.js
```
 (bad name... ik) and it should start
 
 
 
 Auto start
 
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

# SAMPLE DATA
```{
  "nodeDisplayData": {
    "nodeSyncState": "0",
    "nodePeersConnected": "11",
    "nodeIp": "192.0.0.0:1111",
    "nodeIsRunningOk": true
  },
  "farmerDisplaySector": [
    [
      {
        "Id": [
          { "Id": "11111111AAAAAAAAAAAAAAA" },
          { "Id": "11111111AAAAAAAAAAAAAAB" },
          { "Id": "11111111AAAAAAAAAAAAAAC" },
          { "Id": "11111111AAAAAAAAAAAAAAD" }
        ],
        "Performance": [
          { "Id": "11111111AAAAAAAAAAAAAAA", "SectorsPerHour": "9.93", "MinutesPerSector": "6.04" },
          { "Id": "11111111AAAAAAAAAAAAAAB", "SectorsPerHour": "9.93", "MinutesPerSector": "6.04" },
          { "Id": "11111111AAAAAAAAAAAAAAC", "SectorsPerHour": "9.96", "MinutesPerSector": "6.02" },
          { "Id": "11111111AAAAAAAAAAAAAAD", "SectorsPerHour": "9.96", "MinutesPerSector": "6.02" }
        ],
        "Rewards": [
          { "Id": "11111111AAAAAAAAAAAAAAA", "Rewards": 12 },
          { "Id": "11111111AAAAAAAAAAAAAAB", "Rewards": 15 },
          { "Id": "11111111AAAAAAAAAAAAAAC", "Rewards": 6 },
          { "Id": "11111111AAAAAAAAAAAAAAD", "Rewards": 14 }
        ],
        "Misses": [],
        "PlotsCompleted": [
          { "Id": "11111111AAAAAAAAAAAAAAA", "PlotState": "Plotted", "Sectors": "2324" },
          { "Id": "11111111AAAAAAAAAAAAAAB", "PlotState": "Plotted", "Sectors": "2325" },
          { "Id": "11111111AAAAAAAAAAAAAAC", "PlotState": "Plotted", "Sectors": "2322" },
          { "Id": "11111111AAAAAAAAAAAAAAD", "PlotState": "Plotted", "Sectors": "2321" }
        ],
        "PlotsRemaining": [
          { "Id": "11111111AAAAAAAAAAAAAAA", "PlotState": "NotPlotted", "Sectors": "1328" },
          { "Id": "11111111AAAAAAAAAAAAAAB", "PlotState": "NotPlotted", "Sectors": "1327" },
          { "Id": "11111111AAAAAAAAAAAAAAC", "PlotState": "NotPlotted", "Sectors": "1330" },
          { "Id": "11111111AAAAAAAAAAAAAAD", "PlotState": "NotPlotted", "Sectors": "1331" }
        ],
        "FarmerIp": "0.0.0.0:2222",
        "FarmerIsRunning": true,
        "SummaryData": {
          "Id": "Overall",
          "TotalSectors": 662,
          "TotalSeconds": 239531.611091674,
          "TotalSize": "14.63",
          "TotalMinutesPerSector": 90.49773755656108,
          "TotalETA": "5.6 Days",
          "TotalPercentComplete": "63.6",
          "TotalDisks": 4,
          "Uptime": "60203",
          "TotalRewards": 47
        }
      }
    ],
    [
      {
        "Id": [
          { "Id": "11111111111111111111AAAAAA" },
          { "Id": "222222222222AAAAAAAAAAAAA" },
          { "Id": "AAAAAAAAAAAAAAAAAAAAAA111" }
        ],
        "Performance": [
          { "Id": "11111111111111111111AAAAAA", "SectorsPerHour": "0", "MinutesPerSector": "0" },
          { "Id": "222222222222AAAAAAAAAAAAA", "SectorsPerHour": "9.34", "MinutesPerSector": "6.42" },
          { "Id": "AAAAAAAAAAAAAAAAAAAAAA111", "SectorsPerHour": "9.37", "MinutesPerSector": "6.40" }
        ],
        "Rewards": [
          { "Id": "11111111111111111111AAAAAA", "Rewards": 25 },
          { "Id": "222222222222AAAAAAAAAAAAA", "Rewards": 3 },
          { "Id": "AAAAAAAAAAAAAAAAAAAAAA111", "Rewards": 9 }
        ],
        "Misses": [],
        "PlotsCompleted": [
          { "Id": "11111111111111111111AAAAAA", "PlotState": "Plotted", "Sectors": "3680" },
          { "Id": "222222222222AAAAAAAAAAAAA", "PlotState": "Plotted", "Sectors": "1061" },
          { "Id": "AAAAAAAAAAAAAAAAAAAAAA111", "PlotState": "Plotted", "Sectors": "1039" }
        ],
        PlotsRemaining":[
          {"Id":"01HNK443JWGNNSHNHWYT2ANDVR","PlotState":"NotPlotted","Sectors":"0"},
          {"Id":"01HPKJJFEWFNZEBBXGEN5H8XWV","PlotState":"NotPlotted","Sectors":"2591"},
          {"Id":"01HPKJJGJ0P4BEHRW4T9S9ADEP","PlotState":"NotPlotted","Sectors":"2612"}
        ]
        "FarmerIp": "0.0.0.0:2222",
        "FarmerIsRunning": true,
        "SummaryData": {
          "Id": "Overall",
          "TotalSectors": 662,
          "TotalSeconds": 239538.611091674,
          "TotalSize": "14.61",
          "TotalMinutesPerSector": 90.49773755656108,
          "TotalETA": "5.6 Days",
          "TotalPercentComplete": "63.6",
          "TotalDisks": 4,
          "Uptime": "60203",
          "TotalRewards": 47
        }
      }
    ],
  ]
}
    ```