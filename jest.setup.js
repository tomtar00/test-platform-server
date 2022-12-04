const shell = require('shelljs')
shell.config.silent = true;
require('dotenv').config();
const backupPath = 'data/test_db_backup.sql'

module.exports = () => {

    const pass = process.env.DB_PASS_DEV
    const port = process.env.DB_PORT_DEV
    const user = process.env.DB_USER_DEV
    const base = process.env.DB_BASE_DEV

    // restore database from backup
    const restore = shell.exec(`SET PGPASSWORD=${pass}&& psql -p ${port} -U ${user} ${base} < ${backupPath}`)
    if (restore.stderr) {
        throw restore.stderr
    }

}