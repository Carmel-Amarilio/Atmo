import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '../cmps/AppHeader';
import { atmoService } from '../services/Atmo.service';

export function Consultation() {

  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! Ask any questions you have about your cloud environment.' }
  ])
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    const newMSG=[...messages, { from: 'user', text: input }]
    setMessages(newMSG)
    sendConsultation(newMSG)
    setInput('')
  }

  async function sendConsultation(newMSG) {
    try {
      const response  = await atmoService.sendConsultation(newMSG)
      setMessages(res=>[...res, response])
      console.log(response );
      
    } catch (error) {
      console.log('Cannot logout', err)
    }
  }

  return (
    <section className='consultation flex column align-center'>
      <AppHeader />
      <h2>
        How can I help you with cloud consultation?
      </h2>

      <section className='chat-box flex'>
        <div className="messages flex column" >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`msg ${msg.from === 'ai' ? 'ai' : 'user'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area flex">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </section>
    </section>
  )
}
