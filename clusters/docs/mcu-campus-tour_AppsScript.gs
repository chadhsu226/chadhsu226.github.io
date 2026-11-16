/**
 * 銘傳管理學院導覽・學生參與版 名單後台（Google Apps Script）v2
 * 貼到「擴充功能 → Apps Script」，部署成網頁應用程式。
 * 試算表「通過」欄（I 欄）打勾，那位同學才會出現在所有人的地圖上。
 *
 * v2 修正：
 * - 不再預先把 I2:I1000 全部變成勾選框（那會讓新報名被寫到第 1001 列，很難找到）。
 * - 新報名一律寫在「最後一位同學」的下一列。
 * - 「通過」欄打勾、或填 TRUE／V／是／通過 都算通過。
 * - 網址後面加 ?check=1 可以看診斷資訊（只有數量，不含個資）。
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
    s.hideColumns(2, 2); // 隱藏 id、token
  }
  return s;
}

/** 依 B 欄（id）找最後一位同學在第幾列 */
function lastMemberRow_(s) {
  const n = s.getMaxRows();
  const ids = s.getRange(1, 2, n, 1).getValues();
  for (let i = n - 1; i >= 1; i--) if (String(ids[i][0]).trim() !== '') return i + 1;
  return 1;
}

function approved_(v) {
  if (v === true) return true;
  return /^(true|v|y|yes|是|通過|ok|1|✓|✔)$/i.test(String(v).trim());
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(x, n) {
  return String(x == null ? '' : x).replace(/[<>]/g, '').trim().slice(0, n);
}

/** 網頁讀名單：只回傳「通過」的同學，不含 token */
function doGet(e) {
  const s = sheet_();
  const last = lastMemberRow_(s);
  const v = last > 1 ? s.getRange(2, 1, last - 1, 10).getValues() : [];
  const members = [];
  let rows = 0, ok = 0, ticked = 0;
  v.forEach(r => {
    if (String(r[1]).trim() === '') return;
    rows++;
    if (approved_(r[8])) ticked++;
    if (!approved_(r[8]) || String(r[5]).trim() === '') return;
    let look = {};
    try { look = JSON.parse(r[7]); } catch (err) {}
    members.push({ id: r[1], dept: r[3], deptName: r[4], name: r[5], intro: r[6], look: look });
    ok++;
  });
  if (e && e.parameter && e.parameter.check) {
    return out_({ sheet: s.getName(), lastMemberRow: last, members: rows, approved: ticked, published: ok });
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
    const last = lastMemberRow_(s);
    const v = last > 1 ? s.getRange(2, 1, last - 1, 10).getValues() : [];
    let row = -1;
    for (let i = 0; i < v.length; i++) if (v[i][1] === d.id) { row = i + 2; break; }
    if (row > 0 && v[row - 2][2] !== d.token) return out_({ ok: false, error: 'token' });

    if (d.action === 'delete') {
      if (row > 0) s.deleteRow(row);
      return out_({ ok: true });
    }

    const vals = [new Date(), clean_(d.id, 24), clean_(d.token, 40), clean_(d.dept, 8), clean_(d.deptName, 10),
      clean_(d.name, 12), clean_(d.intro, 40), JSON.stringify(d.look || {}).slice(0, 400), false, ''];
    if (!vals[5]) return out_({ ok: false, error: 'name' });

    if (row > 0) {
      const old = v[row - 2];
      // 只改外表就維持原本的審核結果；改了名字、科系或介紹就要重新審核
      const same = old[3] === vals[3] && old[4] === vals[4] && old[5] === vals[5] && old[6] === vals[6];
      vals[8] = same && approved_(old[8]);
      vals[9] = old[9];
    } else {
      row = last + 1;
      if (row > s.getMaxRows()) s.insertRowsAfter(s.getMaxRows(), 50);
    }
    s.getRange(row, 1, 1, 10).setValues([vals]);
    const box = s.getRange(row, 9);
    box.insertCheckboxes();
    if (vals[8]) box.check(); else box.uncheck();
    return out_({ ok: true, row: row });
  } finally {
    lock.releaseLock();
  }
}
