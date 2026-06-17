/**
 * PediCheck — Google Apps Script backend for the landing site.
 *
 * Bound to the PediCheck Google Sheet (Extensions -> Apps Script). Deployed as a
 * Web App ("Execute as: Me", "Who has access: Anyone"). The Next.js route
 * handlers in src/app/api/* proxy to this script's /exec URL server-side and
 * pass a shared token, so the URL/token are never exposed to browsers.
 *
 * Two tabs, identical column layout to the NestJS Sheets design so backends are
 * interchangeable with no data migration:
 *   Leads    (A-J): id, createdAt, type, name, email, phone, subject, message, consent, ip
 *   Features (A-I): id, createdAt, title, description, email, consent, status, upvotes, downvotes
 *
 * SETUP: run setupSheets() once from the editor. It writes the header rows, adds
 * the PENDING/APPROVED/REJECTED dropdown to the Features status column, and
 * generates the shared token (printed to the execution log — copy it into the
 * pedicheck env as APPS_SCRIPT_TOKEN). See docs/PEDICHECK_APPS_SCRIPT_SETUP.md.
 */

var LEADS_TAB = 'Leads';
var FEATURES_TAB = 'Features';

var LEADS_HEADERS = ['id', 'createdAt', 'type', 'name', 'email', 'phone', 'subject', 'message', 'consent', 'ip'];
var FEATURE_HEADERS = ['id', 'createdAt', 'title', 'description', 'email', 'consent', 'status', 'upvotes', 'downvotes'];

// Feature column indexes (0-based, matching FEATURE_HEADERS).
var F_ID = 0, F_TITLE = 2, F_DESC = 3, F_STATUS = 6, F_UP = 7, F_DOWN = 8;

/** One-time setup: headers, status dropdown, shared token. Run from the editor. */
function setupSheets() {
  var leads = getSheet(LEADS_TAB);
  if (isFirstRowEmpty(leads)) {
    leads.getRange(1, 1, 1, LEADS_HEADERS.length).setValues([LEADS_HEADERS]);
  }

  var features = getSheet(FEATURES_TAB);
  if (isFirstRowEmpty(features)) {
    features.getRange(1, 1, 1, FEATURE_HEADERS.length).setValues([FEATURE_HEADERS]);
  }

  // Status dropdown (column G) on every data row.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PENDING', 'APPROVED', 'REJECTED'], true)
    .setAllowInvalid(false)
    .build();
  var dataRows = Math.max(features.getMaxRows() - 1, 1);
  features.getRange(2, F_STATUS + 1, dataRows, 1).setDataValidation(rule);

  // Shared token — generated once, then reused. To rotate: delete the
  // SHARED_TOKEN script property and run setupSheets() again.
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('SHARED_TOKEN');
  if (!token) {
    token = Utilities.getUuid();
    props.setProperty('SHARED_TOKEN', token);
  }
  Logger.log('Setup complete.');
  Logger.log('APPS_SCRIPT_TOKEN = ' + token);
  Logger.log('Copy that token into pedicheck .env.local and Vercel as APPS_SCRIPT_TOKEN.');
}

/** Web App entry point. Every action is POSTed by the Next.js route handlers. */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ ok: false, error: 'bad_request' });
    }
    var body = JSON.parse(e.postData.contents);

    if (body.token !== getToken()) {
      return jsonOut({ ok: false, error: 'unauthorized' });
    }

    var payload = body.payload || {};
    var data;
    switch (body.action) {
      case 'createLead':
        data = createLead(payload);
        break;
      case 'createFeature':
        data = createFeature(payload);
        break;
      case 'listFeatures':
        data = listFeatures();
        break;
      case 'vote':
        data = vote(payload);
        break;
      default:
        return jsonOut({ ok: false, error: 'unknown_action' });
    }
    return jsonOut({ ok: true, data: data });
  } catch (err) {
    return jsonOut({ ok: false, error: (err && err.message) ? err.message : String(err) });
  }
}

/** Health check — visiting the /exec URL in a browser returns a small ok. */
function doGet() {
  return jsonOut({ ok: true, data: { service: 'pedicheck', status: 'up' } });
}

function createLead(p) {
  if (!p.email) throw new Error('email_required');
  getSheet(LEADS_TAB).appendRow([
    Utilities.getUuid(),
    new Date().toISOString(),
    p.type || 'contact',
    p.name || '',
    p.email,
    p.phone || '',
    p.subject || '',
    p.message || '',
    p.consent === true ? 'true' : 'false',
    p.ip || '',
  ]);
  return {};
}

function createFeature(p) {
  if (!p.title || !p.description) throw new Error('title_and_description_required');
  var id = Utilities.getUuid();
  getSheet(FEATURES_TAB).appendRow([
    id,
    new Date().toISOString(),
    p.title,
    p.description,
    p.email || '',
    p.email ? (p.consent === true ? 'true' : 'false') : '',
    'PENDING',
    0,
    0,
  ]);
  return { id: id };
}

/** APPROVED rows only, newest first, PII stripped. */
function listFeatures() {
  var values = getSheet(FEATURES_TAB).getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) { // skip header row
    var r = values[i];
    var status = String(r[F_STATUS] || '').trim().toUpperCase();
    if (status !== 'APPROVED') continue;
    out.push({
      id: String(r[F_ID]),
      title: String(r[F_TITLE] || ''),
      description: String(r[F_DESC] || ''),
      upvotes: Number(r[F_UP]) || 0,
      downvotes: Number(r[F_DOWN]) || 0,
    });
  }
  return out.reverse();
}

function vote(p) {
  if (!p.id || (p.direction !== 'up' && p.direction !== 'down')) {
    throw new Error('id_and_direction_required');
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise read-modify-write so votes are not lost
  try {
    var sheet = getSheet(FEATURES_TAB);
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][F_ID]) === String(p.id)) {
        var col = (p.direction === 'up' ? F_UP : F_DOWN) + 1; // 1-based column
        var cell = sheet.getRange(i + 1, col);
        var next = (Number(cell.getValue()) || 0) + 1;
        cell.setValue(next);
        return { value: next };
      }
    }
    throw new Error('not_found');
  } finally {
    lock.releaseLock();
  }
}

// --- helpers ----------------------------------------------------------------

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function isFirstRowEmpty(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return true;
  var firstRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  return firstRow.every(function (c) { return String(c).trim() === ''; });
}

function getToken() {
  return PropertiesService.getScriptProperties().getProperty('SHARED_TOKEN');
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
