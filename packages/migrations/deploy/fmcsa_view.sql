-- Deploy quikbroker:fmcsa_view to pg
-- requires: appschema

BEGIN;

-- Create a view that queries the fmcsa.fmcsa_2025Mar table
CREATE VIEW app.fmcsa_carrier_view AS
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
FROM fmcsa.fmcsa_2025Mar;

-- Create indexes to improve search performance
CREATE INDEX IF NOT EXISTS idx_fmcsa_dot_number 
ON fmcsa.fmcsa_2025Mar(dot_number);

CREATE INDEX IF NOT EXISTS idx_fmcsa_legal_name 
ON fmcsa.fmcsa_2025Mar(legal_name);

CREATE INDEX IF NOT EXISTS idx_fmcsa_dba_name 
ON fmcsa.fmcsa_2025Mar(dba_name);

COMMIT;