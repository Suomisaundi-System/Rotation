import test from "node:test";
import assert from "node:assert/strict";
import {RotationStore} from "./rotation.mjs";
test("rotation overlap and revocation",()=>{
 const old="a".repeat(40),s=new RotationStore({initialSecret:old});
 assert.equal(s.verify(old),true);
 const next=s.rotate();
 assert.equal(s.verify(next),true);
 assert.equal(s.verify(old),true);
 assert.equal(s.verify("bad"),false);
 s.revokePrevious();
 assert.equal(s.verify(old),false);
 assert.equal(s.verify(next),true);
});
test("reject weak secrets",()=>assert.throws(()=>new RotationStore({initialSecret:"short"})));
test("no previous credential if zero overlap",()=>{
 const old="a".repeat(40),s=new RotationStore({initialSecret:old,overlapMs:0});
 s.rotate();assert.equal(s.verify(old),false);
});
