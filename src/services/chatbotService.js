//src/services/chatbotService.js
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
  serverTimestamp,
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
        state: "PENDING",
      },
    });

    // Poll for the response
    const response = await pollForResponse(generateRef.id);

    // If we have a userId, we can optionally store the conversation
    if (userId) {
      await storeConversation(userId, prompt, response);
    }

    return {
      success: true,
      response: response,
      messageId: generateRef.id,
    };
  } catch (error) {
    console.error("Error sending chatbot message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Enhanced prompt with concise context
const enhancePromptWithContext = (prompt) => {
  const context = `
You are ITIANS Career Assistant, an AI helper for ITI graduates in Egypt.

PLATFORM PURPOSE:
ITIANS connects ITI graduates with companies, mentors, and career opportunities. ITI is Egypt's Information Technology Institute that trains students for the job market.

USER TYPES:
1. Admin (ITI management)
2. Freelancers (job seekers)
3. Mentors (career coaches)
4. Companies (hiring managers)

KEY FEATURES:
- Job postings and applications
- Mentorship programs
- Professional networking
- Career development resources

RESPONSE RULES:
1. Keep responses SHORT and DIRECT (2-3 paragraphs max)
2. Use bullet points for lists
3. Use markdown for formatting (code blocks, bold, etc.)
4. Answer in Arabic or English based on user's language
5. Focus on ACTIONABLE advice
6. Don't repeat the question
7. Be professional but friendly
8. If unsure, ask clarifying questions

User Question: ${prompt}

Provide a concise, helpful response:
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
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    } catch (error) {
      console.error("Error polling for response:", error);
      attempts++;

      // If it's a network error, wait longer before retrying
      if (error.code === "unavailable" || error.code === "deadline-exceeded") {
        await new Promise((resolve) => setTimeout(resolve, pollInterval * 2));
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
      type: "chatbot",
    });
  } catch (error) {
    console.error("Error storing conversation:", error);
  }
};

// Get user's chatbot conversation history
export const getChatbotHistory = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, "chatbot_conversations"),
      where("userId", "==", userId),
      where("type", "==", "chatbot"),
      orderBy("timestamp", "desc"),
      limit(limitCount),
    );

    const querySnapshot = await getDocs(q);
    const conversations = [];

    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
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
    "كيف أحسن بروفايلي على منصة ITIANS؟",
    "How do I find job opportunities?",
    "إيه أفضل طريقة للتواصل مع الشركات؟",
    "How can I connect with mentors?",
    "كيف أقدم على وظيفة بشكل صحيح؟",
    "What skills are companies looking for?",
    "إزاى أبني شبكة علاقات مهنية؟",
    "How do I prepare for interviews?",
    "إيه الخدمات المتاحة للمستقلين؟",
    "What are the platform features?",
    "كيف أصبح منتور على المنصة؟",
    "How do companies post jobs?",
  ];
};
