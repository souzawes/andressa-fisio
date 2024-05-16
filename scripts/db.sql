CREATE OR REPLACE FUNCTION check_recurring_session_time_conflict() RETURNS TRIGGER AS
$$
IF EXISTS (
    SELECT 1
    FROM RE
)
$$