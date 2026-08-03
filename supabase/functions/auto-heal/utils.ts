export function success(
  logs: string[],
  text: string,
) {

  logs.push(`✅ ${text}`);

}

export function warning(
  logs: string[],
  text: string,
) {

  logs.push(`⚠ ${text}`);

}

export function error(
  logs: string[],
  text: string,
) {

  logs.push(`❌ ${text}`);

}

export function info(
  logs: string[],
  text: string,
) {

  logs.push(`ℹ ${text}`);

}
