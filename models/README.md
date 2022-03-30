# models
Shared Dibs Models
## Versioning
- Full version updates should be used sparingly, such as upgrading sequelize or something.
- Major release versioning updates should be reserved for adding new models.
- Minor release versioning updates should be used for updating functionality of existing models.
## Deployment
Travis will automatically deploy migrations to the production database and updated module to npm.
## Created Functions
### rank_user_matches(string **VARCHAR**, dibs_users **RECORD**):
Does a Levenshtein comparison between a string and elements of the dibs user entries selected. Returns an integer representing the ranking.
### get_current_end_of_month()
Gets the end date of the current month and returns it as a timestamp
