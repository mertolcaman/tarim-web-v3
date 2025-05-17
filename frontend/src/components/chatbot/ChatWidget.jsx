// src/components/chatbot/ChatWidget.jsx

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// Configure Axios to use your VITE_API_BASE env var
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
});

const WELCOME_MESSAGE =
    '👋 Hello! I’m your agricultural assistant. Ask me anything about your sensor data.';

const ChatWidget = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const url = `/chat/history/${userId}`;
            console.log('Fetching chat history from', api.defaults.baseURL + url);
            const res = await api.get(url);
            const history = Array.isArray(res.data) ? res.data : [];
            if (history.length === 0) {
                // first-time user: show welcome message
                setMessages([{ role: 'assistant', message: WELCOME_MESSAGE }]);
            } else {
                setMessages(history);
            }
            scrollToBottom();
        } catch (err) {
            console.error('Error fetching history:', err);
            // on error, still show welcome
            setMessages([{ role: 'assistant', message: WELCOME_MESSAGE }]);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', message: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/', {
                user_id: userId,
                message: input,
            });
            const botMsg = { role: 'assistant', message: res.data.reply };
            setMessages((prev) => [...prev, botMsg]);
            scrollToBottom();
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container p-3">
            <div className="card">
                <div className="card-header">Chat with Assistant</div>
                <div
                    className="card-body d-flex flex-column"
                    style={{ height: '400px', overflowY: 'auto' }}
                >
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div
                                key={idx}
                                className={`mb-2 p-2 rounded ${isUser
                                        ? 'bg-primary text-white align-self-end'
                                        : 'align-self-start text-white'
                                    }`}
                                style={{
                                    maxWidth: '75%',
                                    backgroundColor: isUser ? undefined : 'darkgreen',
                                }}
                            >
                                {isUser ? (
                                    msg.message
                                ) : (
                                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                                )}
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
                <div className="card-footer">
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={2}
                            disabled={loading}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={sendMessage}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
