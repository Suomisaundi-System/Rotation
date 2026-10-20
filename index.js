export * from "./system.js";
const main="https://suomisaundi-system.github.io/";
const panel=document.createElement("main");
panel.style.cssText="display:grid;place-content:center;min-height:80vh;text-align:center;font:16px system-ui;padding:1rem";
const h=document.createElement("h1");h.textContent="Nothing to see here";
const p=document.createElement("p");p.textContent="Enter through Suomisaundi System. Redirecting in 10 seconds.";
const a=document.createElement("a");a.href=main;a.textContent="Enter Suomisaundi System";
panel.append(h,p,a);document.body.append(panel);
setTimeout(()=>location.replace(main),10000);
