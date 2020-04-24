/* service that polls dump1090 server and stores the result into a sqlite3 database.  
   Currently not storing mlat values but intend to in a subsequent version  */

//++++++++++++++++++++++++++++++++++++++++++
const POLLING_RATE_MILISECONDS = 1000;
const AIRCRAFT_SIGHTINGS_SERVER = "192.168.1.72";
const DATABASE_PATH = "../db/aircraft.db";
  
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database(DATABASE_PATH); 
const fs = require('fs') 

const debug = {"log_http" : false};  // http logging turned off

function winnow_insert(sql) {
  // Remove undefined values from insert
  sql = sql.replace(/undefined/g, 'NULL');
  sql = sql.replace(/'NULL'/g, 'NULL');
  return sql;
}

//++++++++++++++++++++++++++++++++++++++++++
function insert_sighting(sighting) {

  for (let aircraft of sighting.aircraft) {

    let insert = `INSERT INTO sighting ( 
      hex,
      flight,
      now, 
      alt_baro, 
      alt_geom, 
      gs, 
      track, 
      baro_rate, 
      squawk, 
      emergency, 
      nav_qnh, 
      nav_altitude_mcp, 
      nav_heading, 
      lat, 
      lon, 
      nic, 
      rc,
      seen_pos, 
      version, 
      nic_baro, 
      nac_p, 
      nac_v, 
      sil, 
      sil_type, 
      gva, 
      sda, 
      mlat, 
      tisb, 
      messages, 
      seen, 
      rssi     
    ) VALUES (
      '${aircraft.hex}',
      '${aircraft.flight}',
      ${sighting.now},
      ${aircraft.alt_baro}, 
      ${aircraft.alt_geom}, 
      ${aircraft.gs}, 
      ${aircraft.track}, 
      ${aircraft.baro_rate}, 
      '${aircraft.squawk}', 
      '${aircraft.emergency}', 
      ${aircraft.nav_qnh}, 
      ${aircraft.nav_altitude_mcp}, 
      ${aircraft.nav_heading}, 
      ${aircraft.lat}, 
      ${aircraft.lon}, 
      ${aircraft.nic}, 
      ${aircraft.rc},
      ${aircraft.seen_pos}, 
      ${aircraft.version}, 
      ${aircraft.nic_baro}, 
      ${aircraft.nac_p}, 
      ${aircraft.nac_v}, 
      ${aircraft.sil}, 
      '${aircraft.sil_type}', 
      ${aircraft.gva}, 
      ${aircraft.sda}, 
      NULL, 
      NULL, 
      ${aircraft.messages}, 
      ${aircraft.seen}, 
      ${aircraft.rssi} 
    );`;

    insert = winnow_insert(insert);

    db.run(insert, function(err){
      if (err !== null) {
        console.log( `Write to database failed: err=${err}
        statement="${insert}"` );
      }
    });
  }    

  //console.log(mess);
}
    
//++++++++++++++++++++++++++++++++++++++++++
function get_all_planes_and_save() {
  const http = require('http');
  var options = {
    host: AIRCRAFT_SIGHTINGS_SERVER,
    path: '/dump1090-fa/data/aircraft.json'
  };

  var req = http.get(options, function(res) {

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
    // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      // ...and/or process the entire body here.
      var sighting = JSON.parse(body);
        
      if (debug.log_http) {
        fs.writeFile('debug_log.js', sighting, err => {
          if (err) {
            console.error(err);
            return;
          };
        });
      }

      insert_sighting(sighting);  
    })
  });

  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
}

//++++++++++++++++++++++++++++++++++++++++++
setInterval(get_all_planes_and_save, POLLING_RATE_MILISECONDS);  // Infinite loop
