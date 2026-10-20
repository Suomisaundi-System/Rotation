import {createHash,randomBytes,timingSafeEqual} from "node:crypto";
// Trusted Node.js only. Holds credentials in process memory; integrate secret manager in production.
export class RotationStore {
 #active;#previous=null;#expires=0;#audit;
 constructor({initialSecret,overlapMs=300000,audit=()=>{}}={}){
  if(typeof initialSecret!=="string"||initialSecret.length<32)throw Error("Strong initial secret required");
  if(!Number.isSafeInteger(overlapMs)||overlapMs<0||overlapMs>3600000)throw Error("Invalid overlap");
  this.overlapMs=overlapMs;this.#active=this.#hash(initialSecret);this.#audit=audit;
 }
 #hash(secret){return createHash("sha256").update(secret).digest();}
 #same(a,b){return timingSafeEqual(a,b);}
 verify(secret){
  if(typeof secret!=="string")return false;
  const hash=this.#hash(secret);
  if(this.#same(hash,this.#active))return true;
  if(this.#previous&&Date.now()<this.#expires&&this.#same(hash,this.#previous))return true;
  return false;
 }
 rotate(){
  const next=randomBytes(32).toString("base64url");
  this.#previous=this.#active;this.#active=this.#hash(next);this.#expires=Date.now()+this.overlapMs;
  this.#audit({event:"credential-rotated",at:new Date().toISOString(),overlapUntil:new Date(this.#expires).toISOString()});
  return next; // Return exactly once to trusted caller; never log.
 }
 revokePrevious(){
  this.#previous=null;this.#expires=0;
  this.#audit({event:"previous-credential-revoked",at:new Date().toISOString()});
 }
 status(){return {previousValid:!!this.#previous&&Date.now()<this.#expires,overlapUntil:this.#previous?new Date(this.#expires).toISOString():null};}
}
