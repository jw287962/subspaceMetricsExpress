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

