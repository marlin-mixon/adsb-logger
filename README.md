# adsb-logger 0.1a

This is a single program that runs in an infinite loop, recording data from a dump1090 adsb source.  The source may or may not be on the same computer and is referenced by its IP address.

Possible issues: This code may need to be optimized to ensure all sightings are being recorded.  It currently runs every second and does NOT consider the history_n files.

PREREQUISITES:

1. Nodejs
2. npm (for installing node packages)
3. Node Packages: sqlite3, fs
4. Sqlite3

INSTALLATION:

1. Expand the source into the desired directory.

2. Create the database to store each aircraft sighting:
   cd to the db directory and type: 
   sqlite3 sql_scripts/create_db.sql

3. Modify the code of service_write_sightings.js and change the IP address of AIRCRAFT_SIGHTINGS_SERVER to reflect your local environment.  You may set it to be localhost but always be mindful of the space requirements of the computer you run it on becaue the database size can grow quickly in an aircraft-active location.

4. Currently this runs on the command line and only outputs database errors to stdout as well as storing the sighting into the sighting table.  To start this process:
   cd to the service directory and type:
   node service_write_sightings.js


