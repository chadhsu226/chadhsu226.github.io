/**
 * 銘傳管理學院導覽・學生參與版 名單後台（Google Apps Script）
 * 貼到「擴充功能 → Apps Script」，部署成網頁應用程式。
 * 試算表的「通過」欄打勾，那位同學才會出現在所有人的地圖上。
 */
const SHEET = '名單';
const HEAD = ['送出時間', 'id', 'token', '系所代碼', '自填科系', '姓名', '介紹', '外觀', '通過', '備註'];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.appendRow(HEAD);
    s.setFrozenRows(1);
    s.getRange('I2:I1000').insertCheckboxes();
    s.hideColumns(2, 2); // 隱藏 id、token
  }
  return s;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(x, n) {
  return String(x == null ? '' : x).replace(/[<>]/g, '').trim().slice(0, n);
}

/** 網頁讀名單：只回傳「通過」的同學，不含 token */
function doGet() {
  const v = sheet_().getDataRange().getValues();
  const members = [];
  for (let i = 1; i < v.length; i++) {
    const r = v[i];
    if (r[8] !== true) continue;
    let look = {};
    try { look = JSON.parse(r[7]); } catch (e) {}
    members.push({ id: r[1], dept: r[3], deptName: r[4], name: r[5], intro: r[6], look: look });
  }
  return out_({ members: members, updated: new Date().toISOString() });
}

/** 網頁送出報名、更新或離開 */
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const s = sheet_();
    const v = s.getDataRange().getValues();
    let row = -1;
    for (let i = 1; i < v.length; i++) if (v[i][1] === d.id) { row = i + 1; break; }
    if (row > 0 && v[row - 1][2] !== d.token) return out_({ ok: false, error: 'token' });

    if (d.action === 'delete') {
      if (row > 0) s.deleteRow(row);
      return out_({ ok: true });
    }

    const vals = [new Date(), clean_(d.id, 24), clean_(d.token, 40), clean_(d.dept, 8), clean_(d.deptName, 10),
      clean_(d.name, 12), clean_(d.intro, 40), JSON.stringify(d.look || {}).slice(0, 400), false, ''];
    if (!vals[5]) return out_({ ok: false, error: 'name' });

    if (row > 0) {
      const old = v[row - 1];
      // 只改外表就維持原本的審核結果；改了名字、科系或介紹就要重新審核
      const same = old[3] === vals[3] && old[4] === vals[4] && old[5] === vals[5] && old[6] === vals[6];
      vals[8] = same ? old[8] === true : false;
      vals[9] = old[9];
      s.getRange(row, 1, 1, 10).setValues([vals]);
      s.getRange(row, 9).insertCheckboxes();
      if (vals[8]) s.getRange(row, 9).check(); else s.getRange(row, 9).uncheck();
    } else {
      s.appendRow(vals);
      const r = s.getLastRow();
      s.getRange(r, 9).insertCheckboxes().uncheck();
    }
    return out_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
