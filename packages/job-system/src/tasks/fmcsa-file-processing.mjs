import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import pg from "pg";
import { from as copyFrom } from "pg-copy-streams";


async function checkTableExists(pgClient, tableSchema, tableName) {
  const {
    rows: [{exists}],
  } = await pgClient.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = $1
          AND table_name = $2
      );`, 
      [ tableSchema, tableName ]
    );

  return !!exists;
}

async function createTable(pgClient, tableSchema, tableName) {
  // const {
  //   rows,
  // } = 
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS ${tableSchema}.${tableName} (
      dot_number TEXT,
      legal_name TEXT,
      dba_name TEXT,
      carrier_operation TEXT,
      hm_flag TEXT,
      pc_flag TEXT,
      phy_street TEXT,
      phy_city TEXT,
      phy_state TEXT,
      phy_zip TEXT,
      phy_country TEXT,
      mailing_street TEXT,
      mailing_city TEXT,
      mailing_state TEXT,
      mailing_zip TEXT,
      mailing_country TEXT,
      telephone TEXT,
      fax TEXT,
      email_address TEXT,
      mcs150_date TEXT,
      mcs150_mileage TEXT,
      mcs150_mileage_year TEXT,
      add_date TEXT,
      oic_state TEXT,
      nbr_power_unit TEXT,
      driver_total TEXT,
      recent_mileage TEXT,
      recent_mileage_year TEXT,
      vmt_source_id TEXT,
      private_only TEXT,
      authorized_for_hire TEXT,
      exempt_for_hire TEXT,
      private_property TEXT,
      private_passenger_business TEXT,
      private_passenger_nonbusiness TEXT,
      migrant TEXT,
      us_mail TEXT,
      federal_government TEXT,
      state_government TEXT,
      local_government TEXT,
      indian_tribe TEXT,
      op_other TEXT
    )`
    );
}

async function uploadFile(pgClient, tableSchema, tableName) {
  const command = `COPY ${tableSchema}.${tableName} FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',')`;
  // const uploadFilePath = `/worker/files/test.txt`;
  const uploadFilePath = `/worker/files/FMCSA_CENSUS1_2025Mar/FMCSA_CENSUS1_2025Mar.txt`

  await pgClient.query("SET client_encoding = 'latin1';");

  const ingestStream = pgClient.query(copyFrom(command));
  const sourceStream = fs.createReadStream(uploadFilePath);
  await pipeline(sourceStream, ingestStream);
}


async function run(pgClient) {
  const tableSchema = "fmcsa";
  const tableName = "fmcsa_2025Mar";

  const tableExists = await checkTableExists(pgClient, tableSchema, tableName)
  if (!tableExists) {
    console.log(`Database Table Not Found: ${tableSchema}.${tableName}.`)
    await createTable(pgClient, tableSchema, tableName)
    console.log(`Database Table Created: ${tableSchema}.${tableName}.`)
  } else {
    console.log(`Database Table Found: ${tableSchema}.${tableName}.`)
  }
  console.log(`Start Upload File.`)
  await uploadFile(pgClient, tableSchema, tableName)
}

async function runner(payload, helpers) {
  // async is optional, but best practice
  helpers.logger.debug(`Received ${JSON.stringify(payload)}`);

  await helpers.withPgClient(async (pgClient) => 
    await run(pgClient)
  );
}

export default runner;
