import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Send a message to the chatbot and get response
export const sendChatbotMessage = async (prompt, userId = null) => {
  try {
    // Enhance the prompt with context for better responses
    const enhancedPrompt = enhancePromptWithContext(prompt);
    
    // Create a new document in the "generate" collection
    const generateRef = await addDoc(collection(db, "generate"), {
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      createTime: serverTimestamp(),
      startTime: serverTimestamp(),
      status: {
        state: "PENDING"
      }
    });

    console.log("Chatbot message sent, document ID:", generateRef.id);

    // Poll for the response
    const response = await pollForResponse(generateRef.id);
    
    // If we have a userId, we can optionally store the conversation
    if (userId) {
      await storeConversation(userId, prompt, response);
    }

    return {
      success: true,
      response: response,
      messageId: generateRef.id
    };
  } catch (error) {
    console.error("Error sending chatbot message:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Enhance prompt with context for better AI responses
const enhancePromptWithContext = (prompt) => {
  const context = `
You are an intelligent and professional assistant for the ITIANS platform, a comprehensive professional networking platform designed specifically for graduates of the Information Technology Institute (ITI) in Egypt.

PLATFORM OVERVIEW:
ITIANS is a cutting-edge professional platform that serves as a bridge between ITI graduates and the tech industry. It provides comprehensive career development tools, networking opportunities, and professional growth resources.

KEY FEATURES:
- Professional Profile Management: Create and optimize professional profiles
- Mentorship Programs: Connect with experienced industry professionals
- Job Opportunities: Access curated job listings and career opportunities
- Skill Development: Access learning resources and training programs
- Networking Events: Participate in industry events and meetups
- Community Support: Engage with fellow ITI graduates and professionals

TARGET AUDIENCE:
- ITI graduates seeking career advancement
- Professionals looking to mentor others
- Companies seeking ITI talent
- Students preparing for their careers

RESPONSE GUIDELINES:
1. Be professional yet approachable
2. Provide specific, actionable advice
3. Include relevant examples and best practices
4. Reference platform features when applicable
5. Offer step-by-step guidance when possible
6. Be encouraging and supportive
7. Keep responses concise but comprehensive
8. Use clear, professional English

EXPERTISE AREAS:
- Career development and job search strategies
- Professional networking and relationship building
- Technical skill development and learning paths
- Profile optimization and personal branding
- Industry insights and market trends
- Professional etiquette and communication
- Platform navigation and feature utilization

User Question: ${prompt}

Please provide a detailed, professional, and actionable response that helps the user achieve their goals on the ITIANS platform.
`;

  return context;
};

// Poll for response from the generate collection
const pollForResponse = async (messageId, maxAttempts = 30) => {
  const pollInterval = 2000; // 2 seconds
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const docRef = doc(db, "generate", messageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.status?.state === "COMPLETED" && data.response) {
          return data.response;
        } else if (data.status?.state === "FAILED") {
          throw new Error("Chatbot request failed");
        }
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    } catch (error) {
      console.error("Error polling for response:", error);
      attempts++;
      
      // If it's a network error, wait longer before retrying
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        await new Promise(resolve => setTimeout(resolve, pollInterval * 2));
      }
    }
  }

  throw new Error("Timeout waiting for chatbot response");
};

// Store conversation in user's chat history
const storeConversation = async (userId, prompt, response) => {
  try {
    await addDoc(collection(db, "chatbot_conversations"), {
      userId: userId,
      prompt: prompt,
      response: response,
      timestamp: serverTimestamp(),
      type: "chatbot"
    });
  } catch (error) {
    console.error("Error storing conversation:", error);
  }
};

// Get user's chatbot conversation history
export const getChatbotHistory = async (userId, limit = 20) => {
  try {
    const q = query(
      collection(db, "chatbot_conversations"),
      where("userId", "==", userId),
      where("type", "==", "chatbot"),
      orderBy("timestamp", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    const conversations = [];

    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return conversations.reverse(); // Return in chronological order
  } catch (error) {
    console.error("Error getting chatbot history:", error);
    return [];
  }
};

// Get suggested prompts for the chatbot
export const getSuggestedPrompts = () => {
  return [
    "How can I optimize my ITIANS profile to attract better opportunities?",
    "What are the most effective networking strategies for ITI graduates?",
    "How do I find and connect with mentors in the tech industry?",
    "What are the current in-demand skills for ITI graduates?",
    "How can I prepare for technical interviews effectively?",
    "What career paths are most promising for ITI graduates?",
    "How do I build a strong professional network on ITIANS?",
    "What are the best practices for job searching in the tech industry?",
    "How can I improve my communication skills for professional settings?",
    "What resources are available for continuous learning and skill development?",
    "How do I handle career transitions and pivots successfully?",
    "What are the key factors for long-term career success in tech?"
  ];
};
