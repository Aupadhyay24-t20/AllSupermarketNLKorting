import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Zap, Smartphone, ArrowLeft } from 'lucide-react'
import Layout from '../components/layout/Layout'

// ── Phase definitions ─────────────────────────────────────────────────────────
const IPHONE_PHASES = [
  { ms: 1300 }, // 0  idle
  { ms: 750  }, // 1  finger to share button
  { ms: 500  }, // 2  tap share
  { ms: 1100 }, // 3  share sheet slides up
  { ms: 750  }, // 4  finger to "Toevoegen aan startscherm"
  { ms: 550  }, // 5  tap option
  { ms: 850  }, // 6  confirm screen slides in (iOS nav push)
  { ms: 800  }, // 7  finger to "Voeg toe" top-right
  { ms: 450  }, // 8  tap Add
  { ms: 2400 }, // 9  success home screen
]

const ANDROID_PHASES = [
  { ms: 1300 }, // 0  idle
  { ms: 750  }, // 1  finger to ⋮ menu
  { ms: 450  }, // 2  tap ⋮
  { ms: 950  }, // 3  dropdown opens
  { ms: 700  }, // 4  finger to "App installeren"
  { ms: 500  }, // 5  tap option
  { ms: 850  }, // 6  install dialog slides up
  { ms: 700  }, // 7  finger to "Installeer" button
  { ms: 450  }, // 8  tap Install
  { ms: 2400 }, // 9  success home screen
]

// phase index → user-visible step (1–5), same mapping for both platforms
const PHASE_TO_STEP = [1, 2, 2, 2, 3, 3, 4, 4, 4, 5]

// ── Finger cursor ─────────────────────────────────────────────────────────────
// left:0 top:0 + marginLeft/Top -12 centres the 24px dot.
// animate x/y = translateX/Y → dot centre sits at (x, y) on screen.
function Finger({ x, y, tapping, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="finger"
          initial={{ opacity: 0, scale: 0, x, y }}
          animate={{ opacity: 1, scale: tapping ? [1, 0.5, 1] : 1, x, y }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            x: { type: 'spring', stiffness: 155, damping: 20 },
            y: { type: 'spring', stiffness: 155, damping: 20 },
            scale: tapping ? { duration: 0.38, times: [0, 0.35, 1] } : { duration: 0.2 },
            opacity: { duration: 0.18 },
          }}
          style={{
            position: 'absolute', left: 0, top: 0,
            marginLeft: -12, marginTop: -12,
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 3px 16px rgba(0,0,0,0.38), 0 0 0 1.5px rgba(0,0,0,0.09)',
            zIndex: 80, pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  )
}

// ── Fresco app icon (tree logo) ───────────────────────────────────────────────
function FrescoAppIcon({ size, style }) {
  return (
    <div style={{ width:size,height:size,borderRadius:Math.round(size*0.24),background:'linear-gradient(135deg,#1e6b3c,#2a8a4e)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,...style }}>
      <svg width={Math.round(size*0.52)} height={Math.round(size*0.52)} viewBox="0 0 28 28" fill="none">
        <path d="M4 21C4 10 14 3 14 3s10 7 10 18c0 3.3-4.5 5-10 5S4 24.3 4 21Z" fill="white"/>
        <line x1="14" y1="26" x2="14" y2="15" stroke="#1e6b3c" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

// ── Shared status bar ─────────────────────────────────────────────────────────
function StatusBar({ light }) {
  const c = light ? '#fff' : '#000'
  return (
    <div style={{ height: 42, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 22px 7px', flexShrink: 0 }}>
      <span style={{ fontSize: 8, fontWeight: 700, color: c }}>11:55</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
        {[3, 5, 7, 9].map((h, i) => <div key={i} style={{ width: 3, height: h, background: c, borderRadius: 1 }} />)}
        <div style={{ width: 17, height: 9, border: `1.5px solid ${c}`, borderRadius: 3, marginLeft: 3, padding: '0 2px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '70%', height: '100%', background: c, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

// ── iPhone Safari mockup ──────────────────────────────────────────────────────
// Phone 240×510, screen 224×494
// Share btn: x=112, y=468  |  "Toevoegen" option: x=112, y=287  |  "Voeg toe": x=205, y=62
function IPhonePhone({ phase }) {
  const fingerVisible = (phase >= 1 && phase <= 5) || (phase >= 7 && phase <= 8)
  const fingerX = phase >= 7 ? 205 : 112
  const fingerY = phase >= 4 && phase <= 5 ? 287 : phase >= 7 ? 62 : 468
  const tapping = phase === 2 || phase === 5 || phase === 8

  const showSafari  = phase <= 5
  const showSheet   = phase >= 3 && phase <= 5
  const showConfirm = phase >= 6 && phase <= 8
  const showSuccess = phase === 9
  const shareActive = phase === 1 || phase === 2

  return (
    <div style={{ position: 'relative', width: 240, height: 510, flexShrink: 0 }}>
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(150deg,#3e3e3e,#181818)', borderRadius: 46, padding: 8, boxShadow: '0 36px 90px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
        <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: 40, overflow: 'hidden', position: 'relative' }}>

          {/* Dynamic Island */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#000', borderRadius: 13, zIndex: 100 }} />

          {/* SAFARI VIEW */}
          <AnimatePresence>
            {showSafari && (
              <motion.div key="safari" initial={{ x: 0 }} exit={{ x: -224 }} transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                <StatusBar />

                {/* Address bar */}
                <div style={{ margin: '0 9px 6px', background: '#f2f2f7', borderRadius: 13, padding: '6.5px 14px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><rect x="1" y="4.5" width="6" height="5" rx="1.2" fill="#666"/><path d="M2.5 4.5V3A1.5 1.5 0 015.5 3v1.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: 8.5, color: '#222', flex: 1, textAlign: 'center', fontWeight: 500 }}>getfresco.nl</span>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2v8M2 6l4-4 4 4"/></svg>
                </div>

                {/* Page */}
                <div style={{ flex: 1, padding: '6px 13px', overflow: 'hidden', paddingBottom: 56 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
                    <div style={{ width: 17, height: 17, borderRadius: 4, background: 'var(--c-brand)' }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--c-brand)' }}>Fresco</span>
                  </div>
                  {[...Array(7)].map((_, i) => (
                    <div key={i} style={{ height: 40, borderRadius: 8, background: i%2===0?'#f7f7f7':'#f0f8f3', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', padding: '0 9px', gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: '#ddd', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ width: '62%', height: 5.5, background: '#ccc', borderRadius: 3, marginBottom: 4 }} />
                        <div style={{ width: '40%', height: 4.5, background: '#ddd', borderRadius: 2.5 }} />
                      </div>
                      <div style={{ width: 24, height: 13, borderRadius: 4, background: 'var(--c-brand)', opacity: 0.55, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>

                {/* Safari toolbar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 54, background: '#f8f8f8', borderTop: '0.5px solid #d8d8d8', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 14px' }}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#c0c0c0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="10 2 2 10 10 18"/></svg>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#ddd" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 2 10 10 2 18"/></svg>
                  <motion.div animate={{ background: shareActive ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0)' }} transition={{ duration: 0.25 }} style={{ width: 38, height: 38, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="20" viewBox="0 0 18 22" fill="none" stroke="#007aff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="10" width="14" height="11" rx="2"/><polyline points="13 5 9 1 5 5"/><line x1="9" y1="1" x2="9" y2="15"/>
                    </svg>
                  </motion.div>
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 2h12v16l-6-4-6 4V2z"/></svg>
                  <div style={{ width: 17, height: 17, border: '2px solid #aaa', borderRadius: 5, fontSize: 8, color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</div>
                </div>

                {/* Share sheet */}
                <AnimatePresence>
                  {showSheet && (
                    <motion.div key="sheet" initial={{ y: 330 }} animate={{ y: 0 }} exit={{ y: 330 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
                      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 318, background: '#f0f0f5', borderRadius: '20px 20px 0 0', zIndex: 40, boxShadow: '0 -12px 48px rgba(0,0,0,0.24)' }}>
                      <div style={{ width: 38, height: 4, background: '#c0c0c5', borderRadius: 2, margin: '10px auto 0' }} />
                      <div style={{ display: 'flex', gap: 8, padding: '12px 14px 8px', overflowX: 'hidden' }}>
                        {[{l:'AirDrop',c:'#3498db'},{l:'Mail',c:'#2980b9'},{l:'Messages',c:'#27ae60'},{l:'Notes',c:'#f39c12'},{l:'More',c:'#95a5a6'}].map(({l,c})=>(
                          <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 13, background: c, opacity: 0.25 }} />
                            <span style={{ fontSize: 6.5, color: '#444' }}>{l}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: 0.5, background: '#c8c8cc', margin: '2px 0 6px' }} />
                      <div style={{ background: '#fff', margin: '0 11px', borderRadius: 14, overflow: 'hidden' }}>
                        {[{label:'Add to Home Screen',icon:true,primary:true},{label:'Add to Reading List'},{label:'Add Bookmark'}].map(({label,icon,primary},i)=>(
                          <motion.div key={label}
                            animate={{ background: primary&&phase===4?'rgba(0,122,255,0.06)':primary&&phase===5?'#007aff':'transparent' }}
                            transition={{ duration: 0.28 }}
                            style={{ padding:'10px 14px', fontSize:8.5, fontWeight:primary?600:400, color:primary&&phase===5?'#fff':'#111', borderBottom:i<2?'0.5px solid #e8e8ee':'none', display:'flex', alignItems:'center', gap:10 }}>
                            {icon && <div style={{ width:19,height:19,borderRadius:5,flexShrink:0,background:phase===5?'rgba(255,255,255,0.3)':'#e8e8ed',display:'flex',alignItems:'center',justifyContent:'center' }}><span style={{ fontSize:14,color:phase===5?'#fff':'#333',lineHeight:1,marginTop:-1 }}>+</span></div>}
                            {label}
                          </motion.div>
                        ))}
                      </div>
                      <div style={{ margin:'8px 11px 0', background:'#fff', borderRadius:14, padding:'10px 14px', fontSize:9, fontWeight:600, color:'#007aff', textAlign:'center' }}>Cancel</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONFIRM SCREEN */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div key="confirm" initial={{ x: 224 }} animate={{ x: 0 }} exit={{ x: 224 }} transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
                style={{ position: 'absolute', inset: 0, background: '#f2f2f7', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#000', borderRadius: 13, zIndex: 10 }} />
                <StatusBar />
                <div style={{ height: 44, background: '#f9f9fb', borderBottom: '0.5px solid #d0d0d5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
                  <span style={{ fontSize: 8.5, color: '#007aff' }}>Cancel</span>
                  <span style={{ fontSize: 7.5, fontWeight: 600, color: '#000', flex: 1, textAlign: 'center', padding: '0 4px' }}>Add to Home Screen</span>
                  <span style={{ fontSize: 8.5, fontWeight: phase===8?700:600, color: '#007aff' }}>Add</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px 16px' }}>
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 22 }}
                    style={{ borderRadius: 17, overflow: 'hidden', boxShadow: '0 6px 20px rgba(30,107,60,0.4)', marginBottom: 20 }}>
                    <FrescoAppIcon size={68} />
                  </motion.div>
                  <div style={{ width: '100%', background: '#fff', borderRadius: 11, padding: '10px 14px', marginBottom: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: '#000' }}>Fresco</span>
                    <motion.div animate={{ opacity: [1,0,1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 1.5, height: 14, background: '#007aff', borderRadius: 1, marginLeft: 1 }} />
                  </div>
                  <div style={{ width: '100%', background: '#fff', borderRadius: 11, padding: '8px 14px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: 7.5, color: '#8e8e93' }}>getfresco.nl</span>
                  </div>
                  <p style={{ fontSize: 7.5, color: '#8e8e93', textAlign: 'center', lineHeight: 1.65, maxWidth: 170, margin: 0 }}>
                    An icon will be added to your Home Screen so you can quickly access this website.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div key="success-ios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0, background: '#f5f5f7', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 90, height: 24, background: '#000', borderRadius: 13, zIndex: 10 }} />
                <StatusBar />
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 500, color: '#444', letterSpacing: '0.03em' }}>6 January</div>
                  <div style={{ fontSize: 30, fontWeight: 100, color: '#111', lineHeight: 1.1 }}>11:55</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px 12px', padding: '0 20px', alignContent: 'start' }}>
                  {[...Array(16)].map((_, i) => (
                    <motion.div key={i} initial={i===12?{scale:0,opacity:0}:{}} animate={i===12?{scale:1,opacity:1}:{}} transition={i===12?{delay:0.55,type:'spring',stiffness:360,damping:18}:{}}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      {i===12 ? <FrescoAppIcon size={44} style={{ borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.18)' }} /> : <div style={{ width:44,height:44,borderRadius:12,background:`rgba(0,0,0,${0.06+(i%5)*0.015})` }} />}
                      {i===12&&<span style={{ fontSize:7,color:'#333' }}>Fresco</span>}
                    </motion.div>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 22, padding: '10px 18px', display: 'flex', gap: 14, border: '1px solid rgba(0,0,0,0.06)' }}>
                  {[...Array(4)].map((_,i)=><div key={i} style={{ width:40,height:40,borderRadius:11,background:'rgba(0,0,0,0.08)' }}/>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Finger x={fingerX} y={fingerY} tapping={tapping} visible={fingerVisible} />
        </div>
      </div>
      <div style={{ position:'absolute',right:-3,top:138,width:3,height:62,background:'#1a1a1a',borderRadius:'0 2px 2px 0' }} />
      <div style={{ position:'absolute',left:-3,top:116,width:3,height:36,background:'#1a1a1a',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:160,width:3,height:72,background:'#1a1a1a',borderRadius:'2px 0 0 2px' }} />
    </div>
  )
}

// ── Android Chrome mockup ─────────────────────────────────────────────────────
// Phone 240×510, screen 224×494
// ⋮ menu:          x=208, y=48   (top-right of address bar)
// "App installeren": x=151, y=147  (3rd item in dropdown)
// "Installeer" btn:  x=168, y=440  (right button in install dialog)
function AndroidPhone({ phase }) {
  const fingerVisible = (phase >= 1 && phase <= 5) || (phase >= 7 && phase <= 8)
  const fingerX = phase >= 4 && phase <= 5 ? 151 : phase >= 7 ? 168 : 208
  const fingerY = phase >= 4 && phase <= 5 ? 147 : phase >= 7 ? 440 : 48
  const tapping = phase === 2 || phase === 5 || phase === 8

  const showChrome  = phase <= 5
  const showDropdown = phase >= 3 && phase <= 5
  const showDialog  = phase >= 6 && phase <= 8
  const showSuccess = phase === 9
  const menuActive  = phase === 1 || phase === 2

  return (
    <div style={{ position: 'relative', width: 240, height: 510, flexShrink: 0 }}>
      <div style={{ width:'100%',height:'100%',background:'linear-gradient(150deg,#2c2c2c,#101010)',borderRadius:28,padding:8,boxShadow:'0 36px 90px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.09)' }}>
        <div style={{ width:'100%',height:'100%',background:'#fff',borderRadius:22,overflow:'hidden',position:'relative' }}>

          {/* CHROME VIEW */}
          <AnimatePresence>
            {showChrome && (
              <motion.div key="chrome" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ position:'absolute',inset:0,display:'flex',flexDirection:'column',background:'#fff' }}>

                {/* Status bar */}
                <div style={{ height:24,background:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 10px',flexShrink:0 }}>
                  <span style={{ fontSize:7.5,fontWeight:700,color:'#111' }}>11:55</span>
                  <div style={{ display:'flex',gap:3,alignItems:'flex-end' }}>
                    {[3,5,7,9].map((h,i)=><div key={i} style={{ width:2.5,height:h,background:'#111',borderRadius:1 }}/>)}
                    <div style={{ width:15,height:7.5,border:'1.5px solid #111',borderRadius:2,marginLeft:3,padding:'0 1.5px',display:'flex',alignItems:'center' }}>
                      <div style={{ width:'70%',height:'100%',background:'#111',borderRadius:1 }} />
                    </div>
                  </div>
                </div>

                {/* Chrome address bar */}
                <div style={{ height:52,background:'#fff',borderBottom:'1px solid #e8e8e8',display:'flex',alignItems:'center',padding:'0 8px',gap:6,flexShrink:0 }}>
                  <div style={{ flex:1,background:'#f1f3f4',borderRadius:22,height:36,display:'flex',alignItems:'center',padding:'0 12px',gap:6 }}>
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><rect x="1" y="4.5" width="6" height="5" rx="1.2" fill="#666"/><path d="M2.5 4.5V3A1.5 1.5 0 015.5 3v1.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    <span style={{ fontSize:8,color:'#333',flex:1 }}>getfresco.nl</span>
                    {/* Install icon in address bar (PWA indicator) */}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v9M9 11l3 3 3-3"/><line x1="5" y1="19" x2="19" y2="19"/>
                    </svg>
                  </div>
                  {/* ⋮ menu button */}
                  <motion.div animate={{ background: menuActive?'rgba(26,115,232,0.12)':'transparent' }} transition={{ duration:0.25 }}
                    style={{ width:34,height:34,borderRadius:17,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2.5 }}>
                    {[0,1,2].map(i=><div key={i} style={{ width:3,height:3,background:menuActive?'#1a73e8':'#555',borderRadius:'50%',transition:'background 0.25s' }}/>)}
                  </motion.div>
                </div>

                {/* Page */}
                <div style={{ flex:1,padding:'8px 12px',overflow:'hidden' }}>
                  <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:9 }}>
                    <div style={{ width:16,height:16,borderRadius:4,background:'var(--c-brand)' }} />
                    <span style={{ fontSize:11,fontWeight:700,color:'var(--c-brand)' }}>Fresco</span>
                  </div>
                  {[...Array(7)].map((_,i)=>(
                    <div key={i} style={{ height:38,borderRadius:7,background:i%2===0?'#f7f7f7':'#f0f8f3',border:'1px solid #ebebeb',display:'flex',alignItems:'center',padding:'0 9px',gap:7,marginBottom:5 }}>
                      <div style={{ width:26,height:26,borderRadius:6,background:'#ddd',flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ width:'60%',height:5,background:'#ccc',borderRadius:3,marginBottom:4 }} />
                        <div style={{ width:'38%',height:4,background:'#ddd',borderRadius:2.5 }} />
                      </div>
                      <div style={{ width:22,height:12,borderRadius:4,background:'var(--c-brand)',opacity:0.55,flexShrink:0 }} />
                    </div>
                  ))}
                </div>

                {/* Chrome dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div key="dropdown" initial={{ opacity:0,scaleY:0.8,transformOrigin:'top right' }} animate={{ opacity:1,scaleY:1 }} exit={{ opacity:0,scaleY:0.8 }} transition={{ duration:0.22,ease:[0.16,1,0.3,1] }}
                      style={{ position:'absolute',top:76,right:6,width:158,background:'#fff',borderRadius:10,boxShadow:'0 8px 32px rgba(0,0,0,0.2)',overflow:'hidden',zIndex:40 }}>
                      {[
                        { label:'New tab' },
                        { label:'Bookmarks' },
                        { label:'Install and create shortcut', primary:true },
                        { label:'History' },
                        { label:'Settings' },
                      ].map(({label,primary},i)=>(
                        <motion.div key={label}
                          animate={{ background:primary&&phase===4?'rgba(26,115,232,0.07)':primary&&phase===5?'#1a73e8':'transparent' }}
                          transition={{ duration:0.28 }}
                          style={{ padding:'8px 14px',fontSize:8,fontWeight:primary?700:400,color:primary&&phase===5?'#fff':primary?'#1a73e8':'#222',borderBottom:i<4?'1px solid #f5f5f5':'none',display:'flex',alignItems:'center',gap:8 }}>
                          {primary && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={phase===5?'#fff':'#1a73e8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 5v9M9 11l3 3 3-3"/><line x1="5" y1="19" x2="19" y2="19"/>
                            </svg>
                          )}
                          {label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INSTALL DIALOG */}
          <AnimatePresence>
            {showDialog && (
              <motion.div key="dialog" initial={{ y: 130 }} animate={{ y: 0 }} exit={{ y: 130 }} transition={{ duration:0.38,ease:[0.16,1,0.3,1] }}
                style={{ position:'absolute',bottom:0,left:0,right:0,background:'#fff',borderRadius:'20px 20px 0 0',zIndex:50,boxShadow:'0 -8px 40px rgba(0,0,0,0.22)',padding:'16px 18px 24px' }}>
                <div style={{ width:36,height:4,background:'#e0e0e0',borderRadius:2,margin:'0 auto 16px' }} />
                <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:18 }}>
                  <FrescoAppIcon size={44} style={{ borderRadius:12 }} />
                  <div>
                    <div style={{ fontSize:9.5,fontWeight:700,color:'#111',marginBottom:2 }}>Fresco</div>
                    <div style={{ fontSize:7.5,color:'#888' }}>getfresco.nl</div>
                  </div>
                </div>
                <div style={{ display:'flex',justifyContent:'flex-end',gap:8 }}>
                  <div style={{ padding:'7px 14px',borderRadius:6,background:'transparent',fontSize:8,fontWeight:600,color:'#1a73e8' }}>CANCEL</div>
                  <motion.div animate={{ background:phase===8?'#1557b0':'#1a73e8' }} transition={{ duration:0.2 }}
                    style={{ padding:'7px 18px',borderRadius:6,fontSize:8,fontWeight:700,color:'#fff' }}>
                    INSTALL
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUCCESS */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div key="success-android" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
                style={{ position:'absolute',inset:0,background:'#f1f3f4',display:'flex',flexDirection:'column' }}>
                {/* Status bar */}
                <div style={{ height:24,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px' }}>
                  <span style={{ fontSize:7.5,fontWeight:700,color:'#111' }}>11:55</span>
                  <div style={{ display:'flex',gap:3,alignItems:'flex-end' }}>
                    {[3,5,7,9].map((h,i)=><div key={i} style={{ width:2.5,height:h,background:'#111',borderRadius:1 }}/>)}
                    <div style={{ width:15,height:7.5,border:'1.5px solid #111',borderRadius:2,marginLeft:3,padding:'0 1.5px',display:'flex',alignItems:'center' }}>
                      <div style={{ width:'70%',height:'100%',background:'#111',borderRadius:1 }} />
                    </div>
                  </div>
                </div>
                {/* Date */}
                <div style={{ textAlign:'center',padding:'8px 0 16px' }}>
                  <div style={{ fontSize:10.5,fontWeight:500,color:'#444',letterSpacing:'0.03em' }}>9 August</div>
                  <div style={{ fontSize:30,fontWeight:100,color:'#111',lineHeight:1.1 }}>11:55</div>
                </div>
                {/* Icon grid */}
                <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px 12px',padding:'0 20px',alignContent:'start' }}>
                  {[...Array(16)].map((_,i)=>(
                    <motion.div key={i} initial={i===8?{scale:0,opacity:0}:{}} animate={i===8?{scale:1,opacity:1}:{}} transition={i===8?{delay:0.55,type:'spring',stiffness:360,damping:18}:{}}
                      style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:5 }}>
                      {i===8 ? <FrescoAppIcon size={44} style={{ borderRadius:8,boxShadow:'0 4px 12px rgba(0,0,0,0.18)' }} /> : <div style={{ width:44,height:44,borderRadius:8,background:`rgba(0,0,0,${0.06+(i%5)*0.015})` }} />}
                      {i===8&&<span style={{ fontSize:7,color:'#333' }}>Fresco</span>}
                    </motion.div>
                  ))}
                </div>
                {/* Android dock */}
                <div style={{ position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.7)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderRadius:18,padding:'9px 16px',display:'flex',gap:14,border:'1px solid rgba(0,0,0,0.06)' }}>
                  {[...Array(5)].map((_,i)=><div key={i} style={{ width:36,height:36,borderRadius:8,background:'rgba(0,0,0,0.08)' }}/>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Finger x={fingerX} y={fingerY} tapping={tapping} visible={fingerVisible} />
        </div>
      </div>
      {/* Buttons */}
      <div style={{ position:'absolute',right:-3,top:110,width:3,height:50,background:'#1a1a1a',borderRadius:'0 2px 2px 0' }} />
      <div style={{ position:'absolute',left:-3,top:90,width:3,height:30,background:'#1a1a1a',borderRadius:'2px 0 0 2px' }} />
      <div style={{ position:'absolute',left:-3,top:128,width:3,height:60,background:'#1a1a1a',borderRadius:'2px 0 0 2px' }} />
    </div>
  )
}

// ── Device selector card ──────────────────────────────────────────────────────
function DeviceCard({ label, sub, note, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)
  const active = hovered && !disabled
  return (
    <motion.button onClick={disabled?undefined:onClick} onMouseEnter={()=>!disabled&&setHovered(true)} onMouseLeave={()=>setHovered(false)}
      whileTap={disabled?{}:{scale:0.97}}
      style={{ width:210,minHeight:200,border:`2px solid ${active?'var(--c-brand)':'var(--c-border)'}`,borderRadius:20,background:active?'var(--c-brand-bg)':'#fff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,transition:'border-color 0.2s, background 0.2s',padding:'2rem' }}>
      <div style={{ width:52,height:84,border:`3px solid ${active?'var(--c-brand)':'#ccc'}`,borderRadius:label==='iPhone'?16:10,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color 0.2s' }}>
        {label==='iPhone'&&<div style={{ width:20,height:5,background:active?'var(--c-brand)':'#ccc',borderRadius:3,position:'absolute',top:6,transition:'background 0.2s' }}/>}
        {label==='Android'&&<div style={{ width:7,height:7,borderRadius:'50%',background:active?'var(--c-brand)':'#ccc',position:'absolute',top:7,transition:'background 0.2s' }}/>}
        <div style={{ width:28,height:28,borderRadius:label==='iPhone'?8:4,background:active?'var(--c-brand)':'#eee',transition:'background 0.2s' }} />
        <div style={{ width:14,height:4,background:active?'var(--c-brand)':'#ccc',borderRadius:2,position:'absolute',bottom:7,transition:'background 0.2s' }} />
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'1.05rem',fontWeight:700,color:active?'var(--c-brand)':'var(--c-text)',transition:'color 0.2s' }}>{label}</div>
        <div style={{ fontSize:'0.75rem',color:'var(--c-text-subtle)',marginTop:2 }}>{sub}</div>
        {note&&<div style={{ fontSize:'0.7rem',color:'var(--c-text-subtle)',marginTop:4 }}>{note}</div>}
      </div>
    </motion.button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GetAppPage() {
  const { t } = useTranslation()
  const [device, setDevice] = useState(null)
  const [phase, setPhase] = useState(0)

  const phases = device === 'android' ? ANDROID_PHASES : IPHONE_PHASES

  useEffect(() => { setPhase(0) }, [device])

  useEffect(() => {
    if (!device) return
    const t = setTimeout(() => setPhase(p => (p + 1) % phases.length), phases[phase]?.ms ?? 1000)
    return () => clearTimeout(t)
  }, [phase, device])

  const userStep = PHASE_TO_STEP[phase] ?? 1

  const iphoneSteps = [t('app.step1'), t('app.step2'), t('app.step3'), t('app.step4'), t('app.step5')]
  const androidSteps = [t('app.android_step1'), t('app.android_step2'), t('app.android_step3'), t('app.android_step4'), t('app.android_step5')]
  const stepLabels = device === 'android' ? androidSteps : iphoneSteps

  const totalMs = phases.reduce((a, b) => a + b.ms, 0)
  const elapsed = phases.slice(0, phase).reduce((a, b) => a + b.ms, 0)
  const endFraction = Math.min(1, (elapsed + (phases[phase]?.ms ?? 0)) / totalMs)

  return (
    <Layout>
      <Helmet>
        <title>{t('app.page_title')}</title>
        <meta name="description" content={t('app.desc')} />
      </Helmet>

      {/* Hero */}
      <section style={{ background:'linear-gradient(160deg,#fff 0%,#f2f9f5 55%,#e8f4ec 100%)',padding:'var(--pad-hero)',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute',right:-80,top:-80,width:440,height:440,borderRadius:'50%',background:'radial-gradient(circle,rgba(30,107,60,0.07) 0%,transparent 68%)',pointerEvents:'none' }} />
        <div style={{ maxWidth:560,margin:'0 auto',padding:'0 var(--layout-pad)',position:'relative' }}>
          <h1 style={{ margin:'0 0 1rem',fontSize:'clamp(2rem,4.5vw,3.2rem)',letterSpacing:'-0.01em',lineHeight:1.1,color:'var(--c-text)' }}>
            {t('app.h1_line1')}<br />
            <em style={{ color:'var(--c-brand)',fontStyle:'italic' }}>{t('app.h1_line2')}</em>
          </h1>
          <p style={{ margin:'0 auto',fontSize:'1rem',color:'var(--c-text-muted)',lineHeight:1.8,maxWidth:400 }}>{t('app.desc')}</p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding:'var(--pad-section)',background:'#fafafa',borderTop:'1px solid var(--c-border)' }}>
        <div style={{ maxWidth:'var(--layout-max)',margin:'0 auto',padding:'0 var(--layout-pad)' }}>
          <AnimatePresence mode="wait">

            {/* Selector */}
            {!device && (
              <motion.div key="selector" initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-12 }} transition={{ duration:0.25 }} style={{ textAlign:'center' }}>
                <h2 style={{ margin:'0 0 0.4rem',fontSize:'1.4rem',color:'var(--c-text)',letterSpacing:'-0.01em' }}>{t('app.selector_title')}</h2>
                <p style={{ margin:'0 0 2.5rem',fontSize:'0.875rem',color:'var(--c-text-subtle)' }}>{t('app.selector_sub')}</p>
                <div style={{ display:'flex',gap:'1.25rem',justifyContent:'center',flexWrap:'wrap' }}>
                  <DeviceCard label="iPhone" sub="Safari" onClick={()=>setDevice('iphone')} />
                  <DeviceCard label="Android" sub="Chrome" onClick={()=>setDevice('android')} />
                </div>
              </motion.div>
            )}

            {/* iPhone or Android guide */}
            {device && (
              <motion.div key={device} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-12 }} transition={{ duration:0.25 }}>
                <div style={{ display:'flex',gap:'3rem',alignItems:'center',flexWrap:'wrap',justifyContent:'center' }}>

                  {/* Left: instructions */}
                  <div style={{ flex:'1 1 260px',maxWidth:320 }}>
                    <button onClick={()=>setDevice(null)} style={{ display:'inline-flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',color:'var(--c-text-muted)',fontSize:'0.82rem',fontWeight:500,marginBottom:'1.5rem',padding:0 }}>
                      <ArrowLeft size={14} />
                      {t('app.back')}
                    </button>

                    <div style={{ fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--c-text-subtle)',marginBottom:'1.25rem' }}>
                      {device==='iphone' ? 'iPhone · Safari' : 'Android · Chrome'}
                    </div>

                    <div style={{ display:'flex',flexDirection:'column' }}>
                      {stepLabels.map((label, i) => {
                        const stepNum = i + 1
                        const done = userStep > stepNum
                        const active = userStep === stepNum
                        return (
                          <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'0.8rem 0',borderBottom:i<4?'1px solid var(--c-border)':'none',opacity:active?1:done?0.55:0.28,transition:'opacity 0.4s' }}>
                            <div style={{ width:22,height:22,borderRadius:'50%',background:active||done?'var(--c-brand)':'#ddd',color:'#fff',fontSize:'0.68rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,transition:'background 0.3s' }}>
                              {done ? '✓' : stepNum}
                            </div>
                            <span style={{ fontSize:'0.875rem',fontWeight:active?600:400,color:active?'var(--c-text)':'var(--c-text-muted)',lineHeight:1.5,transition:'font-weight 0.2s,color 0.2s' }}>{label}</span>
                          </div>
                        )
                      })}
                    </div>

                    <p style={{ fontSize:'0.75rem',color:'var(--c-text-subtle)',marginTop:'1.25rem',lineHeight:1.6,marginBottom:0 }}>
                      {device==='iphone' ? t('app.safari_note') : t('app.chrome_note')}
                    </p>
                  </div>

                  {/* Right: phone */}
                  <div style={{ flex:'0 0 auto' }}>
                    {device==='iphone' ? <IPhonePhone phase={phase}/> : <AndroidPhone phase={phase}/>}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:'var(--pad-section)',background:'var(--c-bg)',borderTop:'1px solid var(--c-border)' }}>
        <div style={{ maxWidth:'var(--layout-max)',margin:'0 auto',padding:'0 var(--layout-pad)' }}>
          <h2 style={{ margin:'0 0 0.4rem',fontSize:'1.5rem',letterSpacing:'-0.01em',color:'var(--c-text)',textAlign:'center' }}>{t('app.why_title')}</h2>
          <p style={{ margin:'0 0 2.5rem',textAlign:'center',fontSize:'0.85rem',color:'var(--c-text-subtle)' }}>{t('app.why_sub')}</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.25rem' }}>
            {[{Icon:Zap,title:t('app.feat1_title'),body:t('app.feat1_body')},{Icon:Smartphone,title:t('app.feat2_title'),body:t('app.feat2_body')}].map(({Icon,title,body})=>(
              <div key={title} style={{ padding:'1.5rem',border:'1px solid var(--c-border)',borderRadius:'var(--r-xl)',background:'#fff' }}>
                <div style={{ width:40,height:40,borderRadius:10,background:'var(--c-brand-bg)',border:'1px solid var(--c-brand-tint)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'0.9rem' }}>
                  <Icon size={18} color="var(--c-brand)" strokeWidth={1.75}/>
                </div>
                <h3 style={{ margin:'0 0 0.35rem',fontSize:'0.95rem',color:'var(--c-text)',fontWeight:600 }}>{title}</h3>
                <p style={{ margin:0,fontSize:'0.8rem',color:'var(--c-text-muted)',lineHeight:1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
