// Configuration-only rotation readiness. Never handle bot tokens in public code.
export const rotationPolicy=Object.freeze({
  credentialLocation:"trusted-server-only",
  maxCredentialAgeDays:30,
  overlapMinutes:5,
  auditRequired:true,
  revokePreviousAfterVerification:true
});
export function rotationPlan({service,now=new Date(),periodDays=rotationPolicy.maxCredentialAgeDays}={}){
  if(typeof service!=="string"||!/^[a-z0-9_.-]{1,80}$/i.test(service))throw Error("Invalid service");
  if(!Number.isFinite(periodDays)||periodDays<=0)throw Error("Invalid period");
  return {service,createdAt:now.toISOString(),nextReviewAt:new Date(now.getTime()+periodDays*86400000).toISOString(),steps:["Create replacement in provider","Store replacement in secret manager","Switch backend references","Verify health and authentication","Revoke old credential","Record audit event"]};
}
export function secretReference(name){
  if(!/^[A-Z][A-Z0-9_]{2,100}$/.test(name))throw Error("Invalid secret name");
  return {name,location:"server-environment",valueExposed:false};
}
