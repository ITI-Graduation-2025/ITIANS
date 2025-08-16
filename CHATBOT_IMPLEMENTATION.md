# ITIANS Chatbot Implementation

## Overview
This implementation adds an AI-powered chatbot to the ITIANS platform using Firebase's "generate" collection and Gemini AI. The chatbot provides a floating widget that users can access from any page to get help with platform navigation, career advice, and more.

## Features

### 🤖 AI Assistant
- **Powered by Gemini AI** through Firebase's "generate" collection
- **Context-aware responses** specific to ITIANS platform
- **Real-time interaction** with smooth animations

### 💬 Chat Interface
- **Floating widget** accessible from any page
- **Modern UI** with smooth animations using Framer Motion
- **Message history** persistence for logged-in users
- **Suggested prompts** to help users get started
- **Loading indicators** and error handling

### 🔧 Technical Features
- **Firebase integration** for message storage and retrieval
- **Real-time polling** for AI responses
- **User authentication** integration
- **Responsive design** for mobile and desktop
- **Accessibility** with keyboard navigation

## Implementation Details

### Files Created/Modified

1. **`src/services/chatbotService.js`** - Core chatbot service
   - `sendChatbotMessage()` - Sends messages to Firebase "generate" collection
   - `pollForResponse()` - Polls for AI responses
   - `getChatbotHistory()` - Retrieves user's chat history
   - `getSuggestedPrompts()` - Returns helpful prompt suggestions

2. **`src/components/ChatbotWidget.jsx`** - Main chatbot component
   - Floating chat button
   - Expandable chat interface
   - Message display with animations
   - Input handling and suggestions

3. **`src/components/componentts/LayoutWrapper.jsx`** - Added chatbot widget
   - Integrated chatbot into main layout
   - Available on all pages

### Firebase Collection Structure

The chatbot uses the existing "generate" collection with the following structure:

```javascript
{
  createTime: timestamp,
  prompt: "user message",
  response: "AI response",
  status: {
    state: "COMPLETED" | "PENDING" | "FAILED",
    startTime: timestamp,
    completeTime: timestamp
  },
  updateTime: timestamp
}
```

Additional collection for user conversations:
```javascript
// chatbot_conversations collection
{
  userId: "user_id",
  prompt: "user message",
  response: "AI response",
  timestamp: timestamp,
  type: "chatbot"
}
```

## Usage

### For Users
1. **Access the chatbot** by clicking the floating robot icon in the bottom-right corner
2. **Type your question** or select from suggested prompts
3. **Get instant help** with platform navigation, career advice, and more
4. **View chat history** if you're logged in

### For Developers
1. **Customize suggestions** by modifying `getSuggestedPrompts()` in `chatbotService.js`
2. **Add new features** by extending the `ChatbotWidget` component
3. **Modify styling** using Tailwind CSS classes
4. **Add new AI capabilities** by updating the Firebase "generate" collection structure

## Suggested Prompts

The chatbot comes with helpful pre-defined prompts:
- "How can I find a mentor in my field?"
- "What are the best practices for networking on ITIANS?"
- "How do I create an effective profile?"
- "What career development resources are available?"
- "How can I improve my job search strategy?"
- "What events are happening in the ITIANS community?"
- "How do I connect with other professionals?"
- "What skills should I focus on developing?"
- "How can I get help with technical issues?"
- "What are the community guidelines?"

## Technical Requirements

- Firebase project with "generate" collection configured
- Gemini AI integration through Firebase
- Next.js 15+ with React 19+
- Framer Motion for animations
- Tailwind CSS for styling

## Future Enhancements

- **Voice input/output** capabilities
- **File sharing** in chat
- **Multi-language support**
- **Advanced analytics** for user interactions
- **Integration with other platform features**
- **Custom AI training** for platform-specific responses

## Troubleshooting

### Common Issues
1. **Chatbot not responding** - Check Firebase "generate" collection configuration
2. **Messages not saving** - Verify user authentication and Firestore permissions
3. **UI not displaying** - Ensure all dependencies are installed

### Debug Mode
Enable console logging by checking the browser's developer tools for detailed error messages and API responses.

## Support

For technical support or feature requests, please refer to the development team or create an issue in the project repository.
