import React from 'react'
import ChatWidget from './ChatWidget'

const ChatPage = () => {
    // TODO: replace 3 with your real user ID from login context
    const userId = 3

    return (
        <div className="container mt-4">
            <h2>Ask the Agricultural Assistant</h2>
            <ChatWidget userId={userId} />
        </div>
    )
}

export default ChatPage
