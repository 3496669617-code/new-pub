/* 安心陪 · 陪诊点单小程序 —— 交互脚本
   由「陪诊点单小程序原型.html」拆分而来 */

/* ================= 数据层 ================= */
const SERVICES = [
  // 到院前
  {id:'pickup', cat:'pre',  name:'上门接送陪同', price:129, unit:'次', dur:'约1.5h', desc:'司机上门接老人，含搀扶与轮椅协助上下车', ic:'car', color:'#EAF2FF', fg:'#2B7FFF', hot:true},
  {id:'queuenum', cat:'pre', name:'代取号 · 排队占位', price:39, unit:'次', dur:'约40min', desc:'提前到院取号排队，老人到院直接就诊', ic:'ticket', color:'#FFF1EA', fg:'#FF7A45'},
  {id:'wheel', cat:'pre', name:'轮椅 / 担架协助', price:49, unit:'次', dur:'全程', desc:'提供医院轮椅租借与全程推行服务', ic:'wheel', color:'#F1EEFF', fg:'#7B61FF'},
  // 院内陪同
  {id:'full', cat:'in', name:'全程陪诊（4小时）', price:299, unit:'次', dur:'4h', desc:'陪诊师全程跟随，覆盖挂号到取药全流程', ic:'nurse', color:'#EAF2FF', fg:'#2B7FFF', hot:true},
  {id:'reg', cat:'in', name:'挂号排队协助', price:39, unit:'次', dur:'约40min', desc:'协助窗口/自助机挂号、建档、缴费排队', ic:'doc', color:'#E8F8F2', fg:'#00B578'},
  {id:'wait', cat:'in', name:'候诊陪同', price:49, unit:'次', dur:'约1.5h', desc:'陪同候诊，关注叫号、搀扶进出诊室', ic:'clock', color:'#FFF1EA', fg:'#FF7A45'},
  {id:'exam', cat:'in', name:'检查陪同引导', price:59, unit:'次', dur:'约2h', desc:'陪同抽血、B超、CT等检查，含路线引导', ic:'scan', color:'#F1EEFF', fg:'#7B61FF', hot:true},
  {id:'medicine', cat:'in', name:'缴费取药', price:39, unit:'次', dur:'约40min', desc:'代排队缴费、药房取药并核对药品清单', ic:'pill', color:'#E8F8F2', fg:'#00B578'},
  // 诊后服务
  {id:'report', cat:'post', name:'报告领取与解读', price:49, unit:'次', dur:'约1h', desc:'代取检查报告，口头解读并拍照同步家属', ic:'report', color:'#EAF2FF', fg:'#2B7FFF'},
  {id:'deliver', cat:'post', name:'代取药 · 送药到家', price:59, unit:'次', dur:'约2h', desc:'取药后当日送达，当面核对用法用量', ic:'moto', color:'#FFF1EA', fg:'#FF7A45'},
  {id:'admit', cat:'post', name:'住院办理协助', price:89, unit:'次', dur:'约2h', desc:'协助办理入院手续、押金、床位与物品安置', ic:'bed', color:'#F1EEFF', fg:'#7B61FF'},
  {id:'review', cat:'post', name:'复诊提醒与预约', price:19, unit:'次', dur:'7天', desc:'7天内按时提醒用药与复诊，并代约下次号源', ic:'bell', color:'#E8F8F2', fg:'#00B578'},
  // 老人关怀
  {id:'voice', cat:'care', name:'语音汇报（1分钟）', price:15, unit:'次', dur:'—', desc:'服务结束后陪诊师发1分钟语音，讲清医生说了什么', ic:'mic', color:'#EAF2FF', fg:'#2B7FFF', hot:true},
  {id:'photo', cat:'care', name:'诊疗单据拍照归档', price:9, unit:'次', dur:'—', desc:'病历、处方、检查单一键拍照，归入健康档案', ic:'camera', color:'#FFF1EA', fg:'#FF7A45'},
  {id:'live', cat:'care', name:'家属实时进度推送', price:19, unit:'次', dur:'—', desc:'挂号、候诊、检查、取药每个节点微信提醒您', ic:'share', color:'#F1EEFF', fg:'#7B61FF'},
  {id:'record', cat:'care', name:'全程录音留档', price:29, unit:'次', dur:'—', desc:'经授权录音留存30天，医嘱有据可查', ic:'shield', color:'#E8F8F2', fg:'#00B578'}
];

const PACKAGES = [
  {id:'pk_base', name:'基础陪诊包', price:166, old:177, items:['代取号 · 排队占位','候诊陪同','缴费取药'], cat:'bundle'},
  {id:'pk_exam', name:'检查无忧包', price:158, old:167, items:['检查陪同引导','报告领取与解读','诊疗单据拍照归档'], cat:'bundle'},
  {id:'pk_full', name:'全流程安心包', price:399, old:491, items:['全程陪诊 4小时','上门接送陪同','语音汇报','家属实时进度推送','费用优惠 ¥92'], cat:'bundle', hot:true}
];

/* ================= 服务地域：当前仅开通上海市 ================= */
const CITY = { name:'上海', full:'上海市' };
// 上海市辖区（仅用于展示定位与筛选医院）
const AREAS = ['浦东新区','黄浦区','徐汇区','静安区','虹口区','杨浦区','长宁区','普陀区','闵行区'];
// 医院库：只收录上海市医院，不提供其他城市
const HOSPITALS = [
  {id:'renji_e', name:'上海交通大学医学院附属仁济医院（东院）', short:'仁济医院东院', area:'浦东新区', level:'三级甲等', address:'浦建路160号'},
  {id:'renji',   name:'上海交通大学医学院附属仁济医院（西院）', short:'仁济医院西院', area:'黄浦区', level:'三级甲等', address:'山东中路145号'},
  {id:'ruijin',  name:'上海交通大学医学院附属瑞金医院',         short:'瑞金医院',     area:'黄浦区', level:'三级甲等', address:'瑞金二路197号'},
  {id:'zhongshan',name:'复旦大学附属中山医院',                  short:'中山医院',     area:'徐汇区', level:'三级甲等', address:'枫林路180号'},
  {id:'huashan', name:'复旦大学附属华山医院',                   short:'华山医院',     area:'静安区', level:'三级甲等', address:'乌鲁木齐中路12号'},
  {id:'shiyi',   name:'上海市第一人民医院',                     short:'市第一人民医院', area:'虹口区', level:'三级甲等', address:'武进路85号'},
  {id:'shiliu',  name:'上海市第六人民医院',                     short:'市第六人民医院', area:'徐汇区', level:'三级甲等', address:'宜山路600号'},
  {id:'shijiu',  name:'上海交通大学医学院附属第九人民医院',     short:'市第九人民医院', area:'黄浦区', level:'三级甲等', address:'制造局路639号'},
  {id:'xinhua',  name:'上海交通大学医学院附属新华医院',         short:'新华医院',     area:'杨浦区', level:'三级甲等', address:'控江路1665号'},
  {id:'feike',   name:'上海市肺科医院',                         short:'上海市肺科医院', area:'杨浦区', level:'三级甲等', address:'政民路507号'},
  {id:'xiongke', name:'上海市胸科医院',                         short:'上海市胸科医院', area:'徐汇区', level:'三级甲等', address:'淮海西路241号'},
  {id:'longhua', name:'上海中医药大学附属龙华医院',             short:'龙华医院',     area:'徐汇区', level:'三级甲等', address:'宛平南路725号'},
  {id:'shuguang',name:'上海中医药大学附属曙光医院',             short:'曙光医院',     area:'黄浦区', level:'三级甲等', address:'普安路185号'},
  {id:'dongfang',name:'上海市东方医院',                         short:'东方医院',     area:'浦东新区', level:'三级甲等', address:'即墨路150号'},
  {id:'shishi',  name:'上海市第十人民医院',                     short:'市第十人民医院', area:'静安区', level:'三级甲等', address:'延长中路301号'},
  {id:'erke',    name:'复旦大学附属儿科医院',                   short:'复旦儿科医院', area:'闵行区', level:'三级甲等', address:'万源路399号'},
  {id:'pifu',    name:'上海市皮肤病医院',                       short:'上海市皮肤病医院', area:'静安区', level:'三级甲等', address:'保德路1278号'},
  {id:'putuo',   name:'上海市普陀区中心医院',                   short:'普陀区中心医院', area:'普陀区', level:'三级综合', address:'兰溪路164号'},
  {id:'tongren', name:'上海市同仁医院',                         short:'上海市同仁医院', area:'长宁区', level:'三级综合', address:'仙霞路1111号'}
];

const CATS = [
  {id:'all', name:'全部'},
  {id:'pre', name:'到院前'},
  {id:'in', name:'院内陪同'},
  {id:'post', name:'诊后服务'},
  {id:'care', name:'老人关怀'}
];

const STEPS = [
  {t:'订单已提交', d:'等待陪诊师接单', eta:'预计 30 分钟内完成接单'},
  {t:'陪诊师已接单', d:'资质与联系方式见下方陪诊师卡片', eta:'陪诊师将按约定时间到达医院'},
  {t:'陪诊师已到达医院', d:'{H} · 门诊楼1层大厅', eta:'正在协助取号排队'},
  {t:'挂号完成 · 候诊中', d:'{D} · 等待叫号', eta:'请留意叫号屏与陪诊师提醒'},
  {t:'检查进行中', d:'陪同完成全部检查项目，含路线引导', eta:'检查完成后会同步进度'},
  {t:'取药完成', d:'药品已核对，并逐项向老人说明用法', eta:'正在整理单据并准备返程'},
  {t:'服务已完成', d:'本次服务已结束 · 待您评价', eta:'服务已结束'}
];

const ICONS = {
  car:'<path d="M5 16V11l1.8-4.2A2 2 0 0 1 8.6 5.5h6.8a2 2 0 0 1 1.8 1.3L19 11v5"/><rect x="3.5" y="15" width="17" height="4.5" rx="2"/><circle cx="7.5" cy="19.5" r="1.4"/><circle cx="16.5" cy="19.5" r="1.4"/>',
  ticket:'<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8z"/><path d="M14 6v12"/>',
  wheel:'<circle cx="10" cy="4.5" r="2"/><path d="M10 7v6h5l3 5"/><circle cx="10" cy="16" r="5" fill="none"/>',
  nurse:'<circle cx="12" cy="7" r="3.4"/><path d="M5 20.5c0-3.4 3.1-5.8 7-5.8s7 2.4 7 5.8"/><path d="M12 13v5M9.5 15.5h5"/>',
  doc:'<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  scan:'<path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><path d="M4 12h16"/>',
  pill:'<rect x="3.5" y="9" width="17" height="6.5" rx="3.2"/><path d="M12 9v6.5"/>',
  report:'<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M8.5 17v-3M12 17v-5M15.5 17v-2"/>',
  moto:'<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l-2-8H9"/>',
  bed:'<path d="M3 19v-9M3 13h13a4 4 0 0 1 4 4v2"/><circle cx="7.5" cy="10" r="2"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  camera:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
  share:'<circle cx="17" cy="5.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17" cy="18.5" r="2.5"/><path d="M8.8 10.7l6-3.9M8.8 13.3l6 3.9"/>',
  shield:'<path d="M12 3l8 3.5V12c0 5-3.4 8.2-8 9.5-4.6-1.3-8-4.5-8-9.5V6.5L12 3z"/><path d="M9 12l2 2 4-4"/>'
};

/* ================= 状态 ================= */
const state = {
  cart:{}, cat:'all', tab:'home', history:[],
  date:'今天（10月6日）', time:'上午 08:00-12:00', mobility:'',
  noteTags:[], addons:{voice:true, photo:true, live:true, record:false},
  order:null, step:0, payMethod:'微信支付',
  /* 服务地域（hospitalId 为 null 表示尚未选择医院） */
  area:'浦东新区', hospitalId:null,
  /* 就诊人与订单：初始一律为空，不使用任何预置演示数据 */
  patients:[], patientId:null,
  orders:[]
};
function curHospital(){ return HOSPITALS.find(h=>h.id===state.hospitalId) || null; }
function curPatient(){ return state.patients.find(p=>p.id===state.patientId) || null; }
function patientLabel(p){ return p ? `${p.name} · ${p.age}岁 · ${p.gender}` : ''; }

/* ================= 工具 ================= */
const $ = id => document.getElementById(id);
function toast(msg, ms=1700){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._tid); t._tid = setTimeout(()=>t.classList.remove('show'), ms);
}
function findSvc(id){ return SERVICES.find(s=>s.id===id) || PACKAGES.find(p=>p.id===id); }
function itemPrice(id){ const s = findSvc(id); return s ? s.price : 0; }

/* ================= 服务地域 / 医院（仅上海市） ================= */
function syncPlace(){
  const h = curHospital();
  const loc = $('hhLoc'); if(loc) loc.textContent = CITY.name + ' · ' + state.area;
  const t = $('fHospitalTxt'), m = $('fHospitalMeta');
  if(t){
    t.textContent = h ? h.short : '请选择就诊医院';
    t.style.color = h ? 'var(--txt)' : '#B7BDC8';
  }
  if(m) m.textContent = h ? (h.area + ' · ' + h.level + ' · ' + h.address) : '来自上海市医院库，共 19 家';
  const eh = $('expertHospital'); if(eh) eh.textContent = h ? (h.short + ' 常驻') : '常驻医院：待派单';
}

/* ---- 底部选择层 ---- */
function openSheet(title, tall){
  $('sheetTitle').textContent = title;
  $('sheet').classList.toggle('tall', !!tall);
  $('sheetMask').classList.add('show');
  $('sheet').classList.add('show');
}
function closeSheet(){
  $('sheetMask').classList.remove('show');
  $('sheet').classList.remove('show');
}
function openAreaSheet(){
  $('sheetBody').innerHTML = `
    <div class="scope-tip">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>
      <span>当前仅开通 <b>${CITY.full}</b>，陪诊师均为上海本地常驻，可提供上门接送。其他城市暂未开通。</span>
    </div>
    <div class="dist-grid">
      ${AREAS.map(a=>`<div class="dg ${state.area===a?'on':''}" onclick="pickArea('${a}')">${a}</div>`).join('')}
    </div>
    <div class="area-lock">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>
      其他城市暂未开通
    </div>`;
  openSheet('选择服务区域');
}
function pickArea(a){
  state.area = a;
  syncPlace();
  closeSheet();
  toast('服务区域已切换：' + CITY.name + ' · ' + a);
}

/* ---- 医院选择：数据源仅上海市医院 ---- */
let hospArea = 'all';
function openHospitalSheet(){
  hospArea = 'all';
  renderHospitalSheet();
  openSheet('选择就诊医院');
}
function renderHospitalSheet(){
  const list = HOSPITALS.filter(h => hospArea==='all' || h.area===hospArea);
  const order = list.slice().sort((a,b)=>{
    const na = a.area===state.area ? 0 : 1, nb = b.area===state.area ? 0 : 1;
    return na - nb || a.id.localeCompare(b.id);
  });
  $('sheetBody').innerHTML = `
    <div class="scope-tip">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>
      <span>医院库仅收录 <b>${CITY.full}</b> 医院（共 ${HOSPITALS.length} 家），不提供其他地域。</span>
    </div>
    <div class="pick-chips" style="margin-top:13px">
      <div class="pick-chip ${hospArea==='all'?'on':''}" onclick="setHospArea('all')">全部</div>
      ${AREAS.map(a=>`<div class="pick-chip ${hospArea===a?'on':''}" onclick="setHospArea('${a}')">${a}</div>`).join('')}
    </div>
    <div style="margin-top:4px">
      ${order.length ? order.map(h=>`
        <div class="opt-item hosp-item ${state.hospitalId===h.id?'on':''}" onclick="pickHospital('${h.id}')">
          <div class="hosp-ck"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>
          <div class="oi-body">
            <div class="hosp-name">${h.name}</div>
            <div class="hosp-meta">
              <span>${h.area}</span><span>${h.level}</span>${h.area===state.area?'<span class="tag green">靠近您</span>':''}<span>${h.address}</span>
            </div>
          </div>
        </div>`).join('') : '<div style="padding:26px 0;text-align:center;font-size:13px;color:#B4BAC6">该区域暂无收录医院</div>'}
    </div>`;
}
function setHospArea(a){ hospArea = a; renderHospitalSheet(); }
function pickHospital(id){
  state.hospitalId = id;
  const h = curHospital();
  syncPlace();
  closeSheet();
  toast('就诊医院已选择：' + h.short);
}

/* ================= 就诊人 ================= */
const DISEASES = ['高血压','糖尿病','冠心病','脑卒中','慢阻肺','骨质疏松','白内障'];
const MOBILITIES = ['可自主行走','长距离需搀扶','需轮椅推行','卧床 / 需担架'];
let pfGender = '女', pfDisease = [], pfMobility = MOBILITIES[0], editingId = null;

const IC_USER = '<svg class="ic" style="width:22px;height:22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6"/></svg>';

function renderHomePatient(){
  const el = $('homePatient'); if(!el) return;
  const p = curPatient();
  if(!p){
    el.innerHTML = `
      <div class="my-elder is-empty" onclick="go('patient')">
        <div class="avatar ph">${IC_USER}</div>
        <div class="me-info">
          <div class="me-name">还未添加就诊人</div>
          <div class="me-sub one">添加后陪诊师可提前了解老人状况</div>
        </div>
        <span class="add-pill">去添加</span>
      </div>`;
    return;
  }
  el.innerHTML = `
    <div class="my-elder" onclick="go('patient')">
      <div class="avatar">${p.name.slice(0,1)}</div>
      <div class="me-info">
        <div class="me-name">${p.name} <span class="tag blue">就诊人</span></div>
        <div class="me-sub"><span>${p.age}岁 · ${p.gender}</span>${p.tags.slice(0,2).map(t=>`<span class="tag gray">${t}</span>`).join('')}</div>
      </div>
      <svg class="ic" style="width:16px;height:16px;color:#A8B0BE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 6l6 6-6 6"/></svg>
    </div>`;
}

function renderPatient(){
  const box = $('patientScroll'); if(!box) return;
  const list = state.patients;
  const foot = `<div style="margin:16px;font-size:11.5px;color:#A8B0BE;line-height:1.9">
      就诊人信息用于陪诊师提前了解老人身体状况。病史与用药信息仅对本次服务的陪诊师可见，服务结束后自动隐藏。
    </div>`;
  if(!list.length){
    box.innerHTML = `
      <div class="blank-dash">
        <div class="bd-ic">${IC_USER.replace('width:22px;height:22px','width:27px;height:27px')}</div>
        <div class="bd-t">还没有就诊人</div>
        <div class="bd-d">添加老人信息后，下单时可直接选择，陪诊师也能提前了解身体状况</div>
        <button class="btn btn-main" style="height:42px;padding:0 26px;font-size:14px;margin-top:4px" onclick="openPatientForm()">添加就诊人</button>
      </div>` + foot;
    return;
  }
  box.innerHTML = list.map(p=>`
    <div class="pt-card ${p.id===state.patientId?'on':''}" onclick="selectPatient('${p.id}')">
      <div class="pt-top">
        <div class="avatar" style="width:46px;height:46px;font-size:16px">${p.name.slice(0,1)}</div>
        <div class="pt-body">
          <div class="pt-name">${p.name}${p.id===state.patientId?'<span class="tag blue" style="margin-left:4px">当前</span>':''}</div>
          <div class="pt-sub">${p.gender} · ${p.age}岁${p.phone?' · '+p.phone:''}</div>
        </div>
        <div class="pt-edit" onclick="event.stopPropagation();openPatientForm('${p.id}')">
          <svg class="ic" style="width:15px;height:15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 20h4L20 8l-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>
        </div>
      </div>
      <div class="pt-rows">
        <div><span class="k">行动能力：</span>${p.mobility}</div>
        <div><span class="k">基础病史：</span>${p.tags.length?p.tags.join('、'):'未填写'}</div>
        <div><span class="k">沟通提示：</span>${p.note?p.note:'未填写'}</div>
      </div>
    </div>`).join('') + `
    <div class="card" style="display:flex;align-items:center;justify-content:center;gap:8px;color:#2B7FFF;font-size:14px;font-weight:600;border:1px dashed #BFD7FF;background:#F8FBFF;margin-top:0" onclick="openPatientForm()">
      <svg class="ic" style="width:18px;height:18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      添加就诊人
    </div>` + foot;
}

function openPatientForm(id){
  editingId = id || null;
  const p = editingId ? state.patients.find(x=>x.id===editingId) : null;
  pfGender = p ? p.gender : '女';
  pfDisease = p ? p.tags.slice() : [];
  pfMobility = p ? p.mobility : MOBILITIES[0];
  $('sheetBody').innerHTML = `
    <div class="pf-row"><span class="pf-label">姓名</span><input id="pfName" value="${p?p.name:''}" placeholder="请输入老人姓名"></div>
    <div class="pf-row"><span class="pf-label">性别</span><div class="pick-chips" id="pfGenderBox" style="flex:1;justify-content:flex-end"></div></div>
    <div class="pf-row"><span class="pf-label">年龄</span><input id="pfAge" type="number" value="${p?p.age:''}" placeholder="如 78"></div>
    <div class="pf-row" style="border-bottom:none"><span class="pf-label">联系电话</span><input id="pfPhone" value="${p&&p.phone?p.phone:''}" placeholder="选填"></div>
    <div class="pf-block"><div class="pf-label">基础病史（可多选）</div><div class="pick-chips" id="pfDiseaseBox"></div></div>
    <div class="pf-block"><div class="pf-label">行动能力</div><div class="pick-chips" id="pfMobilityBox"></div></div>
    <div class="pf-block" style="border-bottom:none"><div class="pf-label">沟通提示（选填）</div><textarea class="textarea" id="pfNote" placeholder="例如：耳朵背，请大声说话">${p&&p.note?p.note:''}</textarea></div>
    <button class="btn btn-main" style="width:100%;height:46px;margin-top:14px" onclick="savePatient()">${editingId?'保存修改':'保存'}</button>`;
  drawPFChips();
  openSheet(editingId ? '编辑就诊人' : '添加就诊人', true);
}
function drawPFChips(){
  $('pfGenderBox').innerHTML = ['女','男'].map(g=>
    `<div class="pick-chip ${pfGender===g?'on':''}" onclick="pfGender='${g}';drawPFChips()">${g}</div>`).join('');
  $('pfDiseaseBox').innerHTML = DISEASES.concat(['无']).map(d=>
    `<div class="pick-chip ${pfDisease.includes(d)?'on':''}" onclick="toggleDisease('${d}')">${d}</div>`).join('');
  $('pfMobilityBox').innerHTML = MOBILITIES.map(m=>
    `<div class="pick-chip ${pfMobility===m?'on':''}" onclick="pfMobility='${m}';drawPFChips()">${m}</div>`).join('');
}
function toggleDisease(d){
  if(d === '无'){ pfDisease = pfDisease.includes('无') ? [] : ['无']; drawPFChips(); return; }
  const i = pfDisease.indexOf(d);
  if(i >= 0) pfDisease.splice(i,1); else pfDisease.push(d);
  pfDisease = pfDisease.filter(x => x !== '无');
  drawPFChips();
}
function savePatient(){
  const name = ($('pfName').value || '').trim();
  const age = parseInt($('pfAge').value, 10);
  if(!name){ toast('请填写就诊人姓名'); return; }
  if(!age || age <= 0 || age > 120){ toast('请填写有效的年龄'); return; }
  const data = {
    name, gender:pfGender, age,
    phone:($('pfPhone').value || '').trim(),
    tags:pfDisease.slice(), mobility:pfMobility,
    note:($('pfNote').value || '').trim()
  };
  if(editingId){
    Object.assign(state.patients.find(x=>x.id===editingId), data);
    if(state.patientId === editingId) state.mobility = data.mobility;
  } else {
    const id = 'p' + Date.now().toString().slice(-8);
    state.patients.push(Object.assign({id}, data));
    state.patientId = id;
    state.mobility = data.mobility;
  }
  closeSheet();
  renderPatient(); renderHomePatient(); updateMineStats(); syncPlace();
  if($('page-confirm').classList.contains('active')) renderConfirm();
  toast(editingId ? '已保存修改' : '就诊人已添加');
}
function selectPatient(id){
  state.patientId = id;
  const p = curPatient(); if(p) state.mobility = p.mobility;
  renderPatient(); renderHomePatient();
  if($('page-confirm').classList.contains('active')) renderConfirm();
  toast('已选择就诊人：' + p.name);
}

/* ================= 路由 ================= */
// 顶部安全区占位条跟随页面头部配色，保证真机刘海区域与页面内容无缝衔接
const TOP_STYLE = {
  home:'#2B7FFF',
  mine:'#2B7FFF',
  detail:'#2B7FFF',
  light:'#fff'
};
function syncSafebar(page){
  $('safebar').style.background = TOP_STYLE[page] || TOP_STYLE.light;
}
function go(page, keepHist=true){
  const cur = document.querySelector('.page.active');
  if(cur && cur.id !== 'page-'+page && keepHist) state.history.push(cur.id.replace('page-',''));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const el = $('page-'+page); if(el) el.classList.add('active');
  const isTab = ['home','orders','mine'].includes(page);
  $('tabbar').classList.toggle('show', isTab);
  syncSafebar(page);
  ['home','orders','mine'].forEach(t=>{
    document.querySelector(`.tab[data-tab="${t}"]`).classList.toggle('on', t===page);
  });
  if(isTab){ state.tab = page; state.history = []; }
  const sc = el?.querySelector('.scroll'); if(sc) sc.scrollTop = 0;
  if(page==='catalog') renderCatalog();
  if(page==='confirm') renderConfirm();
  if(page==='pay') renderPay();
  if(page==='orders') renderOrders();
  if(page==='detail') renderDetail();
  if(page==='home') renderHome();
  if(page==='patient') renderPatient();
  if(page==='mine') updateMineStats();
}
function back(){
  if($('page-detail').classList.contains('active') && state._restore){
    state.order = state._restore.order; state.step = state._restore.step; state._restore = null;
  }
  const prev = state.history.pop() || 'home';
  go(prev, false);
}

/* ================= 首页 ================= */
function renderHome(){
  $('pkgScroll').innerHTML = PACKAGES.map(p=>`
    <div class="pkg">
      ${p.hot?'<span class="tag orange" style="position:absolute;top:-1px;right:-1px;border-radius:0 14px 0 10px">最受欢迎</span>':''}
      <h3>${p.name}</h3>
      <div class="pkg-list">${p.items.map(i=>'· '+i).join('<br>')}</div>
      <div class="pkg-bt">
        <div class="price"><span class="rmb">¥</span><span class="num">${p.price}</span><span class="old">¥${p.old}</span></div>
        <button class="add" onclick="addPkg('${p.id}',event)">
          <svg class="ic" style="width:15px;height:15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>`).join('');

  $('homeSvc').innerHTML = SERVICES.filter(s=>s.hot).slice(0,4).map(s=>svcItemHTML(s)).join('');
  renderHomePatient();
}
function addPkg(id, e){
  e.stopPropagation();
  state.cart[id] = (state.cart[id]||0) + 1;
  const p = findSvc(id);
  toast(`已加入「${p.name}」`);
  updateCartUI();
}

/* ================= 点单页 ================= */
function svcItemHTML(s){
  const qty = state.cart[s.id] || 0;
  return `
  <div class="svc-item">
    <div class="svc-ic" style="background:${s.color};color:${s.fg}">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[s.ic]||ICONS.doc}</svg>
    </div>
    <div class="si-body">
      <div class="si-name">${s.name}${s.hot?'<span class="tag orange">热门</span>':''}</div>
      <div class="si-desc">${s.desc}</div>
      <div class="si-meta">
        <span class="tag gray">${s.unit}</span>
        ${s.dur!=='—'?`<span class="tag gray">时长 ${s.dur}</span>`:''}
      </div>
    </div>
    <div class="si-right">
      <div class="price"><span class="rmb">¥</span><span class="num">${s.price}</span></div>
      ${qty>0 ? `
        <div class="stepper">
          <button class="step-btn minus" onclick="changeQty('${s.id}',-1)">−</button>
          <span style="font-size:14px;font-weight:600;min-width:14px;text-align:center">${qty}</span>
          <button class="step-btn plus" onclick="changeQty('${s.id}',1)">+</button>
        </div>` : `
        <button class="step-btn plus" style="width:26px;height:26px" onclick="changeQty('${s.id}',1)">+</button>`}
    </div>
  </div>`;
}
function renderCatalog(){
  $('catBar').innerHTML = CATS.map(c=>`<div class="chip ${state.cat===c.id?'on':''}" onclick="setCat('${c.id}')">${c.name}</div>`).join('');
  const list = state.cat==='all' ? SERVICES : SERVICES.filter(s=>s.cat===state.cat);
  let html = '';
  if(state.cat==='all'){
    CATS.filter(c=>c.id!=='all').forEach(c=>{
      const arr = SERVICES.filter(s=>s.cat===c.id);
      html += `<div class="cat-label">${c.name}</div>` + arr.map(svcItemHTML).join('');
    });
  } else {
    html = list.map(svcItemHTML).join('');
  }
  // 服务包
  html += `<div class="cat-label">服务包 · 更划算</div>` + PACKAGES.map(p=>`
    <div class="svc-item">
      <div class="svc-ic" style="background:#FFF6E8;color:#FF9500">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>
      </div>
      <div class="si-body">
        <div class="si-name">${p.name} <span class="tag orange">省 ¥${p.old-p.price}</span></div>
        <div class="si-desc">${p.items.join(' + ')}</div>
      </div>
      <div class="si-right">
        <div class="price"><span class="rmb">¥</span><span class="num">${p.price}</span></div>
        ${(state.cart[p.id]||0)>0?`
        <div class="stepper">
          <button class="step-btn minus" onclick="changeQty('${p.id}',-1)">−</button>
          <span style="font-size:14px;font-weight:600;min-width:14px;text-align:center">${state.cart[p.id]}</span>
          <button class="step-btn plus" onclick="changeQty('${p.id}',1)">+</button>
        </div>`:`<button class="step-btn plus" style="width:26px;height:26px" onclick="changeQty('${p.id}',1)">+</button>`}
      </div>
    </div>`).join('');
  $('catalogScroll').innerHTML = html;
  updateCartUI();
}
function setCat(id){ state.cat = id; renderCatalog(); }

/* ================= 购物车 ================= */
function changeQty(id, delta){
  const cur = state.cart[id] || 0;
  const next = cur + delta;
  if(next <= 0) delete state.cart[id]; else state.cart[id] = next;
  updateCartUI();
  if($('page-catalog').classList.contains('active')) renderCatalog();
  if($('page-home').classList.contains('active')) renderHome();
  if($('page-confirm').classList.contains('active')) renderConfirm();
}
function cartSummary(){
  const ids = Object.keys(state.cart);
  let svcTotal = 0, count = 0;
  ids.forEach(id=>{ svcTotal += itemPrice(id) * state.cart[id]; count += state.cart[id]; });
  return {ids, svcTotal, count};
}
function updateCartUI(){
  const {ids, svcTotal, count} = cartSummary();
  $('cartBadge').textContent = count;
  $('cartBadge').style.display = count>0 ? 'flex' : 'none';
  $('cartTotal').textContent = '¥' + svcTotal;
  $('cartbar').classList.toggle('show', count>0);
  $('catalogCount').textContent = `已选 ${count} 项`;
}

/* ================= 确认订单 ================= */
function renderConfirm(){
  syncPlace();
  // 就诊人
  const cp = curPatient();
  $('confirmPatient').innerHTML = cp ? `
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar" style="width:42px;height:42px;font-size:15px">${cp.name.slice(0,1)}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14.5px;font-weight:600">${cp.name} <span style="font-size:12px;color:#8A909E;font-weight:400">${cp.gender} · ${cp.age}岁</span></div>
          <div style="font-size:11.5px;color:#8A909E;margin-top:5px">${cp.phone || '未填写联系电话'}${cp.tags.length?' · 有'+cp.tags.join('、')+'史':''}</div>
        </div>
        <span style="font-size:12px;color:#2B7FFF">更换</span>
      </div>` : `
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar" style="width:42px;height:42px;background:#E9EEF7;color:#A8B0BE">${IC_USER.replace('width:22px;height:22px','width:20px;height:20px')}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14.5px;font-weight:600;color:#B7BDC8">请选择就诊人</div>
          <div style="font-size:11.5px;color:#8A909E;margin-top:5px">下单前需先添加老人信息</div>
        </div>
        <span style="font-size:12px;color:#2B7FFF">去添加</span>
      </div>`;

  // 日期
  const dates = ['今天（10月6日）','明天（10月7日）','后天（10月8日）','10月9日 周五'];
  $('dateChips').innerHTML = dates.map(d=>`<div class="pick-chip ${state.date===d?'on':''}" onclick="pick('date','${d}')">${d}</div>`).join('');
  const times = ['上午 08:00-12:00','下午 13:00-17:00','傍晚 17:00-19:00'];
  $('timeChips').innerHTML = times.map(t=>`<div class="pick-chip ${state.time===t?'on':''}" onclick="pick('time','${t}')">${t}</div>`).join('');
  $('mobilityChips').innerHTML = MOBILITIES.map(m=>`<div class="pick-chip ${state.mobility===m?'on':''}" onclick="pick('mobility','${m}')">${m}</div>`).join('');

  // 服务清单
  const {ids, svcTotal} = cartSummary();
  $('confirmSvcList').innerHTML = ids.length ? ids.map(id=>{
    const s = findSvc(id);
    return `<div class="check-line" style="border-bottom:none;padding:10px 0">
      <div class="cl-body">
        <div class="cl-name">${s.name}</div>
        ${s.cat==='bundle'?`<div class="cl-desc">含 ${s.items.join('、')}</div>`:`<div class="cl-desc">${s.desc}</div>`}
      </div>
      <div style="text-align:right">
        <div class="price"><span class="rmb">¥</span><span class="num" style="font-size:15px">${s.price}</span></div>
        ${state.cart[id]>1?`<div style="font-size:11px;color:#8A909E">×${state.cart[id]}</div>`:''}
      </div>
    </div>`;
  }).join('') : '<div style="font-size:13px;color:#B4BAC6;padding:12px 0">还没有选择服务，<span style="color:#2B7FFF" onclick="go(\'catalog\')">去点单</span></div>';

  // 增值服务
  const addons = [
    {id:'voice', name:'语音汇报', desc:'服务结束后 1 分钟语音讲清医嘱', price:15},
    {id:'photo', name:'单据拍照归档', desc:'病历处方拍照存入健康档案', price:9},
    {id:'live', name:'家属实时进度推送', desc:'每个节点微信提醒您', price:19},
    {id:'record', name:'全程录音留档', desc:'需老人或家属授权，留存30天', price:29}
  ];
  $('addonList').innerHTML = addons.map(a=>`
    <div class="check-line" onclick="toggleAddon('${a.id}')">
      <div class="cb-box ${state.addons[a.id]?'on':''}">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
      </div>
      <div class="cl-body">
        <div class="cl-name">${a.name}</div>
        <div class="cl-desc">${a.desc}</div>
      </div>
      <div class="price"><span class="rmb">¥</span><span class="num" style="font-size:15px">${a.price}</span></div>
    </div>`).join('');

  // 快捷嘱托
  const qks = ['听不太清，请大声说话','行动慢，请多等一会儿','需要写清用药说明','请全程搀扶','不要推销任何额外消费'];
  $('qkTags').innerHTML = qks.map(q=>`<div class="qk-tag ${state.noteTags.includes(q)?'on':''}" onclick="toggleNoteTag('${q}')">${q}</div>`).join('');

  // 费用
  const addonTotal = addons.reduce((a,x)=> a + (state.addons[x.id] ? x.price : 0), 0);
  const total = svcTotal + addonTotal;
  $('feeDetail').innerHTML = `
    <div class="form-row" style="padding:8px 0"><span class="fr-label" style="flex:1;color:#5C6373">服务费</span><span class="fr-val">¥${svcTotal.toFixed(2)}</span></div>
    <div class="form-row" style="padding:8px 0"><span class="fr-label" style="flex:1;color:#5C6373">增值服务</span><span class="fr-val">¥${addonTotal.toFixed(2)}</span></div>
    <div class="form-row" style="padding:8px 0"><span class="fr-label" style="flex:1;color:#5C6373">优惠券</span><span class="fr-val" style="color:#B4BAC6">暂无可用</span></div>
    <div class="divider" style="margin:6px 0"></div>
    <div class="form-row" style="padding:6px 0;border-bottom:none"><span class="fr-label" style="flex:1;font-weight:600;color:#1A1D26">应付合计</span><span class="fr-val price" style="font-size:18px">¥${total.toFixed(2)}</span></div>`;
  $('confirmTotal').textContent = '¥' + total.toFixed(2);
}
function toConfirmPay(){
  if(!curPatient()){ toast('请先添加并选择就诊人'); go('patient'); return; }
  if(!curHospital()){ toast('请选择就诊医院'); openHospitalSheet(); return; }
  if(!state.mobility){ toast('请选择老人行动能力'); return; }
  go('pay');
}
function pick(key, val){ state[key] = val; renderConfirm(); }
function toggleAddon(id){ state.addons[id] = !state.addons[id]; renderConfirm(); }
function toggleNoteTag(q){
  const i = state.noteTags.indexOf(q);
  if(i>=0) state.noteTags.splice(i,1); else state.noteTags.push(q);
  $('fNote').value = state.noteTags.join('；');
  renderConfirm();
}

/* ================= 支付 ================= */
function renderPay(){
  const {svcTotal} = cartSummary();
  const addonTotal = Object.entries(state.addons).reduce((a,[k,v])=> a + (v ? {voice:15,photo:9,live:19,record:29}[k] : 0), 0);
  const total = svcTotal + addonTotal;
  state.payTotal = total;
  $('payAmount').textContent = '¥' + total.toFixed(2);
}
function pickPay(el){
  document.querySelectorAll('.pay-m').forEach(e=>e.querySelector('.radio').classList.remove('on'));
  el.querySelector('.radio').classList.add('on');
  state.payMethod = el.querySelector('.pm-name').childNodes[0].textContent.trim();
}
function doPay(){
  $('loadingText').textContent = '正在支付…';
  $('loading').classList.add('show');
  setTimeout(()=>{
    $('loadingText').textContent = '正在通知陪诊师…';
    setTimeout(()=>{
      $('loading').classList.remove('show');
      createOrder();
      go('success');
    }, 700);
  }, 900);
}
function createOrder(){
  const {ids, svcTotal} = cartSummary();
  const addonTotal = Object.entries(state.addons).reduce((a,[k,v])=> a + (v ? {voice:15,photo:9,live:19,record:29}[k] : 0), 0);
  const total = svcTotal + addonTotal;
  const no = 'PA' + Date.now().toString().slice(-10);
  const items = [];
  ids.forEach(id=>{
    const s = findSvc(id);
    for(let i=0;i<state.cart[id];i++){
      items.push({name:s.name, price:s.price, desc: s.cat==='bundle' ? ('含 '+s.items.join('、')) : s.desc});
    }
  });
  Object.keys(state.addons).forEach(k=>{
    if(state.addons[k]) items.push({name:{voice:'语音汇报（1分钟）',photo:'诊疗单据拍照归档',live:'家属实时进度推送',record:'全程录音留档'}[k], price:{voice:15,photo:9,live:19,record:29}[k], desc:'增值服务'});
  });
  const hosp = curHospital();
  const pat = curPatient();
  const dept = ($('fDept').value || '').trim();
  state.order = {
    no, items,
    amount: total, svcTotal, addonTotal,
    hospital: hosp.short, hospitalFull: hosp.name, area: hosp.area,
    dept: dept || '未指定科室',
    patient: pat ? {name:pat.name, age:pat.age, gender:pat.gender, phone:pat.phone, tags:pat.tags.slice(), mobility:pat.mobility, note:pat.note} : null,
    date: state.date, time: state.time, mobility: state.mobility,
    note: $('fNote').value || state.noteTags.join('；'),
    created: new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-')
  };
  state.step = 0;
  $('sucOrderNo').textContent = no;
  $('sucPatient').textContent = patientLabel(pat);
  $('sucTime').textContent = state.date + ' ' + state.time.split(' ')[0];
  $('sucAmount').textContent = '¥' + total.toFixed(2);
  state.orders.unshift({no, status:'进行中', time: state.date + ' ' + state.time.split(' ')[0],
    amount: total, svc: items.map(i=>i.name), cat:'doing',
    hospital: hosp.short, dept: state.order.dept, patient: state.order.patient});
  renderOrders(); updateMineStats();
  syncOrderToBackend(state.order);
}

/* ================= 后台同步（接单服务） ================= */
/* 陪诊后台服务地址：默认本地 3000 端口，与「陪诊后台服务.js」的默认端口一致。
   如需换地址，可在控制台执行 localStorage.setItem('anxin_backend','http://host:port') 后刷新。
   后台未启动时同步会静默跳过，不影响原型本身的演示。 */
const BACKEND_URL = (function(){
  try { return localStorage.getItem('anxin_backend') || 'http://localhost:3000'; }
  catch(e){ return 'http://localhost:3000'; }
})();

function syncOrderToBackend(order){
  if(!order || typeof fetch !== 'function') return;
  fetch(BACKEND_URL + '/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.parse(JSON.stringify(order)))
  })
  .then(r => r.json().then(d => ({ ok: r.ok, d })))
  .then(({ ok, d }) => {
    if(ok && d && d.ok){
      toast(d.duplicated ? '该订单已在后台接单系统中' : '订单已推送至后台接单系统');
      console.log('%c[后台同步] 成功', 'color:#12B76A;font-weight:600', d.order && d.order.no);
    } else {
      throw new Error((d && d.error) || '后台返回异常');
    }
  })
  .catch(err => {
    console.warn('[后台同步] 未连接接单服务：' + err.message + '（原型演示不受影响）');
  });
}

/* ================= 订单详情 ================= */
function openOrderDetail(){
  const fromSuccess = $('page-success').classList.contains('active');
  go('detail');
  if(fromSuccess) state.history = ['orders'];
}
function renderDetail(){
  const o = state.order;
  if(!o){
    // 没有订单时（正常流程不会出现）做兜底渲染，避免留下半空页面
    $('odStatus').textContent = '暂无进行中的订单';
    $('odDesc').textContent = '下单并支付后，可在此查看陪诊进度';
    $('odEta').textContent = '可前往首页点单';
    $('timeline').innerHTML = '<div class="empty" style="padding:46px 0 34px">暂无订单进度，请从订单列表进入</div>';
    $('expertCard').style.display = 'none';
    $('demoBar').style.display = 'none';
    $('detailSvcList').innerHTML = '<div style="font-size:13px;color:#B4BAC6;padding:12px 0">暂无服务项</div>';
    $('dPatient').textContent = '—';
    $('dHospital').textContent = '—';
    $('dTime').textContent = '—';
    $('dOrderNo').textContent = '—';
    $('feedbackBox').innerHTML = '服务完成后，陪诊师会上传现场照片与结算单据，并发送 1 分钟语音汇报。';
    return;
  }
  const st = STEPS[state.step];
  const fill = s => (s || '')
    .replace(/\{H\}/g, o.hospital || '就诊医院')
    .replace(/\{D\}/g, o.dept || '就诊科室');
  $('odStatus').textContent = st.t;
  $('odDesc').textContent = fill(st.d);
  $('odEta').textContent = st.eta;
  $('expertCard').style.display = state.step >= 1 ? 'flex' : 'none';
  $('demoBar').style.display = o.readonly ? 'none' : 'flex';

  $('timeline').innerHTML = STEPS.map((s,i)=>{
    let cls = '';
    if(i < state.step) cls = 'done';
    else if(i === state.step) cls = 'cur';
    const mark = i < state.step ? '已完成' : (i === state.step ? (i === STEPS.length-1 ? '已完成' : '进行中') : '—');
    return `<div class="tl-item ${cls}">
      <div class="tl-axis"><div class="tl-dot"></div><div class="tl-line"></div></div>
      <div class="tl-body"><div class="tl-t">${s.t}</div><div class="tl-d">${fill(s.d)}</div></div>
      <div class="tl-time">${mark}</div>
    </div>`;
  }).join('');

  const items = o.items || [];
  $('detailSvcList').innerHTML = items.map(it=>`
      <div class="check-line" style="border-bottom:none;padding:9px 0">
        <div class="cl-body"><div class="cl-name">${it.name}</div><div class="cl-desc">${it.desc||''}</div></div>
        <div class="price"><span class="rmb">¥</span><span class="num" style="font-size:15px">${it.price}</span></div>
      </div>`).join('') + `
    <div class="divider"></div>
    <div class="form-row" style="padding:4px 0;border-bottom:none"><span class="fr-label">实付金额</span><span class="fr-val price" style="font-size:17px">¥${o.amount.toFixed(2)}</span></div>`;

  $('dPatient').textContent = o.patient ? patientLabel(o.patient) : '—';
  $('dHospital').textContent = o.hospital + ' · ' + o.dept;
  $('dTime').textContent = o.date + ' ' + o.time;
  $('dOrderNo').textContent = o.no;

  if(state.step >= 5){
    $('feedbackBox').innerHTML = `
      <div style="color:#1A1D26;font-weight:600;margin-bottom:6px">陪诊师反馈</div>
      <div>· 诊断结论与医嘱：由陪诊师在服务结束后填写</div>
      <div>· 检查结果：报告原件由陪诊师拍照归入健康档案</div>
      <div>· 用药说明：药品名称与用法用量需家属授权后查看</div>
      <div style="margin-top:10px;padding:10px;background:#F7F9FC;border-radius:10px;display:flex;align-items:center;gap:9px">
        <svg class="ic" style="width:18px;height:18px;color:#2B7FFF" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/></svg>
        <span style="flex:1;color:#2B7FFF;font-size:12.5px">语音汇报（服务完成后生成）</span>
        <span style="color:#B4BAC6;font-size:12.5px">待生成</span>
      </div>`;
  } else {
    $('feedbackBox').innerHTML = '服务完成后，陪诊师会上传现场照片与结算单据，并发送 1 分钟语音汇报。';
  }
}
function advanceStep(){
  if(state.order && state.order.readonly){ toast('历史订单已归档，仅可查看'); return; }
  if(state.step < STEPS.length-1){
    state.step++;
    renderDetail();
    renderOrders();
    toast('已推进：' + STEPS[state.step].t);
    if(state.step === STEPS.length-1){
      const od = state.orders.find(x=>x.no===state.order.no);
      if(od){ od.status='已完成'; od.cat='done'; }
    }
    updateMineStats();
  } else {
    toast('已经是最后一个节点，服务全部完成');
  }
}

/* ================= 订单列表 ================= */
let orderTab = 'all';
function updateMineStats(){
  const doing = state.orders.filter(o=>o.cat==='doing').length;
  const done = state.orders.filter(o=>o.cat==='done').length;
  $('mOrderCount').textContent = doing;
  $('mDoneCount').textContent = done;
  $('mCouponCount').textContent = 0;
  $('muPatientCount').textContent = state.patients.length;
  $('mPatientCount').textContent = state.patients.length + ' 位';
  $('mRecordCount').textContent = done + ' 份';
  const badge = $('tabBadge');
  badge.style.display = doing ? 'flex' : 'none';
  badge.textContent = doing;
}
function renderOrders(){
  updateMineStats();
  const segs = [{id:'all',name:'全部'},{id:'doing',name:'进行中'},{id:'done',name:'已完成'}];
  $('orderSeg').innerHTML = segs.map(s=>`<div class="sg ${orderTab===s.id?'on':''}" onclick="setOrderTab('${s.id}')">${s.name}</div>`).join('');
  const list = orderTab==='all' ? state.orders : state.orders.filter(o=>o.cat===orderTab);
  if(!list.length){
    $('ordersScroll').innerHTML = `<div class="empty"><svg class="ic" style="width:46px;height:46px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>${orderTab==='all'?'还没有订单，去首页点单吧':'该分类下暂无订单'}</div>`;
    return;
  }
  $('ordersScroll').innerHTML = list.map(o=>`
    <div class="order-card" onclick="openFromList('${o.no}')">
      <div class="oc-head">
        <div class="oc-h-l">${o.status==='进行中'?'<span class="tag blue">进行中</span>':'<span class="tag gray">已完成</span>'} ${o.status==='进行中'?'陪诊服务中':'陪诊服务'}</div>
        <div class="oc-time">${o.time}</div>
      </div>
      <div class="oc-body">
        <div class="oc-svc">${o.svc.join(' · ')}</div>
        ${o.hospital?`<div style="font-size:11.5px;color:#8A909E;margin-top:7px">${CITY.full} · ${o.hospital}${o.dept?' · '+o.dept:''}${o.patient?' · '+o.patient.name:''}</div>`:''}
        <div style="font-size:11.5px;color:#B4BAC6;margin-top:5px">订单号 ${o.no}</div>
      </div>
      <div class="oc-foot">
        <div class="oc-amt">合计<b>¥${o.amount.toFixed(2)}</b></div>
        <div style="display:flex;gap:8px">
          ${o.cat==='doing'
            ? `<button class="btn btn-ghost" style="height:32px;padding:0 15px;font-size:12.5px" onclick="event.stopPropagation();toast('已申请取消，客服将在10分钟内联系您')">申请取消</button>
               <button class="btn btn-main" style="height:32px;padding:0 15px;font-size:12.5px" onclick="event.stopPropagation();openOrderDetail('detail')">查看进度</button>`
            : `<button class="btn btn-ghost" style="height:32px;padding:0 15px;font-size:12.5px" onclick="event.stopPropagation();toast('已再次下单，可在点单页调整服务项')">再来一单</button>
               <button class="btn btn-main" style="height:32px;padding:0 15px;font-size:12.5px" onclick="event.stopPropagation();toast('感谢您的评价')">评价</button>`}
        </div>
      </div>
    </div>`).join('');
}
function setOrderTab(t){ orderTab = t; renderOrders(); }
function openFromList(no){
  const o = state.orders.find(x=>x.no===no);
  if(!o) return;
  if(o.cat === 'doing' && state.order && state.order.no === no){
    go('detail');
    return;
  }
  // 历史已完成订单：构造只读完成态
  const prevOrder = state.order, prevStep = state.step;
  const items = o.svc.map(n=>({name:n, price:0, desc:'已完成服务项'}));
  if(items.length) items[items.length-1].price = o.amount;
  state.order = {
    no:o.no, items, amount:o.amount, svcTotal:o.amount, addonTotal:0,
    hospital:o.hospital || '就诊医院', dept:o.dept || '未指定科室',
    patient:o.patient || null,
    date:o.time.split(' ')[0], time:o.time.split(' ').slice(1).join(' ')||'—',
    mobility:o.patient ? o.patient.mobility : state.mobility, note:'', created:o.time, readonly:true
  };
  state.step = STEPS.length-1;
  go('detail');
  state._restore = {order:prevOrder, step:prevStep};
}

/* ================= 启动 ================= */
(function init(){
  syncPlace();
  renderHome();
  renderCatalog();
  renderPatient();
  renderOrders();
  go('home', false);
  console.log('%c安心陪 · 原型已就绪','color:#2B7FFF;font-weight:600');
})();

/* 调试接口：便于查阅原型数据与状态 */
window.__app = { state, CITY, AREAS, HOSPITALS, DISEASES, MOBILITIES, SERVICES, PACKAGES, STEPS,
  go, back, changeQty, curHospital, curPatient, patientLabel, pickArea, pickHospital,
  renderPatient, savePatient, selectPatient, openPatientForm, updateMineStats };
