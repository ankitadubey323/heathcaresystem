import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DrAIWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: '👋 Hello! I am Dr. AI. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { type: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://ai-agent-9-nnzd.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      const reply = data.response || data.message || 'I am here to help!'
      setMessages(prev => [...prev, { type: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { type: 'bot', text: '⚠️ Could not connect to Dr. AI.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'fixed', bottom: '90px', right: '24px',
              width: '320px', height: '440px',
              background: '#111', borderRadius: '20px',
              border: '1px solid #222', display: 'flex',
              flexDirection: 'column', overflow: 'hidden',
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #00d4aa, #00a87a)',
              padding: '14px 16px', display: 'flex',
              alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '24px' }}>🩺</span>
              <div>
                <p style={{ color: '#000', fontWeight: '700', fontSize: '14px' }}>Dr. AI Agent</p>
                <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '11px' }}>● Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginLeft: 'auto', background: 'none',
                  border: 'none', color: '#000', fontSize: '18px', cursor: 'pointer',
                }}
              >✕</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '12px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.type === 'user' ? '#00d4aa' : '#1a1a1a',
                  color: msg.type === 'user' ? '#000' : '#fff',
                  padding: '8px 12px', borderRadius: '12px',
                  fontSize: '13px', lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div style={{
                  alignSelf: 'flex-start', background: '#1a1a1a',
                  padding: '8px 14px', borderRadius: '12px', color: '#888',
                }}>
                  typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 12px', borderTop: '1px solid #222',
              display: 'flex', gap: '8px',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Dr. AI..."
                style={{
                  flex: 1, border: '1px solid #333', borderRadius: '20px',
                  padding: '8px 14px', fontSize: '13px',
                  background: '#1a1a1a', color: '#fff', outline: 'none',
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#00d4aa', border: 'none',
                  cursor: 'pointer', fontSize: '16px',
                }}
              >→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00d4aa, #00a87a)',
          border: 'none', cursor: 'pointer', fontSize: '26px',
          zIndex: 10000, boxShadow: '0 4px 20px rgba(0,212,170,0.4)',
        }}
      >
        🩺
      </motion.button>
    </>
  )
}