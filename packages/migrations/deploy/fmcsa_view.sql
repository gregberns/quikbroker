-- Deploy quikbroker:fmcsa_view to pg
-- requires: appschema

BEGIN;


CREATE TABLE IF NOT EXISTS fmcsa.fmcsa_current (
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
);

-- Create a view that queries the fmcsa.fmcsa_2025Mar table
CREATE OR REPLACE VIEW app.fmcsa_carrier_view AS
SELECT
    dot_number,
    legal_name,
    dba_name,
    carrier_operation,
    hm_flag,
    pc_flag,
    phy_street,
    phy_city,
    phy_state,
    phy_zip,
    phy_country,
    mailing_street,
    mailing_city,
    mailing_state,
    mailing_zip,
    mailing_country,
    telephone,
    fax,
    email_address,
    mcs150_date,
    mcs150_mileage,
    mcs150_mileage_year,
    add_date,
    oic_state,
    nbr_power_unit,
    driver_total,
    recent_mileage,
    recent_mileage_year,
    vmt_source_id,
    private_only,
    authorized_for_hire,
    exempt_for_hire,
    private_property,
    private_passenger_business,
    private_passenger_nonbusiness,
    migrant,
    us_mail,
    federal_government,
    state_government,
    local_government,
    indian_tribe,
    op_other
FROM fmcsa.fmcsa_current;

-- Create indexes to improve search performance
CREATE INDEX IF NOT EXISTS idx_fmcsa_dot_number 
ON fmcsa.fmcsa_current(dot_number);

CREATE INDEX IF NOT EXISTS idx_fmcsa_legal_name 
ON fmcsa.fmcsa_current(legal_name);

CREATE INDEX IF NOT EXISTS idx_fmcsa_dba_name 
ON fmcsa.fmcsa_current(dba_name);

COMMIT;
