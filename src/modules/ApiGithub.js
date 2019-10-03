const github = require('octonode');

/**
 * init
 * Bağlanılaca olan hesap bilgileri buraya girilecek
 */
export const client = github.client('eee307a3daff5a1fab7558b5521077a80c2bb811');
export const gitOrgName = "GtuDevOps";

const gitOrg = client.org(gitOrgName);

/*
function callback (err, status, body, headers) {
  console.log(err);     //json object
  console.log(status);  //json object
  console.table(body);  //json object
  console.log(headers); //json object
};
*/

export default gitOrg;
export const Github = client;
export const gitTeam = client.team("admin");
