const LOGSQL_ENABLED = /^(1|true|yes)$/i.test(process.env.LOGSQL || '');
const BLUE  = '\x1b[34m';
const RED   = '\x1b[31m';
const RESET = '\x1b[0m';

function ts() {
	return (new Date().toISOString().slice(0,19).replace('T',' '));
}

export function sql_log(msg, errorFlag = false, force = false) {
	if (!errorFlag && !LOGSQL_ENABLED && !force) {
		return ;
	}

	const color		= errorFlag ? RED : BLUE;
	const prefix	= `${color}[${ts()}]`;
	const suffix	= RESET;

	if (errorFlag) {
		console.error(`${prefix} SQL Error: ${msg} ${suffix}`);
	} else {
		console.log(`${prefix} ${msg} ${suffix}`);
	}
}

export function sql_error(err, context='') {
	const msg = (err && err.stack) ? err.stack : String(err);
	sql_log(`${context} ${msg}`, true);
}