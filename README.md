# adsb-logger

This is a single program that runs in an infinite loop, recording data from a dump1090 adsb source.  The source may or may not be on the same computer and is referenced by its IP address.

INSTALLATION

1. Expand the source into the desired directory.

2. Create the database to store each aircraft sighting:
   cd to the db directory and type: 
   sqlite3 sql_scripts/create_db.sql

3. Currently this runs on the command line and outputs each sighting to stdout as well as storing the sighting into the sighting table.  To start this process:
   cd to the service directory and type:
   node service_write_sightings.js

4. Modify the code of service_write_sightings.js and change the IP address of AIRCRAFT_SIGHTINGS_SERVER to reflect your local environment.  You may set it to be localhost but be mindful of the space requirements of this computer.
