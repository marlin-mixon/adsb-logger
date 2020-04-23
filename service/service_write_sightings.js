/*

history_n.json
These files are historical copies of aircraft.json at (by default) 30 second intervals. They follow exactly the same format as aircraft.json. To know how many are valid, see receiver.json ("history" value). They are written in a cycle, with history_0 being overwritten after history_119 is generated, so history_0.json is not necessarily the oldest history entry. To load history, you should:

read "history" from receiver.json.
load that many history_N.json files
sort the resulting files by their "now" values
process the files in order

*/

const POLLING_RATE_MILISECONDS = 1000;
const AIRCRAFT_SIGHTINGS_SERVER = "192.168.1.72";

function winnow_insert(sql) {
  // Remove undefined values from insert
  sql = sql.replace(/undefined/g, 'NULL');
  sql = sql.replace(/'NULL'/g, 'NULL');
  return sql;
}

function insert_sighting(sighting) {

  for (let aircraft of sighting.aircraft) {

    let insert = `INSERT INTO sighting ( 
	  hex,
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
      // 
    });
  }	

  //console.log(mess);
}
    
const sqlite3 = require('sqlite3').verbose();                                                                                                                                           
const db = new sqlite3.Database('../db/aircraft.db');                                                                                                                          

function get_all_planes_and_save() {
  const http = require('http');
  var options = {
    host: AIRCRAFT_SIGHTINGS_SERVER,
    path: '/dump1090-fa/data/aircraft.json'
  };

  var req = http.get(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
    // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      // ...and/or process the entire body here.
      var sighting = JSON.parse(body);

      insert_sighting(sighting);  
    })
  });

  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  });
}

setInterval(get_all_planes_and_save, POLLING_RATE_MILISECONDS);
