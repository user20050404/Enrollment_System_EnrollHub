import React, { useState, useRef, useEffect } from 'react';

const RESPONSES = [
  {
    keywords: ['enroll', 'enrollment', 'how to enroll', 'sign up for subject'],
    answer: 'To enroll in a subject:\n1. Go to the Enrollments page\n2. Click "+ Enroll Student"\n3. Select the student and section\n4. Click "Enroll Student"\n\nNote: Sections that are full cannot be selected.'
  },
  {
    keywords: ['full', 'no slots', 'no space', 'capacity', 'max'],
    answer: 'Each section has a maximum number of students. When a section is full, it will show "FULL" and cannot accept more enrollments. Please choose a different section with available slots.'
  },
  {
    keywords: ['drop', 'dropped', 'remove enrollment', 'cancel enrollment'],
    answer: 'To drop a subject, an admin or staff must update the enrollment status to "Dropped" from the Enrollments page. Students cannot drop subjects on their own.'
  },
  {
    keywords: ['units', 'total units', 'how many units'],
    answer: 'Your total enrolled units are calculated automatically based on the subjects you are enrolled in. You can see your total units in the Students page under your profile.'
  },
  {
    keywords: ['section', 'sections', 'what is a section'],
    answer: 'A section is a specific class schedule for a subject. Each section has:\n- A subject (e.g. CS101)\n- A room and schedule\n- An instructor\n- A maximum number of students'
  },
  {
    keywords: ['subject', 'subjects', 'available subjects'],
    answer: 'Subjects are the courses offered each semester. You can view all available subjects in the Subjects page. Each subject has a code, name, units, year level, and semester.'
  },
  {
    keywords: ['student id', 'id number', 'student number'],
    answer: 'Your Student ID is a unique identifier assigned to you (e.g. 2024-0001). It is required when adding a student to the system. Contact admin if you need help with your Student ID.'
  },
  {
    keywords: ['login', 'sign in', 'can\'t login', 'forgot password'],
    answer: 'To login:\n1. Go to the Login page\n2. Enter your email and password\n3. Click "Sign In"\n\nIf you forgot your password, contact your system administrator to reset it.'
  },
  {
    keywords: ['register', 'sign up', 'create account', 'new account'],
    answer: 'To create an account:\n1. Click "Register" on the login page\n2. Fill in your details\n3. Submit the form\n4. Check your email for a verification link\n5. Click the link to verify your account\n6. You can now login!'
  },
  {
    keywords: ['verify', 'verification', 'email verification', 'confirm email'],
    answer: 'After registering, check your email inbox for a verification link. Click the link to activate your account. If you didn\'t receive the email, check your spam folder or contact the administrator.'
  },
  {
    keywords: ['admin', 'role', 'staff', 'permission', 'access'],
    answer: 'The system has 3 roles:\n- Admin: Full access (add/edit/delete everything)\n- Staff: Can manage students, subjects, sections, and enrollments\n- Student: Can view their own enrollment information'
  },
  {
    keywords: ['schedule', 'time', 'when', 'class time'],
    answer: 'Class schedules are set per section. Go to the Sections page to view the schedule, room, and instructor for each section.'
  },
  {
    keywords: ['profile', 'account', 'my account', 'personal info'],
    answer: 'You can view and update your profile by clicking your name in the top navigation bar or going to the Profile page. You can update your photo and personal information there.'
  },
  {
    keywords: ['duplicate', 'already enrolled', 'enrolled twice'],
    answer: 'The system prevents duplicate enrollments. A student cannot enroll in the same subject twice, even in different sections. If you see this error, the student is already enrolled in that subject.'
  },
  {
    keywords: ['school year', 'academic year', 'semester'],
    answer: 'Sections are organized by school year (e.g. 2024-2025) and semester (1st, 2nd, or Summer). Make sure to select the correct school year and semester when creating sections.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer: 'Hello! 👋 I\'m your enrollment assistant. I can help you with:\n- How to enroll in subjects\n- Section availability\n- Understanding roles and permissions\n- Account and login issues\n\nWhat do you need help with?'
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'salamat'],
    answer: 'You\'re welcome! 😊 Feel free to ask if you have more questions about the enrollment system.'
  },
  {
    keywords: ['help', 'what can you do', 'commands', 'topics'],
    answer: 'I can help you with:\n📋 Enrollment process\n🏫 Sections and capacity\n📚 Subjects and units\n👥 Student management\n🔐 Login and registration\n👤 Roles and permissions\n\nJust type your question!'
  },
];

function getResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const item of RESPONSES) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.answer;
    }
  }
  return "I'm not sure about that. Try asking about:\n- How to enroll\n- Section capacity\n- Roles and permissions\n- Login or registration\n\nOr contact your system administrator for further help.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm your enrollment assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const reply = { role: 'assistant', content: getResponse(input) };
    setMessages(m => [...m, userMsg, reply]);
    setInput('');
  };

  const handleKey = e => { if (e.key === 'Enter') send(); };

  const quickQuestions = [
    'How do I enroll?',
    'What are the roles?',
    'Section is full?',
    'How to register?',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: '50%', background: '#4F46E5', border: 'none',
          color: '#fff', fontSize: 24, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(79,70,229,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="Enrollment Assistant"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, width: 360, height: 500,
          background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', zIndex: 999, overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ background: '#4F46E5', padding: '1rem', color: '#fff' }}>
            <strong style={{ fontSize: '1rem' }}>💬 Enrollment Assistant</strong>
            <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: 2 }}>Ask me anything about enrollment</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? '#4F46E5' : '#F3F4F6',
                color: m.role === 'user' ? '#fff' : '#111',
                padding: '0.6rem 0.9rem',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: '0.875rem', lineHeight: 1.6,
                whiteSpace: 'pre-line',
              }}>
                {m.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0.5rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid #E5E7EB' }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => {
                  const reply = getResponse(q);
                  setMessages(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: reply }]);
                }} style={{
                  background: '#EEF2FF', color: '#4F46E5', border: 'none',
                  borderRadius: 99, padding: '0.3rem 0.75rem', fontSize: '0.8rem',
                  cursor: 'pointer', fontWeight: 500
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.5rem' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Type your question..."
              style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem' }}
            />
            <button onClick={send} disabled={!input.trim()} style={{
              padding: '0.5rem 1rem', background: '#4F46E5', color: '#fff',
              border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
              opacity: !input.trim() ? 0.5 : 1
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
