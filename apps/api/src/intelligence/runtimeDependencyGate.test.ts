import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Lockfile verification, not proof that a vulnerable code path is reachable.
// These are the minimum fixed versions from the audited Express 4.x dependency line.
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));
const version=(name:string):string|undefined=>lock.packages?.[`node_modules/${name}`]?.version;
const numeric=(value:string)=>value.split('.').slice(0,3).map(Number);
const atLeast=(actual:string,minimum:string)=>{
  const a=numeric(actual),b=numeric(minimum);
  for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]>b[i];}
  return true;
};
test('server lockfile does not pin known-vulnerable Express 4 proxy/header parsing dependencies',()=>{
  for(const [name,minimum] of [
    ['proxy-addr','2.0.8'],
    ['body-parser','1.20.9'],
    ['js-yaml','3.15.2'],
    ['qs','6.16.0']
  ]){
    const current=version(name);
    assert.ok(current && atLeast(current,minimum),`${name}: requires >=${minimum}, installed ${current??'missing'}`);
  }
});
test('existing direct Express stack remains 4.x until a separate compatibility-reviewed migration',()=>{
  assert.match(version('express')??'',/^4\./);
  assert.match(version('multer')??'',/^2\./);
});
