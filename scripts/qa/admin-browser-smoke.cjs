// AROMIA isolated real-browser QA (no production API, database, secrets or external images).
// Run after the web build with PLAYWRIGHT_PACKAGE_PATH set to an installed local package.
const {createRequire}=require('node:module');
const {spawn}=require('node:child_process');
const {createServer}=require('node:http');
const {mkdirSync,rmSync}=require('node:fs');
const {join,resolve}=require('node:path');
const {setTimeout:delay}=require('node:timers/promises');
const assert=require('node:assert/strict');
const requireBrowser=createRequire(join(process.env.PLAYWRIGHT_PACKAGE_PATH||'/nonexistent','package.json'));
const {chromium}=requireBrowser('playwright');

const ROOT=resolve(__dirname,'../..');
const WEB=join(ROOT,'apps/web');
const TMP_IMG=join(WEB,'public','qa-browser-fixtures');
const PASSWORD='aromia-qa-browser-password-not-for-production';
const COOKIE_SECRET='aromia-qa-browser-long-fixture-cookie-secret-not-for-production';
const ADMIN_TOKEN='aromia-qa-browser-test-bearer';
const WEB_PORT=3107, API_PORT=4407;
const base=`http://localhost:${WEB_PORT}`;
const state={apiCalls:0,writeCalls:0,credentialLeak:false};

const fakeApi=createServer((req,res)=>{
  state.apiCalls++;
  if(req.method!=='GET')state.writeCalls++;
  if(req.headers['x-editorial-review-token'])state.credentialLeak=true;
  if(req.headers.authorization!==`Bearer ${ADMIN_TOKEN}`) {
    res.writeHead(403,{'content-type':'application/json'});res.end(JSON.stringify({error:'unauthorized_fixture'}));return;
  }
  const path=new URL(req.url,'http://localhost');
  const send=(status,body)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));};
  if(path.pathname==='/api/admin/intelligence/visual-reviews'&&path.searchParams.get('slug')==='qa-perfume-edt') {
    return send(200,{reviews:[{
      id:51,review_id:'qa-review-51',product_slug:'qa-perfume-edt',
      product_fingerprint:'b'.repeat(64),image_sha256:'c'.repeat(64),
      operator_note:'Fixture: identity and image rights not independently verified.',
      evidence:{identity:'EDT differs from reference',rights:'Pending',visual:'Pending'},
      status:'recorded_pending_independent_verification',
      actor:'publisher_credential',recorded_at:'2026-11-17T21:00:00Z'
    }],publication:'blocked',identityVerified:false,rightsVerified:false});
  }
  if(path.pathname==='/api/admin/intelligence/visual-decisions/51'){
    return send(200,{decisions:[{
      id:3,observation_id:51,decision_key:'qa-rejected',
      decision:'rejected',reason:'Incorrect commercial label on visual asset',
      actor:'publisher_credential',recorded_at:'2026-11-17T21:05:00Z'
    }],approval:false,publication:'blocked',applied:false});
  }
  return send(404,{error:'fixture_endpoint_not_found'});
});
const listen=(server,port)=>new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(port,'127.0.0.1',resolve);
});
async function waitForWeb(child){
  for(let i=0;i<90;i++){
    if(child.exitCode!==null)throw new Error(`Next.js exited prematurely: ${child.exitCode}`);
    try{
      const r=await fetch(`${base}/admin/login`,{redirect:'manual'});
      if(r.status===200)return;
    }catch{}
    await delay(1000);
  }
  throw new Error('Timed out waiting for isolated Next.js server');
}
const report=(name,detail)=>process.stdout.write(`PASS ${name}${detail?` — ${detail}`:''}\n`);
(async()=>{
  let server, browser;
  let webLogs='';
  try{
    mkdirSync(TMP_IMG,{recursive:true});
    const sharp=require(join(WEB,'node_modules/sharp'));
    await sharp({create:{width:40,height:80,channels:3,background:{r:30,g:100,b:125}}})
      .png().toFile(join(TMP_IMG,'current.png'));
    await sharp({create:{width:40,height:80,channels:3,background:{r:32,g:101,b:126}}})
      .png().toFile(join(TMP_IMG,'candidate.png'));
    await listen(fakeApi,API_PORT);
    server=spawn(process.execPath,[join(WEB,'node_modules/next/dist/bin/next'),'start','-p',String(WEB_PORT),'--hostname','127.0.0.1'],{
      cwd:WEB,env:{...process.env,NODE_ENV:'production',ADMIN_PASSWORD:PASSWORD,
        ADMIN_SESSION_SECRET:COOKIE_SECRET,ADMIN_API_TOKEN:ADMIN_TOKEN,
        API_URL:`http://127.0.0.1:${API_PORT}`,VISUAL_EVIDENCE_INSPECTION_ENABLED:'true',
        INTELLIGENCE_ENABLED:'true',VISUAL_REVIEW_JOURNAL_ENABLED:'true',
        GITHUB_PROGRESS_TOKEN:'',NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']
    });
    server.stdout.on('data',d=>webLogs+=String(d).slice(-2000));
    server.stderr.on('data',d=>webLogs+=String(d).slice(-2000));
    await waitForWeb(server);
    browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,headless:true,args:['--no-sandbox']});
    const page=await browser.newPage({viewport:{width:390,height:844}});
    page.setDefaultTimeout(20000);

    await page.goto(`${base}/admin/revision-visual`);
    assert.match(page.url(),/\/admin\/login/);
    report('Anonymous redirect to login');

    await page.getByLabel('Contraseña').fill('incorrect');
    await page.getByRole('button',{name:'Ingresar'}).click();
    await page.getByRole('alert').filter({hasText:'Contraseña incorrecta'}).waitFor();
    assert.match(await page.getByRole('alert').filter({hasText:'Contraseña incorrecta'}).innerText(),/incorrecta/i);
    report('Incorrect password rejected');
    await page.getByLabel('Contraseña').fill(PASSWORD);
    await page.getByRole('button',{name:'Ingresar'}).click();
    await page.waitForURL(/\/admin(?:\?|$)/);
    report('Signed admin login and redirect');

    await page.goto(`${base}/admin/progreso`);
    await page.getByRole('heading',{name:'Estado de Aromia'}).waitFor();
    const bar=page.getByRole('progressbar',{name:'Hitos de proyecto verificados'});
    await bar.waitFor();
    assert.equal(await bar.getAttribute('aria-valuenow'),'10');
    report('Accessible milestone bar', '1/10 verified, no inflated progress');

    await page.goto(`${base}/admin/revision-visual`);
    await page.getByLabel('Slug del perfume').fill('qa-perfume-edt');
    await page.getByRole('button',{name:'Consultar'}).click();
    await page.getByRole('heading',{name:'Historial: qa-perfume-edt'}).waitFor();
    await page.getByRole('button',{name:'Ver decisiones supervisadas'}).click();
    await page.getByText('Imagen rechazada').waitFor();
    report('Private per-perfume history + rejection disposition');

    await page.getByLabel('Ruta pública del archivo').fill('/qa-browser-fixtures/current.png');
    await page.getByRole('button',{name:'Inspeccionar archivo'}).click();
    await page.getByText('SHA-256 real:',{exact:false}).waitFor();
    await page.getByRole('heading',{name:'Fidelidad de identidad del producto'}).waitFor();
    report('Real local raster bytes inspected and presented');
    await page.getByLabel('Referencia maestra del producto real').fill('https://example.org/qa-edt-reference');
    const label=page.getByRole('group',{name:'Etiqueta y disposición'});
    await label.getByLabel('Resultado de inspección').selectOption('mismatch');
    await label.getByLabel('Observación').fill('Incorrect printed EDT concentration on bottle');
    await label.getByLabel('Referencia de comparación').fill('https://example.org/qa-edt-reference');
    await page.getByRole('button',{name:'Evaluar discrepancias sin aprobar'}).click();
    await page.getByText('Recurso incompatible: revisión bloqueada').waitFor();
    report('Material identity mismatch blocks asset');

    await page.getByLabel('Ruta local de la imagen candidata').fill('/qa-browser-fixtures/candidate.png');
    await page.getByLabel('Motivo editorial').fill('Candidate only: correct product label requires independent review.');
    await page.getByRole('button',{name:'Simular sustitución, sin aplicar'}).click();
    await page.getByText('Simulación preparada · ningún archivo modificado').waitFor();
    assert.equal(await page.getByText('Simulación preparada · ningún archivo modificado').count(),1);
    report('Distinct candidate produces non-applying rollback dry run');

    assert.equal(state.writeCalls,0,'Unexpected API write during read-only admin flow');
    assert.equal(state.credentialLeak,false,'Publisher credential crossed into fake backend');
    assert.ok(state.apiCalls>=2,'Expected real admin proxy calls');
    report('No backend writes, no Publisher credential leakage');

    await page.setViewportSize({width:1365,height:860});
    await page.getByRole('heading',{name:'Revisión visual'}).waitFor();
    assert.equal(await page.locator('body').evaluate(el=>el.scrollWidth<=window.innerWidth+10),true,
      'Visual admin page has horizontal overflow at desktop viewport');
    report('Desktop layout without horizontal overflow');
  }catch(e){process.stderr.write(`BROWSER QA FAILURE: ${e.stack||e}\nServer output:\n${webLogs.slice(-3000)}\n`);process.exitCode=1;
  }finally{
    if(browser)await browser.close().catch(()=>{});
    if(server){server.kill('SIGTERM');await delay(500);}
    await new Promise(resolve=>fakeApi.close(()=>resolve()));
    rmSync(TMP_IMG,{recursive:true,force:true});
  }
})();
